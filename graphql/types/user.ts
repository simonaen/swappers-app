import { enumType, extendType, inputObjectType, objectType } from "nexus";
import { Item } from "./item";

export const User = objectType({
    name: 'User',
    definition(t) {
      t.nonNull.string('id')
      t.string('firstName')
      t.string('lastName')
      t.nonNull.string('email')
      t.nonNull.boolean('blocked')
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
        })
    }
})
