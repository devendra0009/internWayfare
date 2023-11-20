const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../model/User');

passport.serializeUser((user, done) => {
//   console.log(user);
  return done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => console.log(err));
});

passport.use(
  new GoogleStrategy(
    {
      // strategy options
      callbackURL: '/auth/google/redirect',
      clientID:
        '1076239184248-fvepnnk2vka2jimj9q5eoiv12283bba2.apps.googleusercontent.com',
      clientSecret: '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',
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback
      console.log('fn fired', profile);
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log('User already exists', currentUser);
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            name: profile.displayName,
            profileImg: profile.photos[0].value
          })
            .save()
            .then((data) => {
              console.log(data, 'New user ');
              done(null, data);
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);
