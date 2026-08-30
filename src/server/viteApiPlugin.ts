import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  handleRegister,
  handleLogin,
  handleSocialAuthUrl,
  handleSocialCallback,
  handleGetMe,
  handleLogout,
  handleGenerate2faOtp,
  handleVerify2faOtp,
  handleResend2faOtp,
  handleToggle2fa,
  handleGet2faStatus,
} from './routes.ts';
import type { SocialProvider } from './socialOAuth.ts';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER BACKEND — VITE API SERVER MIDDLEWARE PLUGIN
   ─────────────────────────────────────────────────────────────────────────
   Serves live REST endpoints:
   - POST /api/auth/register (Candidate registration with password hashing & JWT)
   - POST /api/auth/login
   - GET  /api/auth/:provider (google, github, linkedin, apple)
   - GET  /api/auth/:provider/callback (OAuth redirect flow)
   - POST /api/auth/:provider/callback (SPA direct exchange)
   - GET  /api/auth/me
   - POST /api/auth/logout
   ═══════════════════════════════════════════════════════════════════════════ */

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

const SUPPORTED_PROVIDERS: SocialProvider[] = ['google', 'github', 'linkedin', 'apple'];

export function jadeerBackendApiPlugin(): Plugin {
  return {
    name: 'jadeer-backend-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url?.split('?')[0] || '';
        const method = req.method?.toUpperCase() || 'GET';

        // Handle CORS Preflight
        if (method === 'OPTIONS' && url.startsWith('/api/')) {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.end();
          return;
        }

        // 0. POST /api/auth/register
        if (url === '/api/auth/register' && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = await handleRegister(body);

            if (result.status === 201 && result.data?.token) {
              const userJson = encodeURIComponent(JSON.stringify(result.data.user));
              const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
              const secureFlag = protocol === 'https' ? '; Secure' : '';
              res.setHeader('Set-Cookie', [
                `auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
              ]);
            }

            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 1. POST /api/auth/login
        if (url === '/api/auth/login' && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = await handleLogin(body);

            if (result.status === 200 && result.data?.token) {
              const userJson = encodeURIComponent(JSON.stringify(result.data.user));
              const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
              const secureFlag = protocol === 'https' ? '; Secure' : '';
              res.setHeader('Set-Cookie', [
                `auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
              ]);
            }

            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 2. Multi-Provider OAuth Callbacks: GET & POST /api/auth/:provider/callback
        for (const provider of SUPPORTED_PROVIDERS) {
          const callbackPath = `/api/auth/${provider}/callback`;

          if (url === callbackPath) {
            // GET flow (Browser redirect from OAuth provider)
            if (method === 'GET') {
              try {
                const searchParams = new URLSearchParams(req.url?.split('?')[1] || '');
                const oauthError = searchParams.get('error');
                if (oauthError) {
                  res.writeHead(302, { Location: `/signin?error=${provider}_${encodeURIComponent(oauthError)}` });
                  res.end();
                  return;
                }

                const code = searchParams.get('code') || 'demo_' + provider + '_code';
                const state = searchParams.get('state') || undefined;

                const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
                const host = req.headers['host'] || 'localhost:5174';
                const redirectUri = `${protocol}://${host}/api/auth/${provider}/callback`;

                const result = await handleSocialCallback(provider, {
                  code,
                  state,
                  redirectUri,
                });

                if (result.status === 200 && result.data?.token) {
                  const userJson = encodeURIComponent(JSON.stringify(result.data.user));
                  const secureFlag = protocol === 'https' ? '; Secure' : '';
                  res.setHeader('Set-Cookie', [
                    `auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                    `auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                    `jadeer_auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                    `jadeer_auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                  ]);

                  res.writeHead(302, { Location: result.data.redirectUrl || '/candidates/wizard' });
                  res.end();
                  return;
                }

                res.writeHead(302, { Location: `/signin?error=${provider}_auth_failed` });
                res.end();
              } catch {
                res.writeHead(302, { Location: '/candidates/wizard' });
                res.end();
              }
              return;
            }

            // POST flow (SPA direct JSON exchange)
            if (method === 'POST') {
              try {
                const body = await parseBody(req);
                const result = await handleSocialCallback(provider, body);
                sendJson(res, result.status, result.data);
              } catch (err: any) {
                sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
              }
              return;
            }
          }

          // 3. Multi-Provider OAuth Initiate: GET & POST /api/auth/:provider
          const authPath = `/api/auth/${provider}`;
          if (url === authPath) {
            if (method === 'GET') {
              try {
                const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
                const host = req.headers['host'] || 'localhost:5174';
                const searchParams = new URLSearchParams(req.url?.split('?')[1] || '');
                const redirectUri = searchParams.get('redirect_uri') || `${protocol}://${host}/api/auth/${provider}/callback`;

                const result = handleSocialAuthUrl(
                  provider,
                  redirectUri,
                  searchParams.get('state') || undefined
                );

                const acceptHeader = req.headers['accept'] || '';
                if (acceptHeader.includes('text/html') && result.data?.authUrl) {
                  res.writeHead(302, { Location: result.data.authUrl });
                  res.end();
                  return;
                }

                sendJson(res, result.status, result.data);
              } catch (err: any) {
                sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
              }
              return;
            }

            if (method === 'POST') {
              try {
                const body = await parseBody(req);
                const result = await handleSocialCallback(provider, body);
                sendJson(res, result.status, result.data);
              } catch (err: any) {
                sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
              }
              return;
            }
          }
        }

        // 4. GET /api/auth/me
        if (url === '/api/auth/me' && method === 'GET') {
          try {
            const authHeader = req.headers['authorization'];
            const cookieHeader = req.headers['cookie'];
            const result = handleGetMe(
              Array.isArray(authHeader) ? authHeader[0] : authHeader,
              Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader
            );
            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 5. POST /api/auth/logout
        if (url === '/api/auth/logout' && method === 'POST') {
          try {
            const authHeader = req.headers['authorization'];
            const cookieHeader = req.headers['cookie'];
            const result = handleLogout(
              Array.isArray(authHeader) ? authHeader[0] : authHeader,
              Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader
            );

            // Clear all authentication cookies with expired Max-Age and Past Expiration
            const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
            const secureFlag = protocol === 'https' ? '; Secure' : '';
            res.setHeader('Set-Cookie', [
              `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax${secureFlag}`,
              `auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax${secureFlag}`,
              `jadeer_auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax${secureFlag}`,
              `jadeer_auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax${secureFlag}`,
              `__Host-jadeer_auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax; Secure`,
              `__Host-jadeer_auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax; Secure`,
            ]);

            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 6. POST /api/auth/2fa/generate & /api/auth/otp/send
        if ((url === '/api/auth/2fa/generate' || url === '/api/auth/otp/send') && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = handleGenerate2faOtp(body);
            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 7. POST /api/auth/2fa/verify & /api/auth/otp/verify
        if ((url === '/api/auth/2fa/verify' || url === '/api/auth/otp/verify') && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = await handleVerify2faOtp(body);

            if (result.status === 200 && result.data?.token) {
              const userJson = encodeURIComponent(JSON.stringify(result.data.user));
              const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
              const secureFlag = protocol === 'https' ? '; Secure' : '';
              res.setHeader('Set-Cookie', [
                `auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_token=${result.data.token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
                `jadeer_auth_user=${userJson}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`,
              ]);
            }

            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 8. POST /api/auth/2fa/resend & /api/auth/otp/resend
        if ((url === '/api/auth/2fa/resend' || url === '/api/auth/otp/resend') && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = handleResend2faOtp(body);
            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 9. POST /api/auth/2fa/toggle
        if (url === '/api/auth/2fa/toggle' && method === 'POST') {
          try {
            const body = await parseBody(req);
            const result = await handleToggle2fa(body);
            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        // 10. GET /api/auth/2fa/status
        if (url === '/api/auth/2fa/status' && method === 'GET') {
          try {
            const searchParams = new URLSearchParams(req.url?.split('?')[1] || '');
            const email = searchParams.get('email');
            const result = handleGet2faStatus(email);
            sendJson(res, result.status, result.data);
          } catch (err: any) {
            sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
          }
          return;
        }

        next();
      });
    },
  };
}

