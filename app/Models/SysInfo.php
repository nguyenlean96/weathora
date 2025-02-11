<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SysInfo extends Model
{
    use HasAdvancedFilter;

    protected $table = 'sys_info';

    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'report_id',
        'type',
        'country_code',
        'sunrise',
        'sunset'
    ];
    protected $orderable = [
        'id',
        'report_id',
        'type',
        'country_code',
        'sunrise',
        'sunset'
    ];
    protected $filterable = [
        'id',
        'report_id',
        'type',
        'country_code',
        'sunrise',
        'sunset'
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(WeatherReport::class, 'report_id', 'id');
    }
}
