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
        string $city,
        array $params = ['units' => 'metric']
    ): ResponseInterface {

        $baseUrl = config('services.open_weather.api') . '/' . $service . '?appid=' . config('services.open_weather.key');

        // check if the city is empty
        if (empty($city)) {
            throw new \InvalidArgumentException('Location is required');
        }
        try {

            foreach ($params as $key => $value) {
                $baseUrl .= '&' . $key . '=' . $value;
            }

            $baseUrl .= '&q=' . $city;
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
        string $city,
        array $params = ['units' => 'metric']
    ): ResponseInterface {
        return self::getData(service: 'weather', city: $city, params: $params);
    }

    /**
     * @param string $city
     * @param array $params
     * @return ResponseInterface
     */
    public static function getForecastData(
        string $city,
        array $params = ['units' => 'metric']
    ): ResponseInterface {
        return self::getData(service: 'forecast', city: $city, params: $params);
    }
}
