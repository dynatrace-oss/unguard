package org.dynatrace.microblog.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Invalid spam prediction")
public class InvalidSpamPredictionException extends Exception {
  public InvalidSpamPredictionException(String message) {
    super(message);
  }
}
