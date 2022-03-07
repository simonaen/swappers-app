import { useMediaQuery } from "react-responsive";
import Searchbar from "../searchbar/searchbar.component";

export default function Landing () {
    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });
    return (
        <div className="lg:grid lg:grid-cols-3 lg:p-20 md:grid-flow-col">

        <div className="lg:col-span-2 dot-bg">
          <div className="flex flex-col">
            <img className="lg:w-2/3 lg:self-end p-6" src="/landingimage.png" alt="" />
          <div className="flex lg:flex-row flex-col lg:items-center m-6">
            <span className="quicksand-ff lg:pr-4 lg:basis-4/12 lg:text-right lg:text-md text-xl">i'm looking for</span>
            <div className="grow basis-8/12">
               <Searchbar/>
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