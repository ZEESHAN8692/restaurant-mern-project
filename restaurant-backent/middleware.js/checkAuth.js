
import User from "../Model/UserModel.js";

async function CheckAuth(req, res, next) {
  try {
    const { sid } = req.signedCookies;
    if (!sid) {
      res.clearCookie("sid");
      return res.status(401).json({ message: "Unauthorized, sid not found" });
    }

    // Find user by ID
    const user = await User.findById(sid).select("-password -__v");
    if (!user) {
      res.clearCookie("sid");
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Attach user to request
    req.user = user;



    next();
  } catch (err) {
    console.error("CheckAuth error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default CheckAuth;
