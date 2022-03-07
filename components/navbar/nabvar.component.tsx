import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from '@heroicons/react/outline'
import { getSession, useUser } from '@auth0/nextjs-auth0';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

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


export default function Navbar() {
  const { user } = useUser();
  const { data, loading, error } = useQuery(AllCategoriesQuery)

  return (
    <Popover className="bg-white sticky top-0 ">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-4 lg:justify-start md:space-x-10">
          <div className="flex justify-start lg:flex-none">
            <a href="/" className='logo-text'>swappers</a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            <Popover className="">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-900' : 'text-gray-500',
                      'group bg-white rounded-md inline-flex items-center hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2'
                    )}
                  >
                    <span className='text-sm'>categories</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-4 w-4 group-hover:text-gray-500'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-100 mt-3 transform px-2 w-max sm:px-0 lg:ml-0">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid grid-cols-5 gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {
                            data?.allCategories?.map((category) => (
                              <ul key={category.id} className="px-4 w-auto">
                                <a href={'/browse/' + category.name.toLowerCase()} className="text-base font-medium text-gray-900">{category.name}</a>
                                {category.subcategories.map((subcat) =>{
                                    return (
                                    <li key={subcat.id}>
                                        <a href={'/browse/' + category.name.toLowerCase() + '/' + subcat.name.toLowerCase()} 
                                        className="block py-3 text-gray-600 hover:text-blue-400">{subcat.name}</a>
                                    </li>)
                                })}
                              </ul>
                            ))
                          }
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                    </>
              )}      
            </Popover>
        </Popover.Group>
          { !user ? (
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pr-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <Link href="/api/auth/login">
                <a className="whitespace-nowrap text-sm text-gray-500 hover:text-gray-900">
                  login / register
                </a>
                </Link>
              </div>
              ) : (
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0" >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Link href="/dashboard">
                  <a className="whitespace-nowrap text-sm text-gray-500 pr-2 border-r-2 hover:text-gray-900">
                    dashboard
                  </a>
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <Link href="/api/auth/logout">
                  <a className="whitespace-nowrap text-sm text-gray-500 hover:text-gray-900">
                    log out
                  </a>
                </Link>
              </div> 
          )}
          
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {data?.categories?.map((category) => (
                    <a
                      key={category.name}
                      href={'/category/'+ category.name.toLowerCase()}
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    >
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div>
                <a
                  href="auth"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up
                </a>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?{' '}
                  <a href="auth" className="text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
