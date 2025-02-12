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
        Schema::table('weather_reports', function (Blueprint $table) {
            $table->foreignId('report_base_id')
                ->constrained(table: 'report_bases', column: 'id')
                ->cascadeOnDelete();
            $table->dropColumn('coord');
            $table->dropColumn('base');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('weather_reports', function (Blueprint $table) {
            $table->dropForeign(['report_base_id']);
            $table->json('coord')->nullable();
            $table->string('base')->nullable();
        });
    }
};
