import { FC } from "react"
import { IUser } from "../types/types"

interface UserItemProps {
    user: IUser;
}

export const UserItem: FC<UserItemProps> = ({ user }) => {
    return (
        <div style={{ padding: '15px', border: '1px solid gray' }}>
            {user.id}. {user.name} проживает в городе {user.address.city} по улице {user.address.street}
        </div>
    )
}