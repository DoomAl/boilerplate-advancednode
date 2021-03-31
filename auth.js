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
          console.log("1º error local strategy");
          return done(err); 
        }
        if (!user) { 
          console.log("not user local strategy"); 
          return done(null, false); 
          }
        if (!bcrypt.compareSync(password, user.password)) {
          console.log("error en el bcript local strategy");
          return done(null, false);
        }
        console.log("me devuelve el puto user", user);        
        return done(null, user);
      });
    }
  ));
}