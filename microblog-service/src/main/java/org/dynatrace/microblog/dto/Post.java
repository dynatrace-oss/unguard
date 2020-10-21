package org.dynatrace.microblog.dto;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Post {
    private String username;
    private String body;
    private Date timestamp;

    public Post(String username, String body, Date timestamp) {
        this.username = username;
        this.body = body;
        this.timestamp = timestamp;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
