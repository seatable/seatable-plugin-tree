import React from 'react';
import * as dayjs from 'dayjs';
import { ITimeProps } from '@/utils/template-utils/interfaces/Formatter/DurationTimeText.interface';

const CTimeFormatter: React.FC<ITimeProps> = ({ value }) => {
  const formatDate = (date: string) => {
    return dayjs.default(date).format('YYYY-MM-DD HH:mm:ss');
  };

  return <div>{formatDate(value)}</div>;
};

export default CTimeFormatter;
