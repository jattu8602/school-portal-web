// Script to generate a secure random string for NextAuth secret

const crypto = require('crypto')

const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex')
}

const secret = generateSecret()

console.log('\n=== NextAuth Secret Key ===')
console.log(secret)
console.log('\nAdd this to your .env file:')
console.log(`NEXTAUTH_SECRET=${secret}\n`)
