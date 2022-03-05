import Head from 'next/head'
import Navbar from '../../../components/navbar/nabvar.component'
import Sidebar from '../../../components/sidebar/sidebar.component'
import CategoriesTable from '../../../components/tables/categories-tables.component'


export default function ManageCategories() {
  return (
    <div>
      <Head>
        <title>Swappers | Dashboard</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Sidebar>
        <CategoriesTable/>
      </Sidebar>
      
    </div>
  )
}
