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
        Schema::create('precipitations', function (Blueprint $table) {
            // id (Primary Key, auto-increment)
            $table->id();
            // forecast_report_id (Foreign Key -> forecast_reports.id)
            $table->foreignId('report_id')
                ->constrained(table: 'weather_reports', column: 'id')
                ->noActionOnDelete();
            // rain_3h (decimal, nullable)
            $table->decimal('rain_3h', 5, 2)->nullable();
            // snow_3h (decimal, nullable)
            $table->decimal('snow_3h', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('precipitations');
    }
};
