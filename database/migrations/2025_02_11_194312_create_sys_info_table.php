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
        Schema::create('sys_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')
                ->constrained(table: 'weather_reports', column: 'id')
                ->noActionOnDelete();
            // Field: type (number)
            $table->unsignedTinyInteger('type')->default(0)->nullable();
            // Field: country_code (string)
            $table->string('country_code', 2)->nullable();
            // Field: sunrise (number) UNIX timestamp
            $table->unsignedInteger('sunrise')->nullable();
            // Field: sunset (number) UNIX timestamp
            $table->unsignedInteger('sunset')->nullable();

            // Field: pod (string)
            $table->string('pod', 1)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_info');
    }
};
