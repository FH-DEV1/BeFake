import * as express from 'express';
import { Request, Response } from 'express';

import { refreshToken } from './route/refresh';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/refresh-token', refreshToken, (req: Request, res: Response) => {
  res.json({
      token: res.locals.token,
      refresh_token: res.locals.refresh_token,
      token_expiration: res.locals.token_expiration
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
