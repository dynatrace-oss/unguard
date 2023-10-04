<?php

namespace app\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class LikeController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    static function doLike($request)
    {
        $user_token = $request->cookie('jwt');
        $postId = $request->input('postId');

        if (!self::validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = self::extractUserIdFromToken($user_token);

        DB::table('like')->insert([
            'userId' => $userId,
            'postId' => $postId
        ]);
        return response()->json([
            'message' => 'Authorized'
        ], 200);
    }

    static function getLikeCountAndState($request, $postId)
    {
        $user_token = $request->cookie('jwt');

        if (!self::validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = self::extractUserIdFromToken($user_token);

        $count = DB::table('like')->where('postId', '=', $postId)->count('*');
        $userLiked = DB::table('like')->where('userId', '=', $userId)->where('postId', '=', $postId)->count('*') > 0;


        return response()->json([
            'likeCount' => $count,
            'userLiked' => $userLiked
        ], 200);
    }

    static function getMultipleLikeCountsAndStates($request)
    {
        $user_token = $request->cookie('jwt');
        $postIds = $request->query('postIds', $request->query('postIds[]', []));

        if (!self::validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = self::extractUserIdFromToken($user_token);

        $counts = DB::table('like')->select('postId', DB::raw('count(*) as likeCount'))->whereIn('postId', $postIds)->groupBy('postId')->get();
        $userLiked = DB::table('like')->select('postId')->where('userId', '=', $userId)->whereIn('postId', $postIds)->get();

        return response()->json([
            'likeCounts' => $counts,
            'likedPosts' => $userLiked
        ], 200);
    }

    /*
        * Function removeLike is vulnerable to SQL-Injection-Attacks.
        * When "postId" is an array, all contents of the array are added to the SQL-Bindings of the subsequent query.
        * This means that, when passing an array it is possible to manipulate the userId value of the query -> unlike another user's like.
 */
    static function removeLike($request)
    {
        $user_token = $request->cookie('jwt');
        $postId = $request->input('postId');

        if (!self::validateToken($user_token)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
        $userId = $userId = self::extractUserIdFromToken($user_token);

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

    static function validateToken($user_token)
    {
        $auth_service_validate_host = config('app.auth_service_url');

        $response = Http::post($auth_service_validate_host, [
            'jwt' => $user_token
        ]);

        $responseCode = $response->getStatusCode();
        return $responseCode == 200;
    }

    static function extractUserIdFromToken($jwt)
    {
        $jwtPayload = explode(".", $jwt, 3)[1];
        $jsonJwtPayload = base64_decode($jwtPayload);
        $payloadArray = json_decode($jsonJwtPayload, true);
        $userId = $payloadArray['userid'];
        return $userId;
    }
}
