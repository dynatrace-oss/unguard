package org.dynatrace.microblog.authservice;

import com.google.gson.JsonObject;
import okhttp3.*;
import org.dynatrace.microblog.exceptions.InvalidJwtException;
import org.dynatrace.microblog.exceptions.UserNotFoundException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class UserAuthServiceClient {

    private final OkHttpClient client = new OkHttpClient();
    private final Logger logger = LoggerFactory.getLogger(UserAuthServiceClient.class);

    private String userAuthServiceHost;

    public UserAuthServiceClient(String userAuthServiceHost) {
        this.userAuthServiceHost = userAuthServiceHost;
    }

    public String getUserNameForUserId(String jwt, String userId) throws InvalidJwtException, UserNotFoundException {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("jwt", jwt);
        obj.addProperty("userid", userId);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://" + this.userAuthServiceHost + "/user/username/")
                .post(body)
                .build();


        Call call = client.newCall(request);
        try {
            Response response = call.execute();

            if (response.code() == 200) {
                JSONObject responseObject = new JSONObject(response.body().string());
                return responseObject.getString("username");
            } else if (response.code() == 401) {
                throw new InvalidJwtException();
            } else if (response.code() == 404) {
                throw new UserNotFoundException();
            }
        } catch (IOException e) {
            logger.error("Request response error", e);
        }
        throw new RuntimeException("Theoretically Should never reach this path.");
    }


    public String getUserIdFromUsername(String jwt, String username) throws UserNotFoundException {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("jwt", jwt);
        obj.addProperty("username", username);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://" + this.userAuthServiceHost + "/user/useridForName/")
                .post(body)
                .build();

        Call call = client.newCall(request);
        try {
            Response response = call.execute();

            if (response.code() == 200) {
                JSONObject responseObject = new JSONObject(response.body().string());
                return String.valueOf(responseObject.getInt("userId"));
            } else if (response.code() == 401) {
                throw new InvalidJwtException();
            } else if (response.code() == 404) {
                throw new UserNotFoundException();
            }
        } catch (Exception e) {
            logger.error("Request response error", e);
        }
        throw new RuntimeException("Theoretically Should never reach this path, because we checked all status codes " +
                "which could be returned by the user-auth backend.");
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
        try {
            Response response = call.execute();
            return response.code() == 200;
        } catch (Exception e) {
            logger.error("Request response error", e);
        }
        return false;
    }
}
