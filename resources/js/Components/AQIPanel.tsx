import { useCity } from "@/Context/CityProvider";
import { useAirQuality } from "@/Hooks/useAirQuality"
import { useMemo } from "react";

export default function AQIPanel() {
    const { location } = useCity();
    const { data: airQualityData } = useAirQuality(location);

    const aqi = useMemo(() => {
        if (!airQualityData) return 1;
        if (!airQualityData.main) return 1;
        return parseInt(airQualityData.main.aqi);
    }, [airQualityData]);

    const qualitativeAQI = useMemo(() => {
        switch (aqi) {
            case 1:
                return 'Good';
            case 2:
                return 'Fair';
            case 3:
                return 'Moderate';
            case 4:
                return 'Poor';
            case 5:
                return 'Very Poor';
            default:
                return 'Unknown';
        }
    }, [aqi]);

    return (
        <div className="px-3 p-2 w-full h-full flex flex-col bg-blue-500/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="border-b p-0">
                <div className="w-full">
                    <h4 className="text-gray-100 leading-5 mb-1">Air Quality Index</h4>
                </div>
            </div>
            <div className="flex-1 overflow-hiddenrelative">
                <div className="w-full h-full flex flex-col justify-center p-2">
                    <div className="text-5xl text-gray-100 leading-none">{aqi}</div>
                    <div className="text-xl text-gray-200 mb-2">{qualitativeAQI}</div>
                    <div className="w-full">
                        <div className="w-full h-2.5 relative rounded-full border"
                            style={{
                                /**
                                 * linear gradient from blue > green > yellow > orange > red
                                 *
                                 */
                                background: `linear-gradient(90deg, #00b2ff 16%, #00ff00 36%, #ffff00 56%, #ffa500 72%, #ff0000 84%)`,
                            }}
                        >
                            <div className="w-4 h-4 rounded-full bg-white absolute top-1/2 transition-all ease-in-out"
                                style={{
                                    left: `${25 * (aqi - 1)}%`,
                                    transform: `${aqi === 1 ? 'translateX(2%)' : aqi === 5 ? 'translateX(-102%)' : 'translateX(-50%)'} translateY(-50%)`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
