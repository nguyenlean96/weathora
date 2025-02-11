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
        Schema::create('clouds', function (Blueprint $table) {
            // id (Primary Key, auto-increment)
            $table->id();
            // report_id (Foreign Key -> weather_reports.id)
            $table->foreignId('report_id')
                ->constrained(table: 'weather_reports', column: 'id')
                ->noActionOnDelete();
            // coverage (integer, percentage, e.g., 100)
            $table->unsignedInteger('coverage');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clouds');
    }
};
