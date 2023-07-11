<?php

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DoLikeController extends BaseController{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function doLike($request){
        $user_token = $request->cookie('jwt');

        if(!$this->authenticateToken($user_token)){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }else{
            //Todo: do stuff
            Log::notice('Do stuff');
        }

    }

    function authenticateToken($user_token){

        $auth_service_validate_host = config('app.auth_service_url');

        Log::notice('Sending request to: '. $auth_service_validate_host);

        $response =Http::post($auth_service_validate_host, [
                                          'jwt' => $user_token
                                      ]);

        $responseCode = $response->getStatusCode();
        return $responseCode == 200;

    }


}
