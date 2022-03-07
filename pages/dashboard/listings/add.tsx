import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import Navbar from '../../../components/navbar/nabvar.component';
import Sidebar from '../../../components/sidebar/sidebar.component';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Color } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useS3Upload } from 'next-s3-upload';


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

const User = gql`
  query user($userEmail: String!) {
    user(userEmail: $userEmail) {
        id
    }
  }
`

const AddNewItem = gql`
    mutation addItem($name: String!, $description: String, 
    $subCategoryId: String!, $price: Int!, $ownerId: String!, $color: Color!) {
      addItem(name: $name, description: $description, 
        subCategoryId: $subCategoryId, price: $price, ownerId: $ownerId, color: $color) {
            id
        }
    }
`

const AddItemContentLink = gql`
    mutation addItemContentLinks($itemId: String!, $contentLink: String!) {
      addItemContentLinks(itemId: $itemId, contentLink: $contentLink) {
            itemId
        }
    }
`

export default function AddListing() {
    const router = useRouter();
    const user = useUser();
    const { data, loading, error } = useQuery(AllCategoriesQuery);
    const userQuery = useQuery(User, {variables: {
        userEmail: user.user?.email
    }});
    const [subcategoriesList, setsubcategoriesList] = useState({subcategoriesList: []});
    const [addItem] = useMutation(AddNewItem);
    const [addItemContentLinks] = useMutation(AddItemContentLink);

    
    let [imageUrl, setImageUrl] = useState({list: []});
    let { uploadToS3 } = useS3Upload();
    let contentLinks: string[] = [];

    const colorsList = Object.values(Color);
    let mainCatIndex = 0;
    
    const getSubcategories = (event) => {
        event.preventDefault();
        setsubcategoriesList({
          subcategoriesList: data?.allCategories[event.target.value]?.subcategories
        })
    }

    
    const handleFileChange = async (event) => {
      let file = event.target.files[0];
      let { url } = await uploadToS3(file);
      setImageUrl({
        list: [...imageUrl.list, url]
      })
    }

    const addListing = async (event) => {
      event.preventDefault();
      const userId = userQuery.data?.user?.id;
      let newItemId: string;
      
      console.log(imageUrl.list);
      
      const newItem = await addItem({
        variables: {
          name: event.target.name.value,
          description: event.target.price.value,
          subCategoryId: event.target.subcategory.value,
          price: parseInt(event.target.price.value),
          ownerId: userId,
          color: event.target.color.value
        }
      }); 

      imageUrl.list.forEach(cl => {
          addItemContentLinks({variables: {
            itemId: newItem?.data?.addItem.id,
            contentLink: cl
          }}).then((res) => {
            router.push('/listing/' + res?.data?.addItemContentLinks.itemId)
          })
        });
    }

    return (
        <div>
        <Head>
            <title>Swappers | Add Listing</title>
            <meta name="description" content="Swap, sell, and buy collecyable items" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />
        <Sidebar>
        <div className="bg-white max-h-full overflow-scroll">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Add new listing</h2>

            <div>
        <div className="flex flex-col">
          <div className="mt-5">
            <form onSubmit={addListing}>
              <div>
                <div className="py-5 bg-white space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          placeholder="Listing name"
                        />
                      </div>
                    </div>
                    <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          placeholder="$$$"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1">
                      <label htmlFor="maincategory" className="block text-sm font-medium text-gray-700">
                          Main category
                      </label>
                      <select
                          onChange={getSubcategories}
                          id="maincategory"
                          name="maincategory"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                      >
                        <option value="">Select main category</option>
                          {data?.allCategories.map((category) => (
                              <option key={category.id} value={mainCatIndex++}>{category.name}</option>
                          ))}
                      </select>
                      </div>
                    <div className="col-span-1 sm:col-span-1">  
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                          Sub category
                      </label>
                      <select
                          id="subcategory"
                          name="subcategory"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                      >
                          {!subcategoriesList?.subcategoriesList?.length ? (
                          <option value="">Select sub category</option>
                          ) : (
                            subcategoriesList?.subcategoriesList?.map((category) => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                          ))
                          )}
                          
                      </select>
                    </div>
                    <div className="col-span-1 sm:col-span-1">  
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                          Color
                      </label>
                      <select
                          id="color"
                          name="color"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                      >
                          {colorsList?.map((color) => (
                              <option key={color} value={color}>{color}</option>
                          ))}
                      </select>
                    </div>
                  <div className="col-span-3">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Listing description. What is it? What is it made of? Why is it special?"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Detailed description for your listing. Add all you think is necessary.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="text-sm text-gray-600">
                          <label
                            htmlFor="files"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="files" name="files" type="file" className="sr-only" onChange={handleFileChange}  />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="grid gap-2 grid-flow-col-dense">
                    {imageUrl && imageUrl.list.map((cl => (<img className="max-h-32 w-auto" key={cl} src={cl} />))) }
                    </div>
                    </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>

                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
            </div>
        </div>
        </Sidebar>
        
        </div>
    )
}
