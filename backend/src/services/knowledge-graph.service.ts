import {
    KnowledgeNodeType,
    RelationshipType
} from "@prisma/client";

import { prisma } from "../config/prisma";


export interface CreateKnowledgeNodeInput {

    name: string;

    description?: string;

    type: KnowledgeNodeType;

    userId?: string;

    contributionId?: string;

}


export interface CreateKnowledgeRelationshipInput {

    sourceNodeId: string;

    targetNodeId: string;

    type: RelationshipType;

    description?: string;

    creatorId: string;

    contributionId?: string;

}


/*
|--------------------------------------------------------------------------
| Knowledge Nodes
|--------------------------------------------------------------------------
*/

export async function createKnowledgeNode(
    input: CreateKnowledgeNodeInput
) {

    return prisma.knowledgeNode.create({

        data: {

            name: input.name,

            description:
                input.description ?? null,

            type: input.type,

            userId:
                input.userId ?? null,

            contributionId:
                input.contributionId ?? null

        }

    });

}


export async function getKnowledgeNode(
    nodeId: string
) {

    return prisma.knowledgeNode.findUnique({

        where: {

            id: nodeId

        },

        include: {

            user: {

                select: {

                    id: true,

                    name: true

                }

            },

            contribution: {

                select: {

                    id: true,

                    title: true,

                    topic: true,

                    status: true

                }

            },

            outgoingRelationships: {

                include: {

                    targetNode: true

                }

            },

            incomingRelationships: {

                include: {

                    sourceNode: true

                }

            }

        }

    });

}


/*
|--------------------------------------------------------------------------
| Knowledge Relationships
|--------------------------------------------------------------------------
*/

export async function createKnowledgeRelationship(
    input: CreateKnowledgeRelationshipInput
) {

    if (
        input.sourceNodeId ===
        input.targetNodeId
    ) {

        throw new Error(
            "A knowledge node cannot be related to itself"
        );

    }


    return prisma.knowledgeRelationship.create({

        data: {

            sourceNodeId:
                input.sourceNodeId,

            targetNodeId:
                input.targetNodeId,

            type:
                input.type,

            description:
                input.description ?? null,

            creatorId:
                input.creatorId,

            contributionId:
                input.contributionId ?? null

        },

        include: {

            sourceNode: true,

            targetNode: true

        }

    });

}


/*
|--------------------------------------------------------------------------
| Related Knowledge
|--------------------------------------------------------------------------
*/

export async function getRelatedKnowledge(
    nodeId: string
) {

    const node =
        await prisma.knowledgeNode.findUnique({

            where: {

                id: nodeId

            },

            include: {

                outgoingRelationships: {

                    include: {

                        targetNode: true

                    }

                },

                incomingRelationships: {

                    include: {

                        sourceNode: true

                    }

                }

            }

        });


    if (!node) {

        return null;

    }


    const outgoing =
        node.outgoingRelationships.map(
            (relationship) => ({

                relationshipId:
                    relationship.id,

                relationshipType:
                    relationship.type,

                direction:
                    "outgoing",

                node:
                    relationship.targetNode

            })
        );


    const incoming =
        node.incomingRelationships.map(
            (relationship) => ({

                relationshipId:
                    relationship.id,

                relationshipType:
                    relationship.type,

                direction:
                    "incoming",

                node:
                    relationship.sourceNode

            })
        );


    return {

        node: {

            id:
                node.id,

            name:
                node.name,

            description:
                node.description,

            type:
                node.type

        },

        relationships: [

            ...outgoing,

            ...incoming

        ]

    };

}


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export async function searchKnowledgeNodes(
    query: string
) {

    return prisma.knowledgeNode.findMany({

        where: {

            OR: [

                {

                    name: {

                        contains: query,

                        mode: "insensitive"

                    }

                },

                {

                    description: {

                        contains: query,

                        mode: "insensitive"

                    }

                }

            ]

        },

        include: {

            outgoingRelationships: {

                include: {

                    targetNode: true

                }

            }

        },

        orderBy: {

            name: "asc"

        }

    });

}


/*
|--------------------------------------------------------------------------
| Graph Statistics
|--------------------------------------------------------------------------
*/

export async function getKnowledgeGraphStats() {

    const [

        nodeCount,

        relationshipCount

    ] = await Promise.all([

        prisma.knowledgeNode.count(),

        prisma.knowledgeRelationship.count()

    ]);


    const nodesByType =
        await prisma.knowledgeNode.groupBy({

            by: [

                "type"

            ],

            _count: {

                _all: true

            }

        });


    const relationshipsByType =
        await prisma.knowledgeRelationship.groupBy({

            by: [

                "type"

            ],

            _count: {

                _all: true

            }

        });


    return {

        nodes:
            nodeCount,

        relationships:
            relationshipCount,

        nodesByType,

        relationshipsByType

    };

}


/*
|--------------------------------------------------------------------------
| Contribution → Knowledge Graph Integration
|--------------------------------------------------------------------------
*/

export async function createContributionKnowledgeNode(
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


    const existingNode =
        await prisma.knowledgeNode.findFirst({

            where: {

                contributionId

            }

        });


    if (existingNode) {

        return existingNode;

    }


    return prisma.knowledgeNode.create({

        data: {

            name:
                contribution.title,

            description:
                contribution.lesson,

            type:
                KnowledgeNodeType.CONTRIBUTION,

            userId:
                creatorId,

            contributionId

        }

    });

}


/*
|--------------------------------------------------------------------------
| Category → Knowledge Graph
|--------------------------------------------------------------------------
*/

