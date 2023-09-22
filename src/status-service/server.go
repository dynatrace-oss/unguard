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

package main

import (
	"fmt"
	"net/http"
	"status-service/handler"
	"status-service/utils"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

var serverPort = utils.GetEnv("SERVER_PORT", "8083")
var apiPath = utils.GetEnv("API_PATH", "/status-service")

func main() {
	server := echo.New()

	server.Use(middleware.Logger())
	server.Use(middleware.Recover())

	api := server.Group(apiPath)

	api.GET("/deployments", handler.GetDeployments)
	api.GET("/deployments/health", handler.GetHealth)
	api.GET("/users", handler.GetUsers)
	api.GET("/roles", handler.GetRoles)

	if err := server.Start(fmt.Sprintf(":%s", serverPort)); err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
