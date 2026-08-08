import { Router } from "express";

import {
    createExpertProfile,
    getMyExpertProfile,
    updateExpertProfile,
    requestVerification
} from "../controllers/expert.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


router.post(
    "/",
    authenticateToken,
    createExpertProfile
);


router.get(
    "/me",
    authenticateToken,
    getMyExpertProfile
);


router.put(
    "/me",
    authenticateToken,
    updateExpertProfile
);


router.post(
    "/me/verification",
    authenticateToken,
    requestVerification
);


export default router;