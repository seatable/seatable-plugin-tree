import { IResizableCell } from '@/utils/custom-utils/interfaces/CustomPlugin';
import stylesFormatter from '../../../styles/template-styles/formatter/Formatter.module.scss';

const ResizableCell = ({ children, handleMouseDown }: IResizableCell) => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        className={stylesFormatter.formatter_cell_resize_handle}
        onMouseDown={handleMouseDown as React.MouseEventHandler<HTMLDivElement>}></div>
      {children}
    </div>
  );
};

export default ResizableCell;
