import { Router } from "express";

import {
    searchExperts
} from "../controllers/expert-discovery.controller";


const router = Router();


router.get(
    "/search",
    searchExperts
);


export default router;
