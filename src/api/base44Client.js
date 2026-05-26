import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const appId = appParams.appId || import.meta.env.VITE_BASE44_APP_ID;

if (!appId) {
  throw new Error('Missing Base44 app id');
}

export const base44 = createClient({
  appId,
  appBaseUrl: appParams.appBaseUrl,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
});

export { base44 } from './base44client';
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});
