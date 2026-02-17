package org.dynatrace.microblog.exceptions;

public class EmptySpamClassificationException extends RuntimeException {
    public EmptySpamClassificationException(String message) {
        super(message);
    }
}
