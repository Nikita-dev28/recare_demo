import jwt from "jsonwebtoken";
import { loginUser } from "./service.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await loginUser(email, password);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // HIPAA tip: never include PHI in tokens
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = {
      email: user.email,
      id: user._id,
      token: token,
      name: user.name,
    };

    res.status(200).json({
      message: "Login successful",
      user: response,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
