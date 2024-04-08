import React from 'react'
import MeasuresTable from '../components/MeasuresTable'
import BodyPhotosGallery from '../components/BodyPhotosGallery'
import BodyMeasuresTable from '../components/BodyMeasuresTable'
import { useNavigate } from 'react-router-dom';
const MyBody = ({ token }) => {
    const navigate = useNavigate();

    return (
    <div className='mt-5'>
        <button className='btn btn-primary' onClick={() => navigate('/measures')}>Add Measures or Photos</button>
        <MeasuresTable token={token} />
        <BodyMeasuresTable token={token} />
        <BodyPhotosGallery token={token} />
    </div>
    )
}

export default MyBody