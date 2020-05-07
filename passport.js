const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJWT } = require('passport-jwt');

const { JwT_SECRET } = require('./configuration.js');