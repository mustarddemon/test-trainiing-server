var _ = require('lodash');
var util = require('util');
var uuid = require('node-uuid');

var users = [];
module.exports = {

  getUser: function(userId) {
    var foundUser = _.find(users, function(user) {
      return user.id === userId;
    });

    return foundUser;
  },

  getUserByName: function(username) {
    console.log('searching users', users);
    console.log('for username', username);
    var foundUser = _.find(users, function(user) {
      return user.username === username;
    });

    return foundUser;

  },

  createUser: function(userInfo) {
    var requiredFields = [ "username", "password", "firstName", "ssn"];
    var missingFields = [];
    requiredFields.forEach(function(field) {
      if (!userInfo[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return {
        message: "Cannot create user without the following fields " + util.inspect(missingFields)
      }
    };

    var existingUser = module.exports.getUserByName(userInfo.username);
    if (existingUser) {
      return {
        message: "User already exists"
      }
    }

    var newUser = _.cloneDeep(userInfo);
    newUser.id = uuid.v4();
    users.push(newUser);

    return newUser;
  }

}
