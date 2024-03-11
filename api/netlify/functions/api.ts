import express, { Router } from "express";
import serverless from "serverless-http";
import { refreshToken } from '../../routes/refresh.ts';

const api = express();

const router = Router();
router.get("/hello", refreshToken, (req, res) =>  {
    res.json({
        token: res.locals.token,
        refresh_token: res.locals.refresh_token,
        token_expiration: res.locals.token_expiration
    });
});  

api.use("/api/", router);

export const handler = serverless(api);
