import React, { Fragment, useState } from 'react';
import { FileFormatterProps } from '@/utils/template-utils/interfaces/Formatter/File.interface';
import FileItemFormatter from './FileItemFormatter';
import styles from '../../../../../styles/template-styles/formatter/FileFormatter.module.scss';
import FileEditor from '../Editors/FileEditor';

const FileFormatter: React.FC<FileFormatterProps> = ({ value = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={styles.fileFormatter} onDoubleClick={toggleModal}>
      {value.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className={styles.fileFormatter}>
              <FileItemFormatter file={item} />
            </div>
          </Fragment>
        );
      })}
      {modalOpen && <FileEditor isOpen={modalOpen} toggle={toggleModal} files={value} />}
    </div>
  );
};

export default FileFormatter;
