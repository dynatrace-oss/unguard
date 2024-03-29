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


Route::get('/like', function (Request $request){
    return LikeController::getLikeCountsAndStates($request);
});

Route::delete('/like', function (Request $request){
    return LikeController::removeLike($request);
});

Route::post('/like/{postId}', function(Request $request, string $postId){
   return LikeController::doLike($request, $postId);
});
