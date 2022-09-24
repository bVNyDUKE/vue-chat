import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";

const auth = express.Router();

auth.get("/", async (_, res) => {
  res.json({ message: "Hello world!" });
});

auth.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const user = await prisma.user.findUnique({
    where: {
      name: username,
    },
  });

  if (user === null) {
    return res.status(401).json({ message: "Invalid user" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  req.session.regenerate(() => {
    req.session.user = {
      id: user.id,
      name: user.name,
    };
    res.send({ message: "Logged in" });
  });
});

auth.get("/user", async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "No user" });
  }

  res.status(200).json({ user });
});

auth.post("/logout", async (req, res) => {
  req.session.user = null;
  res.send("logged out");
});

export default auth;
