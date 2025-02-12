<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportBase extends Model
{
    use HasAdvancedFilter;

    protected $table = 'report_bases';

    protected $fillable = [
        'location_id',
        'type',
        'lat',
        'lon',
        'timezone',
        'timezone_offset',
        'country',
    ];

    protected $orderable = [
        'id',
        'location_id',
        'type',
        'lat',
        'lon',
        'timezone',
        'timezone_offset',
        'country',
    ];

    protected $filterable = [
        'id',
        'location_id',
        'type',
        'lat',
        'lon',
        'timezone',
        'timezone_offset',
        'country',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
