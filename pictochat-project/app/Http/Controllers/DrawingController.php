<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DrawingController extends Controller
{
    public function store(Request $request){
        $imageData = $request->input('image');
        $caption = $request->input('caption'); //optional caption on the photo
        $chatroomId = $request->input('chatroom_id'); //id of the chatroom

        //Convert from base64
        [$type, $data] = explode(';', $imageData);
        [, $data] = explode(',', $data);
        $data = base64_decode($data);

        $filename = 'drawing_' . time() . '.png';
        Storage::disk('public')->put("drawing/{$filename}", $data);

        //save drawing metadata to database
        $drawing = Drawing::create([
            'user_id' => Auth::id(),
            'filename' => $filename,
            'chatroom_id' => $chatroomId,
            'caption' => $caption
        ]);

        return response()->json([
            'message' => 'Your drawing has been saved!',
            'drawing' => $drawing,
            'url' => Storage::url("drawings/{$filename}"),
        ]);
    }
}
