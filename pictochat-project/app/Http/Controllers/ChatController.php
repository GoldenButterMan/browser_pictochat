<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index(){
        return Inertia::render('Chats/Index', []);
    }

    public function chatroom(){
        return Inertia::render('Chats/Chatroom', []);
    }
}
