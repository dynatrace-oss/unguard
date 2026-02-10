package org.dynatrace.feedbackingestionservice.utils;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;

public class UserFeedbackValidator {
    public static Boolean validateUserFeedback(UserFeedback userFeedback) {
        if (userFeedback == null || userFeedback.getText() == null || userFeedback.getLabel() == null) {
            return false;
        }

        if ( userFeedback.getText().isEmpty()) {
            return false;
        }

        String userLabel = userFeedback.getLabel();
        return userLabel.equals("spam") || userLabel.equals("not_spam");
    }
}
