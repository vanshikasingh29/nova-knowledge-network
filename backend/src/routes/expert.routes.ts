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

import {
    validateBody
} from "../middleware/validation.middleware";

import {
    expertProfileSchema,
    updateExpertProfileSchema
} from "../validation/schemas";


const router = Router();


router.post(
    "/",
    authenticateToken,
    validateBody(expertProfileSchema),
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
    validateBody(updateExpertProfileSchema),
    updateExpertProfile
);


router.post(
    "/me/verification",
    authenticateToken,
    requestVerification
);


export default router;