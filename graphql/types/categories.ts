import { extendType, objectType } from "nexus"

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