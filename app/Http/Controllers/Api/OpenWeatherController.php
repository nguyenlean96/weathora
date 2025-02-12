<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\OpenWeatherClient;
use App\Trait\ApiResponder;
use Illuminate\Http\JsonResponse;

class OpenWeatherController extends Controller
{
    use ApiResponder;

    public function current(): JsonResponse
    {
        try {
            if (!request()->has('location')) {
                throw new \Exception('Location is required');
            }

            $validated = request()->validate([
                'location' => 'required|string',
                'units' => 'string|in:metric,imperial|nullable',
            ]);

            $response = OpenWeatherClient::getWeatherData($validated['location']);

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
            if (!request()->has('location')) {
                throw new \Exception('Location is required');
            }

            $validated = request()->validate([
                'location' => 'required|string',
                'units' => 'string|in:metric,imperial|nullable',
            ]);


            $response = OpenWeatherClient::getForecastData($validated['location']);

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
