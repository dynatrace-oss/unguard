package org.dynatrace.microblog.exceptions;

public class SpamIngestionFailedException extends RuntimeException {
    public SpamIngestionFailedException(String message) {
        super(message);
    }
}
