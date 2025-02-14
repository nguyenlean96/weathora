import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { useWeatherContext } from '@/Context/WeatherDataProvider';
import { Effects } from '.';
import { useMemo } from 'react';
import Snowfall from 'react-snowfall';

export default function WeatherEffectLayer() {
    const { data: currentWeather } = useCurrentWeather();

    const {
        isFogEffectForcedOn,
        isSunFlareEffectForcedOn,
        isRainEffectForcedOn,
    } = useWeatherContext();

    const {
        weatherCode,
        icon,
    } = useMemo(() => {
        if (!currentWeather) return {
            weatherCode: null,
            icon: null,
        };
        return {
            weatherCode: String(currentWeather?.weather[0].id),
            icon: String(currentWeather?.weather[0].icon),
        }
    }, [currentWeather]);

    const snowflakeCount = useMemo(() => {
        if (!currentWeather) return 0;
        if (weatherCode === null || icon === null) return 0;

        if (currentWeather.snow && currentWeather.snow['1h']) {
            return (currentWeather.snow['1h'] * 100) + (Math.random() * 300);
        }

        if (
            icon.startsWith('13')
        ) {
            return 200 + Math.random() * 300;
        }

        return 0;
    }, [currentWeather, weatherCode, icon]);

    /**
     *  Weather code explanation:
     *  - icon: <2-number><letter>
     *      - letter: d = day time, n = night time
     *      - numbers:
     *
     *          - 01: clear sky
     *          - 02: few clouds
     *          - 03: scattered clouds
     *          - 04: broken clouds
     *
     *          - 09: shower rain
     *          - 10: rain
     *          - 11: thunderstorm
     *
     *          - 13: snow
     *          - 50: mist
     */
    return (
        <>
            {
                currentWeather && icon &&
                (
                    icon.includes('01d')
                    || icon.includes('10d')
                    || isSunFlareEffectForcedOn
                )
                && (
                    <Effects.SunFlareEffect />
                )
            }
            {
                currentWeather && icon &&
                (
                    icon.startsWith('09')
                    || icon.startsWith('10')
                    || icon.startsWith('11')
                    || isRainEffectForcedOn
                ) && (
                    <Effects.RainEffect />
                )
            }
            {
                currentWeather && icon && weatherCode &&
                (
                    isFogEffectForcedOn
                    ||
                    (
                        icon.startsWith('50')
                        && ['701', '711', '721', '741'].includes(weatherCode)
                    )
                )
                &&
                <Effects.FogBackgroundEffect />
            }
            {
                currentWeather && icon &&
                (
                    icon.startsWith('13')
                    || isFogEffectForcedOn
                )
                && (
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full z-20'>
                        <Snowfall
                            snowflakeCount={snowflakeCount}
                            color="white"
                        />
                    </div>
                )
            }
            {
                currentWeather && icon && weatherCode &&
                (
                    weatherCode === '800' &&
                    icon.endsWith('d') &&
                    (
                        icon.startsWith('01')
                        || icon.startsWith('02')
                        || icon.startsWith('03')
                    )
                ) && (
                    <div className="z-10 absolute top-0 left-0 w-full h-screen"
                        style={{
                            boxShadow: `inset 0 0 50px #0ff,
                            inset 20px 0 80px #0ff,
                            inset 20px 0 300px rgba(255 255 255 / 0.4),
                            inset -20px 0 80px #fff,
                            inset -20px 0 300px #fff
                            `
                        }}
                    ></div>
                )
            }
            {
                currentWeather && icon &&
                (
                    icon.endsWith('n')
                    && (
                        icon.startsWith('09')
                        || icon.startsWith('10')
                        || icon.startsWith('13')
                        || icon.startsWith('11')
                    )
                ) && (
                    <div className="z-10 absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-slate-400 via-slate-300/50 to-gray-50/0"></div>
                )
            }
            {
                currentWeather && icon && weatherCode &&
                (
                    icon.startsWith('04n')
                    || icon.startsWith('13')
                    || icon.startsWith('50')
                )
                && (
                    <div className="z-10 absolute top-0 left-0 right-0 w-full h-[32dvh] bg-gradient-to-b from-gray-200 via-gray-50/50 to-gray-50/0"></div>
                )
            }


            {
                currentWeather && icon &&
                (
                    icon.startsWith('09')
                    || icon.startsWith('10')
                    || icon.startsWith('11')
                    || isRainEffectForcedOn
                ) && (
                    <div className="z-10 absolute top-0 left-0 w-full h-screen"
                        style={{
                            boxShadow: `inset 0 -50px 100px rgba(100, 100, 100, 0.7),
                            inset 0 -100px 350px rgba(80, 80, 80, 0.8),
                            inset 0 -150px 500px rgba(60, 60, 60, 0.4),
                            inset 0 -600px 100px rgba(50, 50, 50, 0.5)
                            `
                        }}
                    ></div>
                )
            }
        </>
    )
}
