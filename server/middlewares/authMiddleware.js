import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.userId;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Non autorisé" });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, pas de jeton" });
  }
};

export default authMiddleware;
