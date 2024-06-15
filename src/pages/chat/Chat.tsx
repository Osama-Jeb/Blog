import PrivateRoute from "../../providers/PrivateRouter";
import Details from "./components/Details";
import List from "./components/List";
import MainChat from "./components/MainChat";

import "./chat.css"
import { useChat } from "../../providers/ChatProvider";
import { useState } from "react";

const Chat = () => {
    const { chatId } = useChat();

    const [showDetail, setShowDetail] = useState(false);
    const [showList, setShowList] = useState(true);

    return (
        <PrivateRoute>
            <section className="flex h-[90vh]">
                {
                    showList && <List />
                }

                {chatId && <MainChat setShowDetail={setShowDetail} showDetail={showDetail} showList={showList} setShowList={setShowList} />}

                {chatId && (
                    showDetail && <Details />
                )}
            </section>
        </PrivateRoute>
    )
}

export default Chat;