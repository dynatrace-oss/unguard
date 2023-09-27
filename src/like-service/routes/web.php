<?php

use App\Http\Controllers\LikeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

include (__DIR__ . '/../app/Http/Controllers/LikeController.php');


Route::get('/like-service/like-count/{postId}', function (Request $request, string $postId){
    return LikeController::getLikeCountAndState($request, $postId);
});

Route::post('/like-service/like-delete', function (Request $request){
    return LikeController::removeLike($request);
});

Route::post('/like-service/like-post', function(Request $request){
   return LikeController::doLike($request);
});
