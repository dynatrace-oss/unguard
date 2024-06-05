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

package org.dynatrace.profileservice;

import org.dynatrace.profileservice.dal.DatabaseManager;
import org.dynatrace.profileservice.exceptions.BioNotFoundException;
import org.dynatrace.profileservice.model.Bio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@RestController
@Validated
public class BioController {
    final DatabaseManager databaseManager;

    Logger logger = LoggerFactory.getLogger(BioController.class);

    @Autowired
    public BioController(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @PostMapping("/user/{id}/bio")
    public void postBio(@PathVariable("id") @Valid @Min(Integer.MIN_VALUE) @Max(Integer.MAX_VALUE) String userId,
                        @RequestParam String bioText,
                        @RequestParam(required = false, defaultValue = "false") boolean enableMarkdown) {
        if (enableMarkdown) {
            bioText = markdownToHtml(bioText);
        }
        Bio bio = new Bio(Integer.parseInt(userId), bioText); // id will be updated
        boolean success;

        if (databaseManager.getBio(Integer.parseInt(userId)) != null) {
            success = databaseManager.updateBio(bio);
        } else {
            success = databaseManager.insertBio(bio);
        }

        if (!success) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error posting bio for user with id '" + userId + "'");
        }

        bio.setId(databaseManager.getBio(Integer.parseInt(userId)).getId());
    }

    private String markdownToHtml(String markdown) {
        // Unsafe code below, vulnerable to command injection, as 'markdown' is user controlled
        final String[] command = {"/bin/sh", "-c", "echo '" + markdown + "' | markdown"};

        final ProcessBuilder processBuilder = new ProcessBuilder(command);

        Process process;
        try {
            process = processBuilder.start();

            final BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String errLine;
            while ((errLine = err.readLine()) != null) {
                logger.warn(errLine);
            }

            final BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String outLine;
            StringBuilder processOutput = new StringBuilder();
            while ((outLine = in.readLine()) != null) {
                processOutput.append(outLine);
            }

            int returnCode = process.waitFor();
            if (returnCode != 0) {
                logger.warn("Markdown converter exited with {}", returnCode);
            }

            return processOutput.toString();
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to convert markdown", e);
            return markdown;
        }
    }

    @GetMapping("/user/{id}/bio")
    public Bio getBio(@PathVariable("id") @Valid @Min(Integer.MIN_VALUE) @Max(Integer.MAX_VALUE) String userId) throws BioNotFoundException {
        Bio bio = databaseManager.getBio(Integer.parseInt(userId));

        if (bio != null) {
            return bio;
        }

        throw new BioNotFoundException("Bio for user with id '" + userId + "' not found");
    }
}
