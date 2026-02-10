package org.dynatrace.feedbackingestionservice;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.buffer.FeedbackBuffer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.dynatrace.feedbackingestionservice.utils.UserFeedbackValidator.validateUserFeedback;

@RestController
public class FeedbackIngestionController {

    private final Logger logger = LoggerFactory.getLogger(FeedbackIngestionController.class);
    private final FeedbackBuffer buffer;

    public FeedbackIngestionController(FeedbackBuffer buffer) {
        this.buffer = buffer;
    }

    @PostMapping("/add")
    public ResponseEntity<Void> add(@RequestBody UserFeedback userFeedback) {
        if (Boolean.FALSE.equals(validateUserFeedback(userFeedback))) {
            logger.warn("Received invalid feedback item: {}", userFeedback);
            return ResponseEntity.badRequest().build();
        }

        buffer.addToQueue(userFeedback);
        logger.info("Added feedback item to queue. Current amount of items in queue: {}", buffer.getSize());
        return ResponseEntity.accepted().build();
    }
}
