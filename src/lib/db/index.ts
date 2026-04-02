import { createClient, Client } from '@libsql/client';
import { drizzle, DrizzleClient } from 'drizzle-orm/libsql';
import * as schema from './schema';

let client: Client | null = null;
let db: DrizzleClient<typeof schema> | null = null;

export function getDb() {
  if (!client || !db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TURSO_DATABASE_URL is not set');
    }

    client = createClient({
      url,
      authToken: authToken || undefined,
    });

    db = drizzle(client, { schema });
  }

  return db;
}

export { schema };
