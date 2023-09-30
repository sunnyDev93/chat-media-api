import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config';
import { StatusCodes } from 'http-status-codes';

export const verifyToken = (req:Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  if (typeof token === "string") {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
      } else {
        // @ts-ignore
        req.body = {...req.body, ...decoded};
        next()
      }
    });
  }
}