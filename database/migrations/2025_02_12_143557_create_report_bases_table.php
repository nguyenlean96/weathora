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
        Schema::create('report_bases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')
                ->constrained(table: 'cities', column: 'id')
                ->nullable()
                ->noActionOnDelete();
            // type: string
            $table->string('type')->nullable();
            // lat: float
            $table->float('lat');
            // lon: float
            $table->float('lon');
            // timezone: string
            $table->string('timezone')->nullable();
            // timezone_offset: integer
            $table->integer('timezone_offset')->nullable();
            // country: string
            $table->string('country')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_bases');
    }
};
