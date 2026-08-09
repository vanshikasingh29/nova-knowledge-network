import {
    KnowledgeNodeType,
    RelationshipType
} from "@prisma/client";

import { prisma } from "../config/prisma";


export interface CreateKnowledgeNodeInput {
    name: string;
    description: string;
    type: KnowledgeNodeType;
    creatorId: string;
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


export interface SearchKnowledgeOptions {
    query?: string;
    type?: KnowledgeNodeType;
    limit?: number;
}


export async function createKnowledgeNode(
    input: CreateKnowledgeNodeInput
) {
    return prisma.knowledgeNode.create({
        data: {
            name: input.name,
            description: input.description,
            type: input.type,
            userId: input.creatorId,
            contributionId: input.contributionId ?? null
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
                    topic: true
                }
            }
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
            sourceNodeId: input.sourceNodeId,
            targetNodeId: input.targetNodeId,
            type: input.type,
            description: input.description ?? null,
            creatorId: input.creatorId,
            contributionId:
                input.contributionId ?? null
        },
        include: {
            sourceNode: true,
            targetNode: true
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
            (relationship) => ({
                relationshipId:
                    relationship.id,
                relationshipType:
                    relationship.type,
                direction:
                    "outgoing" as const,
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
                    "incoming" as const,
                node:
                    relationship.sourceNode
            })
        );

    return {
        node: {
            id: node.id,
            name: node.name,
            description: node.description,
            type: node.type
        },
        relationships: [
            ...outgoing,
            ...incoming
        ]
    };
}


export async function searchKnowledgeNodes(
    options: SearchKnowledgeOptions
) {
    const {
        query,
        type,
        limit = 25
    } = options;

    return prisma.knowledgeNode.findMany({
        where: {
            ...(type
                ? {
                    type
                }
                : {}),
            ...(query
                ? {
                    OR: [
                        {
                            name: {
                                contains:
                                    query,
                                mode:
                                    "insensitive"
                            }
                        },
                        {
                            description: {
                                contains:
                                    query,
                                mode:
                                    "insensitive"
                            }
                        }
                    ]
                }
                : {})
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
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
        },
        orderBy: {
            name: "asc"
        },
        take: Math.min(limit, 100)
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

    const [
        nodesByType,
        relationshipsByType
    ] = await Promise.all([
        prisma.knowledgeNode.groupBy({
            by: ["type"],
            _count: {
                _all: true
            }
        }),
        prisma.knowledgeRelationship.groupBy({
            by: ["type"],
            _count: {
                _all: true
            }
        })
    ]);

    return {
        nodes: nodeCount,
        relationships: relationshipCount,
        nodesByType,
        relationshipsByType
    };
}


export async function getGraphOverview() {
    const [
        nodes,
        relationships
    ] = await Promise.all([
        prisma.knowledgeNode.findMany({
            select: {
                id: true,
                name: true,
                type: true
            },
            orderBy: {
                name: "asc"
            }
        }),
        prisma.knowledgeRelationship.findMany({
            select: {
                id: true,
                sourceNodeId: true,
                targetNodeId: true,
                type: true,
                description: true
            }
        })
    ]);

    return {
        nodes,
        relationships
    };
}


export async function getNeighbourhood(
    nodeId: string,
    depth = 1
) {
    const startNode =
        await prisma.knowledgeNode.findUnique({
            where: {
                id: nodeId
            },
            select: {
                id: true,
                name: true,
                description: true,
                type: true
            }
        });

    if (!startNode) {
        return null;
    }

    const visited = new Set<string>([
        nodeId
    ]);

    let frontier = [nodeId];

    const discoveredNodes = [
        startNode
    ];

    const discoveredRelationships: Array<{
        id: string;
        sourceNodeId: string;
        targetNodeId: string;
        type: RelationshipType;
        description: string | null;
    }> = [];

    const safeDepth =
        Math.min(Math.max(depth, 1), 3);

    for (
        let level = 0;
        level < safeDepth;
        level++
    ) {
        if (frontier.length === 0) {
            break;
        }

        const relationships =
            await prisma.knowledgeRelationship.findMany({
                where: {
                    OR: [
                        {
                            sourceNodeId: {
                                in: frontier
                            }
                        },
                        {
                            targetNodeId: {
                                in: frontier
                            }
                        }
                    ]
                }
            });

        const nextFrontier: string[] = [];

        for (
            const relationship of relationships
        ) {
            if (
                !discoveredRelationships.some(
                    existing =>
                        existing.id ===
                        relationship.id
                )
            ) {
                discoveredRelationships.push({
                    id:
                        relationship.id,
                    sourceNodeId:
                        relationship.sourceNodeId,
                    targetNodeId:
                        relationship.targetNodeId,
                    type:
                        relationship.type,
                    description:
                        relationship.description
                });
            }

            const connectedId =
                frontier.includes(
                    relationship.sourceNodeId
                )
                    ? relationship.targetNodeId
                    : relationship.sourceNodeId;

            if (
                !visited.has(connectedId)
            ) {
                visited.add(connectedId);
                nextFrontier.push(
                    connectedId
                );
            }
        }

        if (
            nextFrontier.length > 0
        ) {
            const nodes =
                await prisma.knowledgeNode.findMany({
                    where: {
                        id: {
                            in: nextFrontier
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        type: true
                    }
                });

            discoveredNodes.push(
                ...nodes
            );
        }

        frontier = nextFrontier;
    }

    return {
        root: startNode,
        depth: safeDepth,
        nodes: discoveredNodes,
        relationships:
            discoveredRelationships
    };
}