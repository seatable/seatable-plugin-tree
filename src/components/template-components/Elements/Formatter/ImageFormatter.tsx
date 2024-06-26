import { IImageProps } from '@/utils/template-utils/interfaces/Formatter/Image.interface';
import styles from '../../../../styles/template-styles/formatter/ImageFormatter.module.scss';
import React from 'react';
import { getImageThumbnailUrl } from '../../../../utils/template-utils/utils';

const ImageFormatter: React.FC<IImageProps> = ({ value }) => {
  const image = value[0];
  const url = getImageThumbnailUrl(image, 256);

  return (
    <div className={styles.imageItem}>
      <img src={url} alt={value[0]} style={{ width: '50px', marginRight: '10px' }} />{' '}
    </div>
  );
};

export default ImageFormatter;
