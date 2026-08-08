import { Router } from "express";

import {
    getCurrentUser
} from "../controllers/user.controller";

import {
    authenticateToken
} from "../middleware/auth.middleware";


const router = Router();


router.get(
    "/me",
    authenticateToken,
    getCurrentUser
);


export default router;