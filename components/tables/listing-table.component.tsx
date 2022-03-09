import { gql, useMutation, useQuery } from "@apollo/client"
import { useUser } from "@auth0/nextjs-auth0";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useState } from "react";

const AllItemsQuery = gql`
  query allItemsPaginated($first: Int, $after: String){
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
                dateAdded
                dateLastModified
                owner {
                    email
                    firstName
                    lastName
                }
                contentLinks {
                    contentLink
                }
            }
        }
    }
  }
`

const DeleteItem = gql`
    mutation deleteItem($itemId: String!) {
        deleteItem(itemId: $itemId) {
            id
        }
    }
`

export default function ListingTable() {
    const { user } = useUser();
    let { data, loading, error, fetchMore } = useQuery(AllItemsQuery,  {variables: {first: 7}});
    const [deleteItem] = useMutation(DeleteItem);
    const [value, setValue] = useState();

    const deleteItemAndRefresh = (itemId: string) => {
        deleteItem({variables: { itemId: itemId}});
        window.location.reload();
    }
    
return (
    
    <><div className="flex flex-col py-5">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Item Info
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Owner
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Date Added
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Date Modified
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>

                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.allItemsPaginated.edges.map((item) => (
                                <tr key={item.node.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.node.name}</div>
                                                <div className="text-sm text-gray-500 whitespace-pre-line">{item.node.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.node.owner?.email}</div>
                                                <div className="text-sm text-gray-500">{item.node.owner?.firstName} {item.node.owner?.lastName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.node.dateAdded}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.node.dateLastModified}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item?.sold ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Sold
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Available
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => deleteItemAndRefresh(item.node.id)}>
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            { data?.allItemsPaginated?.pageInfo?.hasNextPage ? (
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <div className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            onClick={() => {
                                fetchMore({
                                    variables: { after: data?.allItemsPaginated?.pageInfo?.endCursor },
                                    updateQuery: (prevResult, { fetchMoreResult }) => {
                                        console.log(fetchMoreResult);
                                        
                                    fetchMoreResult.links?.edges = [
                                        ...prevResult.links?.edges,
                                        ...fetchMoreResult.links?.edges,
                                    ];
                                    return fetchMoreResult;
                                    },
                                });
                                }}>
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                    </nav>
                </div>
            ) : (null)}
                
        </div></>
)
}
