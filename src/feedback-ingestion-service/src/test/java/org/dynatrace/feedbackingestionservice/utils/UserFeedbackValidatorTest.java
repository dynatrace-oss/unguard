package org.dynatrace.feedbackingestionservice.utils;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserFeedbackValidatorTest {

    private static UserFeedback feedback(String text, String label) {
        return new UserFeedback(text, label);
    }

    @Test
    void returnsFalse_whenUserFeedbackIsNull() {
        assertFalse(UserFeedbackValidator.validateUserFeedback(null));
    }

    @Test
    void returnsFalse_whenTextIsNull() {
        assertFalse(UserFeedbackValidator.validateUserFeedback(feedback(null, "spam")));
    }

    @Test
    void returnsFalse_whenLabelIsNull() {
        assertFalse(UserFeedbackValidator.validateUserFeedback(feedback("hello", null)));
    }

    @Test
    void returnsFalse_whenTextIsEmpty() {
        assertFalse(UserFeedbackValidator.validateUserFeedback(feedback("", "spam")));
    }

    @Test
    void returnsFalse_whenLabelIsInvalid() {
        assertFalse(UserFeedbackValidator.validateUserFeedback(feedback("hello", "invalid_label")));
    }

    @Test
    void returnsTrue_whenLabelIsSpam() {
        assertTrue(UserFeedbackValidator.validateUserFeedback(feedback("hello", "spam")));
    }

    @Test
    void returnsTrue_whenLabelIsNotSpam() {
        assertTrue(UserFeedbackValidator.validateUserFeedback(feedback("hello", "not_spam")));
    }
}

