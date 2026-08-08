import { Request, Response } from "express";

import { prisma } from "../config/prisma";

import {
    AuthenticatedRequest
} from "../middleware/auth.middleware";


export async function createExpertProfile(
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
            field,
            yearsExperience,
            biography,
            organisation,
            location
        } = req.body;


        if (
            !field ||
            yearsExperience === undefined ||
            !biography
        ) {

            return res.status(400).json({
                message:
                    "Field, years of experience and biography are required"
            });

        }


        const existing =
            await prisma.expertProfile.findUnique({

                where: {
                    userId: req.userId
                }

            });


        if (existing) {

            return res.status(409).json({
                message:
                    "Expert profile already exists"
            });

        }


        const profile =
            await prisma.expertProfile.create({

                data: {

                    field,

                    yearsExperience:
                        Number(yearsExperience),

                    biography,

                    organisation:
                        organisation || null,

                    location:
                        location || null,

                    userId:
                        req.userId

                }

            });


        return res.status(201).json({
            profile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to create expert profile"
        });

    }

}


export async function getMyExpertProfile(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }


        const profile =
            await prisma.expertProfile.findUnique({

                where: {
                    userId:
                        req.userId
                }

            });


        if (!profile) {

            return res.status(404).json({
                message:
                    "Expert profile not found"
            });

        }


        return res.status(200).json({
            profile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to retrieve expert profile"
        });

    }

}


export async function updateExpertProfile(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }


        const existing =
            await prisma.expertProfile.findUnique({

                where: {
                    userId:
                        req.userId
                }

            });


        if (!existing) {

            return res.status(404).json({
                message:
                    "Expert profile not found"
            });

        }


        const {
            field,
            yearsExperience,
            biography,
            organisation,
            location
        } = req.body;


        const profile =
            await prisma.expertProfile.update({

                where: {
                    id:
                        existing.id
                },

                data: {

                    ...(field !== undefined && {
                        field
                    }),

                    ...(yearsExperience !== undefined && {
                        yearsExperience:
                            Number(yearsExperience)
                    }),

                    ...(biography !== undefined && {
                        biography
                    }),

                    ...(organisation !== undefined && {
                        organisation:
                            organisation || null
                    }),

                    ...(location !== undefined && {
                        location:
                            location || null
                    })

                }

            });


        return res.status(200).json({
            profile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to update expert profile"
        });

    }

}


export async function requestVerification(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        if (!req.userId) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }


        const profile =
            await prisma.expertProfile.findUnique({

                where: {
                    userId:
                        req.userId
                }

            });


        if (!profile) {

            return res.status(404).json({
                message:
                    "Expert profile not found"
            });

        }


        const updated =
            await prisma.expertProfile.update({

                where: {
                    id:
                        profile.id
                },

                data: {

                    verificationStatus:
                        "PENDING"

                }

            });


        return res.status(200).json({
            profile: updated
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Unable to request verification"
        });

    }

}