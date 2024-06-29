// controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const { isValidEmail } = require("../modules/validateEmail");

/**
 * Signup function creates a new user in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves to the response object.
 */
const signup = async (req, res) => {
  // Check if the request body contains the required fields
  if (!checkBody(req.body, ["username", "email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides" });
  }

  // Check if the email format is valid
  if (!isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ result: false, error: "Format d'email invalide" });
  }

  try {
    // Destructure the request body for easier access
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Utilisateur déjà enregistré" });
    }

    // Hash the password using bcrypt
    const hash = bcrypt.hashSync(password, 10);

    // Create a new user object and save it to the database
    const newUser = new User({ username, email, password: hash, isPremium: false });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, isPremium: newUser.isPremium },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return a success response with the token
    res
      .status(201)
      .json({ result: true, message: "Utilisateur créé avec succès", token });
  } catch (error) {
    // Return an error response if there was an issue saving the user
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

    // Recherche de l'utilisateur par son email
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
    // Génération d'un token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Si le mot de passe est correct,vérification du type d'utilisateur
    if (user.isPremium) {
      res.json({
        result: true,
        message:
          "Connexion réussie, accès complet aux fonctionnalités premium.",
        token,
        userData: user,
      });
    } else {
      res.json({
        result: true,
        message: "Connexion réussie, accès à la fonctionnalité de base.",
        token,
        userData: user,
      });
    }

  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

//* -----LOGIQUE-POUR-METTRE-A-JOUR-UN-UTILISATEUR----- *//
const updateUser = async(req, res) => {
   if (!checkBody(req.body, ["email"])) {
     return res.json({ result: false, error: "Champs manquants ou vides" });
   }
   if (!isValidEmail(req.body.email)) {
     res.json({ result: false, error: "Invalid email format" });
     return;
   }
   try {
    const { username } = req.params;
    const { email, password } = req.body;
    // Recherche de l'utilisateur par son nom
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur non trouvé" });
    }
    // Mise à jour des informations
    user.email = email;
    if (password) {
      // Hacher le nouveau mot de passe si fourni
      user.password = bcrypt.hashSync(password, 10);
    }
    await user.save();
    res.json({ result: true, message: "Utilisateur mis à jour avec succès" });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}

//* -----LOGIQUE-POUR-METTRE-A-JOUR-UN-COMPTE PREMIUM----- *//
const upgradeToPremium = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur non trouvé" });
    }

    user.isPremium = true;
    await user.save();

    res.json({
      result: true,
      message: "Utilisateur mis à jour vers premium avec succès",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

module.exports = { signup, login, updateUser, upgradeToPremium };
