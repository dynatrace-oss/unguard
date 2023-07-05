<?php

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
public class DoLikeController extends BaseController{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function doLike($request){

    }


}
