function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.redirect('/profile')
  })

  app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') })
  })

  app.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('signupMessage') })
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
  })

  app.post(
    '/auth/signup',
    passport.authenticate('local-signup', {
      failureRedirect: '/signup',
      failureFlash: true,
    }),
    // set cookie
    (req, res, next) => {
      if (req.user) {
        res.cookie('remember_me', req.user.rememberMe, {
          path: '/',
          httpOnly: true,
          maxAge: 604800000,
        })
      }
      next()
    },
    (req, res) => {
      res.redirect('/profile')
    }
  )

  app.post(
    '/auth/login',
    passport.authenticate('local-login', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    // set cookie
    (req, res, next) => {
      if (req.user) {
        res.cookie('remember_me', req.user.rememberMe, {
          path: '/',
          httpOnly: true,
          maxAge: 604800000,
        })
      }
      next()
    },
    (req, res) => {
      res.redirect('/profile')
    }
  )

  app.get('/auth/logout', (req, res) => {
    req.logout()
    res.cookie('remember_me', '')
    res.redirect('/')
  })
}
