package org.dynatrace.microblog.utils;

import java.util.Set;


public class SpamKBIngestionUtils {
    private static final int MIN_USER_VOTES_COUNT = 5;
    private static final double VOTES_DIFFERENCE_THRESHOLD = 0.5;

    public static boolean hasRelevantUserFeedback(Set<String> upvoters, Set<String> downvoters) {
        int upvoteCount = upvoters.size();
        int downvoteCount = downvoters.size();

        if (upvoteCount + downvoteCount >= MIN_USER_VOTES_COUNT) {
            double votesDiff = Math.abs(upvoteCount - downvoteCount) / (double) (upvoteCount + downvoteCount);
            return votesDiff > VOTES_DIFFERENCE_THRESHOLD;
        }

        return false;
    }
}
