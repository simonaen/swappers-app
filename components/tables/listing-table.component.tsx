import { gql, useMutation, useQuery } from "@apollo/client"
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";

const AllItemsQuery = gql`
  query {
    allItems {
        id
        dateAdded
        dateLastModified
        name
        description
        sold
        owner {
            email
            firstName
            lastName
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
    let { data, loading, error } = useQuery(AllItemsQuery);
    const [deleteItem] = useMutation(DeleteItem);
    const [value, setValue] = useState();

    const deleteItemAndRefresh = (itemId: string) => {
        deleteItem({variables: { itemId: itemId}});
        window.location.reload();
    }

    console.log(data);
    
return (
    
    <div className="flex flex-col p-5">
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
                {data?.allItems.map((item) => (
                <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 whitespace-pre-line">{item.description}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.owner.email}</div>
                        <div className="text-sm text-gray-500">{item.owner.firstName} {item.owner.lastName}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.dateAdded}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.dateLastModified}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        { item?.sold ? (
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
                    <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => deleteItemAndRefresh(item.id)}>
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
)
}
