import { useEffect, useState, useRef, useMemo } from "react";
import { useDebouncedCallback } from '@mantine/hooks';
import { useCity } from "@/Context/CityProvider";
import { usePage } from "@inertiajs/react";
import { useWeatherContext } from "@/Context/WeatherDataProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchPanel(_props: any) {
    const { app } = usePage().props;
    const cityInput = useRef<HTMLInputElement>(null);
    const {
        currentPage,
        totalPages,
        hasMore,
        isLoading,
        city,
        setCity,
        data: citiesData,
        fetchData,
    } = useCity();
    const { fetchWeatherData } = useWeatherContext();

    const cities = useMemo(() => citiesData, [isLoading, citiesData]);

    const loadMoreRef = useRef(null);
    const [typingCity, setTypingCity] = useState<string>('');
    const [inFocus, setInFocus] = useState<boolean>(false);

    const fetchCityData = useDebouncedCallback(
        (city: string) => {
            setCity((_: string) => city);
        },
        700 // debounce time 700 - 850ms - natural typing speed
    );

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (!isLoading && hasMore) fetchData();
        }
    });
    useEffect(() => {
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loadMoreRef.current, hasMore, isLoading]);

    useEffect(() => {
        // Check if the cityInput.current is in focus
        if (cityInput.current) {
            if (!inFocus) {
                setTypingCity(city);
            }
        }
    }, [city]);
    return (
        <div className='font-[family-name:var(--font-geist-sans)] md:grid md:grid-cols-1'>
            <div className={"relative bg-transparent md:bg-gradient-to-br from-slate-500 to-blue-500 w-full md:h-screen md:max-h-screen md:overflow-hidden col-span-1 p-2 flex flex-col overflow-visible " + ((app.production) ? "pb-12" : "")}>
                <div className="p-0 md:px-1 md:py-3">
                    <div className="w-full flex items-center sticky ring-1 md:ring-0 ring-black/10 rounded-full shadow-lg md:shadow-sm top-0 px-3 py-1 z-20 bg-white">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
                        <input title="City" type="text" ref={cityInput}
                            placeholder="Enter a city"
                            className="rounded-full w-full leading-5 pl-2 pr-3 p-1.5 dark:text-gray-600 outline-none focus:outline-none bg-transparent border-none ring-0 focus:ring-0"
                            value={typingCity}
                            onChange={(e) => {
                                e.preventDefault();
                                setTypingCity(e.target.value);
                                fetchCityData(e.target.value);
                            }}
                            onFocus={() => setInFocus(true)}
                            onBlur={() => setInFocus(false)}
                        />
                    </div>
                </div>
                <div className={
                    "max-h-[60dvh] md:max-h-full md:block md:grow overflow-y-auto bg-white ring-1 ring-black/20 rounded-lg "
                    + (cityInput.current ? ((document.activeElement === cityInput.current) ? ' block relative' : ' hidden') : ' hidden')
                }>
                    <ul className="md:h-full">
                        {
                            cities.map(
                                (
                                    city: City,
                                    index: number
                                ) =>
                                    (city.name && city.country) &&
                                    (
                                        <li key={`${index}|${city.name}|${city.country}`}
                                            className={
                                                "group px-3.5 pb-1 pt-2.5 cursor-pointer hover:bg-gray-100 transition-all ease-in-out border-dotted text-sm dark:text-gray-600 flex items-center justify-between "
                                                + ((index !== cities.length - 1) && 'border-b')
                                            }
                                            onClick={() => {
                                                setTypingCity(city.name);
                                                fetchWeatherData({ city: city.name, lat: city.lat, lon: city.lon });
                                            }}
                                        >
                                            <div className="">
                                                <h4 className="leading-none">{city.name}</h4>
                                                <span className="leading-none text-xs text-gray-500">
                                                    {
                                                        city.country
                                                        + (
                                                            city.state && city.state.length > 0 ?
                                                                (', ' + city.state)
                                                                : ''
                                                        )
                                                    }
                                                </span>
                                            </div>
                                            <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 group-hover:text-blue-400" size="lg" />
                                        </li>
                                    )
                            )
                        }
                        {
                            isLoading && cities.length === 0 &&
                            <li className='flex justify-center items-center p-2 text-gray-400 italic'>Loading...</li>
                        }
                        <li
                            ref={loadMoreRef}
                            className='flex justify-center items-center p-2 text-gray-400 italic'
                        >
                            {(hasMore && isLoading) ? '' : 'No more cities to load'}
                        </li>
                    </ul>
                </div>
                {
                    app.production
                    && (
                        <div className="absolute bottom-0 right-0 left-0 p-2 text-gray-600">
                            <div className="flex items-center gap-x-1 w-full justify-center">
                                <div className="p-1 px-2 bg-gray-300 rounded">{currentPage}</div>
                                <div className="p-1 px-2 bg-gray-300 rounded">{totalPages}</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
