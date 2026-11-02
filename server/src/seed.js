const fs = require("node:fs/promises");
const path = require("node:path");
require("dotenv").config();

const pool = require("./db");

async function seed() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);

  const menuPath = path.join(__dirname, "..", "..", "src", "data", "foodmenu.json");
  const menu = JSON.parse(await fs.readFile(menuPath, "utf8"));
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM menu_items");
    await client.query("DELETE FROM menu_categories");

    for (const [categoryPosition, category] of menu.categories.entries()) {
      await client.query(
        `INSERT INTO menu_categories (id, name, position)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, position = EXCLUDED.position`,
        [category.id, category.name, categoryPosition],
      );

      for (const [itemPosition, item] of category.items.entries()) {
        await client.query(
          `INSERT INTO menu_items (id, category_id, name, description, price, position)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             category_id = EXCLUDED.category_id,
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             price = EXCLUDED.price,
             position = EXCLUDED.position`,
          [
            item.id,
            category.id,
            item.name,
            item.description,
            item.price,
            itemPosition,
          ],
        );
      }
    }

    await client.query("COMMIT");
    console.log("Menu data seeded successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(async (error) => {
  console.error("Could not seed the database:", error);
  await pool.end();
  process.exitCode = 1;
});
