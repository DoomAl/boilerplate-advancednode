const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, myDataBase) {

  // Serialization and deserialization here...
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      myDataBase.findOne({ username: username }, function(err, user) {
        console.log('User ' + username + ' attempted to log in.');
        if (err) { 
          console.log("primer error");
          return done(err); }
        if (!user) {           
          console.log("segundo error");
          return done(null, false); 
        }
        if (!password === user.password) {
          console.log("falla en el bcrypt local strategy") 
          return done(null, false);
        }    
        console.log("me devuelve el puto user", user)    
        return done(null, user);
      });
    }
  ));
}