import { gql, useMutation, useQuery } from "@apollo/client"
import { useUser } from "@auth0/nextjs-auth0";
import React, { useState } from "react";

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

const AddNewMainCategory = gql`
    mutation addMainCategory($name: String!) {
        addMainCategory(name: $name) {
            id
        }
    }
`

const AddNewSubCategory = gql`
    mutation addSubCategory($mainCatId: String!, $name: String!) {
        addSubCategory(mainCatId: $mainCatId, name: $name) {
            id
        }
    }
`

export default function CategoriesTable() {
    const { user } = useUser();
    const { data, loading, error } = useQuery(AllCategoriesQuery)
    const [addMainCategory] = useMutation(AddNewMainCategory);
    const [addSubCategory] = useMutation(AddNewSubCategory);

    const [showModal, setShowModal] = useState(false);
    const [mainCategoryForm, setMainCatValues] = useState({mainName: ''});
    const [subCategoryForm, setSubCatValues] = useState({mainCatId: data?.allCategories[0].id, subName: ''});

    const set = (name) => {
        return ({ target: { value } }) => {
          setMainCatValues(oldValues => ({...oldValues, [name]: value }));
          setSubCatValues(oldValues => ({...oldValues, [name]: value }));
        }
      };

    const onSubmitNewMain = (event) => {
        event.preventDefault();

        addMainCategory({
            variables: {
                name: mainCategoryForm.mainName
            }
        });

        setMainCatValues({
            mainName: ''
        });

        setShowModal(false); 
        window.location.reload();
    }

    const onSubmitNewSub = (event) => {
        event.preventDefault();
        console.log(subCategoryForm);
        
        addSubCategory({
            variables: {
                mainCatId: subCategoryForm.mainCatId, 
                name: subCategoryForm.subName
            }
        });

        setSubCatValues({
            mainCatId: '',
            subName: ''
        });

        setShowModal(false); 
        window.location.reload();
    }
    
    
return (
    
    <div className="flex flex-col py-5">
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
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="flex my-4">
                <div className="w-fit items-center justify-center px-4 py-2 mr-4 border border-transparent rounded-md shadow-sm text-white bg-blue-200 hover:bg-indigo-200"
                    onClick={()=> setShowModal(true)}>
                  Add new category
                </div>
        </div>
        </div>
    </div>
    {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add category
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
                <div className="grid grid-cols-2 gap-4 divide-x-2">
                    <div>
                    <p className="text-sm p-5 text-gray-500">Add new main category.</p>
                    <form onSubmit={onSubmitNewMain}>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="flex flex-col">
                                <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    value={mainCategoryForm.mainName}
                                    onChange={set('mainName')}
                                    type="text"
                                    name="category-name"
                                    id="category-name"
                                    className="mt-1 block w-max shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                </div>
                            </div>
                            </div>
                            <div className="px-4 py-3  text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-200 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save
                            </button>
                            </div>
                        </div>
                    </form>
                    </div>
                    <div>
                    <p className="text-sm p-5 text-gray-500">Add new sub category.</p>
                    <form onSubmit={onSubmitNewSub}>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="flex flex-col">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="maincategory" className="block text-sm font-medium text-gray-700">
                                        Main category
                                    </label>
                                    <select
                                        value={subCategoryForm.mainCatId}
                                        onChange={set('mainCatId')}
                                        id="maincategory"
                                        name="maincategory"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    >
                                        {data?.allCategories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="subcategory-name" className="block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    value={subCategoryForm.subName}
                                    onChange={set('subName')}
                                    type="text"
                                    name="subcategory-name"
                                    id="subcategory-name"
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                </div>
                            </div>
                            </div>
                            <div className="px-4 py-3  text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-200 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save
                            </button>
                            </div>
                        </div>
                    </form>
                    </div>
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
