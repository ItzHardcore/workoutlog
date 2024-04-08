import React from 'react'
import MeasuresForm from '../components/MeasuresForm'
import BodyMeasuresForm from '../components/BodyMeasuresForm'
import BodyPhotosUpload from '../components/BodyPhotosUpload'

const AddMeasuresPhotos = ({ token }) => {
  return (
    <div className='mt-5'>
    <MeasuresForm token={token}/>
    <BodyMeasuresForm token={token}/>
    <BodyPhotosUpload token={token}/>
    </div>
  )
}

export default AddMeasuresPhotos