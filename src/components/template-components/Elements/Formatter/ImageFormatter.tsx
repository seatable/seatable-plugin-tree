import { IImageProps } from '@/utils/template-utils/interfaces/Formatter/Image.interface';
import React from 'react';

const ImageFormatter: React.FC<IImageProps> = ({ value, containerClassName }) => {
  return (
    <div className={`${containerClassName}`}>
      <img style={{ width: '20px', height: '20px' }} src={value[0]} alt="" />
    </div>
  );
};

export default ImageFormatter;
