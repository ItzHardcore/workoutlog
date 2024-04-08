import React from 'react';

function ErrorPage() {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: 'calc(100vh - 300px)' }}>
            <div className='text-center'>
                <h1>Error 404: Page Not Found</h1>
                <p>We're sorry, but the page you requested could not be found.</p>
            </div>
        </div>
    );
}

export default ErrorPage;
