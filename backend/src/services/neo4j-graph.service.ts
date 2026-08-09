import neo4j from "neo4j-driver";

import {
    createNeo4jSession
} from "../config/neo4j";


/**
 * Convert a Neo4j node into a clean API object.
 */
function mapNode(node: any) {

    return {
        id:
            node.properties?.id ??
            node.elementId,

        elementId:
            node.elementId,

        labels:
            node.labels,

        properties:
            node.properties
    };

}


/**
 * Convert a Neo4j relationship into a clean API object.
 */
function mapRelationship(relationship: any) {

    return {
        id:
            relationship.properties?.id ??
            relationship.elementId,

        elementId:
            relationship.elementId,

        type:
            relationship.type,

        startNodeElementId:
            relationship.startNodeElementId,

        endNodeElementId:
            relationship.endNodeElementId,

        properties:
            relationship.properties
    };

}


/**
 * Synchronise the PostgreSQL knowledge model into Neo4j.
 *
 * This currently provides the graph-side synchronisation boundary.
 * The actual PostgreSQL → Neo4j mapping can be expanded as the
 * knowledge model grows.
 */
export async function synchroniseKnowledgeGraph() {

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH (n)
                RETURN count(n) AS nodeCount
                `
            );

        const nodeCount =
            result.records[0]
                ?.get("nodeCount")
                ?.toNumber?.() ??
            0;

        return {

            synchronised:
                true,

            nodeCount

        };

    } finally {

        await session.close();

    }

}


/**
 * Return a high-level overview of the Neo4j graph.
 */
export async function getNeo4jGraphOverview() {

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH (n)
                OPTIONAL MATCH (n)-[r]->()
                RETURN
                    count(DISTINCT n) AS nodeCount,
                    count(DISTINCT r) AS relationshipCount
                `
            );

        const record =
            result.records[0];

        return {

            nodeCount:
                record
                    ?.get("nodeCount")
                    ?.toNumber?.() ??
                0,

            relationshipCount:
                record
                    ?.get("relationshipCount")
                    ?.toNumber?.() ??
                0

        };

    } finally {

        await session.close();

    }

}


/**
 * Return graph nodes.
 *
 * IMPORTANT:
 * Neo4j integer parameters must be represented using
 * neo4j.int(), not a JavaScript floating-point number.
 */
export async function getNeo4jNodes(
    limit: number = 100
) {

    const safeLimit =
        Math.min(
            Math.max(
                Math.trunc(limit),
                1
            ),
            500
        );

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH (n)
                RETURN n
                LIMIT $limit
                `,
                {
                    limit:
                        neo4j.int(
                            safeLimit
                        )
                }
            );

        return result.records.map(
            record =>
                mapNode(
                    record.get("n")
                )
        );

    } finally {

        await session.close();

    }

}


/**
 * Return the neighbourhood of a node.
 */
export async function getNeo4jNeighbourhood(
    nodeId: string
) {

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH (n)
                WHERE
                    n.id = $nodeId
                    OR elementId(n) = $nodeId

                MATCH (n)-[r]-(connected)

                RETURN
                    n,
                    r,
                    connected
                `,
                {
                    nodeId
                }
            );

        return result.records.map(
            record => ({

                node:
                    mapNode(
                        record.get("n")
                    ),

                relationship:
                    mapRelationship(
                        record.get("r")
                    ),

                connected:
                    mapNode(
                        record.get("connected")
                    )

            })
        );

    } finally {

        await session.close();

    }

}


/**
 * Search nodes by ID, name, title or description.
 */
export async function searchNeo4jGraph(
    query: string
) {

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH (n)

                WHERE
                    toLower(
                        coalesce(
                            toString(n.id),
                            ""
                        )
                    )
                    CONTAINS toLower($query)

                    OR

                    toLower(
                        coalesce(
                            toString(n.name),
                            ""
                        )
                    )
                    CONTAINS toLower($query)

                    OR

                    toLower(
                        coalesce(
                            toString(n.title),
                            ""
                        )
                    )
                    CONTAINS toLower($query)

                    OR

                    toLower(
                        coalesce(
                            toString(n.description),
                            ""
                        )
                    )
                    CONTAINS toLower($query)

                RETURN n

                LIMIT 100
                `,
                {
                    query
                }
            );

        return result.records.map(
            record =>
                mapNode(
                    record.get("n")
                )
        );

    } finally {

        await session.close();

    }

}


/**
 * Find the shortest knowledge path between two nodes.
 */
export async function findKnowledgePath(
    sourceId: string,
    targetId: string
) {

    const session =
        createNeo4jSession();

    try {

        const result =
            await session.run(
                `
                MATCH
                    (source),
                    (target)

                WHERE
                    (
                        source.id = $sourceId
                        OR elementId(source) = $sourceId
                    )
                    AND
                    (
                        target.id = $targetId
                        OR elementId(target) = $targetId
                    )

                MATCH path =
                    shortestPath(
                        (source)-[*..10]-(target)
                    )

                RETURN path

                LIMIT 1
                `,
                {
                    sourceId,
                    targetId
                }
            );

        if (
            result.records.length === 0
        ) {

            return null;

        }

        const path =
            result.records[0]
                .get("path");

        return {

            nodes:
                path.nodes.map(
                    (node: any) =>
                        mapNode(node)
                ),

            relationships:
                path.relationships.map(
                    (relationship: any) =>
                        mapRelationship(
                            relationship
                        )
                )

        };

    } finally {

        await session.close();

    }

}


/**
 * Return graph statistics.
 */
export async function getNeo4jGraphStats() {

    const session =
        createNeo4jSession();

    try {

        const nodeResult =
            await session.run(
                `
                MATCH (n)

                RETURN
                    labels(n) AS labels,
                    count(n) AS count
                ORDER BY count DESC
                `
            );

        const relationshipResult =
            await session.run(
                `
                MATCH ()-[r]->()

                RETURN
                    type(r) AS type,
                    count(r) AS count
                ORDER BY count DESC
                `
            );

        return {

            nodes:
                nodeResult.records.map(
                    record => ({

                        labels:
                            record.get("labels"),

                        count:
                            record
                                .get("count")
                                ?.toNumber?.() ??
                            0

                    })
                ),

            relationships:
                relationshipResult.records.map(
                    record => ({

                        type:
                            record.get("type"),

                        count:
                            record
                                .get("count")
                                ?.toNumber?.() ??
                            0

                    })
                )

        };

    } finally {

        await session.close();

    }

}