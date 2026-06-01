import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import matchRoutes from './routes/match.js';
import usersRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import communityRoutes from './routes/community.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => res.json({ name: 'tripmate-server', status: 'ok' }));
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Frontend services expect these prefixes:
app.use('/auth', authRoutes);
app.use('/match', matchRoutes);
app.use('/users', usersRoutes);
app.use('/chat', chatRoutes);
app.use('/community', communityRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`[tripmate-server] listening on http://localhost:${port}`);
});
