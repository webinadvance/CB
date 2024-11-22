import { sequelize } from "./config.js";
import { Page } from "../models/page.js";
import { PagePlaceholder } from "../models/pagePlaceholder.js";

export async function initializeDatabase() {
  await sequelize.sync({ force: true });

  await Page.bulkCreate([
    {
      title: "Home",
      slug: "home",
      contentData: {
        "main-content": { content: "Welcome" },
        "hero-title": { content: "Hero Title" },
      },
    },
    {
      title: "Test",
      slug: "test",
      componentName: "TestComponent",
      contentData: {
        "main-content": { content: "Test content" },
      },
    },
    {
      title: "Dynamic",
      slug: "aaa/bbb",
      componentName: "TestComponent2",
      paramSchema: ["item1", "item2"],
      contentData: {
        "main-content": { content: "Dynamic content" },
      },
    },
  ]);
}
