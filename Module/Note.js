const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set('strictQuery', true);
const NoteSchema = mongoose.Schema({
    id:String,
    nomst: String,
    moyen: Number,
    notes: {
        type: [Number]
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = Note = mongoose.model("note", NoteSchema);