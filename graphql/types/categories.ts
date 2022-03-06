import { enumType, extendType, nonNull, objectType, stringArg } from "nexus"

export const MainCategory = objectType({
    name: 'MainCategory',
    definition(t) {
      t.nonNull.string('id')
      t.nonNull.string('name')
      t.nonNull.list.nonNull.field('subcategories', {
        type: SubCategory,
        resolve: (parent, _, context) => {
          return context.prisma.subCategory
            .findMany({
              where: { mainCategoryId: parent.id || undefined },
            })
        },
      })
    },
    description: "Maincategory object type. Contains: id, name, subcategories list."

});

export const SubCategory = objectType({
  name: 'SubCategory',
  definition(t) {
      t.nonNull.string('id')
      t.nonNull.string('name')
  },
  description: "Subcategory object type. Contains: id, name."
});

export const Color = enumType({
  name: "Color",
  members: ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PURPLE", "PINK", "BROWN", "BEIGE", "WHITE", "BLACK", "GRAY", "MULTICOLOR", "GOLD", "SILVER"],
  description: "Color enumurator."
});


export const CategoriesQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('allCategories', {
            type: 'MainCategory',
            resolve: (_parent, _args, context) => {
              return context.prisma.mainCategory.findMany()
            },
            description: "Get all categories in MainCategory table."

        })
    }
})

export const CategoriesMutation = extendType({
  type: 'Mutation',
  definition(t) {
      t.field('addMainCategory', {
          type: 'MainCategory',
          args: {
            name: nonNull(stringArg())
          },
          resolve: (_parent, _args, context) => {
            return context.prisma.mainCategory.create({
              data: {
                name: _args.name
              }
            }
            )
          },
          description: "Add new category to main categories."
      }),

      t.field('addSubCategory', {
        type: 'SubCategory',
        args: {
          mainCatId: nonNull(stringArg()),
          name: nonNull(stringArg())
        },
        resolve: (_parent, _args, context) => {
          return context.prisma.subCategory.create({
            data: {
              mainCategoryId: _args.mainCatId, 
              name: _args.name
            }
          }
          )
        },
        description: "Add new category to sub categories."
    })
  }
})