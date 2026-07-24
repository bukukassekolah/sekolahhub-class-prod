/// <reference types="vite/client" />

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

/**
 * Retrieves the configured Google OAuth Client ID from environment variables.
 */
export const getGoogleClientId = (): string => {
  return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID?.trim() || '';
};

/**
 * Checks if the Google OAuth Client ID is properly configured in environment variables.
 */
export const isGoogleOauthConfigured = (): boolean => {
  const id = getGoogleClientId();
  return id.length > 0 && !id.includes('YOUR_GOOGLE_CLIENT_ID');
};

/**
 * Dynamically loads Google Identity Services script if not already present
 */
export const loadGsiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts) {
      resolve();
      return;
    }
    const existingScript = document.getElementById('gsi-client-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error('Gagal memuat Google Identity Services SDK.'));
    document.head.appendChild(script);
  });
};

/**
 * Triggers authentic Google OAuth popup on accounts.google.com
 * Retrieves real user name and email from Google UserInfo
 */
export const triggerGoogleOAuthPopup = async (): Promise<GoogleUserProfile> => {
  const clientId = getGoogleClientId();

  if (!clientId || !isGoogleOauthConfigured()) {
    throw new Error(
      'Google OAuth Client ID belum dikonfigurasi. Harap tentukan environment variable VITE_GOOGLE_CLIENT_ID di file .env atau Secrets aplikasi Anda.'
    );
  }

  await loadGsiScript();

  return new Promise((resolve, reject) => {
    try {
      const google = (window as any).google;

      if (google?.accounts?.oauth2) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid profile email',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              if (tokenResponse.error === 'invalid_client') {
                reject(
                  new Error(
                    'Client ID Google tidak valid (invalid_client). Harap periksa kembali VITE_GOOGLE_CLIENT_ID dan Authorized JavaScript Origins di Google Cloud Console.'
                  )
                );
              } else {
                reject(
                  new Error(
                    tokenResponse.error_description || tokenResponse.error || 'Autentikasi Google dibatalkan.'
                  )
                );
              }
              return;
            }
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (!res.ok) {
                  throw new Error('Gagal mengambil data profil dari Google UserInfo.');
                }
                const info = await res.json();
                resolve({
                  id: info.sub || `goog_${Date.now()}`,
                  name: info.name || info.given_name || 'Guru Sekolah',
                  email: info.email || '',
                  picture: info.picture
                });
              } catch (e: any) {
                reject(e);
              }
            } else {
              reject(new Error('Kredensial tidak diterima dari Google.'));
            }
          }
        });

        client.requestAccessToken();
      } else {
        // Fallback popup if GIS token client API is unavailable
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
          client_id: clientId,
          redirect_uri: window.location.origin,
          response_type: 'token',
          scope: 'openid profile email',
          prompt: 'select_account'
        });

        const popup = window.open(
          authUrl,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          reject(new Error('Popup terblokir oleh browser. Harap izinkan popup untuk login Google.'));
          return;
        }

        const handleMessage = async (event: MessageEvent) => {
          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.token) {
            window.removeEventListener('message', handleMessage);
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${event.data.token}` }
              });
              const info = await res.json();
              resolve({
                id: info.sub || `goog_${Date.now()}`,
                name: info.name || 'Guru Sekolah',
                email: info.email || '',
                picture: info.picture
              });
            } catch (err: any) {
              reject(err);
            }
          }
        };

        window.addEventListener('message', handleMessage);
      }
    } catch (err: any) {
      reject(err);
    }
  });
};
