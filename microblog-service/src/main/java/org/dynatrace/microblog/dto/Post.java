package org.dynatrace.microblog.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Post {
    private final String username;
    private final String body;
    private final Date timestamp;
    private final String imageUrl;

    public Post(
			@JsonProperty("username") String username,
			@JsonProperty("body") String body,
			@JsonProperty("imageUrl") String imageUrl,
			@JsonProperty("timestamp") Date timestamp) {
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
