import { Agent, fetch, Response } from 'undici';

import { env } from './env';

/**
 * Sends an api request to the slurm unix socket
 * @param method The fetch method type
 * @param path The end point to send it to
 * @param data The data to send to the API
 * @returns The response
 */
export async function slurmFetch(method: string, path: string, data?: object): Promise<Response> {
   return await fetch(`http://localhost${path}`, {
      method,
      dispatcher: new Agent({
         connect: {
            socketPath: env.SLURM_UNIX_SOCKET
         }
      }),
      headers: {
         Accept: 'application/json',
         ...(data !== undefined ? { 'Content-Type': 'application/json' } : {})
      },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {})
   });
}
