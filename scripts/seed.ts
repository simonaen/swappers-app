import { PrismaClient } from '@prisma/client'
import { create } from 'domain';
import { categories } from './db-seeds/categories';
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      email: 'admin@email.com',
      firstName: 'Sys',
      lastName: 'Admin',
      role: "ADMIN",
    }
  })
  console.log(`Created user: ${admin.firstName, admin.lastName}`)

  console.log(`Start seeding Main Categories.`);

  const mainCatCount = await prisma.mainCategory.count();
  categories.forEach(async category => {
    const main = await prisma.mainCategory.upsert({
      where: {name: category.main_name},
      update: {},
      create: {
        name: category.main_name
      }
    });

    if (await prisma.mainCategory.count() !== mainCatCount) {
      console.log(`Created main category: ${category.main_name}`)
    }

    console.log(`Start seeding Sub Categories for ${main.name}.`);

    const subCatCount = await prisma.subCategory.count();

    category.sub_categories.forEach(async sub => {
      await prisma.subCategory.upsert({
      where: {name: sub.name},
      update: {},
      create: {
        name: sub.name,
        mainCategoryId: main.id
      }
    });
    if (await prisma.subCategory.count() !== subCatCount) {
      console.log(`Created sub category: ${sub.name}`)
    }
  });
  if (await prisma.subCategory.count() == subCatCount) {
    console.log(`No new subcategories for ${category.main_name}.`);
  }
});
console.log(`Finished seeding Sub Categories...`);

if (await prisma.mainCategory.count() == mainCatCount) {
  console.log('No new data seeded in MainCategories.');
}
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })