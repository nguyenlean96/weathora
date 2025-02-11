<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherCondition extends Model
{
    use HasAdvancedFilter;

    protected $table = 'weather_conditions';

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = ['report_id', 'weather_id', 'main', 'description', 'icon'];

    protected $orderable = ['id', 'report_id', 'weather_id', 'main', 'description', 'icon'];

    protected $filterable = ['id', 'report_id', 'weather_id', 'main', 'description', 'icon'];

    public function report(): BelongsTo
    {
        return $this->belongsTo(WeatherReport::class, 'report_id', 'id');
    }
}
