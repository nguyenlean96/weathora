<?php

namespace App\Trait;

trait ApiResponder
{
    protected function success(
        $data = null,
        ?string $message = null,
        int $code = 200
    ) {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(
        ?string $message = null,
        int $code = 500
    ) {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
}
