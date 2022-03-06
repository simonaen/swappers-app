export default function ListingCard(props) {

    return (        
        <div className="group relative">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <img
                src={props.listing?.contentLinks[0]?.contentLink}
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
            />
            </div>
            <div className="mt-4 flex justify-between">
            <div>
                <h3 className="text-sm text-gray-700">
                <a href={'/listing/'+ props.listing.id}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {props.listing.name}
                </a>
                </h3>
                { props.listing?.sold ? (
                    <span className="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sold
                    </span> 
                    ) : (
                    <span className="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                    </span> 
                )}
                <p className="mt-1 text-sm text-gray-500 h-4 overflow-y-hidden">{props.listing.description}</p>
                
            </div>
            <p className="text-sm font-medium text-gray-900">${props.listing.price}</p>
            </div>
        </div>
        
    )
}


