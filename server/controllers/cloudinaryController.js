import crypto from "crypto";

export const generateSignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "profile_pictures";
  const uploadPreset = "profile_pictures_preset"; // must be signed preset in Cloudinary

  const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;
  console.log("String to sign:", stringToSign);
  const signature = crypto
    .createHmac("sha1", process.env.CLOUDINARY_API_SECRET)
    .update(stringToSign)
    .digest("hex");

  res.json({
    timestamp,
    signature,
    uploadPreset,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};


