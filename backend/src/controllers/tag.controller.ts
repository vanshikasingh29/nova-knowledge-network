import { Request, Response } from "express";

import { prisma } from "../config/prisma";


export async function createTag(
    req: Request,
    res: Response
) {

    try {

        const {
            name
        } = req.body;


        if (!name) {

            return res.status(400).json({
                message: "Tag name is required"
            });

        }


        const normalisedName =
            name.trim().toLowerCase();


        const existing =
            await prisma.knowledgeTag.findUnique({
                where: {
                    name: normalisedName
                }
            });


        if (existing) {

            return res.status(409).json({
                message: "Tag already exists"
            });

        }


        const tag =
            await prisma.knowledgeTag.create({

                data: {
                    name: normalisedName
                }

            });


        return res.status(201).json({
            tag
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Unable to create tag"
        });

    }
}


export async function getTags(
    req: Request,
    res: Response
) {

    try {

        const tags =
            await prisma.knowledgeTag.findMany({

                orderBy: {
                    name: "asc"
                },

                include: {

                    _count: {
                        select: {
                            contributions: true
                        }
                    }

                }

            });


        return res.status(200).json({
            tags
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve tags"
        });

    }
}