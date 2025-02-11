import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState, useEffect, useMemo
} from 'react';

const ForecastDataContext = createContext<any>(null);

export function useForecastData() {
    const value = useContext(ForecastDataContext);

    if (!value) {
        throw new Error('useDailyForecast must be used within a DailyForecastProvider');
    }

    return value;
}


export default function ForecastDataProvider({ children }: PropsWithChildren) {
    const [dailyForecastData, setDailyForecastData] = useState<{
        list: Array<IForecastDateTime>;
        message?: number;
        cnt?: number;
        cod?: string;
        city?: any;
    } | null>(null);
    const [hourlyForecastData, setHourlyForecastData] = useState<any | null>(null);
    const [forecastError, setForecastError] = useState('');

    const UniqueDays = (oridat: {
        list: Array<any>;
        message?: number;
        cnt?: number;
        cod?: string;
        city?: any;
    }) => {
        let loadFirstDayData = 0;
        let hourlyData: Array<any> = [];
        let cwday: number = -1;
        let uniqueDays: Array<any> = [];
        oridat.list
            .sort((a: { dt: string }, b: { dt: string }) => parseInt(a.dt) - parseInt(b.dt))
            .forEach((day: { dt: string }) => {
                let wday = new Date(parseInt(day.dt) * 1000).getDay();
                if (wday !== cwday) {
                    loadFirstDayData++;
                    cwday = wday;
                    uniqueDays.push(day);
                }
                if (loadFirstDayData < 4) {
                    hourlyData.push(day);
                }
            });

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

    const fetchData = async () => {

    }

    return (
        <ForecastDataContext.Provider value={{}}>
            {children}
        </ForecastDataContext.Provider>
    )
}
