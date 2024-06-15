import { useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes, StorageReference } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firbase';

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export const useGoogleTranslate = () => {
    useEffect(() => {
        const googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        const addScript = document.createElement('script');
        addScript.setAttribute(
            'src',
            '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;

        return () => {
            document.body.removeChild(addScript);
        };
    }, []);
};




export const uploadFile = async (image: any, setLoading: any): Promise<string> => {
    if (image) {
        setLoading(true);
        let imageRef : StorageReference;
        
        // add an extension depending on the file format
        if (image.type.startsWith('image')) {
            imageRef = ref(storage, `posts/${uuidv4()}.jpeg`);
        } else if (image.type.startsWith('video')) {
            imageRef = ref(storage, `posts/${uuidv4()}.mp4`);
        } else {
            alert('file type not supported')
            throw Error('File Type Not Supported')
        }


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
    } else {
        return ""
    }
}