const db = require("./index");
const controller = require("./tutorial.controller");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const run = async () => {
  // Middleware
  app.use(bodyParser.json());

  // Routes
  const tutorialRoutes = require("./routes");
  app.use("/api", tutorialRoutes);

  // Server lắng nghe ở port 8080
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  run();
});
