<?php

// database/factories/RoomFactory.php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,  // Random name for room
            'capacity' => $this->faker->numberBetween(1, 10),  // Random capacity between 1 and 10
        ];
    }
}

