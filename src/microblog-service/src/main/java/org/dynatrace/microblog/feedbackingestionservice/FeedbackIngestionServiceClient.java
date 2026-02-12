package org.dynatrace.microblog.feedbackingestionservice;

import com.google.gson.JsonObject;
import io.opentracing.contrib.okhttp3.OkHttpClientSpanDecorator;
import io.opentracing.contrib.okhttp3.TracingInterceptor;
import io.opentracing.util.GlobalTracer;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;

public class FeedbackIngestionServiceClient {

    private final OkHttpClient client;
    private final Logger logger = LoggerFactory.getLogger(org.dynatrace.microblog.feedbackingestionservice.FeedbackIngestionServiceClient.class);

    private final String feedbackIngestionServiceHost;
    private final int feedbackIngestionPort;

    public FeedbackIngestionServiceClient(String feedbackIngestionServiceHost, String feedbackIngestionServicePort) {
        this.feedbackIngestionServiceHost = feedbackIngestionServiceHost;
        this.feedbackIngestionPort = Integer.parseInt(feedbackIngestionServicePort);

        TracingInterceptor tracingInterceptor = new TracingInterceptor(
            GlobalTracer.get(),
            Collections.singletonList(OkHttpClientSpanDecorator.STANDARD_TAGS));
        client = new OkHttpClient.Builder()
            .connectTimeout(Duration.ofSeconds(30))
            .writeTimeout(Duration.ofSeconds(30))
            .readTimeout(Duration.ofSeconds(30))
            .callTimeout(Duration.ofSeconds(30))
            .addInterceptor(tracingInterceptor)
            .addNetworkInterceptor(tracingInterceptor)
            .build();

    }

    public boolean addNewSpamKnowledgeToIngestQueue(String postText, String userLabel) throws IOException {
        JsonObject obj = new JsonObject();
        obj.addProperty("text", postText);
        obj.addProperty("label", userLabel);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"), jsonRequest);

        HttpUrl url = new HttpUrl.Builder()
            .scheme("http")
            .host(this.feedbackIngestionServiceHost)
            .port(this.feedbackIngestionPort)
            .addPathSegment("addToQueue")
            .build();

        Request request = new Request.Builder()
            .url(url)
            .post(body)
            .build();

        Call call = client.newCall(request);
        try (Response response = call.execute()) {
            if (response.code() == 200 || response.code() == 202) {
                logger.info("Successfully added new spam knowledge to ingestion queue");
                return true;
            }
            logger.error("Failed to add new spam knowledge to ingestion queue. Response code: {}, Response body: {}", response.code(), response.body() != null ? response.body().string() : "null");
            return false;
        } catch (IOException e) {
            logger.error("Request response error during ingestion request", e);
            throw e;
        }
    }
}


