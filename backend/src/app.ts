import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";


const app = express();


app.use(cors());


app.use(express.json());


app.use("/api", healthRoutes);


app.use("/api", databaseRoutes);


app.use("/api/auth", authRoutes);


app.use("/api/users", userRoutes);


app.get("/", (req, res) => {

    res.json({

        project: "NOVA",

        message:
            "Network Of Verified Archives API running"

    });

});


export default app;