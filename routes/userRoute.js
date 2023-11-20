const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../model/User');
const router = express.Router();

/*multer*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads')); // Destination folder where the images will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const authCheck = (req, res, next) => {
  if (req.user) next();
  else {
    res.redirect('/auth/login');
  }
};
router
  .get('/profile', authCheck, (req, res) => {
    res.render('profile', { data: req.user });
  })
  .get('/profile/edit-image', authCheck, (req, res) => {
    const profileImg = req.query.img;
    // console.log(profileImg)
    res.render('editImage', { data: profileImg });
  });

router.patch(
  '/profile/updateProfileImage',
  upload.single('croppedImage'),
  (req, res) => {
    try {
      const tempPath = req.file.path;
      console.log(__dirname);
      const targetPath = path.join(
        __dirname,
        '../public/uploads/' + req.file.filename
      );

      if (
        path.extname(req.file.originalname).toLowerCase() === '.jpeg' ||
        path.extname(req.file.originalname).toLowerCase() === '.png' ||
        path.extname(req.file.originalname).toLowerCase() === '.jpg' ||
        path.extname(req.file.originalname).toLowerCase() === '.wbep'
      ) {
        fs.rename(tempPath, targetPath, async (err) => {
          if (err) throw err;

          const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
            req.file.filename
          }`;

          // Update the user's document with the new image URL
          const userId = req.user._id; // Assuming you have user data available in req.user

          try {
            const user = await User.findById(userId);
            if (user) {
              user.images.push(imageUrl); // Add the new image URL to the images array
              await user.save();
              res.status(200).json({
                message: 'Image uploaded and user updated successfully',
              });
            } else {
              res.status(404).json({ message: 'User not found' });
            }
          } catch (error) {
            console.error('Error updating user with image URL:', error);
            res
              .status(500)
              .json({ message: 'Failed to update user with image URL' });
          }
        });
      } else {
        fs.unlink(tempPath, (err) => {
          if (err) throw err;
          res
            .status(415)
            .json({ message: 'Only JPEG or PNG images are allowed' });
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  }
);
module.exports = router;
