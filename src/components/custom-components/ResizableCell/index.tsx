import { IResizableCell } from '@/utils/custom-utils/interfaces/CustomPlugin';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { useState } from 'react';

const ResizableCell = ({ children, handleMouseDown, onHover }: IResizableCell) => {
  const [color, setColor] = useState('#eee');
  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      {onHover && (
        <div
          className={styles.custom_cell_resize_handle}
          style={{ backgroundColor: color }}
          onMouseDown={handleMouseDown as React.MouseEventHandler<HTMLDivElement>}
          onMouseEnter={() => setColor('#3FA2F6')}
          onMouseLeave={() => setColor('#eee')}></div>
      )}
      {children}
    </div>
  );
};

export default ResizableCell;
