/*
 * Copyright 2023 Dynatrace LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.dynatrace.profileservice.dal;

import org.dynatrace.profileservice.model.Bio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.sql.*;

@Service
@Scope("singleton")
public class DatabaseManager {

    private static final String JDBC_URL = System.getenv("SPRING_DATASOURCE_URL");
    private static final String JDBC_USERNAME = System.getenv("SPRING_DATASOURCE_USERNAME");
    private static final String JDBC_PASSWORD = System.getenv("SPRING_DATASOURCE_PASSWORD");

    private static final Logger logger = LoggerFactory.getLogger(DatabaseManager.class);

    private static Connection getConnection() {
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD);
        } catch (SQLException e) {
            logger.error("Error connecting to database: ", e);
        }

        return connection;
    }

    public Bio getBio(int userId) {
        Bio bio = null;

        try (Connection connection = getConnection()) {
            if (connection != null) {
                // This is also vulnerable to SQL injection as the userId is transferred as a string, therefore it is possible to select all bios, though only one is returned, not a list of bios
                String selectStatement = "SELECT * FROM bio WHERE user_id = " + userId + ";";
                Statement statement = connection.createStatement();
                ResultSet rs = statement.executeQuery(selectStatement);

                if (rs.next()) {
                    bio = new Bio(rs.getInt("id"), rs.getInt("user_id"), rs.getString("bio_text"));
                }

                statement.close();
                return bio;
            }
        } catch (SQLException e) {
            logger.error("Error in getBio: ", e);
        }

        return null;
    }

    public boolean insertBio(Bio bio) {
        boolean result = false;

        try (Connection connection = getConnection()) {
            if (connection != null) {
                // This string is what allows SQL injections to be done, no PreparedStatement is used
                String insertStatement = "INSERT INTO bio (user_id, bio_text) VALUES (" + bio.getUserId() + ", '" + bio.getBioText() + "');";

                result = connection.createStatement().executeUpdate(insertStatement) > 0;
            }
        } catch (SQLException e) {
            logger.error("Error in insertBio: ", e);
        }

        return result;
    }

    public boolean updateBio(Bio bio) {
        boolean result = false;

        try (Connection connection = getConnection()) {
            if (connection != null) {
                // String concatenation to allow for SQL injections
                String updateStatement = "UPDATE bio SET bio_text = '" + bio.getBioText() + "' WHERE user_id = " + bio.getUserId();

                result = connection.createStatement().executeUpdate(updateStatement) > 0;
            }
        } catch (SQLException e) {
            logger.error("Error in updateBio: ", e);
        }

        return result;
    }
}