export async function createCategoryKnowledgeNode(
    categoryId: string,
    creatorId: string
) {

    const category =
        await prisma.knowledgeCategory.findUnique({

            where: {

                id: categoryId

            }

        });


    if (!category) {

        throw new Error(
            "Knowledge category not found"
        );

    }


    const existingNode =
        await prisma.knowledgeNode.findFirst({

            where: {

                name:
                    category.name,

                type:
                    KnowledgeNodeType.CATEGORY

            }

        });


    if (existingNode) {

        return existingNode;

    }


    return prisma.knowledgeNode.create({

        data: {

            name:
                category.name,

            description:
                category.description ??
                `Knowledge category: ${category.name}`,

            type:
                KnowledgeNodeType.CATEGORY,

            userId:
                creatorId

        }

    });

}


/*
|--------------------------------------------------------------------------
| Tag → Knowledge Graph
|--------------------------------------------------------------------------
*/

export async function createTagKnowledgeNode(
    tagId: string,
    creatorId: string
) {

    const tag =
        await prisma.knowledgeTag.findUnique({

            where: {

                id: tagId

            }

        });


    if (!tag) {

        throw new Error(
            "Knowledge tag not found"
        );

    }


    const existingNode =
        await prisma.knowledgeNode.findFirst({

            where: {

                name:
                    tag.name,

                type:
                    KnowledgeNodeType.TAG

            }

        });


    if (existingNode) {

        return existingNode;

    }


    return prisma.knowledgeNode.create({

        data: {

            name:
                tag.name,

            description:
                `Knowledge tag: ${tag.name}`,

            type:
                KnowledgeNodeType.TAG,

            userId:
                creatorId

        }

    });

}


/*
|--------------------------------------------------------------------------
| Contribution → Category Relationship
|--------------------------------------------------------------------------
*/

export async function linkContributionToCategory(
    contributionId: string,
    categoryId: string,
    creatorId: string
) {

    const contributionNode =
        await createContributionKnowledgeNode(
            contributionId,
            creatorId
        );


    const categoryNode =
        await createCategoryKnowledgeNode(
            categoryId,
            creatorId
        );


    return prisma.knowledgeRelationship.upsert({

        where: {

            sourceNodeId_targetNodeId_type: {

                sourceNodeId:
                    contributionNode.id,

                targetNodeId:
                    categoryNode.id,

                type:
                    RelationshipType.BELONGS_TO

            }

        },

        update: {},

        create: {

            sourceNodeId:
                contributionNode.id,

            targetNodeId:
                categoryNode.id,

            type:
                RelationshipType.BELONGS_TO,

            creatorId,

            contributionId

        }

    });

}


/*
|--------------------------------------------------------------------------
| Contribution → Tag Relationship
|--------------------------------------------------------------------------
*/

export async function linkContributionToTag(
    contributionId: string,
    tagId: string,
    creatorId: string
) {

    const contributionNode =
        await createContributionKnowledgeNode(
            contributionId,
            creatorId
        );


    const tagNode =
        await createTagKnowledgeNode(
            tagId,
            creatorId
        );


    return prisma.knowledgeRelationship.upsert({

        where: {

            sourceNodeId_targetNodeId_type: {

                sourceNodeId:
                    contributionNode.id,

                targetNodeId:
                    tagNode.id,

                type:
                    RelationshipType.RELATED_TO

            }

        },

        update: {},

        create: {

            sourceNodeId:
                contributionNode.id,

            targetNodeId:
                tagNode.id,

            type:
                RelationshipType.RELATED_TO,

            creatorId,

            contributionId

        }

    });

}


/*
|--------------------------------------------------------------------------
| Build Complete Contribution Graph
|--------------------------------------------------------------------------
*/

export async function buildContributionGraph(
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


    const contributionNode =
        await createContributionKnowledgeNode(
            contributionId,
            creatorId
        );


    /*
    |--------------------------------------------------------------------------
    | Category relationship
    |--------------------------------------------------------------------------
    */

    if (contribution.category) {

        await linkContributionToCategory(

            contributionId,

            contribution.category.id,

            creatorId

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Tag relationships
    |--------------------------------------------------------------------------
    */

    for (
        const contributionTag
        of contribution.tags
    ) {

        await linkContributionToTag(

            contributionId,

            contributionTag.tagId,

            creatorId

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Author / Expert relationship
    |--------------------------------------------------------------------------
    */

    if (contribution.author.expertProfile) {

        const existingPersonNode =
            await prisma.knowledgeNode.findFirst({

                where: {

                    userId:
                        contribution.author.id,

                    type:
                        KnowledgeNodeType.PERSON

                }

            });


        const personNode =
            existingPersonNode ??

            await prisma.knowledgeNode.create({

                data: {

                    name:
                        contribution.author.name,

                    description:
                        contribution
                            .author
                            .expertProfile
                            .biography,

                    type:
                        KnowledgeNodeType.PERSON,

                    userId:
                        contribution.author.id

                }

            });


        await prisma.knowledgeRelationship.upsert({

            where: {

                sourceNodeId_targetNodeId_type: {

                    sourceNodeId:
                        personNode.id,

                    targetNodeId:
                        contributionNode.id,

                    type:
                        RelationshipType.DERIVED_FROM

                }

            },

            update: {},

            create: {

                sourceNodeId:
                    personNode.id,

                targetNodeId:
                    contributionNode.id,

                type:
                    RelationshipType.DERIVED_FROM,

                creatorId,

                contributionId

            }

        });

    }


    return getKnowledgeNode(

        contributionNode.id

    );

}