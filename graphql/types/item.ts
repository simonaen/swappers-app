import { extendType, intArg, mutationType, nonNull, objectType, stringArg } from "nexus";
import { SubCategory } from "./categories";
import { DateScalar } from "./shared";
import { User } from "./user";

export const Item = objectType({
    name: 'Item',
    definition(t) {
      t.nonNull.string('id')
      t.nonNull.field('dateAdded', { type: DateScalar })
      t.nonNull.field('dateLastModified', { type: DateScalar })
      t.nonNull.string('name')
      t.string('description')
      t.nonNull.int('price')
      t.nonNull.boolean('sold')
      t.field('owner', {
        type: User,
        async resolve(_parent, _args, context) {
          return await context.prisma.item
            .findUnique({
              where: { id: _parent.id || undefined },
            }).owner()
        },
      })
      t.list.field('contentLinks', {
        type: ItemContentLink,
        async resolve(_parent, _args, context) {
          return await context.prisma.item
            .findUnique({
              where: { id: _parent.id || undefined },
            }).contentLinks()
        },
      })
      t.nonNull.field('subCategory', {
        type: SubCategory,
        async resolve(_parent, _args, context) {
          return await context.prisma.item
            .findUnique({
              where: { id: _parent.id || undefined },
            }).subCategory()
        },
      })
    },
    description: "Item object type. Corresponds to listing in UI context. Conatins: id, name, descripition, dateAdded, dateModified, price, availability status (sold), owner, conentLinks, subcategory"
});

export const ItemContentLink = objectType({
  name: 'ItemContentLink',
  definition(t) {
    t.string('contentLink')
    t.string('itemId')
  },
  description: "ItemContentLInk object type. Conatins: contentlink and itemId. Conentlinks cannot be duplicate."
})

export const ItemQuery = extendType({
  type: 'Query',
  definition(t) {
      t.nonNull.list.nonNull.field('allItems', {
          type: 'Item',
          resolve: (_parent, _args, context) => {
            return context.prisma.item.findMany()
          },
          description: "Get all rows in items table."
      }),
      t.field('allItemsPaginated', {
        type: 'ItemPagedResponse',
        args: {
          first: intArg(),
          after: stringArg()
        },
        resolve: async (_parent, _args, context) => {
          let queryResults = null

          if (_args.after) {
            queryResults = await context.prisma.item.findMany({
              take: _args.first,
              skip: 1,
              cursor: {
                id: _args.after,
              },
            })
          } else {
            queryResults = await context.prisma.item.findMany({
              take: _args.first,
            })
          }
          if (queryResults.length > 0) {
            const lastItemInResults = queryResults[queryResults.length - 1]
            const myCursor = lastItemInResults.id
  
            const secondQueryResults = await context.prisma.item.findMany({
              take: _args.first,
              cursor: {
                id: myCursor,
              },
              orderBy: {
                dateAdded: 'desc',
              },
            })
            const result = {
              pageInfo: {
                endCursor: myCursor,
                hasNextPage: secondQueryResults.length >= _args.first,
              },
              edges: queryResults.map(item => ({
                cursor: item.id,
                node: item,
              })),
            }
  
            return result
          }
          
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            edges: [],
          }
        },
        description: "Get all rows in items table paginated."
    }),
      t.list.nonNull.field('allItemsByUser', {
        type: 'Item',
        args: {
          userId: nonNull(stringArg())
        },
        resolve: (_parent, _args, context) => {
          return context.prisma.item.findMany({where: {
            ownerId: _args.userId
          }})
        },
        description: "Get all items by user. Passed arg userId."
    }),
      t.nonNull.field('itemById', {
        type: 'Item',
        args: {
          itemId: nonNull(stringArg())
        },
        resolve: (_parent, _args, context) => {
          return context.prisma.item.findFirst({
            where: {
              id: _args.itemId
            }
          })
        },
        description: "Get single item by it's id."
    }),
    t.list.nonNull.field('filterItems', {
      type: 'Item',
      args: {
        filter: stringArg()
      },
      resolve: (_parent, _args, context) => {
        return context.prisma.item.findMany({
          where: _args.filter
          ? {
              OR: [
                { description: { contains: _args.filter, mode: 'insensitive', } },
                { name: { contains: _args.filter, mode: 'insensitive', } }
              ]
            }
          : {}
        })
      },
      description: "Get all items containing filter in name or description."
  })
  }
});

export const ItemMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteItem', {
      type: 'Item',
      args: {
        itemId: nonNull(stringArg())
      },
      resolve: (_parent, _args, context) => {
        return context.prisma.item.delete({
          where: {
            id: _args.itemId
          }
        })
      },
      description: "Remove item from table."
    })
    t.field('addItem', {
      type: 'Item',
      args: {
        name: nonNull(stringArg()),
        description: stringArg(),
        subCategoryId: nonNull(stringArg()),
        price: nonNull(intArg()),
        ownerId: nonNull(stringArg()),
        color: nonNull('Color')
      },
      resolve: (_parent, _args, context) => {
        return context.prisma.item.create({
          data: _args
        })
      },
      description: "Add new item."
    }),
    t.field('addItemContentLinks', {
      type: 'ItemContentLink',
      args: {
        itemId: nonNull(stringArg()),
        contentLink: nonNull(stringArg()),
      },
      resolve: (_parent, _args, context) => {
        return context.prisma.itemContentLink.create({
          data: _args
        })
      },
      description: "Add new item content link."
    })
  }
});