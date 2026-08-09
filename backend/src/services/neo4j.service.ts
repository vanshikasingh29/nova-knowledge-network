import {
    createNeo4jSession
} from "../config/neo4j";


export interface Neo4jHealthResult {

    connected: boolean;

    database: string;

}


export async function getNeo4jHealth(): Promise<Neo4jHealthResult> {

    const session =
        createNeo4jSession();


    try {

        await session.run(
            "RETURN 1 AS health"
        );


        return {

            connected: true,

            database:
                process.env.NEO4J_DATABASE ??
                "neo4j"

        };

    } finally {

        await session.close();

    }

}