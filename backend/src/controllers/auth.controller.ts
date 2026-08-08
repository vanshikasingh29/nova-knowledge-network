import { Request, Response } from "express";

import {
    registerUser,
    loginUser
} from "../services/auth.service";


export async function register(
    req: Request,
    res: Response
) {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({

                message:
                    "Name, email and password are required"

            });

        }


        if (password.length < 8) {

            return res.status(400).json({

                message:
                    "Password must be at least 8 characters"

            });

        }


        const result = await registerUser({

            name,
            email,
            password

        });


        return res.status(201).json(result);


    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "User already exists"
        ) {

            return res.status(409).json({

                message: error.message

            });

        }


        console.error(error);


        return res.status(500).json({

            message: "Unable to create account"

        });

    }

}


export async function login(
    req: Request,
    res: Response
) {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        const result = await loginUser({

            email,
            password

        });


        return res.status(200).json(result);


    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "Invalid email or password"
        ) {

            return res.status(401).json({

                message: error.message

            });

        }


        console.error(error);


        return res.status(500).json({

            message: "Unable to login"

        });

    }

}