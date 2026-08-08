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
            lesson,
            categoryId,
            tagIds
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


        if (categoryId) {

            const category =
                await prisma.knowledgeCategory.findUnique({
                    where: {
                        id: categoryId
                    }
                });


            if (!category) {

                return res.status(404).json({
                    message: "Category not found"
                });

            }

        }


        const contribution =
            await prisma.knowledgeContribution.create({

                data: {

                    title,

                    topic,

                    experience,

                    lesson,

                    authorId: req.userId,

                    categoryId:
                        categoryId || null,

                    tags: {

                        create:
                            Array.isArray(tagIds)
                                ? tagIds.map(
                                    (tagId: string) => ({
                                        tag: {
                                            connect: {
                                                id: tagId
                                            }
                                        }
                                    })
                                )
                                : []

                    }

                },

                include: {

                    category: true,

                    tags: {

                        include: {
                            tag: true
                        }

                    },

                    author: {

                        select: {

                            id: true,

                            name: true

                        }

                    }

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

                    authorId:
                        req.userId

                },

                orderBy: {

                    createdAt:
                        "desc"

                },

                include: {

                    category: true,

                    tags: {

                        include: {
                            tag: true
                        }

                    }

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


export async function searchContributions(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";


        const category =
            typeof req.query.category === "string"
                ? req.query.category.trim()
                : "";


        const tag =
            typeof req.query.tag === "string"
                ? req.query.tag.trim().toLowerCase()
                : "";


        const contributions =
            await prisma.knowledgeContribution.findMany({

                where: {

                    status: "PUBLISHED",

                    AND: [

                        search
                            ? {

                                OR: [

                                    {
                                        title: {
                                            contains:
                                                search,
                                            mode:
                                                "insensitive"
                                        }
                                    },

                                    {
                                        topic: {
                                            contains:
                                                search,
                                            mode:
                                                "insensitive"
                                        }
                                    },

                                    {
                                        experience: {
                                            contains:
                                                search,
                                            mode:
                                                "insensitive"
                                        }
                                    },

                                    {
                                        lesson: {
                                            contains:
                                                search,
                                            mode:
                                                "insensitive"
                                        }
                                    }

                                ]

                            }
                            : {},


                        category
                            ? {

                                category: {

                                    name: {

                                        equals:
                                            category,

                                        mode:
                                            "insensitive"

                                    }

                                }

                            }
                            : {},


                        tag
                            ? {

                                tags: {

                                    some: {

                                        tag: {

                                            name: {

                                                equals:
                                                    tag,

                                                mode:
                                                    "insensitive"

                                            }

                                        }

                                    }

                                }

                            }
                            : {}

                    ]

                },

                orderBy: {

                    createdAt:
                        "desc"

                },

                include: {

                    category: true,

                    tags: {

                        include: {
                            tag: true
                        }

                    },

                    author: {

                        select: {

                            id: true,

                            name: true,

                            expertProfile: {

                                select: {

                                    field: true,

                                    yearsExperience:
                                        true,

                                    organisation:
                                        true

                                }

                            }

                        }

                    }

                }

            });


        return res.status(200).json({

            count:
                contributions.length,

            contributions

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to search knowledge"

        });

    }

}


export async function publishContribution(
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
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id:
                        req.params.id,

                    authorId:
                        req.userId

                }

            });


        if (!existing) {

            return res.status(404).json({

                message:
                    "Knowledge contribution not found"

            });

        }


        const contribution =
            await prisma.knowledgeContribution.update({

                where: {

                    id:
                        existing.id

                },

                data: {

                    status:
                        "PUBLISHED"

                }

            });


        return res.status(200).json({

            contribution

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to publish contribution"

        });

    }

}


export async function getContribution(
    req: AuthenticatedRequest,
    res: Response
) {

    try {

        const contribution =
            await prisma.knowledgeContribution.findUnique({

                where: {

                    id:
                        req.params.id

                },

                include: {

                    category: true,

                    tags: {

                        include: {
                            tag: true
                        }

                    },

                    author: {

                        select: {

                            id: true,

                            name: true,

                            expertProfile: true

                        }

                    }

                }

            });


        if (
            !contribution ||
            contribution.status !== "PUBLISHED"
        ) {

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

                message:
                    "Authentication required"

            });

        }


        const existing =
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id:
                        req.params.id,

                    authorId:
                        req.userId

                }

            });


        if (!existing) {

            return res.status(404).json({

                message:
                    "Knowledge contribution not found"

            });

        }


        const {

            title,
            topic,
            experience,
            lesson,
            categoryId

        } = req.body;


        const contribution =
            await prisma.knowledgeContribution.update({

                where: {

                    id:
                        existing.id

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
                    }),

                    ...(categoryId !== undefined && {
                        categoryId:
                            categoryId || null
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

                message:
                    "Authentication required"

            });

        }


        const existing =
            await prisma.knowledgeContribution.findFirst({

                where: {

                    id:
                        req.params.id,

                    authorId:
                        req.userId

                }

            });


        if (!existing) {

            return res.status(404).json({

                message:
                    "Knowledge contribution not found"

            });

        }


        await prisma.knowledgeContribution.delete({

            where: {

                id:
                    existing.id

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