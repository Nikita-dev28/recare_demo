import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: "Invalid or expired token",
    });
  }
};
