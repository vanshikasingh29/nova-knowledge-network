import { Request, Response } from "express";

import { prisma } from "../config/prisma";


export async function searchExperts(
    req: Request,
    res: Response
) {

    try {

        const field =
            typeof req.query.field === "string"
                ? req.query.field.trim()
                : "";


        const experts =
            await prisma.expertProfile.findMany({

                where: {

                    verificationStatus:
                        "VERIFIED",

                    ...(field && {

                        field: {

                            contains:
                                field,

                            mode:
                                "insensitive"

                        }

                    })

                },

                orderBy: {

                    yearsExperience:
                        "desc"

                },

                select: {

                    id: true,

                    field: true,

                    yearsExperience:
                        true,

                    biography: true,

                    organisation:
                        true,

                    location:
                        true,

                    verificationStatus:
                        true,

                    user: {

                        select: {

                            id: true,

                            name: true

                        }

                    }

                }

            });


        return res.status(200).json({

            count:
                experts.length,

            experts

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to search experts"

        });

    }

}