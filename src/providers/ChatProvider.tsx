import { PropsWithChildren, createContext, useContext, useState } from "react"
import { User } from "../constants/types";


type ChatData = {
    chatId: string | null;
    user: User | null;
    isCurrentUserBlocked: boolean;
    isReceiverBlocked: boolean;
    ChangeChat: (chatId: string, user: User, currentUser: User) => void;
    changeBlock: () => void;
    resetChat: () => void;

};

const ChatContext = createContext<ChatData>({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    ChangeChat: () => { },
    changeBlock: () => { },
    resetChat: () => { },
})
export default function ChatProvider({ children }: PropsWithChildren) {
    const [chatId, setChatId] = useState('');
    const [user, setUser] = useState<any>(null);
    const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false);
    const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);

    const ChangeChat = (chatId: string, user: User, currentUser: User) => {

        if (!currentUser) return

        // currentUser blocked
        if (user.blocked.includes(currentUser.id)) {
            setChatId(chatId);
            setUser(null);
            setIsCurrentUserBlocked(true);
            setIsReceiverBlocked(false);
        }

        // receiver blocked
        else if (currentUser.blocked.includes(user.id)) {
            setChatId(chatId);
            setUser(null);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(true);
        }

        // Neither are blocked
        else {
            setChatId(chatId);
            setUser(user);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(false);
        }
    }


    const changeBlock = () => {
        setIsReceiverBlocked((prev) => (!prev))
    }

    const resetChat = () => {
        setChatId('')
        setUser(null);
        setIsCurrentUserBlocked(false);
        setIsReceiverBlocked(false);
    }

    return <ChatContext.Provider value={{
        chatId,
        user,
        isCurrentUserBlocked,
        isReceiverBlocked,
        ChangeChat,
        changeBlock,
        resetChat,
    }}>

        {children}
    </ChatContext.Provider >
}


export const useChat = () => useContext(ChatContext);