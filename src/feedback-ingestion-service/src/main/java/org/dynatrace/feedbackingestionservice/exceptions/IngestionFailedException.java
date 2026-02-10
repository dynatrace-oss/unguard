package org.dynatrace.feedbackingestionservice.exceptions;

public class IngestionFailedException extends RuntimeException {
    public IngestionFailedException(String message) {
        super(message);
    }
}
