import { Response } from "express";

import { prisma } from "../config/prisma";

import {
    AuthenticatedRequest
} from "../middleware/auth.middleware";


export async function getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const user = await prisma.user.findUnique({

            where: {
                id: req.userId
            },

            select: {

                id: true,

                name: true,

                email: true,

                createdAt: true,

                expertProfile: true

            }

        });


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        return res.status(200).json({
            user
        });


    } catch (error) {

        console.error(error);


        return res.status(500).json({
            message: "Unable to retrieve user"
        });

    }

}