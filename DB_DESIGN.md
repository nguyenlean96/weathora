## For Weather Data

### Database Models Overview
1. `locations` (Stores cities/places for weather data)
2. `weather_conditions` (Describes the general weather state)
3. `weather_reports` (Stores the actual weather data, associated with locations)
4. `wind_data` (Stores wind speed & direction)
5. `cloud_data` (Stores cloudiness percentage)
6. `sys_info` (Stores additional system info like country, sunrise, sunset)
7. `timestamps` (For tracking API response times)

### Database Schema

1. **Locations Table (**`locations`**)**

- `id` (Primary Key, UUID)
- `name` (string, e.g., "Montreal")
- `longitude` (float)
- `latitude` (float)
- `timezone_offset` (integer, in seconds)
- `country_code` (string, from sys -> country)

2. **Weather Reports Table (**`weather_reports`**)**

- `id` (Primary Key, UUID)
- `location_id` (Foreign Key -> locations.id)
- `temperature` (decimal, e.g., -4.8)
- `feels_like` (decimal, e.g., -10.66)
- `temp_min` (decimal)
- `temp_max` (decimal)
- `pressure` (integer, hPa)
- `humidity` (integer, percentage)
- `sea_level_pressure` (integer, nullable)
- `ground_level_pressure` (integer, nullable)
- `visibility` (integer, meters)
- `timestamp` (timestamp, UNIX epoch converted)
3. **Weather Conditions Table (**`weather_conditions`**)**

- `id` (Primary Key, auto-increment)
- `report_id` (Foreign Key -> weather_reports.id)
- `weather_id` (integer, from API)
- `main` (string, e.g., "Clouds")
- `description` (string, e.g., "overcast clouds")
- `icon` (string, e.g., "04d")

4. **Wind Table (**`wind_data`**)**

- `id` (Primary Key, auto-increment)
- `report_id` (Foreign Key -> weather_reports.id)
- `speed` (decimal, e.g., 4.63 m/s)
- `direction` (integer, degrees, e.g., 230)

5. **Cloud Table (**`cloud_data`**)**

- `id` (Primary Key, auto-increment)
- `report_id` (Foreign Key -> weather_reports.id)
- `coverage` (integer, percentage, e.g., 100)

6. **System Info Table (**`sys_info`**)**

- `id` (Primary Key, auto-increment)
- `report_id` (Foreign Key -> weather_reports.id)
- `sunrise` (timestamp)
- `sunset` (timestamp)

### Relationships in Laravel Models
- Location has many WeatherReport
- WeatherReport has one WeatherCondition, WindData, CloudData, and SysInfo

## For Forecast Data

### Database Models Overview
1. `locations` – Stores city information.
2. `forecast_reports` – Stores each forecast entry with a timestamp.
3. `forecast_weather_conditions` – Stores weather condition details for each forecast entry.
4. `forecast_wind_data` – Stores wind speed, direction, and gust data.
5. `forecast_cloud_data` – Stores cloudiness percentage.
6. `forecast_precipitation` – Stores rain or snow data.
7. `sys_info` – Stores system information for sunrise/sunset.

### Database Schema
1. **Locations Table (**`locations`**)**

- `id` (Primary Key, UUID)
- `name` (string, e.g., "Montreal")
- `longitude` (float)
- `latitude` (float)
- `timezone_offset` (integer)
- `country_code` (string)
- `population` (integer, nullable)

2. **Forecast Reports Table (**`forecast_reports`**)**

- `id` (Primary Key, UUID)
- `location_id` (Foreign Key -> locations.id)
- `timestamp` (timestamp, forecast time)
- `temperature` (decimal)
- `feels_like` (decimal)
- `temp_min` (decimal)
- `temp_max` (decimal)
- `pressure` (integer)
- `sea_level_pressure` (integer, nullable)
- `ground_level_pressure` (integer, nullable)
- `humidity` (integer)
- `visibility` (integer, nullable)
- `pop` (decimal, probability of precipitation)

3. Forecast Weather Conditions Table (forecast_weather_conditions)

- `id` (Primary Key, auto-increment)
- `forecast_report_id` (Foreign Key -> forecast_reports.id)
- `weather_id` (integer)
- `main` (string)
- `description` (string)
- `icon` (string)

4. Forecast Wind Table (forecast_wind_data)

- `id` (Primary Key, auto-increment)
- `forecast_report_id` (Foreign Key -> forecast_reports.id)
- `speed` (decimal)
- `direction` (integer)
- `gust` (decimal, nullable)

5. Forecast Cloud Table (forecast_cloud_data)

- `id` (Primary Key, auto-increment)
- `forecast_report_id` (Foreign Key -> forecast_reports.id)
- `coverage` (integer)

6. Forecast Precipitation Table (forecast_precipitation)

- `id` (Primary Key, auto-increment)
- `forecast_report_id` (Foreign Key -> forecast_reports.id)
- `rain_3h` (decimal, nullable)
- `snow_3h` (decimal, nullable)

7. System Info Table (sys_info)

- `id` (Primary Key, auto-increment)
- `location_id` (Foreign Key -> locations.id)
- `sunrise` (timestamp)
- `sunset` (timestamp)

### Relationships in Laravel Models

- Location has many ForecastReport
- ForecastReport has one ForecastWeatherCondition, ForecastWindData, ForecastCloudData, and optionally ForecastPrecipitation
- SysInfo belongs to Location
