package org.dynatrace.feedbackingestionservice.utils;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;

public class UserFeedbackValidator {
    public static Boolean validateUserFeedback(UserFeedback userFeedback) {
        if (userFeedback == null || userFeedback.getText() == null || userFeedback.getLabel() == null) {
            return false;
        }

        if (userFeedback.getText().isEmpty()) {
            return false;
        }

        String label = userFeedback.getLabel();
        return label.equals("spam") || label.equals("not_spam");
    }
}
