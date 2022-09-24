import express from "express";
import cors from "cors";
import auth from "./auth";
import session from "express-session";
import { prisma } from "../db";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const app = express();

export const sessionParser = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  secret: process.env.secret as string,
  resave: true,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
});

app.use(express.static("public"));
app.use(sessionParser);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());

app.use("/api", auth);

app.get("/api/messages", async (req, res) => {
  if (req.session.user === null) {
    return res.status(401);
  }
  const messages = await prisma.message.findMany({
    select: {
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.send({ data: messages });
});

export default app;
