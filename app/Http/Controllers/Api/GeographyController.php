<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Trait\ApiResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeographyController extends Controller
{
    use ApiResponder;

    public function countries(): JsonResponse
    {
        try {
            /**
             * Query the country_code column and paginate the results
             */
            $query = City::select('country')
                ->advancedFilter([
                    's' => request()->input('search') ?: null,
                    'order_column' => request()->input('order_column') ?: 'country',
                    'order_direction' => request()->input('order_direction') ?: 'asc',
                ]);

            if (request()->has('limit')) {
                // Validate the limit query parameter
                $limit = request()->validate([
                    'limit' => 'integer|min:1|max:100',
                ]);

                $query = $query->paginate($limit['limit']);
            } else {
                $query = $query->paginate(10);
            }

            return $this->success($query);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function cities(): JsonResponse
    {
        try {
            /**
             * Query the city column and paginate the results
             */
            $query = City::select('name', 'country')
                ->advancedFilter([
                    's' => request()->input('search') ?: null,
                    'order_column' => request()->input('order_column') ?: 'name',
                    'order_direction' => request()->input('order_direction') ?: 'asc',
                ]);

            if (request()->has('limit')) {
                // Validate the limit query parameter
                $limit = request()->validate([
                    'limit' => 'integer|min:1|max:100',
                ]);

                $query = $query->paginate($limit['limit']);
            } else {
                $query = $query->paginate(10);
            }

            return $this->success($query);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
