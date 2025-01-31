<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition()
    {
        $date = '2025-01-20'; // Fixed date
        $start_time = '15:42:00'; // Fixed start time
        $end_time = '16:42:00'; // One hour later

        return [
            'room_id' => Room::factory(), // Random room
            'person_name' => $this->faker->name,
            'person_email' => $this->faker->email,
            'date' => $date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}




