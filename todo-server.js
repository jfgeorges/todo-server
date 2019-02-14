const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Autorise les connexions depuis une autre adresse

mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

require("./models/Item");

const itemRoutes = require("./routes/Item");
// Activer les routes
app.use(itemRoutes);

app.listen(3000, () => {
  console.log("To-Do-List Server started");
});
