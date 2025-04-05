const { PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const s3 = require("../config/awsConfig"); // your s3 client

const uploadToS3 = async (fileBuffer, filename, folder) => {
  const compressedBuffer = await sharp(fileBuffer)
    .resize(800)
    .jpeg({ quality: 70 })
    .toBuffer();

  const key = `${folder}/${uuid()}-${filename}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: compressedBuffer,
    ContentType: "image/jpeg",
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
};

module.exports = { uploadToS3 };
