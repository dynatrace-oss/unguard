package org.dynatrace.feedbackingestionservice.dto;

public enum FeedbackLabel {
    SPAM("spam"),
    NOT_SPAM("not_spam");

    public final String label;

    private FeedbackLabel(String label) {
        this.label = label;
    }
}
