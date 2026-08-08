import { Router } from "express";

import {
    createExpertProfile,
    getExpertProfile,
    updateExpertProfile
} from "../controllers/expert.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


router.post(
    "/profile",
    authenticateToken,
    createExpertProfile
);


router.get(
    "/profile",
    authenticateToken,
    getExpertProfile
);


router.put(
    "/profile",
    authenticateToken,
    updateExpertProfile
);


export default router;