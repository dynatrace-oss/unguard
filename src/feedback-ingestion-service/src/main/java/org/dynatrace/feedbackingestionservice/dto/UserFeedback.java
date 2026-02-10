package org.dynatrace.feedbackingestionservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserFeedback {
    private final String text;
    private final String label;

    public UserFeedback(
        @JsonProperty("text") String text,
        @JsonProperty("user_label") String userLabel) {
        this.text = text;
        this.label = userLabel;
    }

    public String getText() {
        return text;
    }

    public String getLabel() {
        return label;
    }
}
