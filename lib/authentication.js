const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
