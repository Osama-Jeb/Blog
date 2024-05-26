import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import {auth} from "../firbase"


type AuthData = {
    currentUser: any;
};

const AuthContext = createContext<AuthData>({
    currentUser: null,
})
export default function AuthProvider({ children }: PropsWithChildren) {
    const [currentUser, setCurrentUser] = useState<any>(null);


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        })

    }, [])

    return <AuthContext.Provider value={{ currentUser }}>
        {children}
    </AuthContext.Provider >
}


export const useAuth = () => useContext(AuthContext);