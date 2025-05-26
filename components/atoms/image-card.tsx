import React from 'react';
import { Skeleton } from 'antd';
import Image from "next/image";

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
        <div
            className="image-card"
            style={{
            position: 'relative',
            width: '100%',
            paddingTop: `${100 / ratio}%`,
            overflow: 'hidden',
            ...style,
            }}
        >
            <Image
                src={image_url}
                alt="Image Card"
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL='...'
            />
        </div>
    );
};

export default ImageCard;