import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useForecastDataContext } from '@/Context/ForecastDataProvider';
export default function HourlyForecast() {
    const { hourly: hourlyForecastData, loading: isForecastLoading } = useForecastDataContext();
    const chartDisplayAreaRef = useRef<HTMLDivElement>(null);
    const [isChartReady, setIsChartReady] = useState<boolean>(false);

    const [chartWidth, setChartWidth] = useState<number | null>(null);
    const [chartHeight, setChartHeight] = useState<number | null>(null);

    const data = useMemo(() => {
        if (hourlyForecastData && !isForecastLoading) {
            if (hourlyForecastData.list) {
                return hourlyForecastData.list.map((hour: any) => hour.main.temp);
            }
        }
        return [];
    }, [hourlyForecastData, isForecastLoading]);

    useEffect(() => {
        // This useEffect waits for the component to fully render, then grabs the ref's dimensions
        const handleResize = () => {
            if (chartDisplayAreaRef.current) {
                setChartWidth(chartDisplayAreaRef.current.scrollWidth || 600);
                setChartHeight((chartDisplayAreaRef.current.offsetHeight * .76) || 400);
            }
        };

        // Initially set chart dimensions when the component mounts
        if (chartDisplayAreaRef.current && !isForecastLoading) {
            handleResize();
            setIsChartReady(prev => true); // Once we know the area size, set the chart ready
        }
    }, [chartDisplayAreaRef.current, isForecastLoading]);

    return (
        <div className={'relative ' + (isForecastLoading && 'hidden')}>
            <motion.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-fit p-2 text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.5,
                    duration: 0.5,
                }}
            >
                <div className="w-full p-1 border-b">
                    <span className="text-white">{String(`Hourly forecast`)}</span>
                </div>
                <div className='relative overflow-x-auto overflow-y-hidden pb-3 z-10'>
                    {
                        hourlyForecastData &&
                        <div className='z-10 w-full flex items-center justify-evenly ' ref={chartDisplayAreaRef}>
                            {
                                hourlyForecastData?.list &&
                                hourlyForecastData?.list.map(
                                    (hour: any, index: number) =>
                                    (
                                        <EachHour key={index} hour={hour} index={index} />
                                    )
                                )
                            }
                        </div>
                    }
                    {
                        !isForecastLoading && isChartReady &&
                        chartWidth && chartHeight &&
                        <div className='absolute left-0 right-0 bottom-2 -z-10'>
                            <LineChart
                                data={data}
                                width={chartWidth}
                                height={chartHeight}
                            />
                        </div>
                    }
                </div>
            </motion.div>
        </div>
    )
}

const EachHour = ({ hour, index }: {
    hour: any;
    index: number;
}): JSX.Element => {
    const hourTileRef = useRef<HTMLDivElement>(null);
    return (
        <div className='min-w-[5rem] p-1 py-2'
            ref={hourTileRef}
        >
            <div className='flex flex-col items-center justify-center text-white bg-white/5 rounded-lg'>
                <div className='text-sm'>{hour.dt_txt.split(' ')[1].slice(0, 5)}</div>
                <div className='flex items-center justify-center mb-10'>
                    <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description} className='w-14 h-14 opacity-90' />
                </div>
                <div>{Math.round(hour.main.temp).toFixed(0)}&deg;</div>
            </div>
        </div>
    )
}

const LineChart = ({ data, width, height }: {
    data: number[];
    width?: number;
    height?: number;
}) => {
    const padding = 40;
    const [linePath, setLinePath] = useState<string>('');

    const xScale = (value: number, index: number) => {
        return (index / (data.length - 1)) * ((width ?? 400) - padding * 2) + padding;
    };
    const yScale = (value: number, min: number, max: number) => {

        return (height ?? 600) - ((value - min) / (max - min)) * ((height ?? 600) - padding * 2) - padding;
    };

    useEffect(() => {
        const maxDataValue = Math.max(...data);
        const minDataValue = Math.min(...data);
        if (width === undefined || height === undefined) return;
        // Scale data to fit the width and height

        // Create the line path for the chart and add a circle at each data point
        setLinePath(prev => data.map(
            (value: number, index: number) =>
                index === 0
                    ? `M ${xScale(value, index)} ${yScale(value, minDataValue, maxDataValue)}`
                    : `L ${xScale(value, index)} ${yScale(value, minDataValue, maxDataValue)}`
        ).join(' '))

    }, [data, width, height]);

    return (
        <svg className='opacity-80' width={width} height={height}>
            {/* Draw the line */}
            <path d={linePath} stroke="#ddd" fill="none" strokeWidth="2" />

            {/* Draw the dots */}
            {data.map((value: number, index: number) => (
                <circle
                    key={index}
                    cx={xScale(value, index)}
                    cy={yScale(value, Math.min(...data), Math.max(...data))}
                    r={4}  // Radius of the dot
                    fill="#fff"  // Fill color of the dot
                />
            ))}
        </svg>
    );
};
