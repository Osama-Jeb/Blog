import React from 'react';
import ReactPlayer from 'react-player';

interface Props {
    place: string;
    image: File | null;
}

const FileDisplay: React.FC<Props> = ({ image, place }) => {
    if (!image) return null;

    const fileURL = URL.createObjectURL(image);

    return (
        <>

            {image.type.startsWith('image') ? (
                <img
                    src={fileURL}
                    // className="w-[50%] rounded-xl"
                    className={`rounded-xl ${place == 'add' ? 'w-[50%]' : 'w-full'}`}
                    alt="Uploaded content"
                />
            ) : (
                <ReactPlayer controls={true} url={fileURL} />
            )}
        </>
    );
};

export default FileDisplay;
