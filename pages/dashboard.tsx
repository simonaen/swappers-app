import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import Navbar from '../components/navbar/nabvar.component'
import UsersTable from '../components/tables/user-table.component'

const AllUsersQuery = gql`
  query {
    allUsers {
      id
      firstName
      lastName
      email
      blocked
      role
    }
  }
`

export default function Home() {
  const { data, loading, error } = useQuery(AllUsersQuery)

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Oh no... {error.message}</p>

  return (
    <div>
      <Head>
        <title>Swappers</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.allUsers.map(user => (
            <li key={user.id} className="shadow  max-w-md  rounded">
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-sm text-blue-500">{user.firstName}</p>
                <p className="text-lg font-medium">{user.lastName}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <UsersTable></UsersTable>
    </div>
  )
}
