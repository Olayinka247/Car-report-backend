import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    // the role is to create different access one for admin and one for users
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
    },
    avatar: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    googleID: { type: String },
  },
  {
    timestamps: true,
  }
);

// before saving to data base hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 11);
  }
  next();
});

//reset password
userSchema.methods.resetPassword = async function (password) {
  this.password = await bcrypt.hash(password, 11);
  await this.save();
};

// exclude password and __v from the response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// compare password with hashed password
userSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    } else {
      return null;
    }
  }
  return null;
});

export default model("User", userSchema);
