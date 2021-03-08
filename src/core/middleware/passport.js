import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JsonWebTokenStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkPassword } from '../libs/password'

dotenv.config()

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user) {
          return done(new Error('Incorrect email'))
        }

        if (!checkPassword(password, user.password)) {
          return done(new Error('Incorrect password'))
        }

        // the returned user object is pre-formatted and ready for storing in JWT
        return done(false, user)
      } catch (err) {
        // set error true to let passport 'verified' function to call error
        return done(new Error('Something is not right'))
      }
    },
  ),
)

// Middleware that handle protected requests
// Allows only requests with valid tokens to access some special routes needing authentication
passport.use(
  new JsonWebTokenStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION,
    },
    async (jwtPayload, done) => {
      // find the user in db using uuid
      try {
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
          where: {
            id: jwtPayload.id,
          },
        })

        if (user) {
          return done(null, user)
        }

        return done(new Error("User doesn't exist"))
      } catch (err) {
        return done(err)
      }
    },
  ),
)
