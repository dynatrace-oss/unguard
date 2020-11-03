package org.dynatrace.microblog.dto;

import java.util.Date;

public class Post {
    private final String username;
    private final String body;
    private final Date timestamp;
    private final String imageUrl;

    public Post(String username, String body, String imageUrl, Date timestamp) {
        this.username = username;
        this.body = body;
        this.imageUrl = imageUrl;
        this.timestamp = timestamp;
    }

    public String getUsername() {
        return username;
    }

    public String getBody() {
        return body;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
