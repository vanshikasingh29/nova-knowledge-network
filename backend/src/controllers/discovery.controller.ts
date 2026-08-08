import { Request, Response } from "express";

import { prisma } from "../config/prisma";


export async function getKnowledgeOverview(
    req: Request,
    res: Response
) {

    try {

        const [
            categories,
            tags,
            experts,
            publishedKnowledge
        ] = await Promise.all([

            prisma.knowledgeCategory.count(),

            prisma.knowledgeTag.count(),

            prisma.expertProfile.count(),

            prisma.knowledgeContribution.count({

                where: {

                    status:
                        "PUBLISHED"

                }

            })

        ]);


        return res.status(200).json({

            knowledgeNetwork: {

                categories,

                tags,

                experts,

                publishedKnowledge

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to retrieve knowledge overview"

        });

    }

}