const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    province: { type: String, required: true },
    island: { type: String, required: true },
    city: { type: String },
    track: [
      {
        track_name: { type: String, required: true },
        district: { type: String },
        ward: { type: String, required: true },
      },
    ],
  },

  { _id: false }
);

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const ContentSchema = new mongoose.Schema(
  {
    general_information: { type: String, required: true },
    rules: [
      {
        attention: {
          type: Array,
        },
        obligation: {
          type: Array,
          required: true,
        },
        prohibition: {
          type: Array,
          required: true,
        },
      },
    ],
    accessibility: {
      type: Object,
    },
    image_galery: { type: Array, required: true },
    contact: { type: ContactSchema, required: true },
  },
  { _id: false }
);

const DestinationSchema = new mongoose.Schema(
  {
    approved: { type: Boolean, default: false, required: true },
    added_by: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    location: { type: LocationSchema, required: true },
    content: { type: ContentSchema, required: true },
    difficulty: {
      type: String,
      enum: ["pemula", "menengah", "ahli"],
      required: true,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", DestinationSchema);
