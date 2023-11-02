import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user';
import {secretKey} from '../config';
import {sendEmail} from "../utils/sendEmail";
import Token from "../models/token";


const register = async (req : Request, res : Response) => {

    const uid = req.body ?. uid;
    try {
        const existedUser = await User.findOne({uid: uid});
        let password = "";
        if (req.body ?. password) {
            password = bcrypt.hashSync(req.body ?. password, 8)
        }
        if (existedUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({errorMsg: "User is already existed"});
        } else {
            const user = new User({
                uid: req.body.uid,
                name: req.body ?. name || "New User",
                email: req.body ?. email || null,
                phN: req.body ?. phN || null,
                gid: req.body ?. gid || null,
                password: password || null,
                token: "10000",
                referalCode: uid ?. slice(0, 5),
                referedCode: req.body ?. referedCode
            })
            await user.save();
            return res.status(StatusCodes.OK).json({message: "User is registered successfully", user: user});
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}

const login = async (req : Request, res : Response) => {
    const {uid, password} = req.body;
    try {
        const user = await User.findOne({uid: uid});
        if (user) {
            if (password) {
                const passwordInvalid = bcrypt.compareSync(password, user.password);
                if (passwordInvalid) {
                    const token = jwt.sign({
                        uid: uid
                    }, secretKey, {algorithm: 'HS256'});
                    return res.status(StatusCodes.OK).json({accessToken: token})
                } else {
                    return res.status(StatusCodes.UNAUTHORIZED).send("Password is incorrect")
                }
            } else {
                const token = jwt.sign({
                    uid: uid
                }, secretKey, {algorithm: 'HS256'});
                return res.status(StatusCodes.OK).json({accessToken: token})
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("Not Found");
        }
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}

const adminLogin = async (req : Request, res : Response) => {

    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email});
        if (user) {
            if (password) {
                const passwordInvalid = bcrypt.compareSync(password, user.password);
                if (passwordInvalid) {
                    const token = jwt.sign({
                        email: email
                    }, secretKey, {algorithm: 'HS256'});
                    return res.status(StatusCodes.OK).json({accessToken: token})
                } else {
                    return res.status(StatusCodes.UNAUTHORIZED).send("Password is incorrect")
                }
            } else {
                const token = jwt.sign({
                    email: email
                }, secretKey, {algorithm: 'HS256'});

                return res.status(StatusCodes.OK).json({accessToken: token})
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("Not Found");
        }
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}

const fetchMe = async (req : Request, res : Response) => {
    const {uid} = req.body.decoded;
    try {
        const user = await User.findOne({uid: uid});
        if (user) {
            return res.status(StatusCodes.OK).json({user: user});
        }
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}

const fetchUsers = async (req : Request, res : Response) => {
    try {
        const users = await User.find();
        res.json({users: users});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching users'});
    }
}

const getInflu = async (req : Request, res : Response) => {
    try {
        const users = await User.find({role: "influencer"});
        res.json({users: users});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching users'});
    }
}

const getTotalMoney = async (req : Request, res : Response) => {
    try {
        const users = await User.find();
        if (users) {
            const totalEarning = users.reduce((sum, user) => sum + user.spentPrices, 0);
            res.json({totalEarning: totalEarning});
        }
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching users'});
    }
}

const forgotPassword = async (req : Request, res : Response) => {
    const {uid} = req.body;
    try {
        const user = await User.findOne({uid: uid});
        if (! user) 
            return res.status(400).send("user with given email doesn't exist");
        


        let token = await Token.findOne({userId: user._id});
        if (! token) {
            token = await new Token({
                userId: user._id,
                token: jwt.sign(
                    {
                        uid: uid
                    },
                    secretKey,
                    {algorithm: 'HS256'}
                )
            }).save();
        }

        const link = `${
            process.env.BASE_URL
        }/password-reset/${
            user._id
        }/${
            token.token
        }`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}

const updateUserRole = async (req : Request, res : Response) => {
    const users = req.body ?. users;

    if (users) {

        try {
            for (let i = 0; i < users.length; i++) {
                const orgUser = await User.findOne({_id: users[i]._id});


                if (orgUser) {
                    if (users[i] ?. role === "influencer") {
                        orgUser.role = users[i] ?. role
                        orgUser.referalCode = users[i] ?. uid.slice(0, 5);
                        orgUser.influDate = new Date();
                        orgUser.discount = users[i] ?. discount || 1
                        await orgUser.save();
                    } else {
                        orgUser.role = users[i] ?. role
                        orgUser.referalCode = users[i] ?. uid.slice(0, 5);
                        await orgUser.save();
                    }
                }
            }
            const newUsers = await User.find();
            if (newUsers) {
                return res.status(StatusCodes.OK).json({message: "User is updated successfully", newUsers: newUsers});
            }

        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
}

const getReferralCode = async (req : Request, res : Response) => {
    const {uid} = req.params;
    if (uid) {
        try { // Find the user by ID
            const user = await User.findOne({uid: uid});

            if (! user) {
                return res.status(404).send('User not found');
            }

            // Respond with the referral code
            res.json({referralCode: user.referalCode});
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}
const filterByYear = async (req : Request, res : Response) => {
    const year = req.body.year;
    const month = req.body.month;
    if (year) {
        try { // Find the user by ID
            const users = await User.find();
            let influs: any = [];
            let newInflus: any = [];

            // Respond with the referral code
            for (let i = 0; i < users.length; i++) {
                if (users[i].influDate) {
                    influs.push(users[i]);
                }
            }

            if (influs) {
                for (let i = 0; i < influs.length; i++) {

                    if (String(influs[i].influDate.getFullYear()) === String(year) && String(influs[i].influDate.getMonth() + 1) === String(month)) {
                        newInflus.push(influs[i]);
                    }
                }
            }

            res.json({newInflus: newInflus});
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}

const authController = {
    register,
    login,
    forgotPassword,
    fetchMe,
    fetchUsers,
    updateUserRole,
    getReferralCode,
    getTotalMoney,
    getInflu,
    filterByYear,
    adminLogin
}

export default authController;
