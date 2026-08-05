import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";


const app = express();


app.use(cors());

app.use(express.json());


app.use("/api", healthRoutes);



app.get("/", (req,res)=>{


    res.json({

        project:"NOVA",

        message:
        "Network Of Verified Archives API running"

    });


});


export default app;