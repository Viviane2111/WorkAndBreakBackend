// controllers/usersController.js
const bcrypt = require("bcrypt");
const User = require("../models/users.model");
const { checkBody, isValidEmail } = require("../modules/checkBody");

//* -----LOGIQUE-DE-CRÉATION-D'UN-NOUVEL-UTILISATEUR----- *//
const signup = async (req, res) => {
  // Vérification des champs requis
  if (!checkBody(req.body, ["username", "email", "password"])) {
    return res.status(400).json({ result: false, error: "Champs manquants ou vides" });
  }

  // Vérification du format de l'email
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ result: false, error: "Format d'email invalide" });
  }

  try {
    const { username, email, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ result: false, error: "Utilisateur déjà enregistré" });
    }

    // Hachage du mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ result: true, message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la sauvegarde de l'utilisateur", details: error.message });
  }
};



//* -----LOGIQUE-POUR-RÉCUPÉRER-UN-UTILISATEUR----- *//
const login = async(req, res) => {
   if (!checkBody(req.body, ["email", "password"])) {
     return res.json({ result: false, error: "Champs manquants ou vides" });
   }
   if (!isValidEmail(req.body.email)) {
     res.json({ result: false, error: "Invalid email format" });
     return;
   }
   try {
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}


//* -----LOGIQUE-POUR-METTRE-A-JOUR-UN-UTILISATEUR----- *//
const updateUser = (req, res) => {
   try {
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}


//* -----LOGIQUE-SUPPRIMER-UN-UTILISATEUR----- *//
const deleteUser = (req, res) => {
   try {
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}


module.exports = { signup, login, deleteUser, updateUser };