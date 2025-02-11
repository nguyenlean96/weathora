<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cloud extends Model
{
    use HasAdvancedFilter;

    protected $table = 'clouds';

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = ['report_id', 'coverage'];

    protected $orderable = ['id', 'report_id', 'coverage'];

    protected $filterable = ['id', 'report_id', 'coverage'];

    public function report(): BelongsTo
    {
        return $this->belongsTo(WeatherReport::class, 'report_id', 'id');
    }
}
