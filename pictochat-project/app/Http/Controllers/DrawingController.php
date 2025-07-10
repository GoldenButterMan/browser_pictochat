<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Drawing;

class DrawingController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'image' => ['required', 'string', 'regex:/^data:image\/(png|jpeg|jpg);base64,/'],
            'caption' => 'nullable|string',
            'chatroom_id' => 'nullable|string',
        ]);

        try {
            $imageData = $request->input('image');
            $caption = $request->input('caption');
            $chatroomId = $request->input('chatroom_id');

            // Separate metadata from base64 content
            [$meta, $base64data] = explode(',', $imageData, 2);

            // Determine file extension from MIME type
            if (preg_match('/^data:image\/(\w+);base64$/', $meta, $matches)) {
                $extension = $matches[1];
            } else {
                return back()->withErrors(['image' => 'Invalid image MIME type.']);
            }

            $decodedData = base64_decode($base64data);
            if ($decodedData === false) {
                return back()->withErrors(['image' => 'Failed to decode image data.']);
            }

            $filename = 'drawing_' . time() . '.' . $extension;
            Storage::disk('public')->put("drawing/{$filename}", $decodedData);

            Drawing::create([
                'user_id' => Auth::id(),
                'filename' => $filename,
                'caption' => $request->input('caption'),
                'chatroom_id' => $request->input('chatroom_id'),
            ]);

            return back()->with('success', 'Drawing saved!');
        } catch (\Throwable $e) {
            return back()->withErrors([
                'image' => 'Failed to process drawing: ' . $e->getMessage(),
            ]);
        }
    }
}
