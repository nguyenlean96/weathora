<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weather_reports', function (Blueprint $table) {
            // id (Primary Key, UUID)
            $table->id();

            // coord (json)
            $table->json('coord')->nullable();

            // location_id (Foreign Key -> locations.id)
            $table->foreignId('location_id')
                ->constrained(table: 'cities', column: 'id')
                ->noActionOnDelete();

            // timestamp (timestamp, UNIX epoch converted)
            $table->unsignedInteger('timestamp');

            // base (string)
            $table->string('base')->nullable();

            // temperature (decimal, e.g., -4.8)
            $table->decimal('temperature', 5, 2);
            // feels_like (decimal, e.g., -10.66)
            $table->decimal('feels_like', 5, 2);
            // temp_min (decimal)
            $table->decimal('temp_min', 5, 2);
            // temp_max (decimal)
            $table->decimal('temp_max', 5, 2);

            // pressure (integer, hPa)
            $table->unsignedInteger('pressure')->nullable();

            // humidity (integer, percentage)
            $table->unsignedTinyInteger('humidity')->nullable();
            // pop (decimal, probability of precipitation)
            $table->decimal('pop', 5, 2)->nullable();

            // sea_level_pressure (integer, nullable)
            $table->unsignedInteger('sea_level_pressure')->nullable();
            // ground_level_pressure (integer, nullable)
            $table->unsignedInteger('ground_level_pressure')->nullable();

            // visibility (integer, meters)
            $table->unsignedInteger('visibility')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_reports');
    }
};
