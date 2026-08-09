import {
    KnowledgeNodeType,
    RelationshipType
} from "@prisma/client";

import { prisma } from "../config/prisma";


export interface CreateKnowledgeNodeInput {

    name: string;

    description?: string;

    type: KnowledgeNodeType;

    userId: string;

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
                input.userId,

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

            targetNode: true,

            creator: {

                select: {

                    id: true,

                    name: true

                }

            }

        }

    });

}


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
            relationship => ({

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
            relationship => ({

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

            id: node.id,

            name: node.name,

            description:
                node.description,

            type: node.type

        },

        relationships: [

            ...outgoing,

            ...incoming

        ]

    };

}


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

        nodes: nodeCount,

        relationships:
            relationshipCount,

        nodesByType,

        relationshipsByType

    };

}