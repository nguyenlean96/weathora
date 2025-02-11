<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WeatherReport extends Model
{
    use HasAdvancedFilter;

    protected $table = 'weather_reports';

    protected $hidden = ['created_at', 'updated_at'];

    // Always has the relationship data
    protected $with = [
        'location',
        'conditions',
        'cloud',
        'wind',
        'sysInfo'
    ];

    protected $fillable = [
        'location_id',
        'coord',
        'base',
        'timestamp',
        'temperature',
        'feels_like',
        'temp_min',
        'temp_max',
        'pressure',
        'humidity',
        'pop',
        'sea_level_pressure',
        'ground_level_pressure',
        'visibility',
    ];

    protected $orderable = [
        'id',
        'location_id',
        'base',
        'timestamp',
        'temperature',
        'feels_like',
        'temp_min',
        'temp_max',
        'pressure',
        'humidity',
        'pop',
        'sea_level_pressure',
        'ground_level_pressure',
        'visibility',
    ];

    protected $filterable = [
        'id',
        'location_id',
        'base',
        'timestamp',
        'temperature',
        'feels_like',
        'temp_min',
        'temp_max',
        'pressure',
        'humidity',
        'pop',
        'sea_level_pressure',
        'ground_level_pressure',
        'visibility',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(City::class, 'location_id', 'id');
    }

    public function conditions(): HasMany
    {
        return $this->hasMany(WeatherCondition::class, 'report_id', 'id');
    }

    public function cloud(): HasMany
    {
        return $this->hasMany(Cloud::class, 'report_id', 'id');
    }

    public function wind(): HasMany
    {
        return $this->hasMany(Wind::class, 'report_id', 'id');
    }

    public function sysInfo(): HasOne
    {
        return $this->hasOne(SysInfo::class, 'report_id', 'id');
    }
}
