package org.dynatrace.feedbackingestionservice.exceptions;

public class InvalidUserFeedbackException extends RuntimeException {
    public InvalidUserFeedbackException(String message) {
        super(message);
    }
}
