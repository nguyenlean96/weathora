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
