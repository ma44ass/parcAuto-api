import express from "express";
import "dotenv/config"


import vehiculesRoutes from "./routes/vehicules.js"

const PORT = process.env.port

/***Init exoress Server */
const app = express();

/*Mount middlewares*/
app.use(express.json());

// app.use(jouralisation);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});




/* vehicules Endpoints*/
app.use("/vehicules", vehiculesRoutes);


/*BAD ROUTE*/
app.use((req, res) => {
  res.status(404).json({ erreur: "Route inconnue" });
});

/******/
app.listen((PORT), () => {
    console.log(`Server running on port : ${PORT}`)
})




