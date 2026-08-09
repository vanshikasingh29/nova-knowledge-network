import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    buildContributionGraph,
    createCategoryKnowledgeNode,
    createTagKnowledgeNode
} from "../services/knowledge-graph.service";


export async function buildContributionGraphController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId =
            (req as any).user.userId;

        const graph =
            await buildContributionGraph(
                req.params.id,
                userId
            );

        return res.status(200).json({
            success: true,
            graph
        });
    } catch (error) {
        next(error);
    }
}


export async function createCategoryNodeController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId =
            (req as any).user.userId;

        const node =
            await createCategoryKnowledgeNode(
                req.params.id,
                userId
            );

        return res.status(201).json({
            success: true,
            node
        });
    } catch (error) {
        next(error);
    }
}


export async function createTagNodeController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId =
            (req as any).user.userId;

        const node =
            await createTagKnowledgeNode(
                req.params.id,
                userId
            );

        return res.status(201).json({
            success: true,
            node
        });
    } catch (error) {
        next(error);
    }
}