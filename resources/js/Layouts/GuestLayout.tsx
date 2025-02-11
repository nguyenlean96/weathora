import { ReactNode } from 'react';
import { PropsWithChildren } from 'react';
import WeatherProvider from '@/Context/WeatherDataProvider';
import { CityProvider } from '@/Context/CityProvider';

export default function Guest(
    { children, header }:
        PropsWithChildren<{
            header?: ReactNode;
        }>
) {
    return (
        <CityProvider>
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    {header && (
                        <header className="bg-white shadow dark:bg-gray-800">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main>{children}</main>
                </div>
        </CityProvider>
    );
}
