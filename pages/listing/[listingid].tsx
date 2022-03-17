import { useQuery } from "@apollo/client"
import { gql } from "apollo-server-micro"
import Head from "next/head"
import { useRouter } from "next/router"

const Listing = gql`
  query itemById($itemId: String!) {
    itemById(itemId: $itemId) {
        id
        dateAdded
        dateLastModified
        name
        description
        price
        sold
        owner {
            id
            firstName
            lastName
        }
        contentLinks {
            contentLink
        }
        subCategory {
            name
        }
  }
  }
`
export default function ListingOverview() {
    const router = useRouter();
    const { listingid } = router.query
    const {data, loading, error} = useQuery(Listing, {variables: {itemId: listingid}});
    let key = 1;
    
    return (
        <div>
        <Head>
        <title>Swappers | {data?.itemById.name}</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        {data?.itemById ? (
            <div className="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol role="list" className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li>
                            <div className="flex items-center">
                            <a href="/browse" className="mr-2 text-sm font-medium text-gray-900">
                                Categories
                            </a>
                            <svg
                                width={16}
                                height={20}
                                viewBox="0 0 16 20"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-5 text-gray-300"
                            >
                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                            </svg>
                            </div>
                        </li>
                        <li className="text-sm">
                        <a href={'/browse/' + data?.itemById.subCategory.name.toLowerCase()} 
                           aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                            {data?.itemById.subCategory.name}
                        </a>
                        </li>
                    </ol>
                </nav>
            {/* Image gallery */}
            <div className="grid grid-cols-3 gap-1.5 mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl">
            {data?.itemById.contentLinks.map((cl) => (
                <div key={key++} className={key === 1 ? "col-span-2 rounded-lg  overflow-hidden lg:block" : "rounded-lg overflow-hidden lg:block2"}>
                        <img
                        src={cl.contentLink}
                        className="w-full h-full object-center object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Product info */}
            <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{data?.itemById.name}</h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:mt-0 lg:row-span-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">${data?.itemById.price}</p>
                { data?.itemById.sold ? (
                    <span className="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sold
                    </span> 
                    ) : (
                    <span className="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                    </span> 
                )}
            {/* Owner */}
                <div className="my-2">
                    <h2 className="sr-only">Owner information</h2>
                    <p className="text-sm text-gray-700">Posted by 
                    <a className="cursor-pointer hover:text-blue-400"> {data?.itemById.owner.firstName} {data?.itemById.owner.lastName}</a></p> 
                    <p className="text-sm text-gray-700">On {data?.itemById.dateAdded}</p>
                    { (data?.itemById.sold || router.pathname.includes('message')) ? (null) :(
                    <div className="mt-4 w-fit items-center justify-center px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-white bg-blue-200 hover:bg-indigo-200"
                            onClick={()=> {router.push('/listing/message/' + listingid)}}>
                    Message owner
                    </div>
                    )}
                </div>
            </div>

            <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                {/* Description and details */}
                <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                    <p className="text-base text-gray-900">{data?.itemById.description}</p>
                </div>
                </div>
            </div>
            </div>
            </div>
        ) : (null)}
        </div>
    )
}
