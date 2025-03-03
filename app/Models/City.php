<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    /** @use HasFactory<\Database\Factories\CityFactory> */
    use HasAdvancedFilter,
        HasFactory;

    // Hide the created_at and updated_at columns
    public $hidden = [
        'coord',
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'name',
        'state',
        'country',
        'country_code',
        'lat',
        'lon',
        'timezone_offset',
        'population',
    ];

    protected $filterable = [
        'name',
        'state',
        'country',
        'country_code',
        'lat',
        'lon',
        'timezone_offset',
        'population',
    ];

    protected $orderable = [
        'name',
        'state',
        'country',
        'country_code',
        'lat',
        'lon',
        'timezone_offset',
        'population',
    ];

    protected $casts = [
        'lat' => 'decimal:10',
        'lon' => 'decimal:11',
    ];

    public function weatherReports(): HasMany
    {
        return $this->hasMany(WeatherReport::class, 'location_id', 'id');
    }

    public function reportBase(): HasMany
    {
        return $this->hasMany(ReportBase::class, 'location_id', 'id');
    }
}
