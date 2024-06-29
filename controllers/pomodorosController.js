const User = require("../models/user");

// Mise à jour des performances d'un utilisateur après chaque session réussie.
const updatePerformance = async (req, res) => {
   const {userId, pomodorosCompleted, workTime} = req.body;

   try {
     const user = await User.findById(userId);
     if (!user) {
       return res
         .status(404)
         .json({ result: false, error: "Utilisateur non trouvé" });
     }

     user.pomodorosCompleted += pomodorosCompleted;
     user.totalWorkTime += workTime;
     await user.save();

     res.json({ result: true, message: "Performance mise à jour avec succès", user });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}

// Récupérer et trier les performances
const getLeaderBoard = async(req, res) => {
   try {
      const users = await User.find().sort({ pomodorosCompleted: -1, totalWorkTime: -1}).limite(10);
      res.json({ result: true, leaderboard: users });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}

module.exports = { updatePerformance, getLeaderBoard };