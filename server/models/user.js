const mongoose  = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

// define the user model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

// before saving a model, encrypt the password
userSchema.pre('save', function(next) {
  // get access to the current instance of the user model
  const user = this;

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // after the salt is created, hash (encrypt) the password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      // overwrite plain-text password with encrypted password
      user.password = hash;
      // go ahead and finally save the user
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // check is given password is the correct user password
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
module.exports = ModelClass;