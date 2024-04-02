import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BodyMeasuresForm({ token, onCancel }) {
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date());
    const [fase, setFase] = useState('Maintenance');
    const [kcal, setKcal] = useState('');
    const [peito, setPeito] = useState('');
    const [cintura, setCintura] = useState('');
    const [gluteo, setGluteo] = useState('');
    const [bracoDrt, setBracoDrt] = useState('');
    const [bracoEsq, setBracoEsq] = useState('');
    const [coxaDireita, setCoxaDireita] = useState('');
    const [coxaEsquerda, setCoxaEsquerda] = useState('');

    const handleAddMeasures = async (e) => {
        e.preventDefault();

        // Validate form date

        const measuresData = {
            date,
            fase,
            kcal,
            weight,
            peito,
            cintura,
            gluteo,
            bracoDrt,
            bracoEsq,
            coxaDireita,
            coxaEsquerda
        };

        try {
            const response = await fetch('http://localhost:3001/bodymeasures', { // Updated endpoint URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(measuresData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save measures. Please try again.');
            }

            // After successfully submitting the data, you can also reset the form fields
            setWeight('');
            setDate(new Date());
            setKcal('');
            setPeito('');
            setCintura('');
            setGluteo('');
            setBracoDrt('');
            setBracoEsq('');
            setCoxaDireita('');
            setCoxaEsquerda('');

            console.log("Measure created!");
            // Optionally, you can handle success actions here
        } catch (error) {
            // Handle any errors that occur during the submission
        }
    };

    return (
        <form onSubmit={handleAddMeasures} >
            {/* OPTIONALS */}
            <div className="row g-3 mb-3">
                <div className="col-md-2">
                    <label htmlFor="date" className="form-label">Date:</label>
                    <br />
                    <DatePicker
                        id="date"
                        selected={date}
                        dateFormat="dd/MM/yyyy"
                        onChange={(selectedDate) => setDate(selectedDate)}
                        className="form-control"
                    />

                </div>
                <div className="col-md-2">
                    <label htmlFor="fase" className="form-label">Fase:</label>
                    <select
                        id="fase"
                        className="form-select"
                        value={fase}
                        onChange={(e) => setFase(e.target.value)}
                    >
                        <option value="Bulking">Bulking</option>
                        <option value="Cutting">Cutting</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div className="col-md-8">
                    <label htmlFor="weight" className="form-label">Weight:</label>
                    <div className="input-group w-25">
                        <input
                            type="number"
                            id="weight"
                            className="form-control"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <span className="input-group-text">Kg</span></div>
                </div>
                <div className="col-md">
                    <label htmlFor="kcal" className="form-label">Kcal:</label>
                    <input
                        type="number"
                        id="kcal"
                        className="form-control"
                        value={kcal}
                        onChange={(e) => setKcal(e.target.value)}
                    />

                </div>
                <div className="col-md">
                    <label htmlFor="peito" className="form-label">Peito:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="peito"
                            className="form-control"
                            value={peito}
                            onChange={(e) => setPeito(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>
                </div>
                <div className="col-md">
                    <label htmlFor="cintura" className="form-label">Cintura:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="cintura"
                            className="form-control"
                            value={cintura}
                            onChange={(e) => setCintura(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
                <div className="col-md">
                    <label htmlFor="gluteo" className="form-label">Gluteo:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="gluteo"
                            className="form-control"
                            value={gluteo}
                            onChange={(e) => setGluteo(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
                <div className="col-md">
                    <label htmlFor="bracoDrt" className="form-label">Braco Direito:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="bracoDrt"
                            className="form-control"
                            value={bracoDrt}
                            onChange={(e) => setBracoDrt(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
                <div className="col-md">
                    <label htmlFor="bracoEsq" className="form-label">Braco Esquerdo:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="bracoEsq"
                            className="form-control"
                            value={bracoEsq}
                            onChange={(e) => setBracoEsq(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
                <div className="col-md">
                    <label htmlFor="coxaDireita" className="form-label">Coxa Direita:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="coxaDireita"
                            className="form-control"
                            value={coxaDireita}
                            onChange={(e) => setCoxaDireita(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
                <div className="col-md">
                    <label htmlFor="coxaEsquerda" className="form-label">Coxa Esquerda:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="coxaEsquerda"
                            className="form-control"
                            value={coxaEsquerda}
                            onChange={(e) => setCoxaEsquerda(e.target.value)}
                        />
                        <span className="input-group-text">Cm</span></div>

                </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Measures</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default BodyMeasuresForm;