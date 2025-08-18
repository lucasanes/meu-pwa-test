import { NextRequest, NextResponse } from 'next/server';

const paths = {
  public: ['/', 'signup', 'recover-password', 'verify-email'],
  private: ['dashboard'],
};

function removeLeadingSlash(path: string) {
  if (path === '/') {
    return path;
  }

  return path.replaceAll('/', '');
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  const isPublicPath = paths.public.some(
    path =>
      removeLeadingSlash(path) === removeLeadingSlash(req.nextUrl.pathname)
  );
  const isPrivatePath = paths.private.some(
    path =>
      removeLeadingSlash(path) === removeLeadingSlash(req.nextUrl.pathname)
  );

  if (!token && !isPublicPath && isPrivatePath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (token && isPublicPath && !isPrivatePath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico).*)'],
};
