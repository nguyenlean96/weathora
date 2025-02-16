<?php

use App\Models\City;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::transaction(function () {
            Schema::table('cities', function (Blueprint $table) {
                $table->decimal('lat', 10, 8)->nullable()->after('coord');
                $table->decimal('lon', 11, 8)->nullable()->after('lat');
            });

            City::all()->each(function ($city) {
                $coord = json_decode($city->coord, true);
                $city->update([
                    'lon' => $coord['lon'],
                    'lat' => $coord['lat'],
                ]);
            });

            Schema::table('cities', function (Blueprint $table) {
                $table->decimal('lat', 10, 8)->nullable(false)->change();
                $table->decimal('lon', 11, 8)->nullable(false)->change();
            });

            Schema::table('cities', function (Blueprint $table) {
                $table->dropUnique('cities_name_state_country_code_unique');
                $table->unique(['name', 'state', 'country_code', 'lat', 'lon'], 'cities_name_state_country_code_lat_lon_unique');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn('lat');
            $table->dropColumn('lon');

            $table->dropUnique('cities_name_state_country_code_lat_lon_unique');
        });
    }
};
