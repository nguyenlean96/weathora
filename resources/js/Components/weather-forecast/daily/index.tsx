import { useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { getDayOfWeek } from '@/Utils';
import { useForecastDataContext } from '@/Context/ForecastDataProvider';

export default function DailyForecast(props: any) {
    const { daily: dailyForecastData, loading: isForecastLoading }: {
        daily: Array<IDailyForecast>;
        loading: boolean;
    } = useForecastDataContext();

    const dailyTempRange = useMemo(() => {
        if (!dailyForecastData) return { min: 0, max: 0 };
        const tempMax = Math.max(...dailyForecastData.map((day: IDailyForecast) => day.temp.max));
        const tempMin = Math.min(...dailyForecastData.map((day: IDailyForecast) => day.temp.min));
        return {
            min: tempMin,
            max: tempMax,
        }
    }, [dailyForecastData]);

    return (
        !isForecastLoading
        && dailyForecastData
        && (
            <>
                <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full p-2 mb-3 grid gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1,
                        duration: 0.5,
                    }}
                >
                    <div className="w-full px-1 border-b">
                        <h4 className="text-gray-100 leading-5 mb-1">{String(`Next ${dailyForecastData.length}-day forecast`)}</h4>
                    </div>
                    <div className='w-full flex flex-col gap-y-2'>
                        {dailyForecastData
                            .sort((a: any, b: any) => parseInt(a.dt) - parseInt(b.dt))
                            .map((day: any, index: number) => (
                                <div className="w-full" key={index}>
                                    {
                                        day?.weather[0] &&
                                        <ForecastDayDisplay
                                            position={index}
                                            isForecastLoading={isForecastLoading}
                                            day={day}
                                            maxTemp={dailyTempRange.max}
                                            minTemp={dailyTempRange.min}
                                        />
                                    }
                                </div>
                            ))
                        }
                    </div>
                </motion.div>
            </>
        )
    )
}

const ForecastDayDisplay = (props: any) => {
    const tempRangeBar = useRef<HTMLDivElement>(null);
    const tempIndicator = useRef<HTMLDivElement>(null);
    const { position, day, maxTemp, minTemp }: {
        position: number;
        day: IDailyForecast;
        maxTemp: number;
        minTemp: number;
    } = props;

    const { thisTempRange, tempPos } = useMemo(() => {
        if (!tempRangeBar.current) {
            return { thisTempRange: 0, tempPos: 0 };
        }
        /**
         *  maxTemp and minTemp are the universal max and min temperature values
         *  for the entire forecast period
         *
         *                0%                     100%
         *                |<--day.temp.min        |<--day.temp.max
         *  |||||||||||||||::::::::::::O::::::::::|||||||||||||||||||||||||||
         *  |                          |<--tempPos
         *  |<---minTemp  |<----thisTempRange---->|              maxTemp--->|
         *  0%                                                            100%
         */
        const thisTempRange = ((day.temp.max - day.temp.min) / (maxTemp - minTemp));
        let tempPos = 0;
        let indicatorOffset: number = (((day.temp.day - minTemp) / (maxTemp - minTemp)) * tempRangeBar.current?.offsetWidth);

        tempPos = indicatorOffset;
        return { thisTempRange, tempPos };
    }, [day.temp.day, day.temp.max, tempRangeBar.current]);

    return (
        <div className={'grid grid-cols-12 w-full pr-4 ' + (position === 0 ? 'bg-blue-400 border-2 md:border-4 border-blue-300 rounded-xl' : '')}>
            <div className='flex items-center justify-center w-full col-span-2'>
                <h4 className='text-sm md:text-base text-gray-50'>
                    <span className=''>{getDayOfWeek(day.dt)}</span>
                </h4>
            </div>
            <div className='flex items-center justify-center w-full h-full col-span-2 md:col-span-1'>
                {
                    day?.weather[0]?.icon && (
                        <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
                    )
                }
            </div>
            <div className='col-span-8 md:col-span-9'>
                <div className='grid grid-cols-12 w-full gap-x-2 h-full'>
                    <div className='flex items-center w-full h-full'>
                        <h5 className='text-blue-100 text-base xl:text-lg text-center font-semibold'>
                            {Math.floor(day.temp.min)}
                            &deg;
                        </h5>
                    </div>
                    <div className='col-span-10 w-full flex items-center justify-center px-2'>
                        <div className='relative ring-1 ring-white bg-indigo-800/30 h-2 lg:h-2 2xl:h-2.5 rounded-full animate-gradient-x w-full mb-2 translate-y-1'
                            ref={tempRangeBar}
                        >
                            {
                                tempRangeBar.current
                                &&
                                <>
                                    <div ref={tempIndicator}
                                        className='w-4 h-4 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full border border-[#333] bg-[#fff] drop-shadow-sm'
                                        style={{
                                            left: `${tempPos}px`,
                                        }}
                                    ></div>
                                    <div className='absolute top-1/2 -translate-y-1/2 h-2 rounded'
                                        style={{
                                            width: (thisTempRange * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0)).toFixed(2) + 'px',
                                            left: `${(((day.temp.min - minTemp) / (maxTemp - minTemp)) * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0)).toFixed(2)}px`,
                                            background: `linear-gradient(90deg, rgb(55 48 163 / 0) 0%, rgb(37 99 235) 6%, rgb(34 197 94) 50%, #ea580c 80%, rgb(55 48 163 / 0) 96%)`,
                                        }}
                                    ></div>
                                    {maxTemp !== minTemp && (
                                        <div className='hidden top-0 z-0 bg-gradient-to-r from-orange-500 via-orange-500/90 to-orange-500 rounded-full ring-1 ring-white h-full opacity-90'
                                            style={{
                                                width: (thisTempRange * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0)).toFixed(2) + 'px',
                                                marginLeft: `${tempPos === 0 ? 0 : (tempPos - ((thisTempRange * (tempRangeBar.current ? tempRangeBar.current.offsetWidth : 0) / 2)))}px`,
                                            }}
                                        ></div>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                    <div className='flex items-center w-full h-full'>
                        <h5 className='text-orange-100 text-base xl:text-lg text-center font-semibold'>
                            {Math.round(day.temp.max)}
                            &deg;
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
