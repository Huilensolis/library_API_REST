// const auth = (req, res, next) => {
//     let API_TOKEN = "xywzcvtynm"// process.env.API_TOKEN;
//     console.log('Authenticating...');
//     console.log(API_TOKEN);
//     if(req.headers['api'] === API_TOKEN){
//         console.log('the req header has a token');
//         next();
//     } else{
//         console.log('no api token', req.headers);
//         res.status(401).json({error: 'Unauthorized', message: 'Unauthorized'}).end();
//     }
// }

const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const secret = 'i-really-like-penault-butter';//process.env.SECRET;

passport.use(new JWTStrategy({jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: secret}, async (jwtPayload, done) => {

    const passwordInDb = await User.findOne(
        {
            where: {
                username:  jwtPayload.username
            }
        }
    )
    .then(user => {
        if(user){
            return user.password
        } else{
            return false
        }
    })

    if(!passwordInDb){
        return done(null, false, {error: 'user not match'})
    }

    const doesPasswordMatch = await bcrypt.compare(jwtPayload.password, passwordInDb)

    console.log({jwtPayload, passwordInDb, doesPasswordMatch});

    if(jwtPayload.username === 'admin' && doesPasswordMatch){
        const userMatched = jwtPayload
        return done(null, userMatched)
    } else{
        return done(null, false, {error: 'user not valid'})
    }
}))


module.exports = { secret }