<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataPath = database_path('seeders/data/countries');

        $countries = File::glob($dataPath . '/*.php');
        foreach ($countries as $c) {
            $cities = include $c;
            foreach ($cities as $city) {
                City::create([
                    'name' => $city['name'],
                    'state' => $city['state'],
                    'country_code' => $city['country'],
                    'coord' => $city['coord'],
                ]);
            }
        }
    }
}
