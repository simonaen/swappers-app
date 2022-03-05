import Head from 'next/head'
import Navbar from '../../../components/navbar/nabvar.component'
import Sidebar from '../../../components/sidebar/sidebar.component'
import ListingTable from '../../../components/tables/listing-table.component'


export default function ManageActivity() {
  return (
    <div>
      <Head>
        <title>Swappers | Dashboard | Manage Listings</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Sidebar>
        <ListingTable/>
      </Sidebar>
      
    </div>
  )
}
