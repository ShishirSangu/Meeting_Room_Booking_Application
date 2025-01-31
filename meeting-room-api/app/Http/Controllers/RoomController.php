<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Add a new room.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_name' => 'required|string|max:255|unique:rooms,name',
            'capacity' => 'required|integer|min:1',
            'company_id' => 'required|string',
        ]);

        $room = Room::create([
            'name' => $validated['room_name'],
            'capacity' => $validated['capacity'],
            'company_id' => $validated['company_id'],
        ]);

        return response()->json([
            'message' => 'Room added successfully!',
            'room' => $room,
        ], 201);
    }

    /**
     * Retrieve all rooms.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }

    /**
     * Update room details.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found!'], 404);
        }

        $validated = $request->validate([
            'room_name' => 'required|string|max:255|unique:rooms,name,' . $id,
            'capacity' => 'required|integer|min:1',
            'company_id' => 'required|string',
        ]);

        $room->update([
            'name' => $validated['room_name'],
            'capacity' => $validated['capacity'],
            'company_id' => $validated['company_id'],
        ]);

        return response()->json([
            'message' => 'Room updated successfully!',
            'room' => $room,
        ]);
    }

    /**
     * Delete a room.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found!'], 404);
        }

        $room->delete();

        return response()->json(['message' => 'Room deleted successfully!']);
    }
}
