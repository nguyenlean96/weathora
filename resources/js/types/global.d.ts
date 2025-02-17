import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;

    interface City {
        name: string;
        state: string | null;
        country: string;
        lat: number;
        lon: number;
    };

    interface IMinuteForecast {
        dt: number;
        precipitation: number;
    }
    interface IWeatherCondition {
        id: number;
        main: string;
        description: string;
        icon: string;
    }

    interface ICurrentWeather {
        dt: number;
        sunrise: number;
        sunset: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        uvi: number;
        clouds: number;
        visibility: number;
        wind_speed: number;
        wind_deg: number;
        wind_gust: number;
        weather: Array<IWeatherCondition>;
        snow?: {
            '1h'?: number;
            '3h'?: number;
        };
        rain?: {
            '1h': number;
            '3h': number;
        };
    }

    interface IHourlyForecast {
        dt: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        uvi: number;
        clouds: number;
        visibility: number;
        wind_speed: number;
        wind_deg: number;
        wind_gust: number;
        weather: Array<IWeatherCondition>;
        pop: number;
    }

    interface IDailyForecast {
        dt: number;
        sunrise: number;
        sunset: number;
        moonrise: number;
        moonset: number;
        moon_phase: number;
        summary: string;
        temp: {
            day: number;
            min: number;
            max: number;
            night: number;
            eve: number;
            morn: number;
        };
        feels_like: {
            day: number;
            night: number;
            eve: number;
            morn: number;
        };
        pressure: number;
        humidity: number;
        dew_point: number;
        wind_speed: number;
        wind_deg: number;
        wind_gust: number;
        weather: Array<IWeatherCondition>;
        clouds: number;
        pop: number;
        uvi: number;
    }

    interface IForecastDateTime {
        dt: number;
        dt_txt: string;
        main: any;
        pop: number;
        sys: {
            pod: string;
        };
        visibility: number;
        weather: Array<any>;
        wind: {
            speed: number;
            deg: number;
            gust?: number;
        };
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps { }
}
