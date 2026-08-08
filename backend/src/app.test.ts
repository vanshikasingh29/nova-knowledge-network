import {
    describe,
    it,
    expect
} from "vitest";

import request from "supertest";

import app from "./app";


describe("NOVA API", () => {


    it(
        "returns the NOVA API identity",
        async () => {

            const response =
                await request(app)
                    .get("/");


            expect(
                response.status
            ).toBe(200);


            expect(
                response.body.project
            ).toBe("NOVA");


            expect(
                response.body.message
            ).toBe(
                "Network Of Verified Archives API running"
            );

        }
    );


    it(
        "returns the knowledge network overview",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/discovery/overview"
                    );


            expect(
                response.status
            ).toBe(200);


            expect(
                response.body.knowledgeNetwork
            ).toBeDefined();


            expect(
                response.body.knowledgeNetwork
                    .categories
            ).toEqual(
                expect.any(Number)
            );


            expect(
                response.body.knowledgeNetwork
                    .experts
            ).toEqual(
                expect.any(Number)
            );

        }
    );


    it(
        "returns an empty knowledge search when no knowledge exists",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/contributions/search"
                    );


            expect(
                response.status
            ).toBe(200);


            expect(
                response.body.count
            ).toEqual(
                expect.any(Number)
            );


            expect(
                response.body.contributions
            ).toEqual(
                expect.any(Array)
            );

        }
    );


    it(
        "rejects invalid registration data",
        async () => {

            const response =
                await request(app)
                    .post(
                        "/api/auth/register"
                    )
                    .send({

                        name: "",

                        email:
                            "not-an-email",

                        password:
                            "123"

                    });


            expect(
                response.status
            ).toBe(400);


            expect(
                response.body.success
            ).toBe(false);


            expect(
                response.body.error
            ).toBeDefined();

        }
    );


    it(
        "rejects invalid expert profile data",
        async () => {

            const response =
                await request(app)
                    .post(
                        "/api/experts"
                    )
                    .send({

                        field: "",

                        yearsExperience:
                            -10,

                        biography: ""

                    });


            expect(
                response.status
            ).toBe(401);

        }
    );


});