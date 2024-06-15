import { useEffect } from 'react';

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

const useGoogleTranslate = () => {
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

export default useGoogleTranslate;
