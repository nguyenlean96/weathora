import { useWeatherContext } from "@/Context/WeatherDataProvider";
import { motion } from "motion/react";
import { WindSpeedPanel, CurrentWeather, DailyForecast, HourlyForecast } from "@/Components";
import { useViewportSize } from '@mantine/hooks';
import { useCurrentWeather } from "@/Context/CurrentWeatherProvider";
import WeatherEffectLayer from "./WeatherEffectLayer";
import DailyLightCycle from "./DailyLightCycle";

export default function Main(_props: any) {
    const { width, height } = useViewportSize();
    const {
        isFogEffectForcedOn,
    } = useWeatherContext();
    const { data: currentWeather }
        : {
            data: {
                weather: { icon: string }[],
                rain: { '1h': number },
                snow: { '1h': number },
                main: { temp_max: number, temp_min: number, feels_like: number },
                name: string,
            }
        }
        = useCurrentWeather();

    return currentWeather && (
        <div className="relative w-full h-full bg-blue-200">
            {
                // !isCityBackgroundLoading && cityBackgroundUrl
                false
                && (
                    <>
                        <div className="z-0 absolute top-0 left-0 w-full h-screen bg-white/20 backdrop-blur-sm"></div>
                        <div className="-z-10 absolute top-0 left-0 w-full h-screen">
                            {/* <img src={cityBackgroundUrl} alt="city background" className="object-cover w-full h-full" /> */}
                        </div>
                    </>
                )
            }
            <WeatherEffectLayer />
            <div className={"absolute top-0 left-0 right-0 w-full h-screen overflow-y-scroll z-20 p-2 px-10 pt-16 " + ((String(currentWeather?.weather[0].icon).includes('50') || isFogEffectForcedOn) ? ' pb-64 lg:pb-[30dvh]' : '')}>
                <CurrentWeather />

                <div className="w-full flex justify-center relative">
                    {
                        currentWeather?.rain && currentWeather?.rain['1h'] && (
                            // Display warning for possible rain
                            <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-fit xl:w-4/5 min-w-[18rem] p-2 mb-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-full p-1 border-b">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                        className="w-5 h-5 inline-block mr-2" fill="#fff"
                                    >
                                        <path d="M183.9 370.1c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm96 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm-192 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm384 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zm-96 0c-7.6-4.4-17.4-1.8-21.8 6l-64 112c-4.4 7.7-1.7 17.5 6 21.8 2.5 1.4 5.2 2.1 7.9 2.1 5.5 0 10.9-2.9 13.9-8.1l64-112c4.4-7.6 1.7-17.4-6-21.8zM416 128c-.6 0-1.1 .2-1.6 .2 1.1-5.2 1.6-10.6 1.6-16.2 0-44.2-35.8-80-80-80-24.6 0-46.3 11.3-61 28.8C256.4 24.8 219.3 0 176 0 114.2 0 64 50.1 64 112c0 7.3 .8 14.3 2.1 21.2C27.8 145.8 0 181.5 0 224c0 53 43 96 96 96h320c53 0 96-43 96-96s-43-96-96-96z" />
                                    </svg>
                                    <span className="text-white">{String(`Possible rain`)}</span>
                                </div>
                                <div className="text-white">
                                    Possible rain in the next hour for up to
                                    <span className="px-1">{currentWeather?.rain['1h']}</span>
                                    mm/h
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        currentWeather?.snow && currentWeather?.snow['1h'] && (
                            <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-fit xl:w-4/5 min-w-[18rem] p-2 mb-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-full p-1 border-b">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                        className="w-5 h-5 inline-block mr-2" fill="#fff"
                                    >
                                        <path d="M440.1 355.2l-39.2-23 34.1-9.3c8.4-2.3 13.4-11.1 11.1-19.6l-4.1-15.5c-2.2-8.5-10.9-13.6-19.3-11.3L343 298.2 271.2 256l71.9-42.2 79.7 21.7c8.4 2.3 17-2.8 19.3-11.3l4.1-15.5c2.2-8.5-2.7-17.3-11.1-19.6l-34.1-9.3 39.2-23c7.5-4.4 10.1-14.2 5.8-21.9l-7.9-13.9c-4.3-7.7-14-10.3-21.5-5.9l-39.2 23 9.1-34.7c2.2-8.5-2.7-17.3-11.1-19.6l-15.2-4.1c-8.4-2.3-17 2.8-19.3 11.3l-21.3 81-71.9 42.2v-84.5L306 70.4c6.1-6.2 6.1-16.4 0-22.6l-11.1-11.3c-6.1-6.2-16.1-6.2-22.2 0l-24.9 25.4V16c0-8.8-7-16-15.7-16h-15.7c-8.7 0-15.7 7.2-15.7 16v46.1l-24.9-25.4c-6.1-6.2-16.1-6.2-22.2 0L142.1 48c-6.1 6.2-6.1 16.4 0 22.6l58.3 59.3v84.5l-71.9-42.2-21.3-81c-2.2-8.5-10.9-13.6-19.3-11.3L72.7 84c-8.4 2.3-13.4 11.1-11.1 19.6l9.1 34.7-39.2-23c-7.5-4.4-17.1-1.8-21.5 5.9l-7.9 13.9c-4.3 7.7-1.8 17.4 5.8 21.9l39.2 23-34.1 9.1c-8.4 2.3-13.4 11.1-11.1 19.6L6 224.2c2.2 8.5 10.9 13.6 19.3 11.3l79.7-21.7 71.9 42.2-71.9 42.2-79.7-21.7c-8.4-2.3-17 2.8-19.3 11.3l-4.1 15.5c-2.2 8.5 2.7 17.3 11.1 19.6l34.1 9.3-39.2 23c-7.5 4.4-10.1 14.2-5.8 21.9L10 391c4.3 7.7 14 10.3 21.5 5.9l39.2-23-9.1 34.7c-2.2 8.5 2.7 17.3 11.1 19.6l15.2 4.1c8.4 2.3 17-2.8 19.3-11.3l21.3-81 71.9-42.2v84.5l-58.3 59.3c-6.1 6.2-6.1 16.4 0 22.6l11.1 11.3c6.1 6.2 16.1 6.2 22.2 0l24.9-25.4V496c0 8.8 7 16 15.7 16h15.7c8.7 0 15.7-7.2 15.7-16v-46.1l24.9 25.4c6.1 6.2 16.1 6.2 22.2 0l11.1-11.3c6.1-6.2 6.1-16.4 0-22.6l-58.3-59.3v-84.5l71.9 42.2 21.3 81c2.2 8.5 10.9 13.6 19.3 11.3L375 428c8.4-2.3 13.4-11.1 11.1-19.6l-9.1-34.7 39.2 23c7.5 4.4 17.1 1.8 21.5-5.9l7.9-13.9c4.6-7.5 2.1-17.3-5.5-21.7z" />
                                    </svg>
                                    <span className="text-white">{String(`Possible rain`)}</span>
                                </div>
                                <div className="text-white">
                                    Possible snow in the next hour for up to
                                    <span className="px-1">{currentWeather?.snow['1h']}</span>
                                    mm per hour
                                </div>
                            </motion.div>
                        )
                    }
                </div>
                <div className="col-span-2 w-full">
                    <HourlyForecast />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div>
                        <div className="grid grid-cols-5 gap-2 mb-3">
                            {
                                currentWeather
                                &&
                                <>
                                    <motion.div className="col-span-2 bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-full p-2 grid grid-cols-3 py-4 text-white mb-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {/* MAX TEMPERATURE */}
                                        <div className="text-center">
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                fill='currentColor'
                                                className='bi bi-thermometer-high inline-block'
                                                viewBox='0 0 16 16'
                                            >
                                                <path d='M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415z' />
                                                <path d='M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z' />
                                            </svg>
                                            <span className="text-sm mr-1">H:</span>
                                            <span className="text-base xl:text-lg font-semibold">{Math.round(currentWeather?.main.temp_max)}</span>
                                            &deg;
                                        </div>

                                        {/* MIN TEMPERATURE */}
                                        <div className="text-center">
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                fill='currentColor'
                                                className='bi bi-thermometer-low inline-block'
                                                viewBox='0 0 16 16'
                                            >
                                                <path d='M9.5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585a1.5 1.5 0 0 1 1 1.415z' />
                                                <path d='M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z' />
                                            </svg>
                                            <span className="text-sm mr-1">L:</span>
                                            <span className="text-base xl:text-lg font-semibold">{Math.round(currentWeather?.main.temp_min)}</span>
                                            &deg;
                                        </div>

                                        {/* FEELS LIKE */}
                                        <h5 className="text-lg xl:text-xl text-center">
                                            <span className="text-sm mr-1">Feels like:</span>
                                            <span className="text-base xl:text-lg font-semibold">{Math.round(currentWeather?.main?.feels_like)}&deg;</span>
                                        </h5>
                                    </motion.div>
                                    <div className="col-span-3 h-[10rem] flex">
                                        <DailyLightCycle />
                                    </div>
                                </>
                            }
                        </div>
                        <WindSpeedPanel
                            width={width}
                            height={height}
                        />
                    </div>
                    <div>
                        <DailyForecast
                            width={width}
                            height={height}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
