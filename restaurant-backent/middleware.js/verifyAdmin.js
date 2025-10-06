async function verifyAdmin(req, res, next) {
  const user = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

export default verifyAdmin;