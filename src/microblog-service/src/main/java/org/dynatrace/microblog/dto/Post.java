/*
 * Copyright 2023 Dynatrace LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.dynatrace.microblog.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Post {
    private final String postId;
    private final String username;
    private final String body;
    private final Date timestamp;
    private final String imageUrl;

    public Post(
        @JsonProperty("postId") String postId,
        @JsonProperty("username") String username,
        @JsonProperty("body") String body,
        @JsonProperty("imageUrl") String imageUrl,
        @JsonProperty("timestamp") Date timestamp) {
        this.postId = postId;
        this.username = username;
        this.body = body;
        this.imageUrl = imageUrl;
        this.timestamp = timestamp;
    }

    public String getPostId() {
        return postId;
    }

    public String getUsername() {
        return username;
    }

    public String getBody() {
        return body;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}
