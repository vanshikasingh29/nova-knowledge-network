import {
    z
} from "zod";


export const registerSchema =
    z.object({

        name:
            z.string()
                .trim()
                .min(2)
                .max(100),

        email:
            z.string()
                .trim()
                .email()
                .max(255),

        password:
            z.string()
                .min(8)
                .max(128)

    });


export const loginSchema =
    z.object({

        email:
            z.string()
                .trim()
                .email(),

        password:
            z.string()
                .min(1)

    });


export const expertProfileSchema =
    z.object({

        field:
            z.string()
                .trim()
                .min(2)
                .max(150),

        yearsExperience:
            z.coerce
                .number()
                .int()
                .min(0)
                .max(100),

        biography:
            z.string()
                .trim()
                .min(20)
                .max(5000),

        organisation:
            z.string()
                .trim()
                .max(200)
                .optional()
                .nullable(),

        location:
            z.string()
                .trim()
                .max(200)
                .optional()
                .nullable()

    });


export const updateExpertProfileSchema =
    expertProfileSchema.partial();


export const contributionSchema =
    z.object({

        title:
            z.string()
                .trim()
                .min(3)
                .max(200),

        topic:
            z.string()
                .trim()
                .min(2)
                .max(200),

        experience:
            z.string()
                .trim()
                .min(20)
                .max(10000),

        lesson:
            z.string()
                .trim()
                .min(10)
                .max(5000),

        categoryId:
            z.string()
                .uuid()
                .optional()
                .nullable(),

        tagIds:
            z.array(
                z.string().uuid()
            )
            .max(20)
            .optional()

    });


export const updateContributionSchema =
    contributionSchema.partial();


export const categorySchema =
    z.object({

        name:
            z.string()
                .trim()
                .min(2)
                .max(100),

        description:
            z.string()
                .trim()
                .max(1000)
                .optional()
                .nullable()

    });


export const tagSchema =
    z.object({

        name:
            z.string()
                .trim()
                .min(2)
                .max(50)

    });