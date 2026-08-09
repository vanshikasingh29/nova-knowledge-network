import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    getNeo4jHealth
} from "../services/neo4j.service";

import {
    synchroniseKnowledgeGraph,
    getNeo4jGraphOverview,
    getNeo4jNodes,
    getNeo4jNeighbourhood,
    searchNeo4jGraph,
    findKnowledgePath,
    getNeo4jGraphStats
} from "../services/neo4j-graph.service";


export async function neo4jHealth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const health =
            await getNeo4jHealth();

        return res.status(200).json({
            success: true,
            neo4j: health
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Synchronise PostgreSQL → Neo4j
 */
export async function syncKnowledgeGraph(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result =
            await synchroniseKnowledgeGraph();

        return res.status(200).json({
            success: true,
            message:
                "Knowledge graph synchronised successfully",
            sync: result
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Graph overview
 */
export async function graphOverview(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const overview =
            await getNeo4jGraphOverview();

        return res.status(200).json({
            success: true,
            graph: overview
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Graph nodes
 */
export async function graphNodes(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const requestedLimit =
            Number(req.query.limit ?? 100);

        const limit =
            Math.min(
                Math.max(requestedLimit, 1),
                500
            );

        const nodes =
            await getNeo4jNodes(limit);

        return res.status(200).json({
            success: true,
            count: nodes.length,
            nodes
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Node neighbourhood
 */
export async function graphNeighbourhood(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const nodeId =
            req.params.id;

        const relationships =
            await getNeo4jNeighbourhood(
                nodeId
            );

        return res.status(200).json({
            success: true,
            nodeId,
            count: relationships.length,
            relationships
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Graph search
 */
export async function graphSearch(
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
            await searchNeo4jGraph(
                query
            );

        return res.status(200).json({
            success: true,
            query,
            count: nodes.length,
            nodes
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Shortest knowledge path
 */
export async function graphPath(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const sourceId =
            String(
                req.query.sourceId ?? ""
            ).trim();

        const targetId =
            String(
                req.query.targetId ?? ""
            ).trim();

        if (!sourceId || !targetId) {
            return res.status(400).json({
                success: false,
                error: {
                    message:
                        "sourceId and targetId are required"
                }
            });
        }

        if (sourceId === targetId) {
            return res.status(400).json({
                success: false,
                error: {
                    message:
                        "sourceId and targetId must be different"
                }
            });
        }

        const path =
            await findKnowledgePath(
                sourceId,
                targetId
            );

        if (!path) {
            return res.status(404).json({
                success: false,
                error: {
                    message:
                        "No path found between the specified nodes"
                }
            });
        }

        return res.status(200).json({
            success: true,
            sourceId,
            targetId,
            path
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Graph statistics
 */
export async function graphStats(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const stats =
            await getNeo4jGraphStats();

        return res.status(200).json({
            success: true,
            graph: stats
        });

    } catch (error) {
        next(error);
    }
}