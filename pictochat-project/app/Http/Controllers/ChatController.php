<?php

namespace App\Http\Controllers;

use App\Models\Drawing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index(){
        return Inertia::render('Chats/Index', []);
    }

    public function chatroom(){
        $drawings = Drawing::all();
        return Inertia::render('Chats/Chatroom', compact('drawings'));
    }
}
