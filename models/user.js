const { Schema, model } = require("mongoose");
const { createHmac, randomBytes, createHash } = require("crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "./images/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); // Call next to proceed with the save operation

  const salt = randomBytes(16).toString();

  try {
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next(); // Call next to proceed with the save operation
  } catch (error) {
    return next(error); // Pass the error to the next callback
  }
});
userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not Found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password) // Fix: Use the provided password, not the stored one
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    // Fix: Use strict equality check !==
    throw new Error("Invalid Password");
  }

  return { ...user.toObject(), password: undefined, salt: undefined }; // Fix: Use toObject to remove mongoose-specific properties
});

const User = model("user", userSchema);

module.exports = {
  User,
};
