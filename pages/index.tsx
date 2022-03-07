import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import Navbar from '../components/navbar/nabvar.component'
import Landing from '../components/landing/landing.component'


export default function Home() {

  return (
    <div>
      <Head>
        <title>Swappers</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Quicksand" />
      </Head>

      <Navbar />
      <Landing/>
      
    </div>
  )
}
