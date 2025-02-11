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
        Schema::create('winds', function (Blueprint $table) {
            // id (Primary Key, auto-increment)
            $table->id();
            // report_id (Foreign Key -> weather_reports.id)
            $table->foreignId('report_id')
                ->constrained(table: 'weather_reports', column: 'id')
                ->noActionOnDelete();
            // speed (decimal, e.g., 4.63 m/s)
            $table->decimal('speed', 8, 2);
            // direction (integer, degrees, e.g., 230)
            $table->unsignedInteger('direction');
            // gust (decimal, nullable)
            $table->decimal('gust', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('winds');
    }
};
