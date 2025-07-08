<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Drawing;

class DrawingController extends Controller
{
    public function store(Request $request) {
        $imageData = $request->input('image');
        $caption = $request->input('caption');
        $chatroomId = $request->input('chatroom_id');

        if (!$imageData || !str_starts_with($imageData, 'data:image')) {
            return response()->json(['error' => 'Invalid image data'], 400);
        }

        try {
            [$meta, $base64data] = explode(',', $imageData, 2);
            $decodedData = base64_decode($base64data);

            $filename = 'drawing_' . time() . '.png';
            Storage::disk('public')->put("drawing/{$filename}", $decodedData);

            $drawing = Drawing::create([
                'user_id' => Auth::id(),
                'filename' => $filename,
                'chatroom_id' => $chatroomId,
                'caption' => $caption,
            ]);

            return response()->json(['message' => 'Drawing saved', 'drawing' => $drawing]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Image processing failed'], 500);
        }
    }
}
