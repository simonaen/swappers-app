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
        <UsersTable/>
      </Sidebar>
      
    </div>
  )
}
