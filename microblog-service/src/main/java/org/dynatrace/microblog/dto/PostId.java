package org.dynatrace.microblog.dto;

public class PostId {
    private final String postId;

    public PostId(String postId) {
        this.postId = postId;
    }

    public String getPostId() {
        return postId;
    }
}
