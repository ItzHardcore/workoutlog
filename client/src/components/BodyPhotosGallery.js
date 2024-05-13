import React, { useState, useEffect } from 'react';

function BodyPhotosGallery({ token }) {
    const [photosData, setPhotosData] = useState([]);
    const [error, setError] = useState(null);
    const BASE_URL = require('./baseUrl');

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch(`${BASE_URL}/photos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch photos');
                }
                const data = await response.json();
                setPhotosData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPhotos();
    }, [token]);

    return (
        <div>
            <h2>Body Photos Gallery</h2>
            {error && <div>Error: {error}</div>}
            {photosData.length === 0 ? (
                <h5 className="text-danger">You have no photos</h5>
            ) : (
                <div className="photo-container">
                    {photosData.map((photoData, index) => (
                        <div key={index} className='card p-3' style={{ marginBottom: '20px' }}>
                            <div className='d-flex align-self-center'>
                                <h6 className='me-4'>Weight: {photoData.weight} Kg</h6>
                                <h6>Date: {new Date(photoData.date).toLocaleDateString()}</h6>
                            </div>
                            <div className='text-center'>
                                <div className="d-lg-flex justify-content-center">
                                    <div className="m-2">
                                        <img src={`${BASE_URL}/uploads/${photoData.frontImage}`} alt={`Front view of body - ${index}`} style={{ height: '150px' }} />
                                        <p className='mb-1'>Front Photo</p>
                                    </div>
                                    <div className="m-2">
                                        <img src={`${BASE_URL}/uploads/${photoData.backImage}`} alt={`Back view of body - ${index}`} style={{ height: '150px' }} />
                                        <p className='mb-1'>Back Photo</p>
                                    </div>
                                    <div className="m-2">
                                        <img src={`${BASE_URL}/uploads/${photoData.leftImage}`} alt={`Left view of body - ${index}`} style={{ height: '150px' }} />
                                        <p className='mb-1'>Left Photo</p>
                                    </div>
                                    <div className="m-2">
                                        <img src={`${BASE_URL}/uploads/${photoData.rightImage}`} alt={`Right view of body - ${index}`} style={{ height: '150px' }} />
                                        <p className='mb-1'>Right Photo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BodyPhotosGallery;
