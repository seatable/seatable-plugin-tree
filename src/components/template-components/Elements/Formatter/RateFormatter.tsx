import { IRateProps } from '@/utils/template-utils/interfaces/Formatter/Rate.interface';
import React from 'react';

const RateFormatter: React.FC<IRateProps> = ({ value, data, containerClassName }) => {
  const getRateList = () => {
    const {
      rate_max_number = 5,
      rate_style_color = '#e5e5e5',
      rate_style_type = 'dtable-icon-rate',
    } = data || {};
    const validValue = Math.min(rate_max_number, value);
    const rateList = [];
    for (let i = 0; i < validValue; i++) {
      rateList.push(
        <i
          key={`dtable-ui-component-rate-${i}`}
          className={`dtable-font ${rate_style_type}`}
          style={{ color: rate_style_color || '#e5e5e5' }}></i>
      );
    }
    return rateList;
  };

  if (!value) return null;
  return <div className={`${containerClassName}`}>{getRateList()}</div>;
};

export default RateFormatter;
