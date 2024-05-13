import React, { useState } from 'react';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import { RxLapTimer } from "react-icons/rx";

function TimerPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const startTimer = () => {
        const id = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);
        setIntervalId(id);
    };

    const stopTimer = () => {
        clearInterval(intervalId);
    };

    const resetTimer = () => {
        clearInterval(intervalId);
        setTimer(0);
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours}h `;
        }
        if (minutes > 0 || hours > 0) {
            formattedTime += `${minutes}m `;
        }
        formattedTime += `${seconds}s`;

        return formattedTime;
    };

    return (
        <>
            <div className="position-fixed bottom-0 end-0 pe-3 p-md-5 p-1" style={{ zIndex: 1000 }}>
                {!isOpen && (
                    <span style={{ fontSize: '80px' }} >
                        <RxLapTimer className='timer-icon' style={{ cursor: 'pointer' }} onClick={openModal} />
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="modal fade show d-flex align-items-center justify-content-center" tabIndex="-1" style={{ display: 'block', zIndex: '1050', backdropFilter: 'blur(5px)' }} onClick={closeModal}>
                    <div className="modal-dialog modal-dialog-centered modal-circle">
                        <div className="modal-content" style={{ width: '180px', height: '180px', borderRadius: '100%' }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-body d-flex flex-column justify-content-center align-items-center">
                                <h5 className="modal-title mb-4">{formatTime(timer)}</h5>
                                <div className="modal-buttons d-flex justify-content-around w-100">
                                    <button className="btn btn-sm btn-outline-danger btn-circle" onClick={stopTimer}><FaPause /></button>
                                    <button className="btn btn-sm btn-outline-success btn-circle" onClick={startTimer}><FaPlay /></button>
                                    <button className="btn btn-sm btn-outline-warning btn-circle" onClick={resetTimer}><FaStop /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TimerPopup;
