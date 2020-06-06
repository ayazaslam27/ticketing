import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { createChargeRouter } from "./routes/new";

import { errorHandler, NotFoundError, currentUser } from "@aatickets/common";

const app = express();
app.set("trust proxy", true); // to trust the prozy/behind the proxy of ingress nginx
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test", //only for https
	})
);
app.use(currentUser); //must be after cookie session

app.use(createChargeRouter);

app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
