<?php

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

include (__DIR__.'/api.php');


Route::get('/like-service', function () {
    return view('welcome');
});

Route::get('/like-service/ping', function (){
    return "pong";
});

include (__DIR__.'/../app/Http/Controllers/DoLikeController.php');

Route::post('/like-service/like-post', function(Request $request){
    $doLikeController = new DoLikeController();
   return $doLikeController->doLike($request);
});
