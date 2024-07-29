const mongoose = require("mongoose");

module.exports.checkConnexion = function (req, res, next) {
  if (mongoose.connection.readyState == 1) {
    req.log.info("Vérification de la connexion base de données : OK ")
    next();
  } 
  else {
    req.log.error("Vérification de la connexion base de données : NO OK");
    res.statusCode = 500;
    res.send({
      msg: "La base de données est en erreur ${mongoose.connection.readyState}", 
      type_error: "error-connexion-db",
    });
  }
};
