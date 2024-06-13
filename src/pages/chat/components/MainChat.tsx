import { useEffect, useRef, useState } from "react";
import { useInfo } from "../../../providers/InfoProvider";
import EmojiPicker from "emoji-picker-react"
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firbase";
import { useChat } from "../../../providers/ChatProvider";

const MainChat = () => {
    const { user } = useInfo();
    const { chatId, user: sentUser } = useChat();

    const [open, setOpen] = useState(false)
    const [text, setText] = useState('');
    const [chat, setChat] = useState<any>(null)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        if (!chatId) {
            console.log('User ID is not defined');
            return;
        }
        const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data())
        })

        return () => { unSub() }
    }, [chatId])


    const handleEmojiClick = (e: any) => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }


    const handleSend = async () => {
        if (!text) return

        if (!chatId) {
            console.log('User ID is not defined');
            return;
        }

        try {

            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: user?.id,
                    text,
                    createdAt: new Date()
                })
            })

            const userIDs = [user?.id, sentUser?.id]

            userIDs.forEach(async (id) => {
                //!* see if he notices this
                const userChatsRef = doc(db, 'userchats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);
    
                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()
    
                    const chatIndex = userChatsData.chats.findIndex((c: any) => c.chatId == chatId);
    
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id == user?.id ? true: false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();
    
    
                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats
                    })
                }

            })


            setText('')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className="mainChat border-[#181c1f] border-l-2 border-r-2 flex flex-col"
        >
            <div className="top p-5 flex items-center justify-between border-b-2 border-[#181c1f]">
                <div className="user flex items-center gap-5">
                    <img src={user?.avatar} className="w-[60px] h-[60px] rounded-full object-cover" alt="" />
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-xl">username</span>
                        <p className="font-semibold text-lg text-[#a5a5a5]">Lorem ipsum dolor sit.</p>
                    </div>
                </div>

                {/* icons */}
                <div className="flex items-center gap-4">
                    <p>phone</p>
                    <p>video</p>
                    <p>info</p>
                </div>
            </div>



            <div className="center flex-1 p-5 flex flex-col gap-5 overflow-scroll overflow-x-hidden">

                {
                    chat?.messages?.map((message: any) => (

                        <div key={message?.createdAt} className={`message max-w-[70%] flex gap-5 own self-end`}>
                            <div className="texts flex-1 flex flex-col gap-1">
                                {
                                    message.img &&
                                    <img src={message.img} className="w-full h-[300px] rounded-xl aspect-square object-cover" alt="" />
                                }
                                <p>{message.text}</p>
                                {/* <span className="text-sm">message date ago</span> */}
                            </div>
                        </div>

                    ))
                }



                <div ref={endRef}></div>
            </div>


            <div className="bottom mt-auto p-5 gap-5 flex items-center justify-between border-[#181c1f] border-t-2">

                <div className="icons flex items-center gap-5">
                    <p>image</p>
                    <p>camera</p>
                    <p>micro</p>
                </div>

                <input type="text" placeholder="Type a message..."
                    value={text} onChange={(e) => { setText(e.target.value) }}
                    className="flex-1 bg-[#181c1f]  border-none outline-none text-white rounded-xl text-2xl"
                />

                <div className="emoji relative">
                    <button onClick={() => setOpen((prev) => (!prev))}>
                        <MdOutlineEmojiEmotions />
                    </button>

                    <div className="picker absolute bottom-[50px] left-0">
                        <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
                    </div>
                </div>

                <button
                    onClick={() => { handleSend() }}
                    className="bg-black text-white px-4 py-2 rounded-xl font-semibold">Send</button>
            </div>
        </div>
    )
}

export default MainChat;