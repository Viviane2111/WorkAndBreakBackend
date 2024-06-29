// routes/users.js
var express = require("express");
var router = express.Router();

const {
  signup,
  login,
  updateUser,
} = require("../controllers/usersController");

//* S'ENREGISTRER
router.post("/signup", signup);

//* SE CONNECTER
router.post("/login", login);

//* METTRE A JOUR UN UTILISATEUR
router.put("/update/:username", updateUser);

//* PASSER UN UTILISATEUR EN PREMIUM
router.put("/upgradeToPremium/:userId", upgradeToPremium);

/* GET users listing. */
// router.get("/", function (req, res) {
//   /*code à venir*/
// });

module.exports = router;

// //* SUPPRIMER UN UTILISATEUR
// router.delete("/deleteUser/:username", deleteUser);