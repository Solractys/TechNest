const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Adding additional categories...");

    // Check existing categories to avoid duplicates
    const existingCategories = await prisma.category.findMany();
    const existingSlugs = existingCategories.map((cat) => cat.slug);

    // Define new categories
    const newCategories = [
      { name: "Frontend", slug: "frontend" },
      { name: "Backend", slug: "backend" },
      { name: "DevOps", slug: "devops" },
      { name: "Data Science", slug: "data-science" },
      { name: "Machine Learning", slug: "machine-learning" },
      { name: "Cloud Computing", slug: "cloud-computing" },
      { name: "Cybersecurity", slug: "cybersecurity" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "Internet of Things", slug: "internet-of-things" },
    ];

    // Filter out categories that already exist
    const categoriesToAdd = newCategories.filter(
      (cat) => !existingSlugs.includes(cat.slug),
    );

    if (categoriesToAdd.length === 0) {
      console.log("All categories already exist. No new categories to add.");
      return;
    }

    // Add categories in batch
    const result = await prisma.category.createMany({
      data: categoriesToAdd,
      skipDuplicates: true,
    });

    console.log(`Successfully added ${result.count} new categories`);

    // List all categories
    const allCategories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    console.log("Total categories now:", allCategories.length);
    console.log("All categories:");
    allCategories.forEach((cat) => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
  } catch (error) {
    console.error("Error adding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

