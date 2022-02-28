import { objectType } from "nexus";
import { DateScalar } from "./shared";
import { User } from "./user";

export const Item = objectType({
    name: 'Item',
    definition(t) {
      t.nonNull.int('id')
      t.nonNull.field('createdAt', { type: DateScalar })
      t.nonNull.field('updatedAt', { type: DateScalar })
      t.nonNull.string('title')
      t.string('content')
      t.nonNull.boolean('published')
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