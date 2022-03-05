import { extendType, nonNull, objectType, stringArg } from "nexus"

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
});

export const SubCategory = objectType({
name: 'SubCategory',
definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
},
});


export const CategoriesQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('allCategories', {
            type: 'MainCategory',
            resolve: (_parent, _args, context) => {
              return context.prisma.mainCategory.findMany()
            },
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
    })
  }
})