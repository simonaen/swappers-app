import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import Landing from '../components/landing/landing.component'
import RecentListings from '../components/landing/recent-listings.component'
import Footer from '../components/footer/footer.component'


export default function Home() {

  return (
    <div>
      <Head>
        <title>Swappers</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Quicksand" />
      </Head>

      <Landing/>
      <RecentListings/>
      <Footer/>
    </div>
  )
}
