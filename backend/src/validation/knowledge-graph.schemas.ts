import { z } from "zod";


export const createKnowledgeNodeSchema =
    z.object({
        name:
            z.string()
                .min(1)
                .max(200),

        description:
            z.string()
                .min(1)
                .max(5000),

        type:
            z.enum([
                "CONCEPT",
                "PERSON",
                "ORGANISATION",
                "TECHNOLOGY",
                "TOPIC",
                "CONTRIBUTION",
                "CATEGORY",
                "TAG"
            ]),

        contributionId:
            z.string()
                .uuid()
                .optional()
    });


export const createKnowledgeRelationshipSchema =
    z.object({
        sourceNodeId:
            z.string()
                .uuid(),

        targetNodeId:
            z.string()
                .uuid(),

        type:
            z.enum([
                "RELATED_TO",
                "SUPPORTS",
                "CONTRADICTS",
                "DEPENDS_ON",
                "EXTENDS",
                "DERIVED_FROM",
                "BELONGS_TO"
            ]),

        description:
            z.string()
                .max(5000)
                .optional(),

        contributionId:
            z.string()
                .uuid()
                .optional()
    });