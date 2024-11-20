import { Router } from "express";
import { Page } from "../models/page.js";

export const router = Router();

router.get("/pages", async (req, res) => {
  const pages = await Page.findAll({
    where: req.query.publishedOnly === "true" ? { isPublished: true } : {},
  });
  res.json(pages);
});

router.get("/pages/:slug(*)", async (req, res) => {
  const page = await Page.findOne({
    where: {
      slug: req.params.slug,
      isPublished: true,
    },
  });

  if (!page) return res.status(404).json({ message: "Page not found" });
  res.json(page);
});
