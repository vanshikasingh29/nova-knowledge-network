import { Request, Response } from "express";

import { prisma } from "../config/prisma";


export async function createCategory(
    req: Request,
    res: Response
) {

    try {

        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const description =
            typeof req.body.description === "string"
                ? req.body.description.trim()
                : null;


        if (!name) {

            return res.status(400).json({
                message: "Category name is required"
            });

        }


        const existingCategory =
            await prisma.knowledgeCategory.findUnique({
                where: {
                    name: name
                }
            });


        if (existingCategory) {

            return res.status(409).json({
                message: "Category already exists"
            });

        }


        const newCategory =
            await prisma.knowledgeCategory.create({

                data: {
                    name: name,
                    description: description
                }

            });


        return res.status(201).json({
            category: newCategory
        });

    } catch (error) {

        console.error(
            "Create category error:",
            error
        );

        return res.status(500).json({
            message: "Unable to create category"
        });

    }

}


export async function getCategories(
    req: Request,
    res: Response
) {

    try {

        const categoryList =
            await prisma.knowledgeCategory.findMany({

                orderBy: {
                    name: "asc"
                },

                include: {

                    _count: {
                        select: {
                            contributions: true
                        }
                    }

                }

            });


        return res.status(200).json({
            categories: categoryList
        });

    } catch (error) {

        console.error(
            "Get categories error:",
            error
        );

        return res.status(500).json({
            message: "Unable to retrieve categories"
        });

    }

}