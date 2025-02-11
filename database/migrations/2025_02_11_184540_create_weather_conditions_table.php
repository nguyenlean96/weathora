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
        Schema::create('weather_conditions', function (Blueprint $table) {
            $table->id();
            // report_id (Foreign Key -> weather_reports.id)
            $table->foreignId('report_id')
                ->constrained(table: 'weather_reports', column: 'id')
                ->noActionOnDelete();
            // weather_id (integer, from API)
            $table->unsignedInteger('weather_id');
            // main (string, e.g., "Clouds")
            $table->string('main');
            // description (string, e.g., "overcast clouds")
            $table->string('description');
            // icon (string, e.g., "04d")
            $table->string('icon');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_conditions');
    }
};
