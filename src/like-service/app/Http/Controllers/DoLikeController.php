<?php

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class DoLikeController extends BaseController{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function doLike($request){
        $user_token = $request->cookie('jwt');

        if($this->authenticateToken($user_token)){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }else{
            //Todo: do stuff
        }

    }

    function authenticateToken($user_token){
        $auth_service_address = getenv('USER_AUTH_SERVICE_ADDRESS', true);

        $request = Request::create( 'http://' .
                                        $auth_service_address .
                                        '/auth/isValid/'
            , 'POST', [
            'jwt' => $user_token
        ]);

        $response =http::post($request);
        $responseCode = $response->getStatusCode();
        return $responseCode == 200;

    }


}
