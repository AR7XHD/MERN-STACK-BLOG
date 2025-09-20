export const makeCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,                       // Vercel uses HTTPS -> secure must be true in prod
      sameSite: isProd ? 'none' : 'lax',    // cross-site cookies require SameSite=None in prod
      path: '/',
      maxAge: 60 * 60 * 1000,               // 1 hour
      // domain: isProd ? process.env.COOKIE_DOMAIN || undefined : undefined
      // Uncomment & set COOKIE_DOMAIN only if you need cross-subdomain cookies (e.g. ".example.com")
    };
  };
  