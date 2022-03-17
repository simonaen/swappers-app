import dynamic from "next/dynamic";
import Head from "next/head";
import Chat from "../../../components/chat/chat.component";
import ListingOverview from "../[listingid]";

const Chat = dynamic(() => import('../../../components/chat/chat.component', { ssr: false }));


export default function Message() {

  return (
    <div>
      <Head>
        <title>Swappers | Chat</title>
        <meta name="description" content="Swap, sell, and buy collecyable items" />
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex flex-row">
          <ListingOverview/>
          <Chat/>
        </div>
    </div>
  );
}