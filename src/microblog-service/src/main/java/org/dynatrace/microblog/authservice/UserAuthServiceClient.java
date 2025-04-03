/*
 * Copyright 2023 Dynatrace LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.dynatrace.microblog.authservice;

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

import java.util.Arrays;

public class UserAuthServiceClient {

    private final OkHttpClient client;
    private final Logger logger = LoggerFactory.getLogger(UserAuthServiceClient.class);

    private String userAuthServiceHost;

    public UserAuthServiceClient(String userAuthServiceHost) {
        this.userAuthServiceHost = userAuthServiceHost;

        // setup tracing
        TracingInterceptor tracingInterceptor = new TracingInterceptor(
                GlobalTracer.get(),
                Arrays.asList(OkHttpClientSpanDecorator.STANDARD_TAGS));
        client = new OkHttpClient.Builder()
                .addInterceptor(tracingInterceptor)
                .addNetworkInterceptor(tracingInterceptor)
                .build();

    }

    public String getUserNameForUserId(String userId) throws InvalidJwtException, UserNotFoundException, IOException {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("userid", userId);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://" + this.userAuthServiceHost + "/user/username/")
                .post(body)
                .build();


        Call call = client.newCall(request);
        try (Response response = call.execute()) {

            if (response.code() == 200) {
                JSONObject responseObject = new JSONObject(response.body().string());
                return responseObject.getString("username");
            } else if (response.code() == 401) {
                throw new InvalidJwtException();
            } else if (response.code() == 404) {
                throw new UserNotFoundException();
            } else {
                throw new RuntimeException("Theoretically Should never reach this path, because we checked all status codes " +
                        "which could be returned by the user-auth backend.");
            }
        } catch (IOException e) {
            logger.error("Request response error", e);
            throw e;
        }
    }


    public String getUserIdFromUsername(String username) throws UserNotFoundException, IOException, InvalidJwtException {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("username", username);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://" + this.userAuthServiceHost + "/user/useridForName/")
                .post(body)
                .build();

        Call call = client.newCall(request);
        try (Response response = call.execute()) {

            if (response.code() == 200) {
                JSONObject responseObject = new JSONObject(response.body().string());
                return String.valueOf(responseObject.getInt("userId"));
            } else if (response.code() == 401) {
                throw new InvalidJwtException();
            } else if (response.code() == 404) {
                throw new UserNotFoundException();
            } else {
                throw new RuntimeException("Theoretically Should never reach this path, because we checked all status codes " +
                        "which could be returned by the user-auth backend.");
            }
        } catch (Exception e) {
            logger.error("Request response error", e);
            throw e;
        }
    }

    public boolean checkTokenValidity(String jwtToken) {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("jwt", jwtToken);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://" + this.userAuthServiceHost + "/auth/isValid/")
                .post(body)
                .build();

        Call call = client.newCall(request);
        try (Response response = call.execute()) {
            return response.code() == 200;
        } catch (Exception e) {
            logger.error("Request response error", e);
        }
        return false;
    }
}
