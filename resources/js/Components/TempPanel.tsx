import { motion as m } from 'motion/react';
import { useCurrentWeather } from "@/Context/CurrentWeatherProvider";

export default function TempPanel() {
    const {
        data: currentWeather,
        temp_min,
        temp_max,
    }: {
        data: ICurrentWeather;
        temp_min: number;
        temp_max: number;
    } = useCurrentWeather();
    return (
        <div className='grid grid-cols-3 w-full h-full gap-2'>
            <m.div className="col-span-2 bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-[10rem] p-2 px-3 text-white flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="border-b p-0">
                    <div className="w-full">
                        <h4 className="text-gray-100 leading-5 mb-1">Feels like</h4>
                    </div>
                </div>
                {/* FEELS LIKE */}
                <div className='flex flex-1 justify-center items-center w-full h-full'>
                    <h5 className="text-lg xl:text-5xl text-center text-gray-100 font-bold">
                        {Math.round(currentWeather.feels_like)}&deg;
                    </h5>
                </div>
            </m.div>
            <div className='grid grid-rows-2 gap-2 max-h-full h-[10rem]'>
                <m.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-full p-2 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-0 w-full">
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
                    </div>
                    {/* MAX TEMPERATURE */}
                    <div className="flex flex-col justify-center w-full text-center text-base xl:text-2xl">
                        <span className="font-semibold">{temp_max.toFixed(0)}&deg;</span>
                    </div>
                </m.div>
                <m.div className="bg-blue-500/80 backdrop-blur-sm rounded-xl w-full h-full p-2 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='w-full p-0'>
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
                    </div>
                    {/* MIN TEMPERATURE */}
                    <div className="flex flex-col justify-center w-full text-center text-base xl:text-2xl">
                        <span className="font-semibold">{temp_min.toFixed(0)}&deg;</span>
                    </div>
                </m.div>
            </div>
        </div>
    )
}
