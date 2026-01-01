<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'app' => 'Nexus ERP API',
        'version' => '1.0.0',
        'status' => 'running',
        'documentation' => url('/api/documentation'),
    ]);
});
