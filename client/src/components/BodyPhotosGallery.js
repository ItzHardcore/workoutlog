import React, { useState, useEffect } from 'react';

function BodyPhotosGallery({ token }) {
    const [photosData, setPhotosData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch('http://localhost:3001/photos', {
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
            ) : (<div className="photo-container">
                {photosData.map((photoData, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <div>
                            <img src={`http://localhost:3001/uploads/${photoData.frontImage}`} alt={`Front view of body - ${index}`} style={{ width: '300px', marginRight: '10px' }} />
                            <img src={`http://localhost:3001/uploads/${photoData.backImage}`} alt={`Back view of body - ${index}`} style={{ width: '300px', marginRight: '10px' }} />
                            <img src={`http://localhost:3001/uploads/${photoData.leftImage}`} alt={`Left view of body - ${index}`} style={{ width: '300px', marginRight: '10px' }} />
                            <img src={`http://localhost:3001/uploads/${photoData.rightImage}`} alt={`Right view of body - ${index}`} style={{ width: '300px' }} />
                        </div>
                        <div>Weight: {photoData.weight} Kg</div>
                        <div>Date: {new Date(photoData.date).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>)}

        </div>
    );
}

export default BodyPhotosGallery;
