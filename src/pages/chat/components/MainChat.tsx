import { useEffect, useRef, useState } from "react";
import { useInfo } from "../../../providers/InfoProvider";
import EmojiPicker from "emoji-picker-react"
import { MdOutlineEmojiEmotions, MdPhotoSizeSelectActual } from "react-icons/md";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firbase";
import { useChat } from "../../../providers/ChatProvider";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { v4 as uuidv4 } from "uuid"
import { FaCircleInfo } from "react-icons/fa6";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill, BsPaperclip } from "react-icons/bs";


type MainChatProps = {
    showDetail: boolean;
    showList: boolean;
    setShowDetail: (args0: boolean) => void;
    setShowList: (args0: boolean) => void;
}

const MainChat = (props: MainChatProps) => {
    const { user } = useInfo();
    const { chatId, user: sentUser, isCurrentUserBlocked, isReceiverBlocked } = useChat();

    const [open, setOpen] = useState(false)
    const [text, setText] = useState('');
    const [img, setImg] = useState<any>({
        file: null,
        url: '',
    })
    const [loading, setLoading] = useState(false);

    const [chat, setChat] = useState<any>(null)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat?.messages])

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


    const handleImg = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileType = selectedFile.type;

            if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
                setImg({
                    file: selectedFile,
                    url: URL.createObjectURL(selectedFile),
                });
                console.log(URL.createObjectURL(selectedFile));
            } else {
                console.error('Unsupported file type');
            }
        }
    }

    const uploadFile = async (image: any): Promise<string> => {
        let imageRef: StorageReference;
        imageRef = ref(storage, `chats/${uuidv4()}.${img.file.name.split('.').pop()}`);

        try {
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
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

        let imgUrl = null;
        setLoading(true);

        try {

            if (img.file) {
                imgUrl = await uploadFile(img.file)
            }



            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: user?.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            })

            const userIDs = [user?.id, sentUser?.id]

            userIDs.forEach(async (id) => {

                const userChatsRef = doc(db, 'userchats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex((c: any) => c.chatId == chatId);

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id == user?.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();


                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats
                    })
                }

            })

            setLoading(false)

        } catch (error) {
            console.log(error)
        }


        setText('')
        setImg({
            file: null,
            url: '',
        })
    }

    return (
        <div
            className="mainChat border-[#181c1f] border-l-2 border-r-2 flex flex-col w-[50vw]"
        >
            <div className="top p-5 flex items-center justify-between border-b-2 border-[#181c1f]">
                <div className="user flex items-center gap-5">
                    <img src={sentUser?.avatar} className="w-[60px] h-[60px] rounded-full object-cover" alt="" />
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-xl">{sentUser?.username}</span>
                    </div>
                </div>


                <div className="flex items-center gap-3  text-2xl">

                    <button
                        onClick={() => { props.setShowList(!props.showList) }}
                    >
                        {
                            props.showList ? <BsArrowLeftCircleFill /> : <BsArrowRightCircleFill />
                        }
                    </button>


                    <button
                        onClick={() => { props.setShowDetail(!props.showDetail) }}
                    >
                        <FaCircleInfo />
                    </button>
                </div>

            </div>



            <div className="center flex-1 p-5 flex flex-col gap-5 overflow-scroll overflow-x-hidden">

                {
                    chat?.messages?.map((message: any) => (

                        <div key={message?.createdAt}

                            className={`message max-w-[450px] flex gap-5  ${message.senderId == user.id ? 'own self-end' : ''}`}>
                            <div className="texts flex-1 flex flex-col gap-1">
                                {
                                    message.img && (
                                        message.img.includes('png') ?

                                            <img src={message.img} className="w-full h-[300px] rounded-xl aspect-square object-cover" alt="" />
                                            :
                                            <>
                                                <object data={message.img} type="application/pdf">
                                                </object>
                                                <a href={message.img} target="_blank">View PDF!</a>
                                            </>
                                    )
                                }

                                {
                                    message.text &&
                                    <p
                                        className={`mt-2 px-4 py-2 rounded-b-xl ${message.senderId == user.id ?
                                            'bg-black text-white  rounded-tl-lg' :
                                            'bg-gray-900 w-fit rounded-tr-xl '}`}>
                                        {message.text}</p>
                                }

                            </div>
                        </div>

                    ))}

                {
                    img.url && (
                        <div className="max-w-[450px] flex gap-5 self-end">
                            <div className="texts flex-1 flex flex-col gap-1">

                                <div>
                                    {img.file && img.file.type.startsWith('image/') && (
                                        <img src={img.url} alt="Selected file" width="100" />
                                    )}
                                    {img.file && img.file.type === 'application/pdf' && (
                                        <object data={img.url} type="application/pdf" width="100%" height="100%">
                                        </object>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setImg({
                                            file: null,
                                            url: '',
                                        })
                                    }}
                                >Cancel File</button>
                            </div>
                        </div>
                    )
                }


                <div ref={endRef}></div>
            </div>

            <div className="bottom mt-auto p-5 gap-5 pt-3  flex items-center justify-between border-[#181c1f] border-t-2 flex-col sm:flex-row">

                {
                    isCurrentUserBlocked || isReceiverBlocked ?
                        <div className="flex items-center justify-center font-semibold w-full rounded-xl bg-red-900 h-[5vh]">
                            <p>{isCurrentUserBlocked ? 'You Are Blocked' : isReceiverBlocked ? 'You Blocked this user' : ''}</p>
                        </div>
                        :
                        <>

                            <div className="icons flex items-center gap-5">
                                <label htmlFor="file" className="cursor-pointer text-xl">
                                    <MdPhotoSizeSelectActual />
                                </label>
                                <input type="file" name="file" id="file" className="hidden"
                                    onChange={(e) => { handleImg(e) }}
                                    accept="image/png, image/gif, image/jpeg"
                                />


                                <label htmlFor="paperClip" className="cursor-pointer text-xl">
                                    <BsPaperclip />
                                </label>
                                <input type="file" name="paperClip" id="paperClip" className="hidden"
                                    accept="application/pdf"
                                    onChange={(e) => { handleImg(e) }}
                                />

                                <div className="emoji relative">
                                    <button onClick={() => setOpen((prev) => (!prev))}>
                                        <MdOutlineEmojiEmotions />
                                    </button>

                                    <div className="picker absolute bottom-[50px] left-0">
                                        <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
                                    </div>
                                </div>

                            </div>

                            <div className="flex items-center w-full gap-2">
                                <input type="text" placeholder="Type a message..."
                                    value={text} onChange={(e) => { setText(e.target.value) }}
                                    className="flex-1 bg-[#181c1f] border-none outline-none text-white rounded-xl text-xl w-full"
                                />


                                <button
                                    disabled={loading}
                                    onClick={() => { handleSend() }}
                                    className="bg-black text-white px-4 py-2 rounded-xl font-semibold">Send
                                </button>
                            </div>
                        </>
                }
            </div>
        </div >
    )
}

export default MainChat;