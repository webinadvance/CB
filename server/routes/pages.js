import { Router } from "express";
import { Page } from "../models/page.js";
import { PagePlaceholder } from "../models/pagePlaceholder.js";

export const router = Router();

router.get("/pages", async (req, res) => {
  try {
    const { publishedOnly } = req.query;
    let query = {
      include: [
        {
          model: PagePlaceholder,
          as: "placeholders",
        },
      ],
    };

    if (publishedOnly === "true") {
      query.where = { isPublished: true };
    }

    const pages = await Page.findAll(query);

    const transformedPages = pages.map((page) => ({
      ...page.toJSON(),
      placeholdersDictionary: page.placeholders.reduce((acc, ph) => {
        acc[ph.key] = ph;
        return acc;
      }, {}),
    }));

    res.json(transformedPages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/pages/:slug", async (req, res) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
        isPublished: true,
      },
      include: [
        {
          model: PagePlaceholder,
          as: "placeholders",
        },
      ],
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const transformedPage = {
      ...page.toJSON(),
      placeholdersDictionary: page.placeholders.reduce((acc, ph) => {
        acc[ph.key] = ph;
        return acc;
      }, {}),
    };

    res.json(transformedPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
