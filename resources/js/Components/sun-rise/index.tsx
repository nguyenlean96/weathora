import { useEffect, useRef, useState } from 'react';
import { motion } from "motion/react";
import { TheSun, TheMoon } from "@/Components/celestial";
import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { getTime } from '@/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function SunRise() {
    const [editMode, setEditMode] = useState<boolean>(false);
    /**
     * Because the graph is turned reverse, the slider value is also reversed.
     */
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [sunPosition, setSunPosition] = useState<number>(0);

    const {
        data: currentWeather,
        percentFromSunrise,
        sunriseDateTime,
    }
        : {
            data: any;
            percentFromSunrise: number;
            sunriseDateTime: Date;
        }
        = useCurrentWeather();

    const resetSunPosition = () => {
        setSliderValue(100 - ((51 - (percentFromSunrise * (51 - 7))) % 100));
        setSunPosition((51 - (percentFromSunrise * (51 - 7))) % 100);
    }

    useEffect(() => {
        resetSunPosition();

        return () => {
            setSunPosition(0);
        }
    }, [percentFromSunrise]);

    const sunriseDisplayingAreaRef = useRef<HTMLDivElement>(null);
    const sunriseAnimationDivRef = useRef<SVGSVGElement | null>(null);
    return (
        <div className={"bg-blue-500/80 backdrop-blur-sm rounded-xl overflow-hidden w-full " + (currentWeather?.sys?.sunrise ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-12')}
            ref={sunriseDisplayingAreaRef}
        >
            {
                currentWeather?.sys?.sunrise ? (
                    <div className="w-full h-full overflow-hidden">
                        <div className="relative w-full h-full px-2">
                            <div className='absolute top-1.5 right-3 z-50'>
                                <div className='flex items-center space-x-2'>
                                    {
                                        sunPosition !== ((51 - (percentFromSunrise * (51 - 7))) % 100)
                                        && (
                                            <button
                                                title="Reset sun position"
                                                className="text-xl text-white/60"
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
                                            <button className="text-xl text-white/60"
                                                title="Close edit mode"
                                                onClick={() => setEditMode(false)}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        ) : (
                                            <button className="text-xl text-white/60"
                                                title="Edit sun position"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <FontAwesomeIcon icon={faGear} />
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="absolute left-0 top-0 p-1">
                                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun rises</span> <span className="text-2xl text-white/80 ">{getTime(sunriseDateTime)}</span></div>
                            </div>
                            <div className={'absolute left-2 right-2 z-50 transition-all ease-in-out ' + (editMode ? 'opacity-100 bottom-0' : 'opacity-0 -bottom-24')}>
                                {/* Add an input as a slider to control the percentage of the sun's position */}
                                <input type="range" min="0" max="100"
                                    title="Sun position"
                                    value={sliderValue}
                                    className="w-full"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setSliderValue(parseInt(e.target.value));
                                        setSunPosition(100 - parseInt(e.target.value));
                                    }}
                                />
                            </div>
                            <div className="absolute left-0 top-[55%] w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/40 to-gray-800/80 h-20"></div>
                            <div
                                style={{
                                    transform: `translateX(${(sunriseDisplayingAreaRef.current && sunriseAnimationDivRef.current) ?
                                        ((sunriseDisplayingAreaRef.current.clientWidth - sunriseAnimationDivRef.current.clientWidth) / 2)
                                        : 0}px)`,
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-2 xl:right-0 z-0 opacity-60"
                                    ref={sunriseAnimationDivRef}
                                >
                                    <path d="M 260 110 Q 187.5 6, 125 93 T 6 80" stroke="rgb(90 224 249 / 0.4)" strokeWidth="3" strokeLinecap="round"
                                        fill="transparent" />
                                </svg>
                                <motion.div
                                    className="absolute top-0 left-2 z-10"
                                    style={{
                                        zIndex: 50,
                                        offsetPath: 'path("M 260 110 Q 187.5 6, 125 93 T 6 80")',
                                    }}
                                    initial={{
                                        offsetDistance: '100%',
                                    }}
                                    animate={{
                                        offsetDistance: `${sunPosition}%`,
                                    }}
                                    transition={{
                                        duration: 1,
                                    }}
                                >
                                    {
                                        /**
                                         *  If the sun is between 50% and 93% of the way to sunrise,
                                         *  or less than 6% of the way to sunrise,
                                         */
                                        (
                                            (sunPosition < 51 && sunPosition > 7)
                                            || sunPosition > 96
                                        )
                                            ? <TheSun />
                                            : <TheMoon />
                                    }
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
