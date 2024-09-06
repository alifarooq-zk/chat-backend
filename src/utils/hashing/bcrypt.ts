import * as bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
export function comparePassword(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashPassword);
}
