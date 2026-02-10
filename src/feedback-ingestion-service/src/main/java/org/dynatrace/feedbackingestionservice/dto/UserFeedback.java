package org.dynatrace.feedbackingestionservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserFeedback {
    private final String text;
    private final FeedbackLabel userLabel;

    public UserFeedback(
        @JsonProperty("text") String text,
        @JsonProperty("userLabel") FeedbackLabel userLabel) {
        this.text = text;
        this.userLabel = userLabel;
    }

    public String getText() {
        return text;
    }

    public FeedbackLabel getUserLabel() {
        return userLabel;
    }
}
