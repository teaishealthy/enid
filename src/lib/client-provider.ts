import { RESTClient, ROUTES, logger } from 'eludris.js';
import { z } from 'zod';

console.log('hello');
logger.setLevel('silly');
window.log = logger;
ROUTES.oprishUrl = 'https://api.eludris.gay';

export const restClient = new RESTClient(ROUTES.oprishUrl);

const sessionSchema = z.object({
  token: z.string(),
  session: z.object({
    id: z.number(),
    user_id: z.number(),
    platform: z.string(),
    client: z.string(),
    ip: z.string(),
  }),
});

export function authenticateClient(): boolean {
  if (restClient.authToken !== undefined) {
    return true;
  }
  const sessionString = localStorage.getItem('session');
  if (!sessionString) {
    return false;
  }
  const session = sessionSchema.safeParse(JSON.parse(sessionString));
  if (!session.success) {
    localStorage.removeItem('session');
    return false;
  }
  restClient.authToken = session.data.token;

  return true;
}
