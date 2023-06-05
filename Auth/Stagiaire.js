const mongoose = require("mongoose");

const StagiareSchema = mongoose.Schema({
    NumInscription: Number,
    NomComplete: String,
    DateN: Date,
    email: String,
    notes:[Number],
    password: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = Stagiare = mongoose.model("stagiare", StagiareSchema);