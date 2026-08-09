import neo4j, {
    Driver,
    Session
} from "neo4j-driver";


const uri =
    process.env.NEO4J_URI;

const username =
    process.env.NEO4J_USERNAME;

const password =
    process.env.NEO4J_PASSWORD;


if (!uri) {

    throw new Error(
        "NEO4J_URI environment variable is not configured"
    );

}


if (!username) {

    throw new Error(
        "NEO4J_USERNAME environment variable is not configured"
    );

}


if (!password) {

    throw new Error(
        "NEO4J_PASSWORD environment variable is not configured"
    );

}


export const neo4jDriver: Driver =
    neo4j.driver(
        uri,
        neo4j.auth.basic(
            username,
            password
        )
    );


export function createNeo4jSession(): Session {

    return neo4jDriver.session({

        database:
            process.env.NEO4J_DATABASE ??
            "neo4j"

    });

}


export async function verifyNeo4jConnection(): Promise<void> {

    await neo4jDriver.verifyConnectivity();

}


export async function closeNeo4jConnection(): Promise<void> {

    await neo4jDriver.close();

}