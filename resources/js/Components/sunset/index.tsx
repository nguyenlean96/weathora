<<<<<<< HEAD
import { useRef, useState, useEffect } from 'react';
=======
import { useRef, useMemo } from 'react';
>>>>>>> 4aba730 (Fix timezone converter (#19))
import { motion } from 'motion/react';
import { TheSun, TheMoon } from '@/Components/celestial';
import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { getTime } from '@/Utils';
<<<<<<< HEAD
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
=======
>>>>>>> 4aba730 (Fix timezone converter (#19))

export default function SunSet() {
    const sunsetDisplayingAreaRef = useRef<HTMLDivElement>(null);
    const sunsetAnimationDivRef = useRef<SVGSVGElement | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [sunPosition, setSunPosition] = useState<number>(0);

    const {
        data: currentWeather,
        sunsetDateTime,
        percentFromSunrise
    }
        : {
            data: any;
            sunsetDateTime: Date;
            percentFromSunrise: number;
        }
        = useCurrentWeather();

    const resetSunPosition = () => {
        setSunPosition((92 + (percentFromSunrise * (92 - 50))) % 100);
    }

    useEffect(() => {
        resetSunPosition();

        return () => {
            setSunPosition(0);
        }
    }, [percentFromSunrise]);

    const {
        data: currentWeather,
        sunsetDateTime,
        percentFromSunrise
    }
        : {
            data: any;
            sunsetDateTime: Date;
            percentFromSunrise: number;
        }
        = useCurrentWeather();

    const scaledPercentFromSunrise = useMemo(() => {
        return (92 + (percentFromSunrise * (92 - 50))) % 100;
    }, [percentFromSunrise]);

    return (
        <div className={"bg-blue-500/80 backdrop-blur-sm rounded-xl overflow-hidden w-full h-full " + (currentWeather?.sys?.sunset ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-12')}
            ref={sunsetDisplayingAreaRef}
        >
            {
                currentWeather?.sys?.sunset ? (
                    <div className="w-full h-full overflow-hidden">
                        <div className="relative w-full h-full px-2">
<<<<<<< HEAD
                            <div className='absolute top-1.5 right-3 z-50'>
                                <div className='flex items-center space-x-2'>
                                    {
                                        sunPosition !== ((92 + (percentFromSunrise * (92 - 50))) % 100)
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
                                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun sets</span> <span className="text-2xl text-white/80 ">{getTime(sunsetDateTime)}</span></div>
                            </div>
                            <div className={'absolute left-2 right-2 z-50 transition-all ease-in-out ' + (editMode ? 'opacity-100 bottom-0' : 'opacity-0 -bottom-24')}>
                                {/* Add an input as a slider to control the percentage of the sun's position */}
                                <input type="range" min="0" max="100"
                                    title="Sun position"
                                    value={sunPosition}
                                    className="w-full"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setSunPosition(parseInt(e.target.value));
                                    }}
                                />
                            </div>
                            <div className="absolute left-0 top-[55%] w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/40 to-gray-800/80 h-20"></div>
=======
                            <div className="absolute left-0 top-0 p-1">
                                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun sets</span> <span className="text-2xl text-white/80 ">{getTime(sunsetDateTime)}</span></div>
                            </div>
                            <div className="absolute left-0 top-2/3 w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/60 to-gray-800 h-16"></div>
>>>>>>> 4aba730 (Fix timezone converter (#19))
                            <div
                                style={{
                                    transform: `translateX(${(sunsetDisplayingAreaRef.current && sunsetAnimationDivRef.current) ?
                                        ((sunsetDisplayingAreaRef.current.clientWidth - sunsetAnimationDivRef.current.clientWidth) / 2)
                                        : 0}px)`,
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[1rem] left-1 xl:right-0 z-0 opacity-60"
                                    ref={sunsetAnimationDivRef}
                                >
                                    <path d="M 6 90 Q 58.5 6, 135 75 T 270 60" stroke="rgb(90 224 249 / 0.4)" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                                </svg>
                                <motion.div
                                    className="absolute top-[1rem] left-1 z-10"
                                    style={{
                                        zIndex: 50,
                                        offsetPath: 'path("M 6 90 Q 58.5 6, 135 75 T 270 60")',
                                    }}
                                    initial={{
                                        offsetDistance: '0%',
                                    }}
                                    animate={{
<<<<<<< HEAD
                                        offsetDistance: `${sunPosition}%`,
                                    }}
                                    transition={{
                                        duration: 1,
=======
                                        offsetDistance: `${scaledPercentFromSunrise}%`,
                                    }}
                                    transition={{
                                        delay: 2,
                                        duration: 2,
>>>>>>> 4aba730 (Fix timezone converter (#19))
                                    }}
                                >
                                    {
                                        /**
                                         *  The sun and the moon are displayed
                                         *  based on the scaledPercentFromSunrise value.
                                         */
                                        (
<<<<<<< HEAD
                                            (sunPosition > 49 && sunPosition < 93)
                                            || sunPosition < 8
=======
                                            (scaledPercentFromSunrise > 49 && scaledPercentFromSunrise < 93)
                                            || scaledPercentFromSunrise < 8
>>>>>>> 4aba730 (Fix timezone converter (#19))
                                        )
                                            ? <TheMoon />
                                            : <TheSun />
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
