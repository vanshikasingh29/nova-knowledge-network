import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";


interface RegisterData {
    name: string;
    email: string;
    password: string;
}


interface LoginData {
    email: string;
    password: string;
}


function generateToken(userId: string): string {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { userId },
        secret,
        { expiresIn: "1d" }
    );
}


export async function registerUser(data: RegisterData) {

    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });


    if (existingUser) {
        throw new Error("User already exists");
    }


    const hashedPassword = await bcrypt.hash(
        data.password,
        12
    );


    const user = await prisma.user.create({

        data: {

            name: data.name,

            email: data.email,

            password: hashedPassword

        }

    });


    const token = generateToken(user.id);


    return {

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        },

        token

    };

}


export async function loginUser(data: LoginData) {

    const user = await prisma.user.findUnique({

        where: {

            email: data.email

        }

    });


    if (!user) {
        throw new Error("Invalid email or password");
    }


    const passwordMatches = await bcrypt.compare(
        data.password,
        user.password
    );


    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }


    const token = generateToken(user.id);


    return {

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        },

        token

    };

}