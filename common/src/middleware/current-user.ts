import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
	id: string;
	email: string;
}

// Augmenting properties to existing types
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload; //may or maynot be defined since we dont know the user is logged in or not
		}
	}
}

export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;

		req.currentUser = payload;
	} catch (error) {}

	next();
};
