import { Router, Request, Response } from 'express';

export const apiRouter = Router();

apiRouter.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

// Example POST endpoint
apiRouter.post('/echo', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({ echo: message });
});
