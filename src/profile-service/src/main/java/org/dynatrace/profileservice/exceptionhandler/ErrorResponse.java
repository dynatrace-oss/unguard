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

package org.dynatrace.profileservice.exceptionhandler;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;

import java.util.Date;

public class ErrorResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Date timestamp;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private int status;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private String error;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private String message;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private String path;

    // If stackTrace and data should be included in the response object, @JsonFormat annotation would be needed
    private String stackTrace;
    private Object data;

    public ErrorResponse() {
        timestamp = new Date();
    }

    public ErrorResponse(HttpStatus httpStatus, String message, String path) {
        this();

        this.status = httpStatus.value();
        this.error = httpStatus.name();
        this.message = message;
        this.path = path;
    }

    public ErrorResponse(HttpStatus httpStatus, String message, String path, String stackTrace) {
        this(httpStatus, message, path);

        this.stackTrace = stackTrace;
    }

    public ErrorResponse(HttpStatus httpStatus, String message, String path, String stackTrace, Object data) {
        this(httpStatus, message, path, stackTrace);

        this.data = data;
    }
}
