const jwt = require('jsonwebtoken');
const logger = require('./../utils/Logger');
const ServiceError = require('./../utils/ServiceError');
const StatusCode = require('./../utils/StatusCode');
const env = require('./../utils/Environment');
const path = require('path');
const fs = require('fs');

class Authenticate {
  constructor() {

  }

  authenticateUser(req, res, next) {
    req.isAuthenticated = false;
    let accessToken = req.get('authorization');
    if (accessToken) {
      let decodeOptions = {
        algorithms: 'RS256',
        ignoreExpiration: false,
        maxAge: '1h',
        clockTimestamp: Date().now
      };

      //TODO: add key to database or in secure key store
      let keyName = env.getProperty('JWT_PUBLIC_KEY', 'jwtRS256.key.pub');
      let keyPath = path.join(__dirname, '..', '..', 'keys', keyName);
      let publicKey = fs.readFileSync(keyPath).toString();
      jwt.verify(accessToken, publicKey, decodeOptions, (err, decoded) => {
        if (err) {
          logger.error(err.message);
          return next();
        }
        logger.error('Authorization passed');
        req.isAuthenticated = true;
        req.user = decoded;
        return next();
      });
    } else {
      logger.error('Authorization failed');
      return next();
    }
  }

  isAuthorised(autList, user){

  }
}

module.exports = Authenticate;