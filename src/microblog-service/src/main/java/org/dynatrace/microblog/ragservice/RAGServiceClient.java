package org.dynatrace.microblog.ragservice;

import com.google.gson.JsonObject;
import io.opentracing.contrib.okhttp3.OkHttpClientSpanDecorator;
import io.opentracing.contrib.okhttp3.TracingInterceptor;
import io.opentracing.util.GlobalTracer;
import okhttp3.*;
import org.dynatrace.microblog.exceptions.InvalidJwtException;
import org.dynatrace.microblog.exceptions.UserNotFoundException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;

public class RAGServiceClient {

    private final OkHttpClient client;
    private final Logger logger = LoggerFactory.getLogger(org.dynatrace.microblog.ragservice.RAGServiceClient.class);

    private final String ragServiceHost;

    public RAGServiceClient(String ragServiceHost) {
        this.ragServiceHost = ragServiceHost;

        TracingInterceptor tracingInterceptor = new TracingInterceptor(
            GlobalTracer.get(),
                Collections.singletonList(OkHttpClientSpanDecorator.STANDARD_TAGS));
        client = new OkHttpClient.Builder()
            .connectTimeout(Duration.ofSeconds(240))
            .writeTimeout(Duration.ofSeconds(240))
            .readTimeout(Duration.ofSeconds(240))
            .callTimeout(Duration.ofSeconds(240))
            .addInterceptor(tracingInterceptor)
            .addNetworkInterceptor(tracingInterceptor)
            .build();

    }

    public String getSpamClassification(String postText) throws InvalidJwtException, UserNotFoundException, IOException {
        JsonObject obj = new JsonObject();
        obj.addProperty("text", postText);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"), jsonRequest);

        String requestUrl = "http://" + this.ragServiceHost + "/classifyPost";

        Request request = new Request.Builder()
            .url(requestUrl)
            .post(body)
            .build();


        Call call = client.newCall(request);
        try (Response response = call.execute()) {

            if (response.code() == 200) {
                JSONObject responseObject = new JSONObject(response.body().string());
                return responseObject.getString("classification");
            } else if (response.code() == 401) {
                throw new InvalidJwtException();
            } else {
                throw new RuntimeException("Error retrieving spam classification from RAG service: " + response.code() + " - " + response.message());
            }
        } catch (IOException e) {
            logger.error("Request response error during spam classification", e);
            throw e;
        }
    }
}


