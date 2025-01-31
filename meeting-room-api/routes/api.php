<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomBookingController;
use App\Http\Controllers\UserController;

// Registration & Login Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Room Routes 
Route::apiResource('rooms', RoomController::class);
Route::get('/rooms', [RoomController::class, 'index']);

// Booking Routes 
Route::get('/bookings', [RoomBookingController::class, 'getAllBookings']);
Route::post('/book-room', [RoomBookingController::class, 'store']);
Route::put('/book-room/{id}', [RoomBookingController::class, 'update']);
Route::delete('/book-room/{id}', [RoomBookingController::class, 'destroy']);
Route::get('/room/{roomId}/bookings', [RoomBookingController::class, 'getBookingsForRoom']);

// User Routes 
Route::get('/users', [UserController::class, 'getUsers']);
Route::put('/users/{userId}/approve', [UserController::class, 'approveUser']);
Route::put('/users/{userId}/reject', [UserController::class, 'rejectUser']);
Route::put('/users/{userId}/update', [UserController::class, 'updateProfile']); // No middleware

// Booked Detail
Route::get('/booked-rooms', [RoomBookingController::class, 'getBookedRooms']);

// Available rooms
Route::get('/available-rooms', [RoomBookingController::class, 'getAvailableRooms']);

// Public user route
Route::get('/user', function (Request $request) {
    // Return some static or sample user data, no authentication required
    return response()->json([
        'id' => 1,
        'fullname' => 'John Doe',
        'email' => 'johndoe@example.com',
        'dob' => '1990-01-01',
        'role' => 'admin',
        'status' => 'active',
    ]);
});
