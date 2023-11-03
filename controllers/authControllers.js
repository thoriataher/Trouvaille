const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const { token } = require("morgan");
const Email = require("./../utils/email");
const crypto = require("crypto");
const { reset } = require("nodemon");
const { validateHeaderValue } = require("http");
const { url } = require("inspector");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);
  // Remove Password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    city: req.body.city,
    role: req.body.role,

  });


    
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // const token =signToken(newUser._id)

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password ", 404));
  }
  // 2) check if user exist && password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password ", 400));
  }
  // 3) if everything ok , send token to cleint

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token an check of it`s there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2)verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError(
        "the user  belonging to this token  does no longer exsit ",
        401
      )
    );
  }

  // 4) check if user change password after the token was isued
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError("User  recently changed password! please login agin ", 405)
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles in is array ["admin","lead-guide"] . role="usre" >>>user not have any premission
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action ", 402)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1- Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user`s email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to:${resetURL}./n if you did not forget your password ,please ignore this email !`;

  // try {
  // await Email({
  //   email: user.email,
  //   subject: "Your password reset token (valid for 10 min)",
  //   message,
  // });

  res.status(200).json({
    status: "success",
    message: "Token sent to email ",
  });
  // } catch (err) {
  //   (user.passwordResetToken = undefined),
  //     (user.passwordResetExpires = undefined);

  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError(
  //       "there was an error sending the email ,try again later !",
  //       500
  //     )
  //   );
  // }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired ,and there is user , set the new password
  if (!user) {
    return next(new AppError("token is invaild or has expired ", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 3) Ubdate changePasswordAT property for the user

  // 4) Log the user in, send jwt
  const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).send(token).json({
    status: "success",
    token: token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //2) Cheack  if Postd current password is corect

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong !", 401));
  }

  // 3) If so ,update password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // User.findByIdAndUpdate will Not Work as intended !

  // 4) log user in ,send twt

  createSendToken(user, 200, res);
  //   const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN,
  //   });

  //   res.status(200).send(token).json({
  //     status: 'success',
  //     token: token,
  //   });
  // });
  // correctPassword(password, user.password)
});
