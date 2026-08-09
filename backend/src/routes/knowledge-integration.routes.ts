import { Router } from "express";

import {
    buildContributionGraphController,
    createCategoryNodeController,
    createTagNodeController
} from "../controllers/knowledge-integration.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


router.post(
    "/contributions/:id/graph",
    authenticateToken,
    buildContributionGraphController
);


router.post(
    "/categories/:id/graph-node",
    authenticateToken,
    createCategoryNodeController
);


router.post(
    "/tags/:id/graph-node",
    authenticateToken,
    createTagNodeController
);


export default router;