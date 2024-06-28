// routes/users.js
var express = require("express");
var router = express.Router();

const {
  signup,
  login,
  // deleteUser,
  // updateUser,
} = require("../controllers/usersController");

//* S'ENREGISTRER
router.post("/signup", signup);

//* SE CONNECTER
router.post("/login", login);

// //* METTRE A JOUR UN UTILISATEUR
// router.put("/update/:username", updateUser);

// //* SUPPRIMER UN UTILISATEUR
// router.delete("/deleteUser/:username", deleteUser);

/* GET users listing. */
router.get("/", function (req, res) {
  /*code à venir*/
});

module.exports = router;
