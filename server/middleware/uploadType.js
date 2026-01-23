export const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};
