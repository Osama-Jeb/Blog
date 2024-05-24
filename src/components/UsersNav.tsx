import { User } from "../constants/types";
import { useInfo } from "../providers/InfoProvider";

const UsersNav = () => {
    const { users } = useInfo()

    const usersArray: User[] = [];

    for (const userId in users) {
        if (Object.prototype.hasOwnProperty.call(users, userId)) {
            const user = users[userId];
            usersArray.push(user);
        }
    }

    console.log(usersArray)

    return (
        <div className="fixed top-0 right-0 flex items-center justify-around gap-4 flex-col h-[75vh] text-white w-[20vw]">
            {
                usersArray.map((user, index) => (
                    <div key={index} className="shadow-xl bg-white p-3 w-full text-black">
                        <p>{user.email}</p>
                        <br />
                        <p>add other stuff here like following or message maybe ?</p>
                    </div>
                ))
            }
        </div>
    )
}

export default UsersNav;