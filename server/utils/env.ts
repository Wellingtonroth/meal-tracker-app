export function isProduction(): boolean {
  return process.env.NUXT_PUBLIC_ENV === 'production';
}
