package org.dynatrace.microblog.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "You cannot follow youself")
public class FollowYourselfException extends Exception {

}
