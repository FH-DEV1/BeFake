import express, { Router, Request, Response } from 'express';
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

const api: express.Application = express();
const router: Router = Router();

const AllowedUrls: string[] = [
  'https://bereal-fhdev.vercel.app',
  'https://befake.website',
];

if (process.env.PRODUCTION !== 'true') {
  AllowedUrls.push('http://localhost:3000');
}

const corsOptions: cors.CorsOptions = {
  origin: AllowedUrls,
  preflightContinue: true,
};

router.use(cors(corsOptions));

router.get('/refresh', refreshToken, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/verify-otp', verifyOTP, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/send-code', sendCode, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/feed', getFeed, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/fof', getData, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/me', getSelf, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/pinned-memories', getPinnedMemories, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.get('/profiles', profiles, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.post('/comment/upload', uploadComment, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.post('/realmoji/react', reactRealmoji, (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

router.options('/realmoji/react', (_req: Request, res: Response) => {
  res.json(res.locals.response);
});

api.use('/api/', router);

export const handler = serverless(api);