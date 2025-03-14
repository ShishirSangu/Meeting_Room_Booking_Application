<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'capacity', 'company_id']; // Allow mass assignment

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'room_id');
    }
}
