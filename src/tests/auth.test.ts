import jwt from 'jsonwebtoken'

describe('JWT Token', () => {
  const secret = 'test-secret'
  const payload = { id: 'user123', role: 'ADMIN' }

  it('should generate a valid token', () => {
    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    const decoded = jwt.verify(token, secret) as typeof payload
    expect(decoded.id).toBe('user123')
    expect(decoded.role).toBe('ADMIN')
  })
})
