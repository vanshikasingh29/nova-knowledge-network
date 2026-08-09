import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    getNeo4jHealth
} from "../services/neo4j.service";


export async function neo4jHealth(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const health =
            await getNeo4jHealth();


        return res.status(200).json({

            success: true,

            neo4j: health

        });

    } catch (error) {

        next(error);

    }

}