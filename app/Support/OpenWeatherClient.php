<?php

namespace App\Support;

use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

class OpenWeatherClient
{
    /**
     * Get the weather data from the OpenWeather API.
     *
     * @param string $city
     * @param array $params
     * @return ResponseInterface
     */
    private static function getData(
        string $service = 'weather',
        float $lat = null,
        float $lon = null,
        array $params = ['units' => 'metric']
    ): ResponseInterface {

        $baseUrl = config('services.open_weather.api') . '/' . $service . '?appid=' . config('services.open_weather.key');

        if (empty($lat) || empty($lon)) {
            throw new \InvalidArgumentException('Invalid location');
        }
        try {

            foreach ($params as $key => $value) {
                $baseUrl .= '&' . $key . '=' . $value;
            }

            $baseUrl .= '&lat=' . $lat . '&lon=' . $lon;
            $client = new Client();
            $response = $client->get($baseUrl);

            return $response;
        } catch (\Exception $e) {
            // \Log::error_log($e->getMessage());
            return [];
        }
    }

    /**
     * @param string $city
     * @param array $params
     * @return ResponseInterface
     */
    public static function getWeatherData(
        float $lat = null,
        float $lon = null,
        array $params = ['units' => 'metric']
    ): ResponseInterface {
        if (empty($lat) || empty($lon)) {
            throw new \InvalidArgumentException('Invalid location');
        }

        return self::getData(
            service: 'weather',
            lat: $lat,
            lon: $lon,
            params: $params
        );
    }

    /**
     * @param string $city
     * @param array $params
     * @return ResponseInterface
     */
    public static function getForecastData(
        float $lat = null,
        float $lon = null,
        array $params = ['units' => 'metric']
    ): ResponseInterface {
        if (empty($lat) || empty($lon)) {
            throw new \InvalidArgumentException('Invalid location');
        }
        return self::getData(
            service: 'forecast',
            lat: $lat,
            lon: $lon,
            params: $params
        );
    }
}
