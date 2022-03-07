import { gql, useQuery } from "@apollo/client";
import ListingCard from "../listing/listing-card.component";

const Items = gql`
  query allItemsPaginated($first: Int, $after: String) {
    allItemsPaginated(first: $first, after: $after) {
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

export default function RecentListings () {
    const { data, loading, error } = useQuery(Items, {variables: {first: 4}});

    if  (loading) return (<div>Loading</div>)
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Recent listings</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data?.allItemsPaginated.edges.map((listing) => (
                <ListingCard key={listing.node.id} listing={listing.node}/>
                ))}
                </div>
        </div>
    )
}