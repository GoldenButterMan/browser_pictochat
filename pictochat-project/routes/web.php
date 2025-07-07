<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DrawingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/chats', [ChatController::class, 'index'])->name('chats.index');
    Route::get('/chats/chatroom',[ChatController::class, 'chatroom'])->name('chats.chatroom');
});

Route::post('/save-drawing', [DrawingController::class, 'store'])->name('drawing.save');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
