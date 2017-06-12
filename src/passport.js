const LocalStrategy = require('passport-local').Strategy
const RememberMeStrategy = require('passport-remember-me').Strategy
const uuid = require('uuid/v4')
const { User } = require('./models/user')

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (user) {
            return done(
              null,
              false,
              req.flash('signupMessage', 'Email is already taken.')
            )
          }
          const rememberMe = uuid()
          const newUser = new User({
            email,
            password: User.hashPassword(password),
            rememberMe,
          })
          await newUser.save()
          return done(null, newUser)
        } catch (err) {
          console.log(err)
          return done(err, false, req.flash('signupMessage', err))
        }
      }
    )
  )

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) {
            return done(
              null,
              false,
              req.flash('loginMessage', 'No user found.')
            )
          }
          if (!user.checkHashedPassword(password)) {
            return done(
              null,
              false,
              req.flash('loginMessage', 'Wrong password.')
            )
          }
          return done(null, user)
        } catch (err) {
          console.log(err)
          return done(err)
        }
      }
    )
  )

  const verifyToken = async (token, done) => {
    console.log('verifyToken called', token)
    const user = await User.findOne({ rememberMe: token })
    done(null, user)
  }

  //  For security reasons, remember me tokens should be invalidated after being used
  const issueToken = async (user, done) => {
    console.log('issueToken called', user)
    const token = uuid()
    user.rememberMe = token
    await user.save()
    done(null, token)
  }

  passport.use(new RememberMeStrategy(verifyToken, issueToken))
}
