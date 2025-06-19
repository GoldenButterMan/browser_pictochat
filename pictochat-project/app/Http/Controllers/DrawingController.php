<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DrawingController extends Controller
{
    public function store(Request $request){
        $imageData = $request->input('image');

        //Convert from base64
        [$type, $data] = explode(';', $imageData);
        [, $data] = explode(',', $data);
        $data = base64_decode($data);
    }
}
