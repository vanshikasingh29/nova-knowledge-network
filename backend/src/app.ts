import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import expertRoutes from "./routes/expert.routes";
import expertDiscoveryRoutes from "./routes/expert-discovery.routes";
import contributionRoutes from "./routes/contribution.routes";
import categoryRoutes from "./routes/category.routes";
import tagRoutes from "./routes/tag.routes";
import discoveryRoutes from "./routes/discovery.routes";
import knowledgeGraphRoutes from "./routes/knowledge-graph.routes";
import knowledgeIntegrationRoutes from "./routes/knowledge-integration.routes";



import {
    errorHandler
} from "./middleware/error.middleware";


const app = express();


app.disable("x-powered-by");


app.use(cors());


app.use(express.json({
    limit: "1mb"
}));


app.use("/api", healthRoutes);


app.use("/api", databaseRoutes);


app.use("/api/auth", authRoutes);


app.use("/api/users", userRoutes);


app.use("/api/experts", expertRoutes);


app.use(
    "/api/experts",
    expertDiscoveryRoutes
);


app.use(
    "/api/contributions",
    contributionRoutes
);


app.use(
    "/api/categories",
    categoryRoutes
);


app.use(
    "/api/tags",
    tagRoutes
);


app.use(
    "/api/discovery",
    discoveryRoutes
);

app.use(
    "/api/knowledge-graph",
    knowledgeGraphRoutes
);

app.use(
    "/api/knowledge-integration",
    knowledgeIntegrationRoutes
);


app.get("/", (req, res) => {

    res.status(200).json({

        project:
            "NOVA",

        message:
            "Network Of Verified Archives API running",

        version:
            "1.0.0"

    });

});


app.use(errorHandler);


export default app;