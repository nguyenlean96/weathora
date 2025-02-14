import DebugPanel from '@/Components/debug-panel';
import Main from '@/Components/Main';
import SearchPanel from '@/Components/SearchPanel';
import CurrentWeatherProvider from '@/Context/CurrentWeatherProvider';
import ForecastDataProvider from '@/Context/ForecastDataProvider';
import WeatherProvider from '@/Context/WeatherDataProvider';
import Guest from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <Guest>
            <Head title="Dashboard" />

            <WeatherProvider>
                <div className="relative w-screen h-screen overflow-hidden">
                    <div className="flex flex-col relative md:grid md:grid-cols-5 lg:grid-cols-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 right-0 z-50 md:relative md:z-0 md:col-span-2 lg:col-span-1 md:h-full">
                            <SearchPanel />
                        </div>

                        <CurrentWeatherProvider>
                            <ForecastDataProvider>
                                <div className="md:col-span-3 md:overflow-hidden">
                                    <Main />
                                    <DebugPanel />
                                </div>
                            </ForecastDataProvider>
                        </CurrentWeatherProvider>
                    </div>
                </div>
            </WeatherProvider>
        </Guest>
    );
}
