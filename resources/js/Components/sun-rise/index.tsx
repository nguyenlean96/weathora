import { useMemo, useRef } from 'react';
import { motion } from "motion/react";
import { TheSun, TheMoon } from "@/Components/celestial";
import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { getTime } from '@/Utils';

export default function SunRise() {
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

    const scaledPercentFromSunrise = useMemo(() => {
        return (51 - (percentFromSunrise * (51 - 7))) % 100;
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
                            <div className="absolute left-0 top-0 p-1">
                                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun rises</span> <span className="text-2xl text-white/80 ">{getTime(sunriseDateTime)}</span></div>
                            </div>
                            <div className="absolute left-0 top-2/3 w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/60 to-gray-900 h-16"></div>
                            <div
                                style={{
                                    transform: `translateX(${(sunriseDisplayingAreaRef.current && sunriseAnimationDivRef.current) ?
                                        ((sunriseDisplayingAreaRef.current.clientWidth - sunriseAnimationDivRef.current.clientWidth) / 2)
                                        : 0}px)`,
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[1rem] left-0 xl:right-0 z-0 opacity-60"
                                    ref={sunriseAnimationDivRef}
                                >
                                    <path d="M 260 110 Q 187.5 6, 125 93 T 6 80" stroke="rgb(90 224 249 / 0.4)" strokeWidth="3" strokeLinecap="round"
                                        fill="transparent" />
                                </svg>
                                <motion.div
                                    className="absolute top-[1rem] left-0"
                                    style={{
                                        zIndex: 50,
                                        offsetPath: 'path("M 260 110 Q 187.5 6, 125 93 T 6 80")',
                                    }}
                                    initial={{
                                        offsetDistance: '100%',
                                    }}
                                    animate={{
                                        offsetDistance: `${scaledPercentFromSunrise}%`,
                                    }}
                                    transition={{
                                        delay: 1,
                                        duration: 2,
                                    }}
                                >
                                    {
                                        /**
                                         *  If the sun is between 50% and 93% of the way to sunrise,
                                         *  or less than 6% of the way to sunrise,
                                         */
                                        (
                                            (scaledPercentFromSunrise > 50 && scaledPercentFromSunrise < 93)
                                            || scaledPercentFromSunrise < 6
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
