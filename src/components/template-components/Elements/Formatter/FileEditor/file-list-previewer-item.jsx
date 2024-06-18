import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { Tooltip, Input } from 'reactstrap';
import { toaster } from 'dtable-ui-component';
import ItemDropDownMenu from './item-dropdown-menu';
import keyCodes from './constants/key-codes';
import {
  assetUrlAddParams,
  bytesToSize,
  getFileUploadTime,
  downloadFile,
  getFileThumbnailUrl,
  imageCheck,
} from '../../../../../utils/template-utils/utils';

const FileListItemPropTypes = {
  readOnly: PropTypes.bool,
  isSelected: PropTypes.bool,
  isSelectMultipleFiles: PropTypes.bool,
  itemIndex: PropTypes.number,
  fileItem: PropTypes.object.isRequired,
  isItemFreezed: PropTypes.bool.isRequired,
  freezeItem: PropTypes.func,
  unFreezeItem: PropTypes.func,
  showLargeImage: PropTypes.func,
  deleteFile: PropTypes.func.isRequired,
  onSelectFiles: PropTypes.func,
  updateFileName: PropTypes.func,
  appPage: PropTypes.object,
  column: PropTypes.object,
  rowData: PropTypes.object,
};

class FileListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowOperation: false,
      highlight: false,
      isShowNameTip: false,
      fileItemName: this.props.fileItem.name,
      isEditing: false,
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

  fileNameMouseEnter = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowNameTip: true,
      });
    }
  };

  fileNameMouseLeave = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowNameTip: false,
      });
    }
  };

  handleFileClick = (event) => {
    this.openFile();
  };

  openFile = () => {
    let { fileItem, appPage, column, rowData } = this.props;
    let openFileUrl = fileItem.url;
    let previewerUrl;
    let assetFileIndex = openFileUrl.indexOf('/asset');
    if (assetFileIndex > -1) {
      if (imageCheck(fileItem.name)) {
        this.props.showLargeImage(fileItem.url);
        return;
      }
      previewerUrl = openFileUrl.replace('/asset', '/asset-preview');
      previewerUrl = assetUrlAddParams(previewerUrl, {
        page: appPage,
        column: column,
        row: rowData,
      });
      window.open(previewerUrl, '_blank');
    }

    // todo 暂不支持
    // const { seafileUrl, repoApiToken } = window.dtable;
    // if (repoApiToken) {
    //   let selectedPath = openFileUrl.substring(openFileUrl.lastIndexOf(repoApiToken) + repoApiToken.length);
    //   seafileAPI.getSeafileRepoInfo().then(res => {
    //     let repoID = res.data.repo_id;
    //     let repoName = res.data.repo_name;
    //     if (fileItem.type === 'file') {
    //       previewerUrl = seafileUrl + '/lib/' + repoID + '/file' + selectedPath;
    //     } else {
    //       previewerUrl = seafileUrl + '/library/' + repoID + '/' + repoName + selectedPath;
    //     }
    //     window.open(previewerUrl, '_blank');
    //   });
    // }
  };

  downloadFile = (e) => {
    e.stopPropagation();
    const { appPage, column, rowData } = this.props;
    let downloadUrl = this.props.fileItem.url;
    let seafileFileIndex = downloadUrl.indexOf('seafile-connector');
    if (seafileFileIndex === -1) {
      downloadUrl = downloadUrl + '?dl=1';
      downloadFile(assetUrlAddParams(downloadUrl, { page: appPage, column: column, row: rowData }));
      return;
    }

    // todo 暂不支持
    // seafile file
    // const { repoApiToken } = window.dtable;
    // if (!repoApiToken) return;
    // let selectPath = downloadUrl.substring(downloadUrl.lastIndexOf(repoApiToken) + repoApiToken.length);// select path after repoApiToken
    // seafileAPI.getSeafileDownloadFileLink(selectPath).then(res => {
    //   downloadFile(res.data);
    // }).catch(error => {
    //   toaster.danger(t('The_file_does_not_exist_It_may_have_been_deleted'));
    // });
  };

  onSelectFile = () => {
    const { fileItem } = this.props;
    this.props.onSelectFiles(fileItem.name);
  };

  resetState = () => {
    this.setState({
      isShowOperation: false,
      highlight: false,
    });
    this.props.unFreezeItem();
  };

  updateName = () => {
    const { fileItemName } = this.state;
    const { updateFileName, itemIndex } = this.props;
    if (fileItemName.length !== 0) {
      updateFileName(fileItemName, itemIndex);
      this.setState({
        isEditing: false,
      });
    } else {
      toaster.danger(intl.get('Name_is_required'));
    }
  };

  onScroll = (event) => {
    event.stopPropagation();
  };

  nameChange = (e) => {
    this.setState({ fileItemName: e.target.value });
  };

  onKeyDown = (e) => {
    e.stopPropagation();
    if (e.keyCode === keyCodes.Enter) {
      e.preventDefault();
      this.updateName();
    }
  };

  renameFile = () => {
    this.setState({ isEditing: true });
  };

  render() {
    const { fileItem, readOnly, isSelectMultipleFiles, isSelected, appPage, column, rowData } =
      this.props;
    const { isShowOperation, isShowNameTip, highlight, fileItemName, isEditing } = this.state;
    const fileIconUrl = getFileThumbnailUrl(
      Object.assign({}, fileItem, {
        url: assetUrlAddParams(fileItem.url, { page: appPage, column: column, row: rowData }),
      })
    );
    const uploadTime = getFileUploadTime(fileItem);
    return (
      <div
        className={`dtable-file-previewer-box ${
          highlight ? 'dtable-file-previewer-box-hignlight' : ''
        }`}
        onMouseEnter={this.fileItemMouseEnter}
        onMouseLeave={this.fileItemMouseLeave}>
        <div className="dtable-file-previewer-item">
          {isSelectMultipleFiles && (
            <input
              onChange={this.onSelectFile}
              checked={isSelected}
              className="mr-2"
              type="checkbox"
            />
          )}
          <div className="dtable-file-previewer-icon">
            <img alt="" src={fileIconUrl} />
          </div>
          <div className="dtable-file-previewer-info">
            <div
              className={`dtable-file-previewer-item-name ${
                fileItem.type === 'dir' ? 'dtable-file-previewer-item-name-height' : ''
              }`}
              id={`file-item-tip-${this.props.itemIndex}`}
              onMouseEnter={this.fileNameMouseEnter}
              onMouseLeave={this.fileNameMouseLeave}>
              {isEditing && (
                <Input
                  autoFocus
                  className="rename-input"
                  placeholder={intl.get('Please_input')}
                  value={fileItemName}
                  onChange={this.nameChange}
                  onScroll={this.onScroll}
                  onBlur={this.updateName}
                  onKeyDown={this.onKeyDown}
                />
              )}
              {!isEditing && <span onClick={this.handleFileClick}>{fileItem.name}</span>}
            </div>
            <div className="dtable-file-preview-item-detail d-flex">
              {uploadTime && <span className="upload-time">{`${uploadTime}, `}</span>}
              {fileItem.size > -1 && <span>{bytesToSize(fileItem.size)}</span>}
            </div>
          </div>
        </div>
        {isShowNameTip && (
          <Tooltip
            placement="bottom"
            isOpen={true}
            target={`file-item-tip-${this.props.itemIndex}`}>
            {fileItem.name}
          </Tooltip>
        )}
        {isShowOperation && (
          <div className="dtable-file-previewer-operation">
            {fileItem.type === 'file' && (
              <span
                className="dtable-font dtable-icon-download file-download-icon"
                onClick={this.downloadFile}></span>
            )}
            {!readOnly && (
              <ItemDropDownMenu
                fileItem={fileItem}
                resetState={this.resetState}
                itemIndex={this.props.itemIndex}
                deleteFile={this.props.deleteFile}
                renameFile={this.renameFile}
                freezeItem={this.props.freezeItem}
                unFreezeItem={this.props.unFreezeItem}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

FileListItem.propTypes = FileListItemPropTypes;

export default FileListItem;
