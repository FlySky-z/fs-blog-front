import React from 'react';

interface ImageCardProps {
    image_url: string;
    ratio?: number; // width / height
    style?: React.CSSProperties;
}

const ImageCard: React.FC<ImageCardProps> = ({
    image_url,
    ratio = 16 / 9,
    style = {},
}) => {
    return (
        <div className='image-card'
            style={{
                position: 'relative',
                width: '100%',
                paddingTop: `${100 / ratio}%`,
                overflow: 'hidden',
                ...style,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </div>
    );
};

export default ImageCard;