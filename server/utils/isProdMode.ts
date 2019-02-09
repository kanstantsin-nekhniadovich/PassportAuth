export function isProdMode() {
  const { NODE_ENV } = process.env;

  return NODE_ENV === 'production';
}
