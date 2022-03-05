import Head from 'next/head'
import Navbar from '../../../components/navbar/nabvar.component'
import Sidebar from '../../../components/sidebar/sidebar.component'
import UsersTable from '../../../components/tables/user-table.component'


export default function ManageUsers() {
  return (
    <div>
      <Head>
        <title>Swappers | Dashboard</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Sidebar>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Manage Users</h2>
        <UsersTable/>
      </div>
      </Sidebar>
      
    </div>
  )
}
