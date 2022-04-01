const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema( // ? user bisa upload foto
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    destination_wishlist: { type: Array },
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
