import bcrypt from 'bcryptjs'

export function checkPassword(unencryptedPassword, passwordFromDb) {
  return bcrypt.compareSync(unencryptedPassword, passwordFromDb)
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 8)
}
