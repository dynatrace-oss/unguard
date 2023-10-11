<?php
#
# Copyright 2023 Dynatrace LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

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

    static function doLike($request, $postId)
    {
        $user_token = $request->cookie('jwt');

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
        return response()->make();
    }

    static function getLikeCountsAndStates($request)
    {
        $user_token = $request->cookie('jwt');
        $postIds = $request->query('postId', $request->query('postId[]', []));

        if(!is_array($postIds)) {
            $postIds = [$postIds];
        }

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
        $postId = $request->query('postId');

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

        return response()->make();
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
