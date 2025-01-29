const authenticate = async (req, res, next) => {
  try {
    console.log("Incoming request for authentication...");
    console.log("Cookies received in request:", req.cookies);

    const token = req.cookies.jwtoken;
    console.log("Token extracted:", token);

    if (!token) {
      console.log("❌ No token found in cookies.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log("✅ Token successfully verified:", verifyToken);

    const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
    console.log("🔍 User found in DB:", rootUser);

    if (!rootUser) {
      console.log("❌ User not found or token mismatch.");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    console.log("✅ Authentication successful. Proceeding to next middleware.");
    next();
  } catch (error) {
    console.log("❌ Error in authentication middleware:", error.message);
    return res.status(401).json({ error: "Unauthorized: Token verification failed" });
  }
};
