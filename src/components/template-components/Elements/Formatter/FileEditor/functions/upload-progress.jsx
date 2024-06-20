import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'react-sweet-progress';
import { UPLOAD_PROGRESS } from '../constants/zIndexes';

import 'react-sweet-progress/lib/style.css';

function UploadProgress(props) {
  return (
    <Progress
      type="circle"
      percent={props.uploadPercent}
      width={props.width || 30}
      theme={{
        default: {
          color: props.defaultColor || 'rgba(0, 0, 0, 0.6)',
        },
        active: {
          color: props.activeColor || '#fff',
        },
        success: {
          symbol: props.tipText,
          color: props.successColor || '#fff',
        },
      }}
      style={{
        color: '#fff',
        fontSize: '12px',
        transform: 'rotate(-90deg)',
        position: 'absolute',
        zIndex: UPLOAD_PROGRESS,
      }}
      symbolClassName={props.className || 'dtable-file-upload-span'}
    />
  );
}

UploadProgress.propTypes = {
  uploadPercent: PropTypes.number.isRequired,
  width: PropTypes.number,
  defaultColor: PropTypes.string,
  activeColor: PropTypes.string,
  successColor: PropTypes.string,
  tipText: PropTypes.string,
  className: PropTypes.string,
};

export default UploadProgress;
