import Head from 'next/head'
import Navbar from '../../../components/navbar/nabvar.component'
import Sidebar from '../../../components/sidebar/sidebar.component'
import { useUser } from '@auth0/nextjs-auth0'
import { gql } from 'apollo-server-micro'
import { useQuery } from '@apollo/client'
import ListingCard from '../../../components/listing/listing-card.component'

const AllUserListings = gql`
  query allItemsByUser($userId: String!) {
    allItemsByUser(userId: $userId) {
        id
        dateAdded
        dateLastModified
        name
        description
        price
        sold
        owner {
            firstName
            lastName
        }
        contentLinks {
            contentLink
        }
  }
  }
`

export default function Listings() {
    const { data, loading, error } = useQuery(AllUserListings, {variables: {userId: "262be627-9a66-4c3f-a901-b9814cfa5eb7"}});
        
    const { user } = useUser();
    return (
        <div>
        <Head>
            <title>Swappers | Dashboard | Listings</title>
            <meta name="description" content="Swap, sell, and buy collecyable items" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />
        <Sidebar>
        <div className="bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">My listings</h2>
                <div className="my-4">
                    <a href='/dashboard/listings/add' className=" w-fit cursor-pointer items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-200 hover:bg-indigo-200">
                    Add new listing
                    </a>
                </div>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data?.allItemsByUser.map((listing) => (
                <ListingCard key={listing.id} listing={listing}/>
                ))}
                </div>
                </div>
        </div>
        </Sidebar>
        
        </div>
    )
}
