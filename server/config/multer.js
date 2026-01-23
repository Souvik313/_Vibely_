import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folderName = "posts";

    if (req.uploadType === "profile") {
      folderName = "profile_pictures";
    }

    return {
      folder: folderName,
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

export default upload;
