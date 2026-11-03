import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyToken } from './src/admin/session';
import { LOCALE_HEADER, splitLocale } from './src/i18n-routing';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /en/… is the same page as /…: one address per page.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  // /fa/products is the products page in Persian: served by the same page,
  // which reads the language from the header set here.
  const { locale, path } = splitLocale(pathname);
  if (locale !== 'en') {
    // Never a way round the admin check below: /fa/admin is simply not a page.
    if (/^\/(admin|api)(\/|$)/.test(path)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = path;
    const headers = new Headers(req.headers);
    headers.set(LOCALE_HEADER, locale);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Everything under /admin and /api/admin needs a valid admin session,
  // except the login page, the login endpoint and the Keycloak sign-in routes.
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname.startsWith('/api/admin/oidc/')) {
    return NextResponse.next();
  }

  const session = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/(en|fa|ar|tr|de|fr|es|zh|ja|ru)',
    '/(en|fa|ar|tr|de|fr|es|zh|ja|ru)/:path*',
  ],
  runtime: 'nodejs',
};
