import PrivateRoute from "../../providers/PrivateRouter";
import Details from "./components/Details";
import List from "./components/List";
import MainChat from "./components/MainChat";

import "./chat.css"

const Chat = () => {
    return (
        <PrivateRoute>
            <section className="flex h-[92vh]">
                <List />

                <MainChat />

                <Details />
            </section>
        </PrivateRoute>
    )
}

export default Chat;