import { prisma } from "../config/prisma";
import {
    createContributionKnowledgeNode,
    createCategoryKnowledgeNode,
    createTagKnowledgeNode,
    linkContributionToCategory,
    linkContributionToTag,
    buildContributionGraph
} from "./knowledge-graph.service";


/**
 * Create or retrieve the knowledge node associated
 * with a contribution.
 */
export async function syncContributionNode(
    contributionId: string,
    creatorId: string
) {

    return createContributionKnowledgeNode(
        contributionId,
        creatorId
    );
}


/**
 * Create or retrieve the knowledge node associated
 * with a category.
 */
export async function syncCategoryNode(
    categoryId: string,
    creatorId: string
) {

    return createCategoryKnowledgeNode(
        categoryId,
        creatorId
    );
}


/**
 * Create or retrieve the knowledge node associated
 * with a tag.
 */
export async function syncTagNode(
    tagId: string,
    creatorId: string
) {

    return createTagKnowledgeNode(
        tagId,
        creatorId
    );
}


/**
 * Synchronise all graph relationships belonging
 * to a contribution.
 */
export async function syncContributionRelationships(
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
                }

            }

        });


    if (!contribution) {

        throw new Error(
            "Knowledge contribution not found"
        );

    }


    const contributionNode =
        await createContributionKnowledgeNode(
            contributionId,
            creatorId
        );


    let categoryRelationship = null;


    if (contribution.category) {

        categoryRelationship =
            await linkContributionToCategory(
                contributionId,
                contribution.category.id,
                creatorId
            );

    }


    const tagRelationships = [];


    for (
        const contributionTag
        of contribution.tags
    ) {

        const relationship =
            await linkContributionToTag(
                contributionId,
                contributionTag.tagId,
                creatorId
            );


        tagRelationships.push(
            relationship
        );

    }


    return {

        contributionNode,

        categoryRelationship,

        tagRelationships

    };

}


/**
 * Build the complete graph representation
 * for a contribution.
 *
 * This is the main integration operation
 * used by the application.
 */
export async function synchroniseContributionGraph(
    contributionId: string,
    creatorId: string
) {

    await syncContributionRelationships(
        contributionId,
        creatorId
    );


    return buildContributionGraph(
        contributionId,
        creatorId
    );

}