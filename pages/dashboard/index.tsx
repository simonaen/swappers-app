import Head from 'next/head'
import Sidebar from '../../components/sidebar/sidebar.component'
import { useUser } from '@auth0/nextjs-auth0'


export default function Dashboard() {
  const { user } = useUser();
  return (
    <div>
      <Head>
        <title>Swappers | Dashboard</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Hi, {user?.name}!</h2>
      </div>
      </Sidebar>
      
    </div>
  )
}
