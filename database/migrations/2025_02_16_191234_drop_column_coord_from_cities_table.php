<?php

use App\Models\City;
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
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn('coord');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->json('coord')->nullable();
        });

        City::all()->each(function ($city) {
            $city->update([
                'coord' => [
                    'lon' => $city->lon,
                    'lat' => $city->lat,
                ],
            ]);
        });
    }
};
