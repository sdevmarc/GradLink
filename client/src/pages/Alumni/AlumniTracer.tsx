import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import "leaflet/dist/leaflet.css"
import './css/Alumni.css'

export default function ManageAlumni() {
    const [isSidebar, setSidebar] = useState<boolean>(false)
    const navigate = useNavigate()

    const toggleSidebar = (value: boolean): void => {
        if (value) {
            setSidebar(true)
        } else {
            setSidebar(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }


    return (
        <>
            <div className="flex flex-col">
                <Navbar onSelectSidebar={(item) => toggleSidebar(item)} />
                <div className="flex">
                    <Sidebar SidebarStatus={isSidebar} />
                    <div className={`${isSidebar ? 'w-[100%]' : 'w-[82.5%]'} relative h-[93vh] flex flex-col`}>
                            <button
                                onClick={handleBack}
                                className='absolute top-[1rem] right-[1rem] z-[1] bg-white px-[1rem] py-[.5rem] rounded-lg flex items-center'
                            >
                                <ArrowBackIosIcon /> Back
                            </button>
                        <MapContainer
                            center={[16.48230416925654, 121.1501432409996]} zoom={13} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[16.48230416925654, 121.1501432409996]}>
                                <Popup>
                                    Ser Adonis was here
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
