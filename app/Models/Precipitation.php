<?php

namespace App\Models;

use App\Trait\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Model;

class Precipitation extends Model
{
    use HasAdvancedFilter;

    protected $table = 'precipitations';

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = ['report_id', 'rain_3h', 'snow_3h'];

    protected $orderable = ['id', 'report_id', 'rain_3h', 'snow_3h'];

    protected $filterable = ['id', 'report_id', 'rain_3h', 'snow_3h'];

    public function report()
    {
        return $this->belongsTo(WeatherReport::class, 'report_id', 'id');
    }
}
