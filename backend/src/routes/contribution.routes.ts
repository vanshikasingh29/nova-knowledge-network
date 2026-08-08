import { Router } from "express";

import {
    createContribution,
    getMyContributions,
    getContribution,
    updateContribution,
    deleteContribution
} from "../controllers/contribution.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


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
    authenticateToken,
    getContribution
);


router.put(
    "/:id",
    authenticateToken,
    updateContribution
);


router.delete(
    "/:id",
    authenticateToken,
    deleteContribution
);


export default router;