import { enumType, extendType, intArg, mutationType, nonNull, objectType, stringArg } from "nexus";
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
            description: "Get all users."
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
          description: "Get user by user email."
      }),
      t.field('allusersPaginated', {
        type: 'UserPagedResponse',
        args: {
          first: intArg(),
          after: stringArg()
        },
        resolve: async (_parent, _args, context) => {
          let queryResults = null

          if (_args.after) {
            queryResults = await context.prisma.user.findMany({
              take: _args.first,
              skip: 1,
              cursor: {
                id: _args.after,
              },
            })
          } else {
            queryResults = await context.prisma.user.findMany({
              take: _args.first,
            })
          }
          if (queryResults.length > 0) {
            const lastUserInResults = queryResults[queryResults.length - 1]
            const myCursor = lastUserInResults.id
  
            const secondQueryResults = await context.prisma.user.findMany({
              take: _args.first,
              cursor: {
                id: myCursor,
              },
              orderBy: {
                createdAt: 'desc',
              },
            })
            const result = {
              pageInfo: {
                endCursor: myCursor,
                hasNextPage: secondQueryResults.length >= _args.first,
              },
              edges: queryResults.map(user => ({
                cursor: user.id,
                node: user,
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
        description: "Get all rows in users table paginated."
    })
  }
})

export const UserMutations = extendType({
  type: 'Mutation',
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
            description: "Set user blocked field to true."
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
            description: "Set user blocked field to false."
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
            description: "Set user role by passing userId and role."
          })
    }
})
