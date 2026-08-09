import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    integrateContribution,
    rebuildContributionGraph,
    getContributionGraph,
    removeContributionGraph
} from "../services/knowledge-integration.service";


/*
|--------------------------------------------------------------------------
| Integrate contribution
|--------------------------------------------------------------------------
*/

export async function integrateContributionGraph(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const creatorId =
            (req as any).user.userId;


        const contributionId =
            req.params.contributionId;


        const graph =
            await integrateContribution(

                contributionId,

                creatorId

            );


        return res.status(201).json({

            success: true,

            message:
                "Contribution integrated into knowledge graph",

            graph

        });

    } catch (error) {

        next(error);

    }

}


/*
|--------------------------------------------------------------------------
| Rebuild contribution graph
|--------------------------------------------------------------------------
*/

export async function rebuildGraph(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const creatorId =
            (req as any).user.userId;


        const contributionId =
            req.params.contributionId;


        const graph =
            await rebuildContributionGraph(

                contributionId,

                creatorId

            );


        return res.status(200).json({

            success: true,

            message:
                "Contribution knowledge graph rebuilt",

            graph

        });

    } catch (error) {

        next(error);

    }

}


/*
|--------------------------------------------------------------------------
| Get contribution graph
|--------------------------------------------------------------------------
*/

export async function getGraph(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const contributionId =
            req.params.contributionId;


        const graph =
            await getContributionGraph(

                contributionId

            );


        return res.status(200).json({

            success: true,

            graph

        });

    } catch (error) {

        next(error);

    }

}


/*
|--------------------------------------------------------------------------
| Remove contribution graph
|--------------------------------------------------------------------------
*/

export async function removeGraph(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const contributionId =
            req.params.contributionId;


        const result =
            await removeContributionGraph(

                contributionId

            );


        return res.status(200).json({

            success: true,

            message:
                "Contribution graph removed",

            result

        });

    } catch (error) {

        next(error);

    }

}