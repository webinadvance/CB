import { sequelize } from "./config.js";
import { Page } from "../models/page.js";
import { PagePlaceholder } from "../models/pagePlaceholder.js";

export async function initializeDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Seed initial data
    const pages = [
      {
        title: "Home Page",
        slug: "home",
        isPublished: true,
        placeholders: [
          {
            key: "hero-title",
            content: "Welcome to MySvelteCMS",
            contentType: "text",
          },
          {
            key: "hero-content",
            content: "This is a sample content managed by our CMS",
            contentType: "html",
          },
        ],
      },
      {
        title: "About Us",
        slug: "about",
        isPublished: true,
        placeholders: [
          {
            key: "main-content",
            content: "About page content goes here",
            contentType: "markdown",
          },
        ],
      },
      {
        title: "Custom Test Page",
        slug: "custom-test",
        redirectUrl: "/test",
        isPublished: true,
      },
      {
        title: "Test Page",
        slug: "test",
        componentName: "TestComponent",
        isPublished: true,
        placeholders: [
          {
            key: "main-content",
            content: "Test page content",
            contentType: "html",
          },
        ],
      },
      {
        title: "Test Page 2",
        slug: "test2",
        componentName: "TestComponent2",
        isPublished: true,
        placeholders: [
          {
            key: "main-content",
            content: "Test page content",
            contentType: "html",
          },
        ],
      },
    ];

    // Create pages with their placeholders
    for (const pageData of pages) {
      const placeholders = pageData.placeholders;
      delete pageData.placeholders;

      const page = await Page.create(pageData);

      if (placeholders) {
        await Promise.all(
          placeholders.map((placeholder) =>
            PagePlaceholder.create({
              ...placeholder,
              pageId: page.id,
            }),
          ),
        );
      }
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
