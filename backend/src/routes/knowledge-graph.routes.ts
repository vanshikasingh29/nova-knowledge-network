import { Router } from "express";

import {
    createNode,
    getNode,
    createRelationship,
    getRelatedNodes,
    searchNodes,
    graphStats
} from "../controllers/knowledge-graph.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";

import {
    validateBody
} from "../middleware/validation.middleware";

import {
    createKnowledgeNodeSchema,
    createKnowledgeRelationshipSchema
} from "../validation/knowledge-graph.schemas";


const router = Router();


router.get(
    "/stats",
    graphStats
);


router.get(
    "/search",
    searchNodes
);


router.post(
    "/nodes",
    authenticateToken,
    validateBody(
        createKnowledgeNodeSchema
    ),
    createNode
);


router.get(
    "/nodes/:id",
    getNode
);


router.get(
    "/nodes/:id/related",
    getRelatedNodes
);


router.post(
    "/relationships",
    authenticateToken,
    validateBody(
        createKnowledgeRelationshipSchema
    ),
    createRelationship
);


export default router;