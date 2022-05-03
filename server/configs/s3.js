const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new aws.S3();

const s3Folders = {
  auth: "user_assets",
  users: "user_assets",
  destinations: "destination_assets",
  bookings: "payment",
};

module.exports = {
  s3,
  s3Folders,
};
