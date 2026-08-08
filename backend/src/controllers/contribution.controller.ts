import { Response } from "express";

import { prisma } from "../config/prisma";

import {
    AuthenticatedRequest
} from "../middleware/auth.middleware";


export async function createContribution(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const {
            title,
            topic,
            experience,
            lesson
        } = req.body;


        if (
            !title ||
            !topic ||
            !experience ||
            !lesson
        ) {

            return res.status(400).json({
                message:
                    "Title, topic, experience and lesson are required"
            });

        }


        const contribution =
            await prisma.knowledgeContribution.create({

                data: {

                    title,

                    topic,

                    experience,

                    lesson,

                    authorId: req.userId

                }

            });


        return res.status(201).json({
            contribution
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to create knowledge contribution"
        });

    }

}


export async function getMyContributions(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const contributions =
            await prisma.knowledgeContribution.findMany({

                where: {
                    authorId: req.userId
                },

                orderBy: {
                    createdAt: "desc"
                }

            });


        return res.status(200).json({
            contributions
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to retrieve contributions"
        });

    }

}


export async function getContribution(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const contribution =
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id: req.params.id,

                    authorId: req.userId

                }

            });


        if (!contribution) {

            return res.status(404).json({
                message:
                    "Knowledge contribution not found"
            });

        }


        return res.status(200).json({
            contribution
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to retrieve contribution"
        });

    }

}


export async function updateContribution(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const existingContribution =
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id: req.params.id,

                    authorId: req.userId

                }

            });


        if (!existingContribution) {

            return res.status(404).json({
                message:
                    "Knowledge contribution not found"
            });

        }


        const {
            title,
            topic,
            experience,
            lesson
        } = req.body;


        const contribution =
            await prisma.knowledgeContribution.update({

                where: {
                    id: existingContribution.id
                },

                data: {

                    ...(title !== undefined && {
                        title
                    }),

                    ...(topic !== undefined && {
                        topic
                    }),

                    ...(experience !== undefined && {
                        experience
                    }),

                    ...(lesson !== undefined && {
                        lesson
                    })

                }

            });


        return res.status(200).json({
            contribution
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to update contribution"
        });

    }

}


export async function deleteContribution(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const existingContribution =
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id: req.params.id,

                    authorId: req.userId

                }

            });


        if (!existingContribution) {

            return res.status(404).json({
                message:
                    "Knowledge contribution not found"
            });

        }


        await prisma.knowledgeContribution.delete({

            where: {
                id: existingContribution.id
            }

        });


        return res.status(200).json({
            message:
                "Knowledge contribution deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to delete contribution"
        });

    }

}