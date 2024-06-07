import React from 'react';
import ReactPlayer from 'react-player';

interface Props {
    image: File | null;
}

const FileDisplay: React.FC<Props> = ({ image }) => {
    if (!image) return null;

    const fileURL = URL.createObjectURL(image);

    return (
        <>

            {image.type.startsWith('image') ? (
                <img
                    src={fileURL}
                    className="w-full rounded-xl"
                    alt="Uploaded content"
                />
            ) : (
                <ReactPlayer controls={true} url={fileURL} />
            )}
        </>
    );
};

export default FileDisplay;
