package org.dynatrace.microblog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpamPredictionRatings {
    private final Integer spamPredictionUserUpvotes;
    private final Integer spamPredictionUserDownvotes;
    private final Boolean isUpvotedByUser;
    private final Boolean isDownvotedByUser;

    public SpamPredictionRatings(
        @JsonProperty("spamPredictionUserUpvotes") Integer spamPredictionUserUpvotes,
        @JsonProperty("spamPredictionUserDownvotes") Integer spamPredictionUserDownvotes,
        @JsonProperty("isUpvotedByUser") Boolean isUpvotedByUser,
        @JsonProperty("isDownvotedByUser") Boolean isDownvotedByUser) {
        this.spamPredictionUserUpvotes = spamPredictionUserUpvotes;
        this.spamPredictionUserDownvotes = spamPredictionUserDownvotes;
        this.isUpvotedByUser = isUpvotedByUser;
        this.isDownvotedByUser = isDownvotedByUser;
    }

    public Integer getSpamPredictionUserUpvotes() { return spamPredictionUserUpvotes; }

    public Integer getSpamPredictionUserDownvotes() { return spamPredictionUserDownvotes; }

    public Boolean getIsUpvotedByUser() { return isUpvotedByUser; }

    public Boolean getIsDownvotedByUser() { return isDownvotedByUser; }
}
