<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drawing extends Model
{
    protected $fillable = [
        'user_id',
        'filename',
        'chatroom_id',
        'caption',
    ];
}
