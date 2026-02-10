package org.dynatrace.feedbackingestionservice.ragservice;

import okhttp3.*;
import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.exceptions.IngestionFailedException;
import org.dynatrace.feedbackingestionservice.exceptions.InvalidUserFeedbackException;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

public class RAGServiceClient {

    private final OkHttpClient client;
    private final Logger logger = LoggerFactory.getLogger(org.dynatrace.feedbackingestionservice.ragservice.RAGServiceClient.class);

    private final String ragServiceHost;
    private final int ragServicePort;

    public RAGServiceClient(String ragServiceHost, String ragsServicePort) {
        this.ragServiceHost = ragServiceHost;
        this.ragServicePort = Integer.parseInt(ragsServicePort);

        client = new OkHttpClient.Builder()
            .connectTimeout(Duration.ofSeconds(120))
            .writeTimeout(Duration.ofSeconds(120))
            .readTimeout(Duration.ofSeconds(120))
            .callTimeout(Duration.ofSeconds(120))
            .build();

    }

    public String ingestUserFeedbackBatchToRAGKnowledgeBase(List<UserFeedback> userFeedback) throws IngestionFailedException, IOException, JSONException {
        JSONObject obj = new JSONObject();
        obj.put("entries", userFeedback);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"), jsonRequest);

        HttpUrl url = new HttpUrl.Builder()
            .scheme("http")
            .host(this.ragServiceHost)
            .port(this.ragServicePort)
            .addPathSegment("ingestBatch")
            .build();

        Request request = new Request.Builder()
            .url(url)
            .post(body)
            .build();


        Call call = client.newCall(request);
        try (Response response = call.execute()) {

            if (response.code() == 200) {
                assert response.body() != null;
                JSONObject responseObject = new JSONObject(response.body().string());
                if (responseObject.getBoolean("success")) {
                    int ingestedCount = responseObject.getInt("count");
                    logger.info("Successfully ingested batch of user feedback to RAG knowledge base:{}/{} objects ingested.", ingestedCount, userFeedback.size());
                    return responseObject.getString("message");
                } else {
                    throw new IngestionFailedException("Error ingesting batch of user feedback: " + response.code() + " - " + response.message());
                }
            } else if (response.code() == 422) {
                throw new InvalidUserFeedbackException("Error ingesting batch of user feedback: invalid user feedback object provided. Response code: " + response.code() + " - " + response.message());
            } else {
                throw new IngestionFailedException("Error ingesting batch of user feedback: " + response.code() + " - " + response.message());
            }
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}


