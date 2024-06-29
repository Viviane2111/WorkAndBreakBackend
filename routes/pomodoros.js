// routes/pomodoros.js
var express = require("express");
var router = express.Router();

const {updatePerformance, getLeaderBoard} = require("../controllers/pomodorosController");

//* METTRE A JOUR LA PERFORMANCE D'UN UTILISATEUR
router.put("/updatePerform", updatePerformance);

//* OBTENIR LE LEADERBOARD
router.get("/leaderboard", getLeaderBoard);

module.exports = router;