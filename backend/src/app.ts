import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import expertRoutes from "./routes/expert.routes";
import contributionRoutes from "./routes/contribution.routes";
import categoryRoutes from "./routes/category.routes";
import tagRoutes from "./routes/tag.routes";


const app = express();


app.use(cors());


app.use(express.json());


app.use("/api", healthRoutes);


app.use("/api", databaseRoutes);


app.use("/api/auth", authRoutes);


app.use("/api/users", userRoutes);


app.use("/api/experts", expertRoutes);


app.use("/api/contributions", contributionRoutes);


app.use("/api/categories", categoryRoutes);


app.use("/api/tags", tagRoutes);


app.get("/", (req, res) => {

    res.json({

        project: "NOVA",

        message:
            "Network Of Verified Archives API running"

    });

});


export default app;