const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Note = require("./Note");
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated");

mongoose.connect("mongodb://localhost/note-service");
app.use(express.json());

function moyencalc(notes) {
  let total = 0;
  for (let t = 0; t < notes.length; ++t) {
    total += notes[t];
  }
  return total / notes.length;
}

app.post("/note/ajouter", isAuthenticated, async (req, res, next) => {
  const { notes } = req.body;

  
  const moduleUser = await Note.findOne({ email: req.stg.email });

  await axios.post('http://localhost:4002/ajouterNote',{notes:moduleUser.notes.concat(notes),email:req.stg.email});
  if (moduleUser){
    moyen = (moyencalc(notes) + moduleUser.moyen) / 2;
    
    // moduleUser.notes = moduleUser.notes.concat(notes);
    moduleUser.moyen = moyen;
    
    moduleUser.save().then((result) => res.json(result));
  } else {
    moyen = moyencalc(notes);
    const newNote = new Note({
      // nomst: req.user.nomst,
      notes,
      moyen,
    });
    newNote.save()
      .then((note) => res.status(201).json(note))
      .catch((error) => res.status(400).json({ error }));
  }
});

app.get("/note/afficher", isAuthenticated, async (req, res, next) => {
  const moduleUser = await Note.findOne({ nomst: req.stg.email });

  if (moduleUser) {
    res.json(moduleUser.moyen);
  } else {
    res.json({ err: "Module not found !!" });
  }
});

app.listen(PORT, () => {
  console.log(`Module-Service at ${PORT}`);
});
