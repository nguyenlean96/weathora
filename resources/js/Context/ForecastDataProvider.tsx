import { useForecastData } from '@/Hooks';
import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState, useEffect, useMemo
} from 'react';
import { useWeatherContext } from './WeatherDataProvider';

const ForecastDataContext = createContext<any>(null);

export function useForecastDataContext() {
    const value = useContext(ForecastDataContext);

    if (!value) {
        throw new Error('useDailyForecast must be used within a DailyForecastProvider');
    }

    return value;
}


export default function ForecastDataProvider({ children }: PropsWithChildren) {
    const { cityWeather } = useWeatherContext();
    const { loading, data } = useForecastData(cityWeather);

    /**
     *
     * @param oridat
     * @returns
     */
    const UniqueDays = (oridat: {
        list: Array<any>;
        message?: number;
        cnt?: number;
        cod?: string;
        city?: any;
    }) => {
        let loadFirstDayData = 0;
        let hourlyData: Array<any> = [];
        // Get the current day of the week
        let cwday: number = -1;
        let uniqueDays: Array<any> = [];
        oridat.list
            // First sort the data by date
            .sort((a: { dt: string }, b: { dt: string }) => parseInt(a.dt) - parseInt(b.dt))
            .forEach((day: { main: any; dt: string }) => {
                // Get the day of the week
                let wday = new Date(parseInt(day.dt) * 1000).getDay();
                /**
                 * cwday: Current week day
                 *
                 *  - This one is used to keep track of the current day of
                 *  the week that is being processed while looping through the data
                 *
                 * wday: Week day
                 */
                if (wday !== cwday) {
                    loadFirstDayData++;
                    cwday = wday;
                    uniqueDays.push(day);
                } else {
                    /**
                     *  If the day is already in the uniqueDays array, then
                     *  update the max and min temperature of the day to enhance
                     *  the min and max range rather than just the current temperature
                     */
                    uniqueDays[uniqueDays.length - 1].main.temp_max = Math.max(
                        uniqueDays[uniqueDays.length - 1].main.temp_max,
                        day.main.temp_max
                    );
                    uniqueDays[uniqueDays.length - 1].main.temp_min = Math.min(
                        uniqueDays[uniqueDays.length - 1].main.temp_min,
                        day.main.temp_min
                    );
                }
                if (loadFirstDayData < 4) {
                    hourlyData.push(day);
                }
            });

        // Clone the original data
        let filteredHours: any = new Object({
            ...oridat,
        });
        filteredHours.list = hourlyData;

        oridat.list = uniqueDays;
        let filteredDays: {
            list: Array<any>;
            message?: number;
            cnt?: number;
            cod?: string;
            city?: any;
        } = oridat;

        return [filteredHours, filteredDays];
    };

    const { hourly, daily } = useMemo(() => {
        if (!loading && data) {
            const [hourly, daily] = UniqueDays(data);
            return { hourly, daily };
        }
        return { hourly: null, daily: null };
    }, [data]);

    return (
        <ForecastDataContext.Provider value={{
            hourly,
            daily,
            loading,
        }}>
            {children}
        </ForecastDataContext.Provider>
    )
}
