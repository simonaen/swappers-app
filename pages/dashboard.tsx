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
        <title>Swappers | Dashboard</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <UsersTable></UsersTable>
    </div>
  )
}
