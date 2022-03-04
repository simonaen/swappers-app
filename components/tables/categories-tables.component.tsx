import { gql, useQuery } from "@apollo/client"
import { useUser } from "@auth0/nextjs-auth0";
import React from "react";

const AllCategoriesQuery = gql`
  query {
    allCategories {
      id
      name
      subcategories {
        id
        name
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

export default function CategoriesTables() {
    const { user } = useUser();
    const { data, loading, error } = useQuery(AllCategoriesQuery)
    const [showModal, setShowModal] = React.useState(false);

    let modaldata: any;
    const openModal = (category: any) => {
        modaldata = category;
        setShowModal(true); 
    }
    
    
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
                    Main Categories
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Sub Categories
                </th>
                <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data?.allCategories.map((category) => (
                <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4" onClick={() => refreshSubcatTable(category.id)}>
                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-400">{category.name}</div>
                        <div className="text-sm text-gray-500 whitespace-pre-line">{category.subcategories.length} subcategories</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4">
                        <div className="text-sm text-gray-900 ">
                            {category.subcategories.map((subcat)=> (
                                subcat.name + '/'
                            ))}
                            </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => openModal(category)}>
                        Edit
                    </a>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Update {modaldata?.name}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null }
    </div>

)
}
