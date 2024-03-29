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

import org.dynatrace.profileservice.exceptions.BioNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(HttpServletRequest request, Exception e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        return new ResponseEntity<>(
            new ErrorResponse(
                status,
                e.getMessage(),
                request.getRequestURI()
            ),
            status
        );
    }

    @ExceptionHandler(BioNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBioNotFoundException(HttpServletRequest request, Exception e) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        return new ResponseEntity<>(
            new ErrorResponse(
                status,
                e.getMessage(),
                request.getRequestURI()
            ),
            status
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpServletRequest request, HttpMessageNotReadableException e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        return new ResponseEntity<>(
            new ErrorResponse(
                status,
                e.getMessage(),
                request.getRequestURI()
            ),
            status
        );
    }

    // fallback method
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleExceptions(HttpServletRequest request, Exception e) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        return new ResponseEntity<>(
            new ErrorResponse(
                status,
                e.getMessage(),
                request.getRequestURI()
            ),
            status
        );
    }
}
