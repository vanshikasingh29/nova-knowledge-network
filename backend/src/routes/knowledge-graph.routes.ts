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


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get(
    "/search",
    searchNodes
);


/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/stats",
    graphStats
);


/*
|--------------------------------------------------------------------------
| Node
|--------------------------------------------------------------------------
*/

router.get(
    "/nodes/:id",
    getNode
);


/*
|--------------------------------------------------------------------------
| Related Knowledge
|--------------------------------------------------------------------------
*/

router.get(
    "/nodes/:id/related",
    getRelatedNodes
);


/*
|--------------------------------------------------------------------------
| Create Node
|--------------------------------------------------------------------------
*/

router.post(
    "/nodes",
    authenticateToken,
    validateBody(
        createKnowledgeNodeSchema
    ),
    createNode
);


/*
|--------------------------------------------------------------------------
| Create Relationship
|--------------------------------------------------------------------------
*/

router.post(
    "/relationships",
    authenticateToken,
    validateBody(
        createKnowledgeRelationshipSchema
    ),
    createRelationship
);


export default router;