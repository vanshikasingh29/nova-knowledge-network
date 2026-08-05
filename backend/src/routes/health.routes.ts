import { Router } from "express";


const router = Router();


router.get("/health", (req, res)=>{


    res.json({

        status:"healthy",

        project:"NOVA",

        timestamp:new Date()

    });


});


export default router;