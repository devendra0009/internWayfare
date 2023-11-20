const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Assuming storing URLs of the images
      // You can add more fields related to images like name, description, etc.
    },
  ],
  profileImg: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
