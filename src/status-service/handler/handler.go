/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package handler

import (
	"context"
	"net/http"
	"status-service/connections"
	"status-service/utils"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	v12 "k8s.io/api/apps/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type DeploymentsDto = map[string]v12.Deployment

type Health struct {
	Healthy bool `json:"healthy"`
}
type HealthDto struct {
	Microservices map[string]Health `json:"microservices"`
	Available     int               `json:"available"`
	Total         int               `json:"total"`
}

type UserEntry struct {
	UserId   *string
	Username *string
	Role     *string
}

type UserDto struct {
	UserId   *string  `json:"userId"`
	Username *string  `json:"username"`
	Roles    []string `json:"roles"`
}

type RoleDto struct {
	Name *string `json:"name"`
}

var MAX_USER_ENTRIES = 50
var deploymentsToIgnore = utils.GetEnv("IGNORED_DEPLOYMENTS", "")

/**
GET HANDLERS
*/

// GetDeployments attach a DeploymentsDto to be sent as JSON response
func GetDeployments(c echo.Context) error {
	return c.JSON(http.StatusOK, getDeployments())
}

// GetHealth fetches HealthDto containing the overall health overview of deployments within the specified namespace (environment)
func GetHealth(c echo.Context) error {
	deployments := getDeployments()
	microserviceHealthMap := make(map[string]Health)
	available := 0
	total := 0

	for _, deployment := range deployments {
		// ignore deployments from health check
		if strings.Contains(deploymentsToIgnore, deployment.Name) {
			continue
		}

		microserviceHealthMap[deployment.Name] = Health{
			Healthy: assessHealth(deployment.Status.Conditions, &available, &total),
		}
	}

	return c.JSON(http.StatusOK, &HealthDto{
		Microservices: microserviceHealthMap,
		Available:     available,
		Total:         total,
	})
}

// GetUsers queries the MariaDB database for users and allows for SQL Injection attacks. Takes a "name" parameter to filter by username, and a "roles" or "roles[]" parameter to filter by roles.
func GetUsers(c echo.Context) error {
	params := c.QueryParams()
	nameFilter := params.Get("name")

	roles := []string{}
	if params.Has("roles") {
		roles = append(roles, params["roles"]...)
	} else if params.Has("roles[]") { // if there are multiple roles
		roles = append(roles, params["roles[]"]...)
	}

	db, err := connections.GetDB()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}

	ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// this allows injecting SQL code
	sql_stmt := "SELECT users.id, users.username, roles.name as role_name FROM users " +
		"LEFT JOIN users_roles ON users.id=users_roles.user_id " +
		"LEFT JOIN roles ON roles.id=users_roles.role_id WHERE users.username LIKE '%%" + nameFilter + "%%'"
	if len(roles) > 0 {
		// this also allows injecting SQL code
		sql_stmt += " and roles.name in ('" + strings.Join(roles, "', '") + "')"
	}
	sql_stmt += " LIMIT " + strconv.Itoa(MAX_USER_ENTRIES) + ";"
	rows, err := db.QueryContext(ctxTimeout, sql_stmt)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}
	defer rows.Close()

	var userEntries []UserEntry

	for rows.Next() {
		var userEntry UserEntry
		if err := rows.Scan(&userEntry.UserId, &userEntry.Username, &userEntry.Role); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
		}
		userEntries = append(userEntries, userEntry)
	}
	if err = rows.Err(); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}

	var users []UserDto

	for _, userEntry := range userEntries {
		found := false
		for i, user := range users {
			if *user.UserId == *userEntry.UserId {
				users[i].Roles = append(users[i].Roles, *userEntry.Role)
				found = true
				break
			}
		}
		if !found {
			newUser := UserDto{UserId: userEntry.UserId, Username: userEntry.Username, Roles: []string{}}
			if userEntry.Role != nil {
				newUser.Roles = append(newUser.Roles, *userEntry.Role)
			}
			users = append(users, newUser)
		}
	}

	return c.JSON(http.StatusOK, users)
}

// GetRoles queries the MariaDB database for all the available roles.
func GetRoles(c echo.Context) error {
	db, err := connections.GetDB()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}

	ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.QueryContext(ctxTimeout, "SELECT roles.name from roles;")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}
	defer rows.Close()

	var roles []RoleDto

	for rows.Next() {
		var role RoleDto
		if err := rows.Scan(&role.Name); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
		}
		roles = append(roles, role)
	}
	if err = rows.Err(); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError).SetInternal(err)
	}

	return c.JSON(http.StatusOK, roles)
}

// getDeployments fetch deployments from the Kubernetes API within the specified namespace (environment) and construct a DeploymentsDto
func getDeployments() DeploymentsDto {
	deployments, _ := connections.KubernetesClient().AppsV1().Deployments(
		utils.GetEnv("KUBERNETES_NAMESPACE", "unguard")).List(context.TODO(), v1.ListOptions{})
	deploymentDetailsMap := make(DeploymentsDto)

	for _, deployment := range deployments.Items {
		deploymentDetailsMap[deployment.Name] = deployment
	}

	return deploymentDetailsMap
}

// assessHealth count how many deployments with "Avaialble" condition are in the array, updates count and total respectively
func assessHealth(conditions []v12.DeploymentCondition, available *int, total *int) bool {
	*total = *total + 1
	for _, condition := range conditions {
		if condition.Type == "Available" && condition.Status == "True" {
			*available = *available + 1
			return true
		}
	}

	return false
}
