import { useEffect, useState } from 'react'
import './App.css'
import { FieldValue, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, storage } from './firbase';

import { v4 as uuidv4 } from "uuid";
import { useAuth } from './providers/AuthProvider';
import Login from './components/Login';
import {
  deleteObject,
  getDownloadURL,
  ref,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  owner: string;
  created_at: FieldValue;
  updated_at: FieldValue;
}

type User = {
  id: string;
  email: string;
}

type Comment = {
  id: string;
  owner: string;
  postID: string;
  comment: string;
}


function App() {

  const { currentUser } = useAuth()

  const collectionRef = collection(db, 'posts');

  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);


  const addPost = async () => {
    let imageUrl = '';

    if (!title) {
      alert("add title please")
      return
    }

    if (image) {
      try {
        imageUrl = await uploadImage();
      } catch (error) {
        console.error("Image upload failed", error);
        return;
      }
    }

    const newPost: Post = {
      id: uuidv4(),
      title,
      content,
      imageUrl,
      owner: currentUser.uid,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    try {
      const postRef = doc(collectionRef, newPost.id);
      await setDoc(postRef, newPost);

      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
    }
  }


  const uploadImage = async (): Promise<string> => {
    if (!image) {
      alert("Add an image!");
      throw new Error("No image provided");
    }
    setLoading(true);
    const imageRef = storageRef(storage, `posts/${uuidv4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      setLoading(false);
      return url;
    } catch (error) {
      console.error(error);
      setLoading(false);
      throw error;
    }
  }



  return (
    <>

      <Login />
      <div
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <input placeholder='title' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
        <input placeholder="content" type="text" value={content} onChange={(e) => { setContent(e.target.value) }} />

        <input type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

        <button disabled={loading} onClick={addPost}>Add Post</button>
      </div>
      <div className="card">

        {
          posts && posts.map((post, index) => (
            <div key={index}>

              <p>{post.title}</p>
              <p>{post.content}</p>
              <p>{users[post.owner]?.email}</p>
              {
                post.imageUrl && <img src={post.imageUrl} width={200} alt={post.title} />
              }
              {
                post.owner == currentUser?.uid ?
                  <button onClick={() => { deletePost(post) }}>Delete Post</button>
                  :
                  null
              }

              <div>
                {comments.filter(comment => comment.postID === post.id).map(comment => (
                  <div key={comment.id}>
                    <p>{comment.comment}</p>
                    {
                      post.owner == currentUser?.uid ? 
                      <button onClick={() => {deleteComment(comment)}}>Delete Comment</button>
                      : 
                      null
                    }
                  </div>
                ))}
              </div>
              <div>
                <input type="text" placeholder='Comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button onClick={() => { addComment(post) }}>Comment</button>
              </div>
              <hr />
            </div>
          ))
        }
      </div>


    </>
  )
}

export default App
