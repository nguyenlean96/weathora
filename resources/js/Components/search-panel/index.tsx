import { useEffect, useState, useRef } from "react";
import { useWeatherContext } from "@/Context/WeatherDataProvider";
import { useDebounce, useInfiniteLoading } from "@/Hooks";

export default function SearchPanel({ width, height }: { width: number; height: number }) {
  const cityInput = useRef<HTMLInputElement>(null);
  const {
    city,
    cities,
    previousCity,
    setCity,
    isACityFound,
    getData,
  }: {
    city: string;
    cities: string[];
    previousCity: string;
    setCity: any;
    isACityFound: boolean;
    getData: any;
  } = useWeatherContext();
  const loadMoreRef = useRef(null);
  const [searchBox, setSearchBox] = useState<string>(city);
  const [typingCity, setTypingCity] = useState<string>('');
  const [inFocus, setInFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<string[]>(cities);

  const triggerUpdateCity = async () => {
    return new Promise((resolve: (value?: any) => void) => {
      getData();
      resolve();
    })
      .catch((error) => {
        console.error('Error updating city: ', error);
      });
  };

  const updateDispCityDebounce = useDebounce((city: string) => {
    if (inFocus) {
      setCity((prev: string) => city);
    }
    setSearchBox((prev: string) => city);
    setFilteredCities((prev: string[]) => city.length > 0 ? cities.filter((c: string, index: number) =>
      String(c).toLowerCase().includes(String(city).toLowerCase())
    ) : (typingCity.length > 0
      ? cities.filter((c: string, index: number) =>
        String(c).toLowerCase().includes(String(typingCity).toLowerCase())
      )
      : cities)
    );
  }, 700);

  useEffect(() => {
    if (searchBox.length === 0) {
      setTypingCity(city);
      setSearchBox(city);
    }
  }, [isACityFound]);

  const { items, hasMore, loadItems } = useInfiniteLoading({
    availableItems: filteredCities,
    setIsLoading,
  });

  useEffect(() => {
    setIsLoading(true);
    loadItems(typingCity !== previousCity);
  }, [typingCity, previousCity]);

  useEffect(() => {
    if (loadMoreRef.current && hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          if (hasMore) loadItems();
        }
      });
      observer.observe(loadMoreRef.current);
      return () => observer.disconnect();
    }
  }, [filteredCities.length, hasMore]);

  useEffect(() => {
    // Check if the cityInput.current is in focus
    if (cityInput.current) {
      if (!inFocus) {
        setTypingCity(city);
        updateDispCityDebounce(city);
      }
    }
  }, [city]);
  return (
    <div className='font-[family-name:var(--font-geist-sans)] md:grid md:grid-cols-1'>
      <div className="bg-transparent md:bg-gradient-to-br from-slate-500 to-blue-500 w-full md:h-screen md:max-h-screen md:overflow-hidden col-span-1 p-2 flex flex-col overflow-visible">
        <div className="w-full flex items-center sticky ring-1 md:ring-0 ring-black/10 rounded-full shadow-lg md:shadow-sm top-0 p-0 md:px-2 md:py-3 z-20">
          <input title="City" type="text" ref={cityInput} placeholder="Enter a city" className="rounded-l-full w-full leading-5 px-3 p-1.5 dark:text-gray-600" value={typingCity}
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
            }} />
          <button type="button" className="min-w-[5rem] p-1 bg-gray-200 text-gray-600 rounded-r-full pr-3" onClick={triggerUpdateCity}>{searchBox === previousCity ? 'Refresh' : 'Search'}</button>
        </div>
        <div className={"max-h-[60dvh] md:max-h-full md:block md:grow overflow-y-auto bg-white ring-1 ring-black/20 rounded-lg " + (cityInput.current ? ((document.activeElement === cityInput.current) ? ' block' : ' hidden') : ' hidden')}>
          <ul className="md:h-full">
            {items.map((city, index) => (
              <li key={index} className={"px-3.5 p-2 cursor-pointer hover:bg-gray-100 transition-all ease-in-out border-dotted text-sm dark:text-gray-600 " + ((index !== items.length - 1) && 'border-b')} onClick={() => {
                setTypingCity(city);
                triggerUpdateCity();
                updateDispCityDebounce(city);
              }}
              >{city}</li>
            ))}
            <li
              ref={loadMoreRef}
              className='flex justify-center items-center p-2 text-gray-400 italic'
            >
              {hasMore ? 'Loading...' : 'No more cities to load'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
