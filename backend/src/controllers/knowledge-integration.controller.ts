import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    syncContributionNode,
    syncCategoryNode,
    syncTagNode,
    synchroniseContributionGraph
} from "../services/knowledge-integration.service";


export async function synchroniseContribution(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user.userId;

        const result =
            await synchroniseContributionGraph(
                req.params.id,
                userId
            );


        return res.status(200).json({

            success: true,

            graph: result

        });

    } catch (error) {

        next(error);

    }

}


export async function synchroniseContributionNode(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user.userId;

        const node =
            await syncContributionNode(
                req.params.id,
                userId
            );


        return res.status(200).json({

            success: true,

            node

        });

    } catch (error) {

        next(error);

    }

}


export async function synchroniseCategoryNode(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user.userId;

        const node =
            await syncCategoryNode(
                req.params.id,
                userId
            );


        return res.status(200).json({

            success: true,

            node

        });

    } catch (error) {

        next(error);

    }

}


export async function synchroniseTagNode(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user.userId;

        const node =
            await syncTagNode(
                req.params.id,
                userId
            );


        return res.status(200).json({

            success: true,

            node

        });

    } catch (error) {

        next(error);

    }

}