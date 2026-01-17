import { NextFunction,Request, Response  } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "../Utils";
import { IRequest, IUser } from "../Common";
import { UserRepository, BlackListedRepository } from "../DB/Repositories";
import { UserModel, BlacklistedTokensModel } from "../DB/Models";

const userRepo = new UserRepository(UserModel);
const blackListedRepo = new BlackListedRepository(BlacklistedTokensModel);

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization: accessToken } = req.headers;
    if (!accessToken) return res.status(401).json({ message: 'please login first' });
    const [prefix, token] = accessToken.split(' ');
    if (prefix !== process.env.JWT_PREFIX) return res.status(401).json({ message: 'invalid token' });

    const decodedData = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);
    if (!decodedData._id) return res.status(401).json({ message: 'invalid payload' });

    const blacklistedToken = await blackListedRepo.findOneDocument({ tokenId: decodedData.jti });
    if (blacklistedToken) return res.status(401).json({ message: 'Your session has been expired please login again' });

    const user: IUser | null = await userRepo.findDocumentById(decodedData._id, '-password');
    if (!user) return res.status(404).json({ message: 'Please register first' });

    (req as unknown as IRequest).loggedInUser = { user, token: decodedData as JwtPayload };
    next();
};