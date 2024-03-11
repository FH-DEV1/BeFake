import express, { Router } from "express";
import serverless from "serverless-http";
import { refreshToken } from '../../routes/refresh.ts';
import { verifyOTP } from '../../routes/verifyOTP.ts';

const api = express();
const router = Router();

router.get("/refresh", refreshToken, (req, res) =>  {
  res.json({
      token: res.locals.token,
      refresh_token: res.locals.refresh_token,
      token_expiration: res.locals.token_expiration
  });
});

router.get("/verify-otp", verifyOTP, (req, res) =>  {
  res.json({
    refresh_data: {
      token: res.locals.access_token,
      refresh_token: res.locals.access_refresh_token,
      token_expiration: res.locals.access_expiration
    }
  });
});

api.use("/api/", router);

export const handler = serverless(api);
