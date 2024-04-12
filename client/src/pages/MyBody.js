import React from 'react'
import MeasuresTable from '../components/MeasuresTable'
import BodyPhotosGallery from '../components/BodyPhotosGallery'
import BodyMeasuresTable from '../components/BodyMeasuresTable'
import ActionButton from '../styled/ActionButton';
import FormModal from '../components/FormModal';
import MeasuresForm from '../components/MeasuresForm';
import BodyMeasuresForm from '../components/BodyMeasuresForm';
import BodyPhotosUpload from '../components/BodyPhotosUpload';

const MyBody = ({ token }) => {

    return (
        <div className='mt-5'>
            <div className='d-flex overflow-auto'>
                <FormModal buttonComponent={<ActionButton text="New Daily Measures" backgroundImage="https://as2.ftcdn.net/v2/jpg/05/80/51/67/1000_F_580516754_4Pgrqwiq1ykLjRXJUqSbIgHN07z0hCFW.jpg" />} formComponent={<MeasuresForm token={token} />} />
                <FormModal buttonComponent={<ActionButton text="New Body Measures" backgroundImage="https://www.kim-pearson.com/wp-content/uploads/2020/09/tracking-weight-loss-how-to-take-body-measurements-1.jpg" />} formComponent={<BodyMeasuresForm token={token} />} />
                <FormModal buttonComponent={<ActionButton text="New Body Photos" backgroundImage="https://athleanx.com/wp-content/uploads/2023/07/men-bodyfat-percent.jpg" />} formComponent={<BodyPhotosUpload token={token} />} />
            </div>
            <MeasuresTable token={token} />
            <BodyMeasuresTable token={token} />
            <BodyPhotosGallery token={token} />
        </div>
    )
}

export default MyBody