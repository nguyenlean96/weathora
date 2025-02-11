<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Trait\ApiResponder;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnsplashController extends Controller
{
    use ApiResponder;

    public function photos(): JsonResponse
    {
        try {
            $client = new Client();
            $unsplashApi = config('services.unsplash.api');

            if (!request()->has('search')) {
                throw new \Exception('Search is required');
            }

            $unsplashApi .= '&query=' . request()->get('search');

            $response = $client->get($unsplashApi);

            if ($response->getStatusCode() === 200) {
                return $this->success(json_decode($response->getBody()->getContents()));
            } else {
                return $this->error('Failed to fetch photos');
            }

        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
