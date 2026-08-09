import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    createKnowledgeNode,
    getKnowledgeNode,
    createKnowledgeRelationship,
    getRelatedKnowledge,
    searchKnowledgeNodes,
    getKnowledgeGraphStats
} from "../services/knowledge-graph.service";

import {
    KnowledgeNodeType,
    RelationshipType
} from "@prisma/client";


export async function createNode(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user.userId;


        const node =
            await createKnowledgeNode({

                name:
                    req.body.name,

                description:
                    req.body.description,

                type:
                    req.body.type as KnowledgeNodeType,

                userId,

                contributionId:
                    req.body.contributionId

            });


        return res.status(201).json({

            success: true,

            node

        });

    } catch (error) {

        next(error);

    }

}


export async function getNode(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const node =
            await getKnowledgeNode(
                req.params.id
            );


        if (!node) {

            return res.status(404).json({

                success: false,

                error: {

                    message:
                        "Knowledge node not found"

                }

            });

        }


        return res.status(200).json({

            success: true,

            node

        });

    } catch (error) {

        next(error);

    }

}


export async function createRelationship(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const creatorId =
            (req as any).user.userId;


        const relationship =
            await createKnowledgeRelationship({

                sourceNodeId:
                    req.body.sourceNodeId,

                targetNodeId:
                    req.body.targetNodeId,

                type:
                    req.body.type as RelationshipType,

                description:
                    req.body.description,

                creatorId

            });


        return res.status(201).json({

            success: true,

            relationship

        });

    } catch (error) {

        next(error);

    }

}


export async function getRelatedNodes(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const result =
            await getRelatedKnowledge(
                req.params.id
            );


        if (!result) {

            return res.status(404).json({

                success: false,

                error: {

                    message:
                        "Knowledge node not found"

                }

            });

        }


        return res.status(200).json({

            success: true,

            ...result

        });

    } catch (error) {

        next(error);

    }

}


export async function searchNodes(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const query =
            String(
                req.query.q ?? ""
            ).trim();


        if (!query) {

            return res.status(400).json({

                success: false,

                error: {

                    message:
                        "Search query is required"

                }

            });

        }


        const nodes =
            await searchKnowledgeNodes(
                query
            );


        return res.status(200).json({

            success: true,

            count:
                nodes.length,

            nodes

        });

    } catch (error) {

        next(error);

    }

}


export async function graphStats(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const stats =
            await getKnowledgeGraphStats();


        return res.status(200).json({

            success: true,

            graph:
                stats

        });

    } catch (error) {

        next(error);

    }

}