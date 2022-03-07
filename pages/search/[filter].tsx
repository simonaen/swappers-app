import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import ListingCard from "../../components/listing/listing-card.component";
import Navbar from "../../components/navbar/nabvar.component";
import Searchbar from "../../components/searchbar/searchbar.component";

const FilterItems = gql`
  query filterItems($filter: String) {
    filterItems(filter: $filter) {
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
`

export default function FilterResults () {
    const router = useRouter();
    const { filter } = router.query;
    const { data, loading, error } = useQuery(FilterItems, {variables: {filter: filter}});

    return (
        <div>
        <Head>
            <title>Swappers</title>
            <meta name="description" content="Swap, sell, and buy collecyable items" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-8">
            <h2 className="text-2xl mb-4 font-extrabold tracking-tight text-gray-900">Search results for: {filter}</h2>
            <Searchbar/>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            { loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              </svg>
            ) : (
               data?.filterItems.length ? ( data?.filterItems.map((listing) => (
                <ListingCard key={listing.id} listing={listing}/>
                ))) : (
                <div className="text-xl font-extrabold tracking-tight text-gray-500">No results found :(</div>
                )
            )}
            
            </div>
        </div>
        </div>
    )
}