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

package connections

import (
	"database/sql"
	"status-service/utils"

	"github.com/go-sql-driver/mysql"
)

var envHost = utils.GetEnv("MARIADB_SERVICE", "")
var envPass = utils.GetEnv("MARIADB_PASSWORD", "")

var db *sql.DB

// Get connection to the database. The connection is opened the first time this is run.
func GetDB() (*sql.DB, error) {
	if db != nil {
		return db, nil
	}

	cfg := mysql.NewConfig()

	if cfg.Params == nil {
		cfg.Params = map[string]string{}
	}
	// github.com/go-sql-driver/mysql requires this to be set for multiple statements in one query; allows for more advanced SQL injections
	cfg.Params["multiStatements"] = "true"

	cfg.User = "root"
	cfg.Passwd = envPass
	cfg.DBName = "my_database"
	cfg.Net = "tcp"
	cfg.Addr = envHost

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	return db, err
}
