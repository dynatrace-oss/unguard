package org.dynatrace.feedbackingestionservice.ragservice;

import okhttp3.Call;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.dynatrace.feedbackingestionservice.dto.UserFeedback;
import org.dynatrace.feedbackingestionservice.exceptions.IngestionFailedException;
import org.dynatrace.feedbackingestionservice.exceptions.InvalidUserFeedbackException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

@Component
public class RAGServiceClient {

    private final OkHttpClient httpClient;
    private final Logger logger = LoggerFactory.getLogger(RAGServiceClient.class);

    private final String ragServiceHost;
    private final int ragServicePort;

    public RAGServiceClient() {
        String host = System.getenv("RAG_SERVICE_ADDRESS");
        String port = System.getenv("RAG_SERVICE_PORT");

        this.ragServiceHost = (host == null || host.isBlank()) ? "localhost" : host;
        this.ragServicePort = Integer.parseInt((port == null || port.isBlank()) ? "8000" : port);

        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(Duration.ofSeconds(120))
                .writeTimeout(Duration.ofSeconds(120))
                .readTimeout(Duration.ofSeconds(120))
                .callTimeout(Duration.ofSeconds(120))
                .build();
    }

    public void ingestUserFeedbackBatchToRAGKnowledgeBase(List<UserFeedback> userFeedback)
            throws IngestionFailedException, IOException, JSONException {

        JSONObject obj = new JSONObject();
        JSONArray userFeedbackArray = new JSONArray(userFeedback);
        obj.put("entries", userFeedbackArray);
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

        Call call = httpClient.newCall(request);
        try (Response response = call.execute()) {

            if (response.code() == 200) {
                if (response.body() == null) {
                    throw new IngestionFailedException("Response body is empty");
                }
                JSONObject responseObject = new JSONObject(response.body().string());
                if (responseObject.getBoolean("success")) {
                    logger.info(
                            "Successfully ingested batch of user feedback to RAG knowledge base: {}/{} objects ingested.",
                            responseObject.get("count"),
                            userFeedback.size()
                    );
                    return;
                }
                throw new IngestionFailedException("Error ingesting batch: " + response.code() + " - " + response.message());
            } else if (response.code() == 422) {
                throw new InvalidUserFeedbackException("Invalid user feedback. Response code: " + response.code() + " - " + response.message());
            }

            throw new IngestionFailedException("Error ingesting batch: " + response.code() + " - " + response.message());
        }
    }
}
