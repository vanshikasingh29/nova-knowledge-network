import { Router } from "express";

import {
    getKnowledgeOverview
} from "../controllers/discovery.controller";


const router = Router();


router.get(
    "/overview",
    getKnowledgeOverview
);


export default router;