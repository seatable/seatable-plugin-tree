import React, { Fragment } from 'react';
import { FileFormatterProps } from '@/utils/template-utils/interfaces/Formatter/File.interface';
import FileItemFormatter from './FileItemFormatter';
import styles from '../../../../../styles/template-styles/formatter/FileFormatter.module.scss';

const FileFormatter: React.FC<FileFormatterProps> = ({ value = [], renderItem }) => {
  console.log({ renderItem });
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={styles.fileFormatter}>
      {value.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className={styles.fileFormatter}>
              <FileItemFormatter file={item} />
              {value.length !== 1 && (
                <span className={styles.fileItemCount}>{`+${value.length}`}</span>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default FileFormatter;