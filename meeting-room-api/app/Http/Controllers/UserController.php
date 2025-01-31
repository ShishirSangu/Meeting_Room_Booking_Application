<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get a list of users with optional status filtering.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request)
    {
        $status = $request->query('status', 'all'); // Default to 'all' if no status is provided

        $usersQuery = User::query();

        if ($status !== 'all') {
            $usersQuery->where('status', $status);
        }

        $users = $usersQuery->get();

        return response()->json($users);
    }

    /**
     * Approve a user by updating their status to 'approved'.
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveUser($userId)
    {
        $user = User::find($userId);

        if ($user) {
            $user->status = 'approved';
            $user->save();

            return response()->json(['message' => 'User approved successfully!'], 200);
        }

        return response()->json(['message' => 'User not found!'], 404);
    }

    /**
     * Reject a user by updating their status to 'rejected'.
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectUser($userId)
    {
        $user = User::find($userId);

        if ($user) {
            $user->status = 'rejected';
            $user->save();

            return response()->json(['message' => 'User rejected successfully!'], 200);
        }

        return response()->json(['message' => 'User not found!'], 404);
    }


    public function updateProfile(Request $request, $userId)
    {
        // Validate the input fields
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'dob' => 'required|date',
        ]);

        // Find the user by ID
        $user = User::find($userId);

        // Check if the user exists
        if ($user) {
            // Update user details
            $user->update($validated);

            // Return success response
            return response()->json([
                'message' => 'Profile updated successfully!',
                'user' => $user
            ], 200);
        }

        // Return error if user not found
        return response()->json(['message' => 'User not found!'], 404);
    }
}
