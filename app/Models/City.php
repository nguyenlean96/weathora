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
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'name',
        'state',
        'country',
        'country_code',
        'coord',
    ];

    protected $filterable = [
        'name',
        'state',
        'country',
        'country_code',
    ];

    protected $orderable = [
        'name',
        'state',
        'country',
        'country_code',
    ];

    protected $casts = [
        'coord' => 'array',
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
