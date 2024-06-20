import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import RecentItemDropdownMenu from './recent-item-dropdown-menu';
import { bytesToSize, getFileIconUrl, downloadFile } from '../../Formatter/FileFormatter/utils';

const propTypes = {
  fileItem: PropTypes.object,
  itemIndex: PropTypes.number,
  isItemFreezed: PropTypes.bool.isRequired,
  uploadDate: PropTypes.string,
  unFreezeItem: PropTypes.func,
  freezeItem: PropTypes.func,
  deleteFile: PropTypes.func,
  onSelectFile: PropTypes.func,
};

class RecentUploadItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlight: false,
      isShowOperation: false,
    };
  }

  fileItemMouseEnter = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowOperation: true,
        highlight: true,
      });
    }
  };

  fileItemMouseLeave = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowOperation: false,
        highlight: false,
      });
    }
  };

  downLoadFile = () => {
    let fileUrl = this.formatDownloadUrl();
    let downloadUrl = fileUrl + '?dl=1';
    downloadFile(downloadUrl);
  };

  viewFile = () => {
    let fileUrl = this.formatDownloadUrl();
    let previewerUrl = fileUrl.replace('/asset', '/asset-preview');
    window.open(previewerUrl, '_blank');
  };

  deleteFile = () => {
    let { fileItem, uploadDate } = this.props;
    this.props.deleteFile(fileItem, uploadDate);
  };

  formatDownloadUrl = () => {
    let { fileItem, uploadDate } = this.props;
    const { workspaceID, dtableUuid, server } = window.dtable;
    let url = `${server}/workspace/${workspaceID}/asset/${dtableUuid}/files/${uploadDate}/${fileItem.obj_name}`;
    return url;
  };

  formatRecentUploadItem = () => {
    let { fileItem, uploadDate } = this.props;
    return {
      name: fileItem.obj_name,
      size: fileItem.file_size,
      type: 'file',
      url: this.formatDownloadUrl(),
      date: uploadDate,
    };
  };

  resetState = () => {
    this.setState({
      isShowOperation: false,
      highlight: false,
    });
    this.props.unFreezeItem();
  };

  onSelectFile = (e) => {
    let isChecked = e.target.checked;
    let formatedRecentUploadItem = this.formatRecentUploadItem();
    this.props.onSelectFile(formatedRecentUploadItem, isChecked);
  };

  onRef = (ref) => {
    this.itemMenu = ref;
  };

  render() {
    const { fileItem } = this.props;
    const fileIconUrl = getFileIconUrl(fileItem.obj_name, 'file');
    const { highlight, isShowOperation } = this.state;
    const isItemMenuShow = (this.itemMenu && this.itemMenu.state.isItemMenuShow) || false;
    return (
      <div
        className={`dtable-file-previewer-box ${
          highlight ? 'dtable-file-previewer-box-hignlight' : ''
        }`}
        onMouseEnter={this.fileItemMouseEnter}
        onMouseLeave={this.fileItemMouseLeave}>
        <div className="dtable-file-previewer-item recent-upload-item">
          <div className="file-previewer-select">
            <input type="checkbox" onChange={this.onSelectFile} />
          </div>
          <div className="dtable-file-previewer-icon">
            <img alt="" src={fileIconUrl} />
          </div>
          <div className="dtable-file-previewer-info">
            <div
              className="dtable-file-previewer-item-name"
              id={`item-name-${this.props.itemIndex}`}
              onClick={this.viewFile}>
              {fileItem.obj_name}
            </div>
            {fileItem.file_size > -1 && (
              <div className="dtable-file-previewer-item-size">
                {bytesToSize(fileItem.file_size)}
              </div>
            )}
          </div>
        </div>
        {isShowOperation && !isItemMenuShow && (
          <Tooltip target={`item-name-${this.props.itemIndex}`} placement="bottom" isOpen={true}>
            {fileItem.obj_name}
          </Tooltip>
        )}
        {isShowOperation && (
          <div className="dtable-file-previewer-operation">
            <RecentItemDropdownMenu
              onRef={this.onRef}
              itemIndex={this.props.itemIndex}
              fileItem={fileItem}
              viewFile={this.viewFile}
              deleteFile={this.deleteFile}
              downloadFile={this.downLoadFile}
              resetState={this.resetState}
              freezeItem={this.props.freezeItem}
              unFreezeItem={this.props.unFreezeItem}
            />
          </div>
        )}
      </div>
    );
  }
}

RecentUploadItem.propTypes = propTypes;

export default RecentUploadItem;
