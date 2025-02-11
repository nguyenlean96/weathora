<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Trait\ApiResponder;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;

class OpenWeatherController extends Controller
{
    use ApiResponder;

    public function current(): JsonResponse
    {
        try {
            $client = new Client();
            $openWeatherApi = config('services.open_weather.api') . '/weather?appid=' . config('services.open_weather.key');

            if (request()->has('units')) {
                $openWeatherApi .= '&units=' . request()->get('units');
            }

            if (!request()->has('location')) {
                throw new \Exception('Location is required');
            }

            $openWeatherApi .= '&q=' . request()->get('location');

            $response = $client->get($openWeatherApi);

            if ($response->getStatusCode() === 200) {
                return $this->success(json_decode($response->getBody()->getContents()));
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
            $client = new Client();
            $openWeatherApi = config('services.open_weather.api') . '/forecast?appid=' . config('services.open_weather.key');

            if (request()->has('units')) {
                $openWeatherApi .= '&units=' . request()->get('units');
            }

            if (!request()->has('location')) {
                throw new \Exception('Location is required');
            }

            $openWeatherApi .= '&q=' . request()->get('location');

            $response = $client->get($openWeatherApi);

            if ($response->getStatusCode() === 200) {
                return $this->success(json_decode($response->getBody()->getContents()));
            } else {
                return $this->error('Failed to fetch weather');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
