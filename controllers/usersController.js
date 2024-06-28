// controllers/usersController.js
const User = require("../models/users.model");
const { checkBody, isValidEmail } = require("../modules/checkBody");
const bcrypt = require("bcrypt");

//* -----LOGIQUE-DE-CRÉATION-D'UN-NOUVEL-UTILISATEUR----- *//
const signup = (req,res) => {
   if (!checkBody(req.body, ["username", "email", "password"])) {
     return res.json({ result: false, error: "Champs manquants ou vides" });
   }
   if (!isValidEmail(req.body.email)) {
     res.json({ result: false, error: "Invalid email format" });
     return;
   }
}


//* -----LOGIQUE-POUR-RÉCUPÉRER-UN-UTILISATEUR----- *//
const login = (req, res) => {
   if (!checkBody(req.body, ["email", "password"])) {
     return res.json({ result: false, error: "Champs manquants ou vides" });
   }
   if (!isValidEmail(req.body.email)) {
     res.json({ result: false, error: "Invalid email format" });
     return;
   }
}


//* -----LOGIQUE-POUR-METTRE-A-JOUR-UN-UTILISATEUR----- *//
const updateUser = (req, res) => {}


//* -----LOGIQUE-SUPPRIMER-UN-UTILISATEUR----- *//
const deleteUser = (req, res) => {
}


module.exports = { signup, login, deleteUser, updateUser };