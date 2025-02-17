import { useEffect, useRef, useState } from 'react';
import { motion } from "motion/react";
import { TheSun, TheMoon } from "@/Components/celestial";
import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { getTime } from '@/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function DailyLightCycle() {
    const [willSunRise, setWillSunRise] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [objectPosition, setObjectPosition] = useState<number>(0);
    const [adjustPosition, setAdjustPosition] = useState<number>(0);
    const displayingAreaRef = useRef<HTMLDivElement>(null);
    const animationDivRef = useRef<SVGSVGElement | null>(null);

    const {
        data: currentWeather,
        lightCycle: percentFromSunrise,
        localTime,
        sunriseDateTime,
        sunsetDateTime,
    }
        : {
            data: any;
            lightCycle: number;
            localTime: Date;
            sunriseDateTime: Date;
            sunsetDateTime: Date;
        }
        = useCurrentWeather();

    const resetSunPosition = () => {

        /**
         *              0%                     100%
         *              |        current        |
         *  ::::::::::::|-----------^-----------|::::::::::::
         *          sun rises                sun sets
         *
         *  total = sunSets - sunRises
         *  percentFromSunrise = (current - sunRises) / total
         *  percentFromSunset = (sunSets - current) / total
         */
        console.log('Sunrise:', percentFromSunrise, 'Sunset:', percentFromSunrise - 1);

        // First, check whether the current time is closer to sunrise or sunset
        const scaledPercent = percentFromSunrise * (79 - 21);
        const positionFromSunRises = 21 + (scaledPercent < -21 ? -21 : scaledPercent);
        // If the current time is closer to sunrise
        //  - set the sun to the left
        console.log('Sunrise is closer', scaledPercent, positionFromSunRises);
        setObjectPosition((_: number) => (positionFromSunRises));
        setAdjustPosition((_: number) => (positionFromSunRises))

        if (scaledPercent < 0) {
            setWillSunRise(true)
        } else {
            setWillSunRise(false)
        }
    }

    useEffect(() => {
        resetSunPosition();

        return () => {
            setObjectPosition(0);
        }
    }, [percentFromSunrise]);

    return (
        <div className={"bg-blue-500/80 backdrop-blur-sm rounded-xl overflow-hidden w-full flex flex-col " + (currentWeather?.sys?.sunrise ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-12')}
            ref={displayingAreaRef}
        >
            <div className="border-b px-3 pt-2">
                <div className="w-full">
                    {
                        willSunRise ?
                            <h4 className="text-gray-100 leading-5 mb-1">Sun rises</h4>
                            :
                            <h4 className="text-gray-100 leading-5 mb-1">Sun sets</h4>
                    }
                </div>
            </div>
            {
                currentWeather?.sys?.sunrise ? (
                    <div className="flex-1 w-full max-h-full h-full overflow-hidden">
                        <div className="relative w-full h-full px-2">
                            <div className='absolute z-50 rounded-bl-lg group top-0 right-0'>
                                <div className='flex items-center space-x-2 px-3 p-1.5'>
                                    {
                                        objectPosition !== adjustPosition
                                        && (
                                            <button
                                                title="Reset sun position"
                                                className="text-white/80"
                                                onClick={() => {
                                                    resetSunPosition();
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faArrowRotateRight} />
                                            </button>
                                        )
                                    }
                                    {
                                        editMode ? (
                                            <button className="text-lg text-white/80"
                                                title="Close edit mode"
                                                onClick={() => setEditMode(false)}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        ) : (
                                            <button className="text-xl text-white/80"
                                                title="Edit sun position"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <FontAwesomeIcon icon={faGear} />
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="absolute left-4 top-2 right-4">
                                <div className='flex items-center justify-between'>
                                    {
                                        willSunRise ?
                                            <div className="text-end lg:text-start">
                                                <div className="text-2xl text-white/80 font-bold">{getTime(sunriseDateTime)}</div>
                                            </div>
                                            :
                                            <div className="text-end lg:text-start">
                                                <div className="text-2xl text-white/80 font-bold">{getTime(sunsetDateTime)}</div>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className={'absolute left-2 right-2 z-50 transition-all ease-in-out ' + (editMode ? 'opacity-100 bottom-0' : 'opacity-0 -bottom-24')}>
                                {/* Add an input as a slider to control the percentage of the sun's position */}
                                <input type="range" min="0" max="100"
                                    title="Sun position"
                                    value={adjustPosition}
                                    className="w-full"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setAdjustPosition(parseInt(e.target.value));
                                    }}
                                />
                            </div>
                            <div className="absolute left-0 top-[60%] w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/40 to-gray-800/80 h-14"></div>
                            <div
                                style={{
                                    transform: `translateX(${(displayingAreaRef.current && animationDivRef.current) ?
                                        ((displayingAreaRef.current.clientWidth - animationDivRef.current.clientWidth) / 2)
                                        : 0}px)`,
                                }}
                            >
                                <svg fill="none" xmlns="http://www.w3.org/2000/svg"
                                    className="absolute top-8 left-0 xl:right-0 z-0 opacity-60 w-full"
                                    ref={animationDivRef}
                                >
                                    <path d="M0 68.9552C0 68.9552 37.8514 71.027 64.5943 46.9941C91.3371 22.9611 107.794 1 144 1C180.206 1 199.131 24.6186 223.406 46.9941C247.68 69.3696 288 68.9552 288 68.9552"
                                        stroke="rgb(90 224 249 / 0.4)" strokeWidth="3" strokeLinecap="round" fill="transparent"
                                    />
                                </svg>

                                <motion.div
                                    className="absolute top-8 left-0 z-10"
                                    style={{
                                        zIndex: 50,
                                        offsetPath: 'path("M0 68.9552C0 68.9552 37.8514 71.027 64.5943 46.9941C91.3371 22.9611 107.794 1 144 1C180.206 1 199.131 24.6186 223.406 46.9941C247.68 69.3696 288 68.9552 288 68.9552")',
                                    }}
                                    initial={{
                                        offsetDistance: '100%',
                                    }}
                                    animate={{
                                        offsetDistance: `${adjustPosition}%`,
                                    }}
                                    transition={{
                                        duration: 1,
                                    }}
                                >
                                    <div className='relative'>
                                        {
                                            /**
                                             *  If the sun is between 50% and 93% of the way to sunrise,
                                             *  or less than 6% of the way to sunrise,
                                             */
                                            (
                                                (adjustPosition > 21 && adjustPosition < 79)
                                            )
                                                ? <TheSun />
                                                : <TheMoon />
                                        }
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 animate-pulse w-full h-full rounded-lg"></div>
                )
            }
        </div>
    )
}
