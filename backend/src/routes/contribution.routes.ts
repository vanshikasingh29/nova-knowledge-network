import { Router } from "express";

import {
    createContribution,
    getMyContributions,
    searchContributions,
    publishContribution,
    getContribution,
    updateContribution,
    deleteContribution
} from "../controllers/contribution.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


router.get(
    "/search",
    searchContributions
);


router.post(
    "/",
    authenticateToken,
    createContribution
);


router.get(
    "/",
    authenticateToken,
    getMyContributions
);


router.get(
    "/:id",
    getContribution
);


router.put(
    "/:id",
    authenticateToken,
    updateContribution
);


router.patch(
    "/:id/publish",
    authenticateToken,
    publishContribution
);


router.delete(
    "/:id",
    authenticateToken,
    deleteContribution
);


export default router;