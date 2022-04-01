const mongoose = require("mongoose");

// ? academind locally saved image
// const ImageSchema = new mongoose.Schema(
//   {
//     name: String,
//     img_uri: String,
//   },
//   { timestamps: true }
// );

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image_type: { type: String, required: true },
    image: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Image", ImageSchema);
