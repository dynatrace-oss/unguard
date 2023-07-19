<?php

namespace app\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LikeController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function doLike($request)
    {
        $user_token = $request->cookie('jwt');
        $postId = $request->header('postId');

        if (!$this->validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = $this->extractUserIdFromToken($user_token);

        DB::table('like')->insert([
            'userId' => $userId,
            'postId' => $postId
        ]);
        return response()->json([
            'message' => 'Authorized'
        ], 200);
    }

    function getLikeCountAndState($request)
    {
        $user_token = $request->cookie('jwt');
        $postId = $request->header('postId');

        if (!$this->validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = $userId = $this->extractUserIdFromToken($user_token);

        $count = DB::table('like')->where('postId', '=', $postId)->count('*');
        $userLiked = DB::table('like')->where('userId', '=', $userId)->where('postId', '=', $postId)->count('*') > 0;

        return response()->json([
            'likeCount' => $count,
            'userLiked' => $userLiked
        ], 200);
    }

    /*
        * Function removeLike is vulnerable to SQL-Injection-Attacks.
        * When "postId" is an array, all contents of the array are added to the SQL-Bindings of the subsequent query.
        * This means that, when passing an array it is possible to manipulate the userId value of the query -> unlike another user's like.
 */
    function removeLike($request)
    {
        $user_token = $request->cookie('jwt');
        $postId = $request->input('postId');

        if (!$this->validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = $userId = $this->extractUserIdFromToken($user_token);

        $query = DB::table('like')->where([
            ['postId', '=', $postId],
            ['userId', '=', $userId],
        ]);

        //fixes error when too many values are bound
        $bindings = $query->getBindings();
        $bindings = array_slice($bindings, 0, 2);

        $query->setBindings($bindings)->delete();

        return response()->json([
            'userId' => $userId,
        ], 200);
    }

    function validateToken($user_token)
    {
        $auth_service_validate_host = config('app.auth_service_url');

        Log::notice('Sending request to: ' . $auth_service_validate_host);

        $response = Http::post($auth_service_validate_host, [
            'jwt' => $user_token
        ]);

        $responseCode = $response->getStatusCode();
        return $responseCode == 200;
    }

    function extractUserIdFromToken($jwt)
    {
        $jwtPayload = explode(".", $jwt, 3)[1];
        $jsonJwtPayload = base64_decode($jwtPayload);
        $payloadArray = json_decode($jsonJwtPayload, true);
        $userId = $payloadArray['userid'];
        return $userId;
    }
}
