import Head from 'next/head'
import Sidebar from '../../../components/sidebar/sidebar.component'
import { useUser } from '@auth0/nextjs-auth0'
import { gql } from 'apollo-server-micro'
import { useQuery } from '@apollo/client'
import ListingCard from '../../../components/listing/listing-card.component'

const AllUserListings = gql`
  query allItemsByUser($userEmail: String!, $first: Int, $after: String) {
    allItemsByUser(userEmail: $userEmail, first: $first, after: $after) {
        pageInfo {
            endCursor
            hasNextPage
        }
        edges {
            cursor
            node {
                id
                name
                description
                price
                sold
                contentLinks {
                    contentLink
                }
            }
        }
    }
  }
`

export default function Listings() {
    const userContext = useUser();
    const { data, loading, error, fetchMore } = useQuery(AllUserListings, {
        variables: {
            userEmail: userContext.user?.email || "enevasimona@gmail.com",
            first: 6
        }
    });
    

    return (
        <div>
        <Head>
            <title>Swappers | Dashboard | Listings</title>
            <meta name="description" content="Swap, sell, and buy collecyable items" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

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
            {data?.allItemsByUser?.edges.map((listing) => (
                <ListingCard key={listing.node.id} listing={listing.node}/>
            ))}
            <div className="flex flex-col-reverse">
            {data?.allItemsByUser?.pageInfo?.hasNextPage ? (
                
                <p
                    className="cursor-pointer text-gray-500 hover:text-blue-400 font-medium text-center"
                    onClick={() => {
                    fetchMore({
                        variables: { after: data?.allItemsByUser?.pageInfo?.endCursor },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                        fetchMoreResult.links?.edges = [
                            ...prevResult.links?.edges,
                            ...fetchMoreResult.links?.edges,
                        ];
                        return fetchMoreResult;
                        },
                    });
                    }}
                >
                    load more
                </p>
                ) : (
                <p className="text-center font-medium">
                    You've reached the end!{" "}
                </p>
            )}
            </div>
                </div>
                </div>
        </div>
        </Sidebar>
        
        </div>
    )
}
