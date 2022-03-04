import { gql, useMutation, useQuery } from "@apollo/client"
import { useUser } from "@auth0/nextjs-auth0";

const AllUsersQuery = gql`
  query {
    allUsers {
        id
        firstName
        lastName
        email
        blocked
        role
        createdAt
  }
  }
`

const BLOCK_USER = gql`
    mutation blockUser($userId: String!) {
        blockUser(userId: $userId) {
            id
            blocked
        }
    }
`

const UNBLOCK_USER = gql`
    mutation unblockUser($userId: String!) {
        unblockUser(userId: $userId) {
            id
            blocked
        }
    }
`

const CHANGE_ROLE = gql`
    mutation changeUserRole($userId: String!, $role: Role!) {
        changeUserRole(userId: $userId, role: $role) {
            id
            role
        }
    }
`

export default function UsersTable() {
    const { user } = useUser();
    const { data, loading, error } = useQuery(AllUsersQuery);
    const [blockUser] = useMutation(BLOCK_USER);
    const [unblockUser] = useMutation(UNBLOCK_USER);
    const [changeUserRole] = useMutation(CHANGE_ROLE);


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
                    Name
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Account Creation
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Role
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
                {data?.allUsers.map((user) => (
                <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        { user?.blocked ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Blocked
                            </span> 
                        ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span> 
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    { user?.blocked ? (
                        <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => unblockUser({variables: { userId: user.id}})}>
                            Unblock
                        </a>
                    ) : (
                        <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => blockUser({variables: { userId: user.id}})}>
                            Block
                        </a>
                    )}
                    { user?.role === 'ADMIN' ? (
                        <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => changeUserRole({variables: { userId: user.id, role: 'USER'}})}>
                            Change to "USER"
                        </a>
                    ) : (
                        <a className="px-2 text-indigo-600 hover:text-indigo-900" onClick={() => changeUserRole({variables: { userId: user.id, role: 'ADMIN'}})}>
                            Change to "ADMIN"
                        </a>
                    )}
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
