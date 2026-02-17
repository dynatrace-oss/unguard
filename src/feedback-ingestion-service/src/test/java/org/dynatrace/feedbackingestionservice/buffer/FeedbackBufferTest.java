package org.dynatrace.feedbackingestionservice.buffer;

import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.ragservice.RAGServiceClient;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

class FeedbackBufferTest {

    private static UserFeedback feedback(String text, String label) {
        return new UserFeedback(text, label);
    }

    @Test
    void doesNotIngest_whenBelowThreshold() throws IOException {
        RAGServiceClient client = mock(RAGServiceClient.class);
        FeedbackBuffer buffer = new FeedbackBuffer(client);

        buffer.addToQueue(feedback("spam text", "spam"));
        buffer.addToQueue(feedback("hello", "not_spam"));

        verify(client, never()).ingestUserFeedbackBatchToRAGKnowledgeBase(anyList());
        assertEquals(2, buffer.getSize());
    }

    @Test
    void ingestsOnce_whenThresholdReached() throws IOException {
        RAGServiceClient client = mock(RAGServiceClient.class);
        FeedbackBuffer buffer = new FeedbackBuffer(client);

        for (int i = 0; i < 100; i++) {
            buffer.addToQueue(feedback("text", "not_spam"));
        }

        ArgumentCaptor<List<UserFeedback>> captor = ArgumentCaptor.forClass(List.class);
        verify(client, times(1)).ingestUserFeedbackBatchToRAGKnowledgeBase(captor.capture());
        assertEquals(100, captor.getValue().size());
        assertEquals(0, buffer.getSize());
    }

    @Test
    void flushedQueue_whenItemsAreIngested() throws IOException {
        RAGServiceClient client = mock(RAGServiceClient.class);
        FeedbackBuffer buffer = new FeedbackBuffer(client);

        for (int i = 0; i < 50; i++) {
            buffer.addToQueue(feedback("text", "not_spam"));
        }

        verify(client, never()).ingestUserFeedbackBatchToRAGKnowledgeBase(anyList());
        assertEquals(50, buffer.getSize());

        buffer.processBatchInQueue();

        ArgumentCaptor<List<UserFeedback>> captor = ArgumentCaptor.forClass(List.class);
        verify(client, times(1)).ingestUserFeedbackBatchToRAGKnowledgeBase(captor.capture());
        assertEquals(50, captor.getValue().size());
        assertEquals(0, buffer.getSize());
    }
}
