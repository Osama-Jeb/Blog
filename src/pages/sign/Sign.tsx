import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";

const Sign = () => {
    const { currentUser } = useAuth();
    const [newOld, setNewOld] = useState(false);

    return (
        <div className="flex items-center justify-center h-[100vh]">
            <div>
                {
                    currentUser ?
                        // this one is for signing out
                        <>
                            <Profile />
                        </>
                        : newOld ?
                            // this is for signing in
                            <>
                                <Login />
                                <p>Create New Account ? <button className="underline font-semibold cursor-pointer" onClick={() => { setNewOld(false) }}>Register</button></p>
                            </>

                            :
                            // this one is for registering 
                            <>
                                <Register />
                                <p>Already Have an Account ? <button className="underline font-semibold cursor-pointer" onClick={() => { setNewOld(true) }}>Sign In</button></p>
                            </>
                }
            </div>
        </div>
    )
}

export default Sign;