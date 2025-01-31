<?php

// app/Models/Booking.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id', 
        'person_name', 
        'person_email', 
        'date', 
        'start_time', 
        'end_time',
        'user_id',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}
}

