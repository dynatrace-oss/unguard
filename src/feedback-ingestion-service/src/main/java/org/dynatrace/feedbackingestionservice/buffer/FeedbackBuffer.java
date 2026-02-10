package org.dynatrace.feedbackingestionservice.buffer;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.ragservice.RAGServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class FeedbackBuffer {
    private final BlockingQueue<UserFeedback> queue = new LinkedBlockingQueue<>();
    private final AtomicBoolean isFlushing = new AtomicBoolean(false);
    private static final Logger logger = LoggerFactory.getLogger(FeedbackBuffer.class);
    private final RAGServiceClient ragServiceClient;

    // ingestion to RAG service is triggered when one of the following threshold conditions is reached:
    private static final int MAX_BATCH_SIZE = 100;
    private static final long INGESTION_INTERVAL = 300; //5 minutes

    private final ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "feedback-batch-ingestion");
        thread.setDaemon(true);
        return thread;
    });

    public FeedbackBuffer(RAGServiceClient ragServiceClient) {
        this.ragServiceClient = ragServiceClient;

        scheduledExecutorService.scheduleWithFixedDelay(
            this::processBatchInQueue,
            INGESTION_INTERVAL,
            INGESTION_INTERVAL,
            TimeUnit.SECONDS
        );
    }

    public int getSize() {
        return queue.size();
    }

    public void addToQueue(UserFeedback feedback) {
        queue.add(feedback);

        if (queue.size() >= MAX_BATCH_SIZE) {
            processBatchInQueue();
        }
    }

    private List<UserFeedback> extractBatchFromQueue() {
        List<UserFeedback> batch = new ArrayList<>(FeedbackBuffer.MAX_BATCH_SIZE);
        queue.drainTo(batch, FeedbackBuffer.MAX_BATCH_SIZE);
        return batch;
    }

    public void processBatchInQueue() {
        if (!isFlushing.compareAndSet(false, true)) {
            return;
        }

        try {
            while (true) {
                List<UserFeedback> batch = extractBatchFromQueue();
                if (batch.isEmpty()) {
                    return;
                }

                try {
                    logger.info("Ingesting batch of {} feedback items to RAG service.", batch.size());
                    ragServiceClient.ingestUserFeedbackBatchToRAGKnowledgeBase(batch);
                } catch (Exception e) {
                    logger.error("Failed to ingest feedback batch to RAG service: {}", e.getMessage());
                    return;
                }
            }
        } finally {
            isFlushing.set(false);
        }
    }
}
