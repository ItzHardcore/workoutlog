import React from 'react'
import MeasuresTable from '../components/MeasuresTable'
import BodyMeasuresForm from '../components/BodyMeasuresForm'
import BodyPhotosGallery from '../components/BodyPhotosGallery'

const MyBody = ({ token }) => {
    return (<>
        <MeasuresTable token={token} />
        <BodyMeasuresForm token={token} />
        <BodyPhotosGallery token={token} />
    </>
    )
}

export default MyBody