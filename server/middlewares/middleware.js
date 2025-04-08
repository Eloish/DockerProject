export const date = (req, res, next) => {
  const now = new Date();
  console.log(
    `${now.toLocaleDateString()} - ${now.toLocaleTimeString} - ${
      req.method
    } - ${req.path}`
  );
  next();
};

export const monPath = (req, res, next) => {
  console.log(req.path);
  next();
};
