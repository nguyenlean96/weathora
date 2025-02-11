import { useEffect, useState, useRef, useMemo } from "react";
import { useWeatherContext } from "@/Context/WeatherDataProvider";
import { useDebounce } from "@/Hooks";
import { useCity } from "@/Context/CityProvider";


export default function SearchPanel(_props: any) {
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

    const cities = useMemo(() => {
        //     if (isLoading) return [];
        return citiesData;
    }, [isLoading, citiesData]);

    const loadMoreRef = useRef(null);
    const [searchBox, setSearchBox] = useState<string>(city);
    const [typingCity, setTypingCity] = useState<string>('');
    const [inFocus, setInFocus] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [filteredCities, setFilteredCities] = useState<string[]>(cities);

    const triggerUpdateCity = async () => {
        return new Promise((resolve: (value?: any) => void) => {
            // getData();
            resolve();
        })
            .catch((error) => {
                console.error('Error updating city: ', error);
            });
    };

    const updateDispCityDebounce = useDebounce((city: string) => {
        if (inFocus) {
            setCity((_: string) => city);
        }
        setSearchBox((_: string) => city);
    }, 700);

    // useEffect(() => {
    //     if (searchBox.length === 0) {
    //         setTypingCity(city);
    //         setSearchBox(city);
    //     }
    // }, [isACityFound]);

    // useEffect(() => {
    // setIsLoading(true);
    // loadItems(typingCity !== previousCity);
    // }, [
    //     typingCity
    // , previousCity
    // ]);

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

    // useEffect(() => {
    // Check if the cityInput.current is in focus
    // if (cityInput.current) {
    //     if (!inFocus) {
    //         setTypingCity(city);
    //         updateDispCityDebounce(city);
    //     }
    // }
    // }, [city]);
    return (
        <div className='font-[family-name:var(--font-geist-sans)] md:grid md:grid-cols-1'>
            <div className="relative bg-transparent md:bg-gradient-to-br from-slate-500 to-blue-500 w-full md:h-screen md:max-h-screen md:overflow-hidden col-span-1 p-2 pb-12 flex flex-col overflow-visible">
                <div className="w-full flex items-center sticky ring-1 md:ring-0 ring-black/10 rounded-full shadow-lg md:shadow-sm top-0 p-0 md:px-2 md:py-3 z-20">
                    <input title="City" type="text" ref={cityInput}
                        placeholder="Enter a city"
                        className="rounded-l-full w-full leading-5 px-3 p-1.5 dark:text-gray-600"
                        value={typingCity}
                        onChange={(e) => {
                            e.preventDefault();
                            setTypingCity(e.target.value);
                            updateDispCityDebounce(e.target.value);
                        }}
                        onFocus={() => setInFocus(true)}
                        onBlur={() => setInFocus(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                triggerUpdateCity();
                            }
                        }}
                    />
                    <button type="button"
                        className="min-w-[5rem] p-1 bg-gray-200 text-gray-600 rounded-r-full pr-3"
                        onClick={triggerUpdateCity}>
                        {
                            // searchBox === previousCity ? 'Refresh' :
                            'Search'
                        }
                    </button>
                </div>
                <div className={
                    "max-h-[60dvh] md:max-h-full md:block md:grow overflow-y-auto bg-white ring-1 ring-black/20 rounded-lg "
                    + (cityInput.current ? ((document.activeElement === cityInput.current) ? ' block relative' : ' hidden') : ' hidden')
                }>
                    <ul className="md:h-full">
                        {
                            cities.map(
                                (
                                    city: { name: string; country: string },
                                    index: number
                                ) =>
                                    (city.name && city.country) &&
                                    (
                                        <li key={`${index}|${city.name}|${city.country}`}
                                            className={
                                                "px-3.5 pb-1 pt-2.5 cursor-pointer hover:bg-gray-100 transition-all ease-in-out border-dotted text-sm dark:text-gray-600 "
                                                + ((index !== cities.length - 1) && 'border-b')
                                            }
                                            onClick={() => {
                                                // triggerUpdateCity();
                                                setTypingCity(city.name);
                                                updateDispCityDebounce(city.name);
                                            }}
                                        >
                                            <h4 className="leading-none">{city.name}</h4>
                                            <span className="leading-none text-xs text-gray-500">{city.country}</span>
                                        </li>
                                    )
                                // : null
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
                <div className="absolute bottom-0 right-0 left-0 p-2 text-gray-600">
                    <div className="flex items-center gap-x-1 w-full justify-center">
                        <div className="p-1 px-2 bg-gray-300 rounded">{currentPage}</div>
                        <div className="p-1 px-2 bg-gray-300 rounded">{totalPages}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
