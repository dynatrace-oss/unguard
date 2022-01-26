package org.dynatrace.microblog.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Invalid jwt token")
public class InvalidJwtException extends Exception {

}
