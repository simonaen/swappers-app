import { extendType, mutationType, nonNull, objectType, stringArg } from "nexus";
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
      t.list.field('contentLinks', {
        type: ItemContentLink,
        async resolve(_parent, _args, context) {
          return await context.prisma.item
            .findUnique({
              where: { id: _parent.id || undefined },
            }).contentLinks()
        },
      })
      t.nonNull.int('price')
      t.nonNull.boolean('sold')
      t.nonNull.int('viewCount')
      t.field('owner', {
        type: User,
        async resolve(_parent, _args, context) {
          return await context.prisma.item
            .findUnique({
              where: { id: _parent.id || undefined },
            }).owner()
        },
      })
    },
});

export const ItemContentLink = objectType({
  name: 'ItemContentLink',
  definition(t) {
    t.string('contentLink')
    t.string('itemId')
  }
})

export const ItemQuery = extendType({
  type: 'Query',
  definition(t) {
      t.nonNull.list.nonNull.field('allItems', {
          type: 'Item',
          resolve: (_parent, _args, context) => {
            return context.prisma.item.findMany()
          },
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
    })
  }
});