import { randomBytes } from 'crypto';

export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6); // 마지막 6자리만 사용
  const randomPart = randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${randomPart}`;
}
