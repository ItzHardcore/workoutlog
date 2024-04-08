import React from 'react'
import MeasuresTable from '../components/MeasuresTable'
import BodyPhotosGallery from '../components/BodyPhotosGallery'
import BodyMeasuresTable from '../components/BodyMeasuresTable'
import { useNavigate } from 'react-router-dom';
import ActionButton from '../styled/ActionButton';

const MyBody = ({ token }) => {
    const navigate = useNavigate();

    return (
    <div className='mt-5'>
        <ActionButton text="New Measures" backgroundImage="https://st2.depositphotos.com/1010613/8292/i/450/depositphotos_82921144-stock-photo-man-standing-on-weighing-scale.jpg" onClick={() => navigate('/measures')}/>
        <MeasuresTable token={token} />
        <BodyMeasuresTable token={token} />
        <BodyPhotosGallery token={token} />
    </div>
    )
}

export default MyBody