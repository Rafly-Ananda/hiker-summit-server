const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    province: { type: String, required: true }, // ? provinsi
    island: { type: String, required: true }, // ? pulau
    city: { type: String }, // ? kota
    track: [
      {
        track_name: { type: String, required: true },
        basecamp_name: { type: String, required: true },
        road_name: { type: String, required: true },
        district: { type: String }, // ? kecamatan
        ward: { type: String, required: true }, // ? kelurahan
        village: { type: String, required: true }, // ? desa
        postal_code: { type: Number }, // ? kode pos
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
    note: { type: String },
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
    image_galery: { type: Array, required: true }, // ? an array of string containing the filename / image id || max 5 picture
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
    price_per_person: { type: Number, required: true },
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
