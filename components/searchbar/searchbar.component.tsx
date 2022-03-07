import { useRouter } from "next/router";

export default function Searchbar () {
    const router = useRouter();

    const search = (event) => {
        event.preventDefault();        
        router.push('/search/' + event.target.search.value);
    }
    return (
        <div>
            <form onSubmit={search} className="flex">
                <input className="col-end-2 border-1 border-gray-300 bg-red transition w-full h-12 px-5 rounded-md focus:outline-none text-black text-lg " 
                        type="search" name="search" placeholder="Search" />
                <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pl-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    )
}