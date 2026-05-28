package org.dynatrace.feedbackingestionservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserFeedback {
    private final String text;
    private final String label;

    public UserFeedback(
        @JsonProperty("text") String text,
        @JsonProperty("label") String label) {
        this.text = text;
        this.label = label;
    }

    public String getText() {
        return text;
    }

    public String getLabel() {
        return label;
    }
}
