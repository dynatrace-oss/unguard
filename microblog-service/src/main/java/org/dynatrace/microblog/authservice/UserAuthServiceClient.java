package org.dynatrace.microblog.authservice;

import com.google.gson.JsonObject;
import okhttp3.*;
import org.dynatrace.microblog.exceptions.UserNotFoundException;
import org.json.JSONObject;

public class UserAuthServiceClient {

    private final OkHttpClient client = new OkHttpClient();

    private String userAuthServiceHost;

    public UserAuthServiceClient(String userAuthServiceHost){
        this.userAuthServiceHost = userAuthServiceHost;
    }


    public String getUserNameForUserId(String jwt, String userId) throws UserNotFoundException {
        // build json request
        JsonObject obj = new JsonObject();
        obj.addProperty("jwt", jwt);
        obj.addProperty("userid", userId);
        String jsonRequest = obj.toString();

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), jsonRequest);

        Request request = new Request.Builder()
                .url("http://"+this.userAuthServiceHost+"/user/username/")
                .post(body)
                .build();


        try {
            Call call = client.newCall(request);
            Response response = call.execute();

            JSONObject responseObject = new JSONObject(response.body().string());
            return responseObject.getString("username");
        } catch (Exception e) {
            throw new UserNotFoundException();
        }
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
                .url("http://"+this.userAuthServiceHost+"/user/useridForName/")
                .post(body)
                .build();

        try {
            Call call = client.newCall(request);
            Response response = call.execute();

            JSONObject responseObject = new JSONObject(response.body().string());
            return String.valueOf(responseObject.getInt("userId"));
        } catch (Exception e) {
            e.printStackTrace();
            throw new UserNotFoundException();
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
                .url("http://"+this.userAuthServiceHost+"/auth/isValid/")
                .post(body)
                .build();

        try {
            Call call = client.newCall(request);
            Response response = call.execute();
            if(response.code() == 200){
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
