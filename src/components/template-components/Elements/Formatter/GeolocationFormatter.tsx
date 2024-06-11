import { IGeolocationProps } from '@/utils/template-utils/interfaces/Formatter/Geolocation.interface';
import React from 'react';

const GeolocationFormatter: React.FC<IGeolocationProps> = ({ value, containerClassName }) => {
  return (
    <div className={`${containerClassName}`}>
      {' '}
      <p>
        {value.lng}, {value.lat}
      </p>
    </div>
  );
};

export default GeolocationFormatter;
