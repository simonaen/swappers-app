import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import ListingCard from "../../components/listing/listing-card.component";
import Navbar from "../../components/navbar/nabvar.component";
import Searchbar from "../../components/searchbar/searchbar.component";

const FilterItemsByCategory = gql`
  query filterItemsBycategoryPaginated($categoryName: String!, $first: Int, $after: String) {
    filterItemsBycategoryPaginated(categoryName: $categoryName, first: $first, after: $after) {
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

export default function FilterResults () {
    const router = useRouter();
    const { category } = router.query;
    console.log(router.query);
    
    const { data, loading, error, fetchMore } = useQuery(FilterItemsByCategory, {variables: {categoryName: category, first: 7}});


    return (
        <div>
        <Head>
            <title>Swappers</title>
            <meta name="description" content="Swap, sell, and buy collecyable items" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-8">
            <h2 className="text-2xl mb-4 font-extrabold tracking-tight text-gray-900">Browsing {category} category</h2>
            <div className="max-h-screen overflow-scroll">
            <div className="mt-6 grid grid-cols-1 gap-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            { loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              </svg>
            ) : (
               data?.filterItemsBycategoryPaginated.edges.length ? ( data?.filterItemsBycategoryPaginated.edges.map((listing) => (
                <ListingCard key={listing.node.id} listing={listing.node}/>
                ))) : (
                <div className="text-xl font-extrabold tracking-tight text-gray-500">No results found :(</div>
                )
            )}
            <div className="flex flex-col-reverse">
            {data?.filterItemsBycategoryPaginated?.pageInfo?.hasNextPage ? (
                
                <p
                    className="cursor-pointer text-gray-500 hover:text-blue-400 font-medium text-center"
                    onClick={() => {
                    fetchMore({
                        variables: { after: data?.filterItemsBycategoryPaginated?.pageInfo?.endCursor },
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
        </div>
    )
}