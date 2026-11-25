import express from "express";
import "dotenv/config"

import vehiculesRoutes from "./routes/vehicules.js"
import journalisation from "./middlewares/journalisation.js";

const PORT = process.env.port

/***Init express Server */
const app = express();

/*Mount middlewares*/
app.use(express.json());

// app.use(jouralisation);
app.use(journalisation)

/* vehicules Endpoints*/
app.use("/vehicules", vehiculesRoutes);


/*BAD ROUTE*/
app.use((req, res) => {
  res.status(404).json({ error: "Route inconnue" });
});

/******/
app.listen((PORT), () => {
    console.log(`Server running on port : ${PORT}`)
})




