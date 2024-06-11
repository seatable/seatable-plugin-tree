import { IFileProps } from '@/utils/template-utils/interfaces/Formatter/File.interface';
import React from 'react';

const FileFormatter: React.FC<IFileProps> = ({ value }) => {
  return (
    <div>
      <img style={{ width: '20px', height: '20px' }} src={value[0].url} alt="" />
    </div>
  );
};

export default FileFormatter;
