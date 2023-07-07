<?php

use Illuminate\Support\Facades\Route;

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

//include ('app/Http/Controllers/DoLikeController.php');

Route::get('/like-service/', function () {
    return view('welcome');
});

Route::get(env('API_PATH') . '/ping', function (){
    return "pong";
});

//Route::post(env('API_PATH') . '/like-post', function(Request $request){
  //  return DoLikeController::doLike($request);
//});
