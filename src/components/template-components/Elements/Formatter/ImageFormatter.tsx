import { IImageProps } from '@/utils/template-utils/interfaces/Formatter/Image.interface';
import styles from '../../../../styles/template-styles/formatter/ImageFormatter.module.scss';
import React from 'react';
import { getImageThumbnailUrl } from '../../../../utils/template-utils/utils';

const ImageFormatter: React.FC<IImageProps> = ({ value }) => {
  return (
    <>
      {value.map((image, index) => {
        const url = getImageThumbnailUrl(image, 256);
        return (
          <div className={styles.imageItem} key={index}>
            <img
              src={url}
              alt={image} // Use descriptive alt text if you have context
              style={{ width: '50px', marginRight: '10px' }}
            />
          </div>
        );
      })}
    </>
  );
};

export default ImageFormatter;
