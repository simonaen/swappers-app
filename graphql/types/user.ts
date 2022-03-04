import { enumType, extendType, mutationType, nonNull, objectType, stringArg } from "nexus";
import { Item } from "./item";
import { DateScalar } from "./shared";

export const User = objectType({
    name: 'User',
    definition(t) {
      t.nonNull.string('id')
      t.string('firstName')
      t.string('lastName')
      t.nonNull.string('email')
      t.nonNull.boolean('blocked')
      t.nonNull.field('createdAt', {type: DateScalar})
      t.nonNull.field('role', {type: Role})
      t.nonNull.list.nonNull.field('items', {
        type: Item,
        async resolve(_parent, _args, context) {
          return await context.prisma.user
            .findUnique({
              where: { id: _parent.id || undefined },
            }).items()
        },
      })
    },
    description: "Application User model"
});

export const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
  description: "Roles enumurator. Conatains value: USER, ADMIN."
});

export const UsersQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('allUsers', {
            type: 'User',
            resolve: (_parent, _args, context) => {
              return context.prisma.user.findMany()
            },
        }),
        t.nonNull.field('user', {
          type: 'User',
          args: {
            userEmail: nonNull(stringArg())
          },
          resolve: (_parent, _args, context) => {
            return context.prisma.user.findFirst({
              where: {email: _args.userEmail}
            })
          },
      })
    }
})

export const UserMutations = mutationType({
    definition(t) {
          t.field('blockUser', {
            type: 'User',
            args: {
              userId: nonNull(stringArg())
            },
            resolve: (_parent, _args, context) => {
              return context.prisma.user.update({
                where: {
                  id: _args.userId
                },
                data: {
                  blocked: true
                }
              })
            },
          })

          t.field('unblockUser', {
            type: 'User',
            args: {
              userId: nonNull(stringArg())
            },
            resolve: (_parent, _args, context) => {
              return context.prisma.user.update({
                where: {
                  id: _args.userId
                },
                data: {
                  blocked: false
                }
              })
            },
          })

          t.field('changeUserRole', {
            type: 'User',
            args: {
              userId: nonNull(stringArg()),
              role: nonNull(Role)
            },
            resolve: (_parent, _args, context) => {
              return context.prisma.user.update({
                where: {
                  id: _args.userId
                },
                data: {
                  role: _args.role
                }
              })
            },
          })
    }
})
