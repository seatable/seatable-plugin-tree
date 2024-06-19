import React, { useEffect, useState } from 'react';
import { getFileIconUrl } from './utils';
import styles from '../../../../../styles/template-styles/formatter/FileFormatter.module.scss';
import FileEditor from '../FileEditor';

interface FileItemFormatterProps {
  file: {
    name: string;
    type: string;
  };
}

const FileItemFormatter: React.FC<FileItemFormatterProps> = ({ file }) => {
  const [fileIconData, setFileIconData] = useState<string | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      const fileIconUrl = getFileIconUrl(file.name, file.type);

      try {
        const fileIcon = await import(`./${fileIconUrl}`);
        setFileIconData(fileIcon.default);
      } catch (error) {
        console.error('Error loading icon:', error);
      }
    };

    loadIcon();
  }, [file]);

  if (!fileIconData) {
    return null;
  }

  return <img className={styles.fileItemIcon} src={fileIconData} alt={file.name} />;
};

export default FileItemFormatter;
