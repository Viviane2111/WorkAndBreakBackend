// controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const { isValidEmail } = require("../modules/validateEmail");

//* -----LOGIQUE-DE-CRÉATION-D'UN-NOUVEL-UTILISATEUR----- *//
const signup = async (req, res) => {
  // Vérification des champs requis
  if (!checkBody(req.body, ["username", "email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides" });
  }

  // Vérification du format de l'email
  if (!isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ result: false, error: "Format d'email invalide" });
  }

  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Utilisateur déjà enregistré" });
    }

    // Hacher le mot de passe
    const hash = bcrypt.hashSync(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    //  token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ result: true, message: "Utilisateur créé avec succès", token });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: "Erreur lors de la sauvegarde de l'utilisateur",
      details: error.message,
    });
  }
};

//* -----LOGIQUE-POUR-RÉCUPÉRER-UN-UTILISATEUR----- *//
async function login(req, res) {
  // Vérification des champs requis
  if (!checkBody(req.body, ["email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides" });
  }

  // Vérification du format de l'email
  if (!isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ result: false, error: "Format d'email invalide" });
  }

  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur dans la base de données par email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur non trouvé" });
    }

    // Comparaison du mot de passe fourni avec le mot de passe haché enregistré
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ result: false, error: "Mot de passe incorrect" });
    }

    //   token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Si le mot de passe est correct, retourner les informations de l'utilisateur
    res.json({ result: true, userData: user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};


//* -----LOGIQUE-POUR-METTRE-A-JOUR-UN-UTILISATEUR----- *//
// const updateUser = async(req, res) => {
//    if (!checkBody(req.body, ["email", "password"])) {
//      return res.json({ result: false, error: "Champs manquants ou vides" });
//    }
//    if (!isValidEmail(req.body.email)) {
//      res.json({ result: false, error: "Invalid email format" });
//      return;
//    }
//    try {
//    } catch (error) {
//      res.status(500).json({ error: error.message });
//    }
// }


//* -----LOGIQUE-SUPPRIMER-UN-UTILISATEUR----- *//
// const deleteUser = (req, res) => {
//    try {
//    } catch (error) {
//      res.status(500).json({ error: error.message });
//    }
// }


module.exports = { signup, login };