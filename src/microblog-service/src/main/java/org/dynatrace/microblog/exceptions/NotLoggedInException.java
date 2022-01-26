package org.dynatrace.microblog.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "You are not logged in")
public class NotLoggedInException extends Exception {

}
