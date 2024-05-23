import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../firbase";
import { Comment, Post, User } from "../constants/types";





type InfoData = {
    users: { [key: string]: User } | null;
    posts: Post[] | null;
    comments: Comment[] | null;
}

const InfoContext = createContext<InfoData>({
    users: null,
    posts: null,
    comments: null,
})
export default function InfoProvider({ children }: PropsWithChildren) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {

        const unsub = onSnapshot(collection(db, 'posts'), (QuerySnapshot) => {
            const items: any = [];
            QuerySnapshot.forEach((doc) => {
                items.push(doc.data());
            });


            setPosts(items);
        })


        const getUsers = onSnapshot(collection(db, "users"), (QuerySnapshot) => {
            const usersData: any = {};
            QuerySnapshot.forEach((doc) => {
                usersData[doc.data().id] = doc.data();

            });


            setUsers(usersData);

        })

        const getComments = onSnapshot(collection(db, "comments"), (QuerySnapshot) => {
            const items: any = []
            QuerySnapshot.forEach((doc) => {
                items.push(doc.data())
            })

            setComments(items);
        })

        return () => { unsub(); getUsers(); getComments(); }
    }, [])


    return <InfoContext.Provider value={{users, posts, comments}}>
        {children}
    </InfoContext.Provider >
}


export const useInfo = () => useContext(InfoContext);