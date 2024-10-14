import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uploadPicture from "../middleware/uploadPictureHandler.js";
import fileRemover from "../utils/fileRemover.js";

const generateToken = async (_id) => {
  return await jwt.sign({ id: _id }, process.env.JWT_SECRET, {expiresIn: "30d"});
};

const generateHashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const userData = (user, token = null, avatar= '') => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar:avatar,
    verified: user.verified,
    admin: user.admin,
    token: token,
  };
};



export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // check user exists or not
  await User.findOne({ email })
    .then(async (user) => {
      if (user) {
        throw new Error("User have already registered");
      }
      // create a new user
      const hash = await generateHashPassword(password);
      user = await User.create({ name, email, password: hash });
      const token = await generateToken(user._id);
      return res.status(200).json(userData(user, token));
    })
    .catch((err) => {
      next(err);
    });
};



export const login = async (req, res, next) => {
  const { email, password } = req.body;

  await User.findOne({ email: email })
    .then(async (user) => {
      if (!user) {
        throw new Error("email not found");
      }

      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          const error = new Error("Something went wrong");
          next(error);
        }

        if (result) {
          const token = await generateToken(user._id);
          return res.status(200).json(userData(user, token));
        } else {
          const error = new Error("Wrong Password");
          next(error);
        }
      });
    })
    .catch((err) => {
      next(err);
    });
};


export const userProfile = async (req, res, next) => {
  await User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(200).json(userData(user));
      } else {
        let error = new Error("User not found");
        error.statusCode = 404;
        next(error);
      }
    })
    .catch((err) => {
      next(err);
    });
};



export const updateProfile = async (req, res, next) => {
  await User.findById(req.user._id)
    .then(async (user) => {
      if (!user) {
        throw new Error("User not found");
      }
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const hash = await generateHashPassword(req.body.password);
        user.password = hash;
      }
      user.save();
      return res.status(200).json(userData(user));
    })
    .catch((err) => {
      next(err);
    });
};


export const updateProfilePicture = async (req, res, next) => {
  const upload = uploadPicture.single('profilePicture');

  upload(req, res, async (err) => {
    if (err) {
      const error = new Error('Unknown error when uploading');
      return next(error);
    } else {
      if (req.file) {
        try {
          let filename;
          let updatedUser = await User.findByIdAndUpdate(req.user._id);
          filename = updatedUser.avatar;
          if(filename){
            fileRemover(filename)
          }

          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          return res.json(userData(updatedUser, null, updatedUser.avatar));
        } catch (error) {
          return next(error);
        }
      } else {
        try {
          let updatedUser = await User.findById(req.user._id);
          const filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();

          if (filename) {
            fileRemover(filename); // Assuming fileRemover is an async operation
          }

          return res.json(userData(updatedUser));
        } catch (error) {
          return next(error);
        }
      }
    }
  });
};


