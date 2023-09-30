import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user';
import { secretKey } from '../config';
import {sendEmail} from "../utils/sendEmail";
import Token from "../models/token";



const register = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errorMsg: "email is already existed"
      });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role
      })
      await user.save();
      return res.status(StatusCodes.OK).json({ message: "User is registered successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordInvalid = bcrypt.compareSync(password, user.password);
      if (passwordInvalid) {
        const token = jwt.sign(
          {
            email: email
          },
          secretKey,
          {
            algorithm: 'HS256'
          }
        );
        return res.status(StatusCodes.OK).json({accessToken: token})
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).send("Password is incorrect")
      }
    } else {
      return res.status(StatusCodes.NOT_FOUND).send("Not Found");
    }

  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

const fetchMe = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: jwt.sign(
          {
            email: email
          },
          secretKey,
          {
            algorithm: 'HS256'
          }
        )
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");

  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

const authController = {
  register,
  login,
  forgotPassword,
  fetchMe
}

export default authController;