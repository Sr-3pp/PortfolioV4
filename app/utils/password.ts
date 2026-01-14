import { scryptSync, timingSafeEqual, randomBytes } from 'crypto'

const N = 16384, r = 8, p = 1, keylen = 64

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, keylen, { N, r, p })
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, salt, keylen, { N, r, p })
  return timingSafeEqual(expected, actual)
}

