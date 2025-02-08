import Fog1 from '../graphic/fog1.png';
import Fog2 from '../graphic/fog2.png';
import Fog3 from '../graphic/fog3.png';
import Fog4 from '../graphic/fog4.png';
import Fog5 from '../graphic/fog5.png';

export default function FogBackgroundEffect() {
    return (
        <div className="fog z-30">
            <img src={Fog1} alt="fog" className="fog1" />
            <img src={Fog2} alt="fog" className="fog2" />
            <img src={Fog3} alt="fog" className="fog3" />
            <img src={Fog4} alt="fog" className="fog4" />
            <img src={Fog5} alt="fog" className="fog5" />
            <img src={Fog1} alt="fog" className="fog10" />
            <img src={Fog2} alt="fog" className="fog9" />
            <img src={Fog3} alt="fog" className="fog8" />
            <img src={Fog4} alt="fog" className="fog7" />
            <img src={Fog5} alt="fog" className="fog6" />
        </div>
    )
}
