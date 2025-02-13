import { useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { TheSun, TheMoon } from '@/Components/celestial';
import { useCurrentWeather } from '@/Context/CurrentWeatherProvider';
import { getTime } from '@/Utils';

export default function SunSet() {
    const sunsetDisplayingAreaRef = useRef<HTMLDivElement>(null);
    const sunsetAnimationDivRef = useRef<SVGSVGElement | null>(null);

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
                            <div className="absolute left-0 top-0 p-1">
                                <div className="text-2xl text-end lg:text-start"><span className="font-semibold text-white/60">Sun sets</span> <span className="text-2xl text-white/80 ">{getTime(sunsetDateTime)}</span></div>
                            </div>
                            <div className="absolute left-0 top-2/3 w-full border-t-2 z-0 bg-gradient-to-b from-slate-600/20 via-slate-800/60 to-gray-800 h-16"></div>
                            <div
                                style={{
                                    transform: `translateX(${(sunsetDisplayingAreaRef.current && sunsetAnimationDivRef.current) ?
                                        ((sunsetDisplayingAreaRef.current.clientWidth - sunsetAnimationDivRef.current.clientWidth) / 2)
                                        : 0}px)`,
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[2rem] left-0 xl:right-0 z-0 opacity-60"
                                    ref={sunsetAnimationDivRef}
                                >
                                    <path d="M 6 90 Q 58.5 6, 135 75 T 270 60" stroke="rgb(90 224 249 / 0.4)" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                                </svg>
                                <motion.div
                                    className="absolute top-[2rem] left-0 z-50"
                                    style={{
                                        zIndex: 50,
                                        offsetPath: 'path("M 6 90 Q 58.5 6, 135 75 T 270 60")',
                                    }}
                                    initial={{
                                        offsetDistance: '0%',
                                    }}
                                    animate={{
                                        offsetDistance: `${scaledPercentFromSunrise}%`,
                                    }}
                                    transition={{
                                        delay: 2,
                                        duration: 2,
                                    }}
                                >
                                    {
                                        /**
                                         *  The sun and the moon are displayed
                                         *  based on the scaledPercentFromSunrise value.
                                         */
                                        (
                                            (scaledPercentFromSunrise > 49 && scaledPercentFromSunrise < 93)
                                            || scaledPercentFromSunrise < 8
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
