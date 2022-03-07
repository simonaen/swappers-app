import { useMediaQuery } from "react-responsive";

export default function Landing () {
    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });
    return (
        <div className="lg:grid lg:grid-cols-3 lg:p-20 md:grid-flow-col">

        <div className="col-span-2 dot-bg">
          <div className="flex flex-col">
            <img className="w-2/3 pl-auto self-end p-6" src="/landingimage.png" alt="" />
          <div className="flex items-center m-6">
            <span className="quicksand-ff pr-4 basis-4/12 text-right text-md">i'm looking for</span>
            <div className="grow basis-7/12">
              <input className="col-end-2 border-1 border-gray-300 bg-red transition w-full h-12 px-5 rounded-md focus:outline-none text-black text-lg " type="search" name="search" placeholder="Search" />
            </div>
            <div className=" basis-1/12 self-center pl-4">
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              </div>
          </div>
          </div>
        </div>
        {!isMobile ? (
            <div className="col-span-1 h-full flex self-center">
          <h1 className="landing-logo self-center justify-self-start">swap per<br/>s</h1>
        </div>
        ) : (null)}
        
      </div>
    )
}