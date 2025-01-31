<?php

// database/seeders/RoomBookingSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\Booking;

class RoomBookingSeeder extends Seeder
{
    public function run()
    {
        // Create 5 rooms
        Room::factory()->count(5)->create();

        // Create 10 bookings for rooms
        Booking::factory()->count(10)->create();
    }
}


