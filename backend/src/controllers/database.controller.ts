import { Request, Response } from "express";

import { prisma } from "../config/prisma";



export async function databaseTest(

req:Request,

res:Response

){


const users = await prisma.user.findMany();


res.json({

message:"Database connected successfully",

users

});


}