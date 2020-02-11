const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

// FACEBOOK STRATEGY
const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile,
});

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_KEY,
}, FacebookTokenStrategyCallback));

// GOOGLE STRATEGY
const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile,
});

passport.use(new GoogleTokenStrategy({
    clientID: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
}, GoogleTokenStrategyCallback));

// promisified authenticate functions
const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('google-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

module.exports = { authenticateFacebook, authenticateGoogle };