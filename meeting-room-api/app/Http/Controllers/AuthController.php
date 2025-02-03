<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Registration method
    // public function register(Request $request)
    // {
    //     // Validate input fields
    //     $validator = Validator::make($request->all(), [
    //         'fullname' => 'required|string|max:255',
    //         'role' => 'required|string',
    //         'company_id' => 'required|string',
    //         'email' => 'required|email|unique:users',
    //         'password' => 'required|min:6',
    //         'dob' => 'required|date'
    //     ]);

    //     // Return validation errors if any
    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     // Create a new user record
    //     $user = User::create([
    //         'fullname' => $request->fullname,
    //         'role' => $request->role,
    //         'company_id' => $request->company_id,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //         'dob' => $request->dob,
    //     ]);

    //     // Return success response after registration
    //     return response()->json(['message' => 'User registered successfully!']);
    // }

    public function register(Request $request)
{
    // Validate input fields
    $validator = Validator::make($request->all(), [
        'fullname' => 'required|string|max:255',
        'role' => 'required|string',
        'company_id' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'dob' => 'required|date'
    ]);

    // Return validation errors if any
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Check if another Admin exists with the same company_id prefix
    if ($request->role === 'Admin') {
        $companyPrefix = substr($request->company_id, 0, 5); // Get the first 5 characters
        $existingAdmin = User::where('role', 'Admin')
            ->whereRaw("LEFT(company_id, 5) = ?", [$companyPrefix])
            ->exists();

        if ($existingAdmin) {
            return response()->json(['message' => 'Admin with this company ID already exists. Contact support team.'], 400);
        }
    }

    // Create a new user record
    $user = User::create([
        'fullname' => $request->fullname,
        'role' => $request->role,
        'company_id' => $request->company_id,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'dob' => $request->dob,
    ]);

    return response()->json(['message' => 'User registered successfully!']);
}


    // Login method (without authentication)
    public function login(Request $request)
    {
        // Directly return user details (no password check or token needed)
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return user details without authentication
        return response()->json([
            'message' => 'Login successful!',
            'id' => $user->id,
            'fullname' => $user->fullname,
            'role' => $user->role,
            'status' => $user->status,
            'email' => $user->email,
            'dob' => $user->dob,
            'company_id' => $user->company_id
        ]);
    }
}


// namespace App\Http\Controllers;

// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Validator;

// class AuthController extends Controller
// {
//     public function register(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'fullname' => 'required|string|max:255',
//             'role' => 'required|string',
//             'company_id'=>'required|string',
//             'email' => 'required|email|unique:users',
//             'password' => 'required|min:6',
//             'dob' => 'required|date'
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         $user = User::create([
//             'fullname' => $request->fullname,
//             'role' => $request->role,
//             'company_id' => $request->company_id,
//             'email' => $request->email,
//             'password' => Hash::make($request->password),
//             'dob' => $request->dob,
//         ]);

//         return response()->json(['message' => 'User registered successfully!']);
//     }

//     public function login(Request $request)
//     {
//         $credentials = $request->only('email', 'password');
    
//         $user = User::where('email', $request->email)->first();
    
//         if (!$user || !Hash::check($request->password, $user->password)) {
//             return response()->json(['message' => 'Invalid credentials'], 401);
//         }
    
//         // Return all the details of the logged-in user
//         return response()->json([
//             'message' => 'Login successful!',
//             'id' => $user->id,
//             'fullname' => $user->fullname,
//             'role' => $user->role,
//             'status' => $user->status,
//             'email' => $user->email,
//             'dob' => $user->dob,
//             'company_id' => $user->company_id
//         ]);
//     }
    
// //     public function login(Request $request)
// // {
// //     // Validate login credentials
// //     $credentials = $request->only('email', 'password');

// //     // Find the user by email
// //     $user = User::where('email', $request->email)->first();

// //     if (!$user || !Hash::check($request->password, $user->password)) {
// //         return response()->json(['message' => 'Invalid credentials'], 401);
// //     }

// //     // Return the full name along with the success message
// //     return response()->json([
// //         'message' => 'Login successful!',
// //         'fullname' => $user->fullname // Include full name in the response
// //     ]);
// // }

// }

