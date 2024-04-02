const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bodyMeasureSchema = new Schema({
    date: { type: Date, default: Date.now },
    fase: { type: String, enum: ['Bulking', 'Cutting', 'Maintenance'] },
    kcal: Number,
    weight: Number,
    peito: Number,
    cintura: Number,
    gluteo: Number,
    bracoDrt: Number,
    bracoEsq: Number,
    coxaDireita: Number,
    coxaEsquerda: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const BodyMeasure = mongoose.model('BodyMeasure', bodyMeasureSchema);

module.exports = BodyMeasure;
