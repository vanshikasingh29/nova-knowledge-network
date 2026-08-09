import {
    KnowledgeNodeType,
    RelationshipType
} from "@prisma/client";

import { prisma } from "../config/prisma";

import {
    createContributionKnowledgeNode,
    createCategoryKnowledgeNode,
    createTagKnowledgeNode,
    linkContributionToCategory,
    linkContributionToTag,
    buildContributionGraph
} from "./knowledge-graph.service";


/*
|--------------------------------------------------------------------------
| Create the knowledge node for a contribution
|--------------------------------------------------------------------------
*/

export async function integrateContribution(
    contributionId: string,
    creatorId: string
) {

    const contribution =
        await prisma.knowledgeContribution.findUnique({

            where: {
                id: contributionId
            },

            include: {

                category: true,

                tags: {
                    include: {
                        tag: true
                    }
                },

                author: {
                    include: {
                        expertProfile: true
                    }
                }

            }

        });


    if (!contribution) {

        throw new Error(
            "Knowledge contribution not found"
        );

    }


    const graph =
        await buildContributionGraph(
            contributionId,
            creatorId
        );


    return graph;

}


/*
|--------------------------------------------------------------------------
| Rebuild contribution graph
|--------------------------------------------------------------------------
|
| Re-running this is intentionally safe.
| Existing nodes and relationships are reused
| through the unique constraints / upserts.
|--------------------------------------------------------------------------
*/

export async function rebuildContributionGraph(
    contributionId: string,
    creatorId: string
) {

    const contribution =
        await prisma.knowledgeContribution.findUnique({

            where: {
                id: contributionId
            }

        });


    if (!contribution) {

        throw new Error(
            "Knowledge contribution not found"
        );

    }


    return buildContributionGraph(
        contributionId,
        creatorId
    );

}


/*
|--------------------------------------------------------------------------
| Get contribution graph
|--------------------------------------------------------------------------
*/

export async function getContributionGraph(
    contributionId: string
) {

    const contribution =
        await prisma.knowledgeContribution.findUnique({

            where: {
                id: contributionId
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


    if (!contribution) {

        throw new Error(
            "Knowledge contribution not found"
        );

    }


    const contributionNode =
        await prisma.knowledgeNode.findFirst({

            where: {
                contributionId
            }

        });


    if (!contributionNode) {

        return {

            contribution,

            node: null,

            relationships: []

        };

    }


    const relationships =
        await prisma.knowledgeRelationship.findMany({

            where: {

                OR: [

                    {
                        sourceNodeId:
                            contributionNode.id
                    },

                    {
                        targetNodeId:
                            contributionNode.id
                    }

                ]

            },

            include: {

                sourceNode: true,

                targetNode: true

            }

        });


    return {

        contribution,

        node:
            contributionNode,

        relationships

    };

}


/*
|--------------------------------------------------------------------------
| Remove graph for a contribution
|--------------------------------------------------------------------------
|
| Used when a graph needs to be rebuilt from a clean state.
|--------------------------------------------------------------------------
*/

export async function removeContributionGraph(
    contributionId: string
) {

    const contributionNode =
        await prisma.knowledgeNode.findFirst({

            where: {
                contributionId
            }

        });


    if (!contributionNode) {

        return {

            deleted: false

        };

    }


    await prisma.knowledgeNode.delete({

        where: {
            id: contributionNode.id
        }

    });


    return {

        deleted: true,

        nodeId:
            contributionNode.id

    };

}


/*
|--------------------------------------------------------------------------
| Integrate a category
|--------------------------------------------------------------------------
*/

export async function integrateCategory(
    categoryId: string,
    creatorId: string
) {

    return createCategoryKnowledgeNode(
        categoryId,
        creatorId
    );

}


/*
|--------------------------------------------------------------------------
| Integrate a tag
|--------------------------------------------------------------------------
*/

export async function integrateTag(
    tagId: string,
    creatorId: string
) {

    return createTagKnowledgeNode(
        tagId,
        creatorId
    );

}


/*
|--------------------------------------------------------------------------
| Link contribution to category
|--------------------------------------------------------------------------
*/

export async function integrateContributionCategory(
    contributionId: string,
    categoryId: string,
    creatorId: string
) {

    return linkContributionToCategory(

        contributionId,

        categoryId,

        creatorId

    );

}


/*
|--------------------------------------------------------------------------
| Link contribution to tag
|--------------------------------------------------------------------------
*/

export async function integrateContributionTag(
    contributionId: string,
    tagId: string,
    creatorId: string
) {

    return linkContributionToTag(

        contributionId,

        tagId,

        creatorId

    );

}