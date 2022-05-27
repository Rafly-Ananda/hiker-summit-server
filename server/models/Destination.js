const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LocationSchema = new mongoose.Schema(
  {
    province: { type: String, required: true }, // ? provinsi
    island: {
      enum: ["jawa", "sulawesi", "sumatera", "kalimantan", "papua", "lainnya"],
      type: String,
      required: true,
    }, // ? pulau
    city: { type: String }, // ? kota
    track: [
      {
        description: { type: String, required: true },
        accessibility: { type: Object, required: true },
        track_name: { type: String, required: true, unique: true },
        basecamp_name: { type: String, required: true },
        road_name: { type: String, required: true },
        district: { type: String }, // ? kecamatan
        ward: { type: String, required: true }, // ? kelurahan
        village: { type: String, required: true }, // ? desa
        postal_code: { type: Number }, // ? kode pos
        phone_number: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    general_information: { type: String, required: true },
    rules: {
      attention: { type: Object, required: true },
      obligation: { type: Object, required: true },
      prohibition: { type: Object, required: true },
    },
    image_assets: {
      bucket: { type: String },
      assets_key: { type: Array },
    },
  },
  { _id: false }
);

const DestinationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "unactive"],
      default: "unactive",
      required: true,
    },
    added_by: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    location: { type: LocationSchema, required: true },
    content: { type: ContentSchema, required: true },
    price_per_day: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["pemula", "menengah", "ahli"],
      required: true,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DestinationSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Destination", DestinationSchema);
