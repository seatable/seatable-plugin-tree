import React from 'react';
import PropTypes from 'prop-types';

function CommonAddTool({ callBack, footerName, className, addIconClassName, hideIcon, style }) {
  return (
    <div className={`add-item-btn ${className ? className : ''}`} style={style} onClick={(e) => {
      callBack(e);
    }}>
      {!hideIcon && <span className={`dtable-font dtable-icon-add-table ${addIconClassName || ''}`}></span>}
      <span className="text-truncate">{footerName}</span>
    </div>
  );
}

CommonAddTool.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  addIconClassName: PropTypes.string,
  footerName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  callBack: PropTypes.func.isRequired,
  hideIcon: PropTypes.bool,
};

export default CommonAddTool;
