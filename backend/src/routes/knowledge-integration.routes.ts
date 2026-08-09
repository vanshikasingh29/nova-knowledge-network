import { Router } from "express";

import {
    integrateContributionGraph,
    rebuildGraph,
    getGraph,
    removeGraph
} from "../controllers/knowledge-integration.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


/*
|--------------------------------------------------------------------------
| Get contribution graph
|--------------------------------------------------------------------------
*/

router.get(

    "/contributions/:contributionId",

    getGraph

);


/*
|--------------------------------------------------------------------------
| Build contribution graph
|--------------------------------------------------------------------------
*/

router.post(

    "/contributions/:contributionId",

    authenticateToken,

    integrateContributionGraph

);


/*
|--------------------------------------------------------------------------
| Rebuild contribution graph
|--------------------------------------------------------------------------
*/

router.post(

    "/contributions/:contributionId/rebuild",

    authenticateToken,

    rebuildGraph

);


/*
|--------------------------------------------------------------------------
| Remove contribution graph
|--------------------------------------------------------------------------
*/

router.delete(

    "/contributions/:contributionId",

    authenticateToken,

    removeGraph

);


export default router;