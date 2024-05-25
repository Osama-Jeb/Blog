export type Post = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    owner: string;
    created_at: any;
    updated_at: any;
    upvotes : string[];
    downvotes : string[];
}

export type User = {
    id: string;
    username: string;
    email: string;
    avatar? : string,
    created_at: any;
    updated_at: any;
    bookmark : string[];
}

export type Comment = {
    id: string;
    owner: string;
    postID: string;
    comment: string;
}
