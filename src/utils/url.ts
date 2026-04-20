export function normalizeAppPath(pathname: string | null | undefined) {
  if (!pathname || !pathname.startsWith('/')) {
    return '/';
  }

  if (pathname.startsWith('//') || pathname.startsWith('/\\')) {
    return '/';
  }

  return pathname;
}
