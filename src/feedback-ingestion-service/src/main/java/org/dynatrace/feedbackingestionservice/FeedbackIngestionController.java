package org.dynatrace.feedbackingestionservice;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.exceptions.*;
import org.dynatrace.feedbackingestionservice.ragservice.RAGServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@RestController
public class FeedbackIngestionController {
    Logger logger = LoggerFactory.getLogger(FeedbackIngestionController.class);
    private final RAGServiceClient ragServiceClient;
    private final ExecutorService ragExecutor = Executors.newFixedThreadPool(
        Math.max(10, Runtime.getRuntime().availableProcessors() / 2)
    );

    public FeedbackIngestionController() {
        String ragServiceAddress;
        String ragServicePort;

        if (System.getenv("RAG_SERVICE_ADDRESS") != null) {
            ragServiceAddress = System.getenv("RAG_SERVICE_ADDRESS");
            logger.info("RAG_SERVICE_ADDRESS set to {}", ragServiceAddress);
        } else {
            ragServiceAddress = "localhost";
            logger.warn("No RAG_SERVICE_ADDRESS environment variable defined, falling back to localhost.");
        }
        if (System.getenv("RAG_SERVICE_PORT") != null) {
            ragServicePort = System.getenv("RAG_SERVICE_PORT");
            logger.info("RAG_SERVICE_PORT set to {}", ragServicePort);
        } else {
            ragServicePort = "8000";
            logger.warn("No RAG_SERVICE_PORT environment variable defined, falling back to 8000.");
        }

        this.ragServiceClient = new RAGServiceClient(ragServiceAddress, ragServicePort);
    }

    @RequestMapping("/add")
    public void add(UserFeedback userFeedback) throws IngestionFailedException {
        //TODO: implement
    }
}
