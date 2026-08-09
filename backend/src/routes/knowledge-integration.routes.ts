import { Router } from "express";

import {
    synchroniseContribution,
    synchroniseContributionNode,
    synchroniseCategoryNode,
    synchroniseTagNode
} from "../controllers/knowledge-integration.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


/**
 * Build the complete knowledge graph
 * for a contribution.
 */
router.post(
    "/contributions/:id/synchronise",
    authenticateToken,
    synchroniseContribution
);


/**
 * Create/retrieve the contribution node.
 */
router.post(
    "/contributions/:id/node",
    authenticateToken,
    synchroniseContributionNode
);


/**
 * Create/retrieve the category node.
 */
router.post(
    "/categories/:id/node",
    authenticateToken,
    synchroniseCategoryNode
);


/**
 * Create/retrieve the tag node.
 */
router.post(
    "/tags/:id/node",
    authenticateToken,
    synchroniseTagNode
);


export default router;