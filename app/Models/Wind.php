<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wind extends Model
{
    use HasAdvancedFilter;

    protected $table = 'winds';

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = ['report_id', 'speed', 'direction', 'gust'];

    protected $orderable = ['id', 'report_id', 'speed', 'direction', 'gust'];

    protected $filterable = ['id', 'report_id', 'speed', 'direction', 'gust'];

    public function report(): BelongsTo
    {
        return $this->belongsTo(WeatherReport::class, 'report_id', 'id');
    }
}
