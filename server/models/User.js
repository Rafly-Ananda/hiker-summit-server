const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema( // ? user bisa upload foto
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    destination_wishlist: { type: Array },
    user_status: {
      type: String,
      enum: ["umum", "guide"],
      required: true,
      default: "umum",
    },
    image_assets: {
      bucket: { type: String },
      assets_key: { type: String },
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
