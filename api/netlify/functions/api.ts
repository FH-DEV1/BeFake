import express, { Router, Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { refreshToken } from '../../routes/refresh.ts';
import { verifyOTP } from '../../routes/verifyOTP.ts';
import { getFeed } from '../../routes/feed.ts';
import { getData } from '../../routes/fof.ts';
import { getSelf } from '../../routes/me.ts';
import { getPinnedMemories } from '../../routes/pinnedMemories.ts';
import { sendCode } from '../../routes/sendCode.ts';
import { profiles } from '../../routes/profiles.ts';
import { uploadComment } from '../../routes/comment/upload.ts';
import { reactRealmoji } from '../../routes/realmoji/react.ts';

// Initialize express app and router
const api: express.Application = express();
const router: Router = Router();

// Allowed URLs for CORS
const AllowedUrls: string[] = [
  'https://bereal-fhdev.vercel.app',
  'https://befake.website',
];

if (process.env.PRODUCTION !== 'true') {
  AllowedUrls.push('http://localhost:3000');
}

// CORS options
const corsOptions: cors.CorsOptions = {
  origin: AllowedUrls,
};

// Apply CORS middleware
router.use(cors(corsOptions));

// Route for refreshing token
router.get('/refresh', refreshToken, (_req: Request, res: Response) => {
  res.json({
    token: res.locals.token,
    refresh_token: res.locals.refresh_token,
    token_expiration: res.locals.token_expiration
  });
});

// Route for verifying OTP
router.get('/verify-otp', verifyOTP, (_req: Request, res: Response) => {
  res.json({
    refresh_data: {
      token: res.locals.access_token,
      refresh_token: res.locals.access_refresh_token,
      token_expiration: res.locals.access_expiration
    }
  });
});

// Route for sending code
router.get('/send-code', sendCode, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Route for getting feed
router.get('/feed', getFeed, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Route for getting fof (friends of friends)
router.get('/fof', getData, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Route for getting self
router.get('/me', getSelf, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Route for getting pinned memories
router.get('/pinned-memories', getPinnedMemories, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Route for getting profiles
router.get('/profiles', profiles, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.post('/comment/upload', uploadComment, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.post('/realmoji/upload', reactRealmoji, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

// Mount router at '/api/'
api.use('/api/', router);

// Export the serverless handler
export const handler = serverless(api);
