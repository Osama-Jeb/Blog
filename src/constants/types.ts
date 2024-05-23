import { FieldValue } from "firebase/firestore";

export type Post = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    owner: string;
    created_at: FieldValue;
    updated_at: FieldValue;
}

export type User = {
    id: string;
    email: string;
}

export type Comment = {
    id: string;
    owner: string;
    postID: string;
    comment: string;
}
