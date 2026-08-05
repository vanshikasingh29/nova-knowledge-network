import {Router} from "express";

import {databaseTest} from "../controllers/database.controller";


const router = Router();


router.get(
"/database",
databaseTest
);


export default router;