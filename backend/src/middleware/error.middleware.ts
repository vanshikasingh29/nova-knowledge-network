import {
    Request,
    Response,
    NextFunction
} from "express";

import { ApiError } from "../errors/api-error";


export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {

    console.error(error);


    if (error instanceof ApiError) {

        return res.status(
            error.statusCode
        ).json({

            success: false,

            error: {
                message: error.message
            }

        });

    }


    return res.status(500).json({

        success: false,

        error: {
            message:
                "Internal server error"
        }

    });

}