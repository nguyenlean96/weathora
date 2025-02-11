import {
    useState,
    createContext,
    useContext,
    type PropsWithChildren,
} from 'react';

const samples = [
    'London',
    'Oshawa',
    'Sudbury',
    'Toronto',
    'Windsor',
    'Winnipeg',
    'Halifax',
    'Hamilton',
    'Kitchener',
    'New York',
    'Paris',
    'Los Angeles',
    'Chicago',
    'Las Vegas',
    'Berlin',
    'Amsterdam',
    'Barcelona',
    'Vienna',
    'Prague',
    'Brussels',
    'Zurich',
    'Frankfurt',
    'Oslo',
    'Stockholm',
    'Copenhagen',
    'Helsinki',
    'Warsaw',
    'Krakow',
    'Gdansk',
    'Wroclaw',
    'Poznan',
    'Katowice',
    'Gdynia',
    'Sopot',
    'Gliwice',
    'Zakopane',
    'Zamosc',
    'Zielona Gora',
];

export const WeatherContext = createContext<any>({});

export default function WeatherProvider({ children }: PropsWithChildren) {
    const foundEntry = samples[Math.floor(Math.random() * samples.length)];

    const [isFogEffectForcedOn, setIsFogEffectForcedOn] = useState<boolean>(false);
    const [isSunFlareEffectForcedOn, setIsSunFlareEffectForcedOn] = useState<boolean>(false);
    const [isRainEffectForcedOn, setIsRainEffectForcedOn] = useState<boolean>(false);


    return (
        <WeatherContext.Provider
            value={{
                samples,
                isFogEffectForcedOn,
                isSunFlareEffectForcedOn,
                isRainEffectForcedOn,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
}

// export useWeatherContext
const useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
};

export { useWeatherContext };
