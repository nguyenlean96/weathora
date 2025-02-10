<?php

use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\GeographyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::prefix('api')
    ->name('api.')
    ->group(function () {
        Route::prefix('v1')
            ->name('v1.')
            ->group(function () {
                Route::get('cities', [GeographyController::class, 'cities'])->name('cities');
                Route::get('countries', [GeographyController::class, 'countries'])->name('countries');
            });
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
