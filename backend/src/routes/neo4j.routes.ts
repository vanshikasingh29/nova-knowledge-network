import { Router } from "express";

import {
    neo4jHealth
} from "../controllers/neo4j.controller";


const router =
    Router();


router.get(
    "/health",
    neo4jHealth
);


export default router;