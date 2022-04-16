const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new aws.S3();

const s3Folders = [
  "destination_assets",
  "user_assets",
  "app_assets",
  "payment",
];

module.exports = {
  s3,
  s3Folders,
};
