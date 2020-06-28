import { Request, Response, NextFunction } from "express";

import { NotAuthorizedError } from "../errors/not-authorized-error";

// this middleware will run after current-user middle ware

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}

	next();
};
