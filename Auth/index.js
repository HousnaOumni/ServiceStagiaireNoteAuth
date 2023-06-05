const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Stagiaire = require("./Stagiaire");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://localhost/auth-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Auth-Service DB Connected`);
  }
);

app.use(express.json());

// la méthode regiter permettera de créer et d'ajouter un nouvel utilisateur à la base de données
app.post("/auth/register", async (req, res) => {
  let { NumInscription, NomComplete, DateN, email, password } = req.body;
  //On vérifie si le nouvel utilisateur est déjà inscrit avec la même adresse email ou pas
  const userExists = await Stagiaire.findOne({ email });
  if (userExists) {
    return res.json({ message: "Cet Stagiaire existe déjà" });
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        password = hash;
        const newStagiaire = new Stagiaire({
          NumInscription,
          NomComplete,
          DateN,
          email,
          password,
        });

        newStagiaire
          .save()
          .then((user) => res.status(201).json(user))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
});

//la méthode login permettera de retourner un token après vérification de l'email et du mot de passe
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const stagiaire = await Stagiaire.findOne({ email });
  if (!stagiaire) {
    return res.json({ message: "stagiaire introuvable" });
  } else {
    bcrypt.compare(password, stagiaire.password).then((resultat) => {
      if (!resultat) {
        return res.json({ message: "Mot de passe incorrect" });
      } else {
        const payload = {
          email,
          nom: stagiaire.nom,
        };
        jwt.sign(payload, "secret", (err, token) => {
          if (err) console.log(err);
          else return res.json({ token: token });
        });
      }
    });
  }
});
app.post("/ajouterNote",async(req,res)=>{
  const result = await Stagiaire.updateOne({email:req.body.email},{$set:{notes:req.body.notes}})
  console.log(req.body.notes);
  res.json(result);
});


app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
