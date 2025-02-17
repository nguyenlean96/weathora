<?php

namespace App\Http\Controllers\Api;

use App\Models\City;
use App\Trait\ApiResponder;
use Illuminate\Http\JsonResponse;
use App\Support\OpenWeatherClient;
use App\Http\Controllers\Controller;

class OpenWeatherController extends Controller
{
    use ApiResponder;

    public function current(): JsonResponse
    {
        try {
            /**
             * Deprecated
             */
            // if (!request()->has('location')) {
            //     throw new \Exception('Location is required');
            // }
            if (!request()->has('lat') || !request()->has('lon')) {
                throw new \Exception('Invlaid location');
            }

            $validated = request()->validate([
                // 'location' => 'required|string', # Deprecated got replaced by lat and lon
                'lat' => 'required|numeric',
                'lon' => 'required|numeric',
                'units' => 'string|in:metric,imperial|nullable',
            ]);

            /**
             *  Lat and lon are stored under column coord in the cities table
             *
             *  Check whether the lat and lon are in the coord column with a
             *  tolerance of 0.1 (10km)
             */
            $newLocation = ! City::where('lat', '>=', $validated['lat'] - 0.1)
                ->where('lat', '<=', $validated['lat'] + 0.1)
                ->where('lon', '>=', $validated['lon'] - 0.1)
                ->where('lon', '<=', $validated['lon'] + 0.1)
                ->exists();

            // return $this->success($results);
            $response = OpenWeatherClient::getWeatherData(lat: $validated['lat'], lon: $validated['lon']);

            if ($response->getStatusCode() === 200) {
                $resData = json_decode($response->getBody()->getContents());
                if ($newLocation) {
                    // Get current city from $resData['name']
                    City::updateOrCreate([
                        'name' => $resData->name,
                        'lat' => $resData->coord->lat,
                        'lon' => $resData->coord->lon,
                    ]);
                }
                unset($resData->coord);
                return $this->success($resData);
            } else {
                return $this->error('Failed to fetch weather');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function forecast(): JsonResponse
    {
        try {
            /**
             * Deprecated
             */
            // if (!request()->has('location')) {
            //     throw new \Exception('Location is required');
            // }
            if (!request()->has('lat') || !request()->has('lon')) {
                throw new \Exception('Invlaid location');
            }

            $validated = request()->validate([
                // 'location' => 'required|string', # Deprecated got replaced by lat and lon
                'lat' => 'required|numeric',
                'lon' => 'required|numeric',
                'units' => 'string|in:metric,imperial|nullable',
            ]);

            /**
             *  Lat and lon are stored under column coord in the cities table
             *
             *  Check whether the lat and lon are in the coord column with a
             *  tolerance of 0.1 (10km)
             */
            $newLocation = ! City::where('lat', '>=', $validated['lat'] - 0.1)
                ->where('lat', '<=', $validated['lat'] + 0.1)
                ->where('lon', '>=', $validated['lon'] - 0.1)
                ->where('lon', '<=', $validated['lon'] + 0.1)
                ->exists();

            $response = OpenWeatherClient::getForecastData(lat: $validated['lat'], lon: $validated['lon']);

            /**
             *  Since the forecast response structure is different,
             *  city data is in $res['city']
             */
            if ($response->getStatusCode() === 200) {
                $resData = json_decode($response->getBody()->getContents());
                if ($newLocation) {
                    // Get current city from $resData['name']
                    City::updateOrCreate(
                        [
                            'name' => $resData->city->name,
                            'country_code' => $resData->city->country,
                            'lat' => $resData->city->coord->lat,
                            'lon' => $resData->city->coord->lon,
                        ],
                        [
                            'population' => $resData->city->population,
                            'timezone_offset' => $resData->city->timezone,
                        ]
                    );
                }
                unset($resData->city->coord);
                return $this->success($resData);
            } else {
                return $this->error('Failed to fetch weather');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function airPollution(): JsonResponse
    {
        try {
            if (!request()->has('lat') || !request()->has('lon')) {
                throw new \Exception('Invlaid location');
            }

            $validated = request()->validate([
                'lat' => 'required|numeric',
                'lon' => 'required|numeric',
                'units' => 'string|in:metric,imperial|nullable',
            ]);

            $response = OpenWeatherClient::getAirPollutionData(lat: $validated['lat'], lon: $validated['lon']);

            if ($response->getStatusCode() === 200) {
                $resData = json_decode($response->getBody()->getContents());

                unset($resData->coord);
                return $this->success($resData);
            } else {
                return $this->error('Failed to fetch weather');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function oneCall(): JsonResponse
    {
        try {
            if (!request()->has('lat') || !request()->has('lon')) {
                throw new \Exception('Invlaid location');
            }

            $validated = request()->validate([
                'lat' => 'required|numeric',
                'lon' => 'required|numeric',
            ]);

            $response = OpenWeatherClient::getOneCallData(lat: $validated['lat'], lon: $validated['lon']);

            if ($response->getStatusCode() === 200) {
                $resData = json_decode($response->getBody()->getContents());

                unset($resData->lat);
                unset($resData->lon);

                return $this->success($resData);
            } else {
                return $this->error('Failed to fetch weather');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
