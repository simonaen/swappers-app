import { useState } from "react";
import { useChannel } from "./chat.effect";


export default function Chat() {
    let inputBox = null;
    let messageEnd = null;    

    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;

    const [channel, ably] = useChannel("chat-demo", (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer
    
        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);
    
        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
    });

    const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: messageText });
        setMessageText("");
        inputBox.focus();
    }

    const handleFormSubmission = (event) => {
        event.preventDefault();
        sendChatMessage(messageText);
    }

    const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
          return;
        }
        sendChatMessage(messageText);
        event.preventDefault();
    }

    const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <span key={index} className="block flex-grow-0 w-fit px-4 py-2 border border-transparent rounded-md text-black bg-indigo-200" data-author={author}>{message.data}</span>;
    });
    
    return (
        <div className="border-r-1">

        <main>
        <h3 className="text-md border-b-2 p-5 text-gray-600 font-bold">Next.js Chat Demo</h3>
        <div className="bg-gray-100">
            <div className="flex flex-col flex-start gap-1 p-1 chat-height">
                {messages}
                <div ref={(element) => { messageEnd = element; }}></div>
            </div>
            <form onSubmit={handleFormSubmission} className="flex flow-row">
                <textarea
                ref={(element) => { inputBox = element; }}
                value={messageText}
                placeholder="Type a message..."
                onChange={e => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="basis-10/12 rounded-md"
                ></textarea>
                <button type="submit" disabled={messageTextIsEmpty}
                className="basis-2/12 px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-white bg-blue-200 hover:bg-indigo-200">
                    Send
                </button>
            </form>
        </div>
        </main>

        </div>
    )
}
