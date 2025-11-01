// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { users } from "./usersData.js";

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; // usa una clave segura en producción

// Middleware
app.use(express.json()); // parsea JSON
app.use(cors());

// Middleware: verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Rutas
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
});

app.get("/protected", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Protected data accessed", user: req.user });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
