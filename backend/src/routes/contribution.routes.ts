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

import {
    validateBody
} from "../middleware/validation.middleware";

import {
    contributionSchema,
    updateContributionSchema
} from "../validation/schemas";


const router = Router();


router.get(
    "/search",
    searchContributions
);


router.post(
    "/",
    authenticateToken,
    validateBody(contributionSchema),
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
    validateBody(updateContributionSchema),
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