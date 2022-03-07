import { Kind } from "graphql"
import { objectType, scalarType } from "nexus"
import { Item } from "./item"
import { User } from "./user"

export const DateScalar = scalarType({
    name: 'Date',
    asNexusMethod: 'date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value)
    },
    serialize(value) {
      return value.getTime()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null
    },
  })

export const ItemEdge = objectType({
  name: 'ItemEdge',
  definition(t) {
    t.string('cursor')
    t.field('node', {
      type: Item,
    })
  },
})

export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('endCursor')
    t.boolean('hasNextPage')
  },
})

export const ItemPagedResponse = objectType({
  name: 'ItemPagedResponse',
  definition(t) {
    t.field('pageInfo', { type: PageInfo })
    t.list.field('edges', {
      type: ItemEdge,
    })
  },
})

export const UserEdge = objectType({
  name: 'UserEdge',
  definition(t) {
    t.string('cursor')
    t.field('node', {
      type: User,
    })
  },
})

export const UserPagedResponse = objectType({
  name: 'UserPagedResponse',
  definition(t) {
    t.field('pageInfo', { type: PageInfo })
    t.list.field('edges', {
      type: UserEdge,
    })
  },
})