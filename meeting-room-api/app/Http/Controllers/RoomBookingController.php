<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoomBookingController extends Controller
{


    public function getAllBookings(Request $request)
    {
        $role = $request->input('role');
        $email = $request->input('email');
        $userId = $request->input('user_id');

        if ($role === 'Employee') {
            // Fetch only bookings for the logged-in employee
            $bookings = Booking::with(['room', 'user'])
                ->where('person_email', $email)
                ->orWhere('user_id', $userId)
                ->get();
        } else {
            // Fetch all bookings for Admin or other roles
            $bookings = Booking::with(['room', 'user'])->get();
        }

        return response()->json($bookings);
    }

    // get Booked Details
    

// Get bookings details
    public function getBookingsForRoom($roomId)
    {
        $room = Room::with('bookings')->find($roomId);

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        return response()->json([
            'room' => $room->only(['id', 'name', 'capacity']),
            'bookings' => $room->bookings,
        ]);
    }

// Store a new booking
public function store(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'room_id' => 'required|exists:rooms,id',
        'person_name' => 'required|string|max:255',
        'person_email' => 'required|email',
        'date' => 'required|date',
        'start_time' => 'required|date_format:H:i',
        'end_time' => 'required|date_format:H:i',
        'user_id' => 'required|exists:users,id',
    ]);

    $startTimestamp = "{$request->date} {$request->start_time}";
    $endTimestamp = "{$request->date} {$request->end_time}";

    $existingBooking = Booking::where('room_id', $request->room_id)
        ->where('date', $request->date) 
        ->where(function ($query) use ($startTimestamp, $endTimestamp) {
            $query->where(function ($query) use ($startTimestamp, $endTimestamp) {
                $query->where('start_time', '<', $endTimestamp)
                      ->where('end_time', '>', $startTimestamp);
            });
        })
        ->first();

        if ($existingBooking) {
            // Check if the role is not "Employee"
            if ($request->role !== 'Employee') {
                return response()->json([
                    'message' => "This room is already booked by {$existingBooking->person_name} on {$existingBooking->date} from {$existingBooking->start_time} to {$existingBooking->end_time}."
                ], 400);
            } else {
                return response()->json([
                    'message' => "This room is already booked. Please choose another time slot."
                ], 400);
            }
        }

    $booking = Booking::create([
        'room_id' => $request->room_id,
        'person_name' => $request->person_name,
        'person_email' => $request->person_email,
        'date' => $request->date,
        'start_time' => $startTimestamp,
        'end_time' => $endTimestamp,
        'user_id' => $request->user_id,
    ]);

    return response()->json([
        'message' => 'Room booked successfully!',
        'booking' => $booking
    ]);
}



    // Delete
    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Delete the booking
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }


    // Update
    public function update(Request $request, $id)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'person_name' => 'required|string|max:255',
            'person_email' => 'required|email',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'user_id' => 'required|exists:users,id',
        ]);

        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Update the booking
        $startTimestamp = "{$request->date} {$request->start_time}";
        $endTimestamp = "{$request->date} {$request->end_time}";

        $booking->update([
            'room_id' => $request->room_id,
            'person_name' => $request->person_name,
            'person_email' => $request->person_email,
            'date' => $request->date,
            'start_time' => $startTimestamp,
            'end_time' => $endTimestamp,
            'user_id' =>$request->user_id,
        ]);

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking
        ]);
    }

    // Booked Details
    public function getBookedRooms(Request $request)
    {
        $date = $request->date;
        $startTime = $request->start_time;
        $endTime = $request->end_time;

        $bookedRooms = Booking::where('date', $date)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->pluck('room_id');

        return response()->json($bookedRooms);
    }


    public function getAvailableRooms(Request $request)
{
    $date = $request->date;
    $startTime = $request->start_time;
    $endTime = $request->end_time;

    // Get booked room IDs for the given date and time range
    $bookedRoomIds = Booking::where('date', $date)
        ->where('start_time', '<', $endTime)
        ->where('end_time', '>', $startTime)
        ->pluck('room_id');

    // Get available rooms by excluding the booked room IDs
    $availableRooms = Room::whereNotIn('id', $bookedRoomIds)
        ->when($request->capacity, function ($query, $capacity) {
            return $query->where('capacity', '>=', $capacity);
        })
        ->get();

    return response()->json($availableRooms);
}

}
