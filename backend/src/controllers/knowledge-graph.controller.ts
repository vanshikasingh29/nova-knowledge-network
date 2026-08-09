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
    getKnowledgeGraphStats,
    getGraphOverview,
    getNeighbourhood
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
                name: req.body.name,
                description:
                    req.body.description,
                type:
                    req.body.type as KnowledgeNodeType,
                creatorId:
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
        const userId =
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
                creatorId:
                    userId,
                contributionId:
                    req.body.contributionId
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

        const typeValue =
            req.query.type
                ? String(req.query.type)
                : undefined;

        const limit =
            req.query.limit
                ? Number(req.query.limit)
                : 25;

        const nodes =
            await searchKnowledgeNodes({
                query:
                    query || undefined,
                type:
                    typeValue as
                        | KnowledgeNodeType
                        | undefined,
                limit
            });

        return res.status(200).json({
            success: true,
            count: nodes.length,
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
            graph: stats
        });
    } catch (error) {
        next(error);
    }
}


export async function graphOverview(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const graph =
            await getGraphOverview();

        return res.status(200).json({
            success: true,
            graph
        });
    } catch (error) {
        next(error);
    }
}


export async function neighbourhood(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const depth =
            req.query.depth
                ? Number(req.query.depth)
                : 1;

        const result =
            await getNeighbourhood(
                req.params.id,
                depth
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