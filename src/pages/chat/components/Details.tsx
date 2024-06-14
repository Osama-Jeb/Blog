import { useInfo } from "../../../providers/InfoProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useChat } from "../../../providers/ChatProvider";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firbase";
import { useEffect, useState } from "react";

const Details = () => {
    const { user: currentUser } = useInfo();
    const { chatId, user: chatUser, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChat();


    const [chat, setChat] = useState<any>(null)

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


    const handleBlock = async () => {
        if (!chatUser) return;

        const userDocRef = doc(db, 'users', currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(chatUser.id) : arrayUnion(chatUser.id)
            })
            changeBlock()
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div className="flex-1 details overflow-scroll overflow-x-hidden ">
            <div className="user px-8 py-5 flex flex-col items-center gap-5 border-b-2 border-[#dddddd35]">
                <img src={chatUser?.avatar} className="w-[120px] h-[120px] rounded-full aspect-square object-cover" alt="" />
                <p>{chatUser?.username}</p>
            </div>

            {/* info */}
            <div className="info p-5 flex flex-col gap-7">
                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Chat Settings</span>
                        <IoIosArrowUp />
                    </div>
                    <p>TBA Later</p>
                </div>


                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Shared Photos</span>
                        <IoIosArrowDown />
                    </div>

                    <div className="photos grid grid-cols-4 gap-1 mt-4">
                        {
                            chat?.messages?.map((message: any) => (

                                message.img && (
                                    message.img.includes('png') ?

                                        <img src={message.img} className="w-[60px] h-[60px] rounded-xl aspect-square object-cover" alt="" />
                                        :
                                        null
                                )

                            ))}
                    </div>
                </div>


                {/* <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Shared Files</span>
                        <IoIosArrowUp />
                    </div>
                </div> */}

                <button
                    onClick={handleBlock}
                    className="px-5 py-2 bg-red-700/45  hover:bg-red-700 text-white font-semibold rounded">

                    {
                        isCurrentUserBlocked ? 'You Are Blocked' : isReceiverBlocked ? 'User Blocked' : 'Block User'
                    }
                </button>
            </div>
        </div>
    )
}

export default Details;