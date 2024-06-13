import { useEffect, useState } from "react";
import { useInfo } from "../../../providers/InfoProvider";
import { FaSearch } from "react-icons/fa";
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firbase";
import { User } from "../../../constants/types";
import { TbZoomReset } from "react-icons/tb";
import { useChat } from "../../../providers/ChatProvider";


const List = () => {
    const { user: currentUser } = useInfo()
    const { ChangeChat } = useChat();

    const [chats, setChats] = useState<any>([])

    const [username, setUsername] = useState('');
    const [searchUsers, setSearchUsers] = useState<User[]>([])


    useEffect(() => {
        if (!currentUser?.id) {
            console.error('User ID is not defined');
            return;
        }

        const unSub = onSnapshot(doc(db, 'userchats', currentUser?.id), async (res) => {
            const items = res.data()?.chats;

            const promises = items.map(async (item: any) => {
                const userDocRef = doc(db, 'users', item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();
                return { ...item, user }
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => a.updatedAt - b.updatedAt));
        })

        return () => {
            unSub();
        }
    }, [currentUser?.id]);



    const handleSelect = async (chat: any) => {

        const userChats = chats.map((item: any) => {
            const { user, ...rest } = item;
            return rest;
        })

        const chatIndex = userChats.findIndex(
            (item: any) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, 'userchats', currentUser?.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });

            ChangeChat(chat.chatId, chat.user, currentUser)
        } catch (error) {
            console.log(error)
        }


    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        const usList: User[] = [];

        try {
            const userRef = collection(db, 'users');

            const q = query(userRef, where('username', '==', username));

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                querySnapShot.forEach((doc) => {
                    usList.push({ id: doc.id, ...doc.data() } as User);
                });

                setSearchUsers(usList);

            }

        } catch (error) {
            console.log(error);
        }
    }

    const resetSearch = () => {
        setUsername('')
        setSearchUsers([])
    }


    // the id of the added user
    const handleNewChat = async (id: string) => {
        const chatRef = collection(db, 'chats');
        const userChatsRef = collection(db, 'userchats');


        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            })

            // update the added user's userchats
            await updateDoc(doc(userChatsRef, id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
            })


            // update the current user's userchats
            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: id,
                    updatedAt: Date.now()
                })
            })

            resetSearch()

        } catch (error) {
            console.log(error)
        }
    }





    return (
        <div className="flex-1 flex flex-col">
            {/* user info */}
            {
                currentUser && <div className='userInfo flex items-center justify-between p-6'>
                    <div className="user flex items-center gap-2">
                        <img src={currentUser?.avatar} alt="Avatar" className="w-[20px] h-[20px] rounded-full aspect-square object-cover" />
                        <h2>{currentUser?.username}</h2>
                    </div>
                    <div className="icons flex gap-5">
                        <p>icon1</p>
                        <p>icon2</p>
                        <p>icon3</p>
                    </div>
                </div>
            }

            {/* chat list */}
            <div className="flex-1 overflow-scroll overflow-x-hidden">
                <div className="flex items-center gap-5 p-6">
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 flex items-center gap-3 bg-[#181c1f] rounded-xl p-3">


                        <input
                            type="text" placeholder="Search"
                            className="w-[90%] bg-transparent border-0 outline-none"
                            value={username} onChange={(e) => { setUsername(e.target.value) }}
                        />

                        <button type="submit" className="w-4 ">
                            <FaSearch />
                        </button>
                        <button type="submit" className="w-4 text-xl"
                            onClick={resetSearch}
                        >
                            <TbZoomReset />
                        </button>
                    </form>
                </div>


                <div>
                    {
                        searchUsers.map((us, ind) => (
                            <div key={ind} className="flex items-center justify-between  gap-5 p-5 cursor-pointer border-b-2 border-[#181c1f]">
                                <img src={us?.avatar} alt="Avatar" className="w-[50px] h-[50px] rounded-full aspect-square object-cover" />
                                <p>{us?.username}</p>

                                <button
                                    className="bg-black text-white px-4 py-2 rounded-none"
                                    onClick={() => { handleNewChat(us.id) }}
                                >
                                    Create Chat
                                </button>
                            </div>
                        ))
                    }
                    {
                        chats.map((element: any, index: number) => (
                            <div key={index} className="flex items-center  gap-5 p-5 cursor-pointer border-b-2 border-[#181c1f]"
                                onClick={() => { handleSelect(element) }}
                                style={{
                                    backgroundColor: element?.isSeen ? 'transparent' : '#5f5f5f'
                                }}

                            >
                                <img src={element.user?.avatar} alt="Avatar" className="w-[50px] h-[50px] rounded-full aspect-square object-cover" />

                                <div className="flex flex-col gap-2">
                                    <p className="font-bold">{element.user.username}</p>
                                    <p className="font-semibold ">{element.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default List;