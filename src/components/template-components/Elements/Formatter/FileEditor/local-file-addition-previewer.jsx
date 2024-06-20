import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { Tooltip } from 'reactstrap';
import FileUploader from './functions/file-uploader';
import UploadProgress from './functions/upload-progress';
import { getFileThumbnailUrl } from '../FileFormatter/utils';

const propTypes = {
  deleteFile: PropTypes.func,
  uploadLocalFileValue: PropTypes.array,
  fileUploadCompleted: PropTypes.func,
};

class LocalFileAdditionPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFileTipShow: false,
      isShowDeleteIcon: false,
      enterFileIndex: -1,
      tooltipOpen: false,
      uploadMessageList: [],
      thumbnailSrcList: [],
      reUploadFile: null,
    };
  }

  setFileTipShow = (isFileTipShow) => {
    this.setState({ isFileTipShow: isFileTipShow });
  };

  updateUploadFileList = (fileListInfo) => {
    if (!fileListInfo) {
      this.setState({ thumbnailSrcList: [] });
      return;
    }
    this.setState({ thumbnailSrcList: fileListInfo });
  };

  onFileUploadSuccess = (uploadFileMessage) => {
    this.hideDeleteIcon();
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(uploadFileMessage);
    thumbnailSrcList.splice(findUploadFileIndex, 1, uploadFileMessage);
    if (thumbnailSrcList.every((fileItem) => !fileItem.isUploading)) {
      this.setState({ thumbnailSrcList: [] });
    }
    this.props.fileUploadCompleted(uploadFileMessage);
  };

  onFileUploadProgress = (uploadFileMessage) => {
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(uploadFileMessage);
    thumbnailSrcList.splice(findUploadFileIndex, 1, uploadFileMessage);
    this.setState({ thumbnailSrcList });
  };

  onFileUploadFailed = (uploadedFileInfo) => {
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(uploadedFileInfo);
    thumbnailSrcList.splice(findUploadFileIndex, 1, uploadedFileInfo);
    this.setState({ thumbnailSrcList });
  };

  findUploadFileIndex = (uploadFileMessage) => {
    let { thumbnailSrcList } = this.state;
    let uploadFileIndex = thumbnailSrcList.findIndex(
      (item) => item.name === uploadFileMessage.uploadFile.name
    );
    return uploadFileIndex;
  };

  deleteFile = (event, index) => {
    this.props.deleteFile(index, 'localFile');
  };

  showDeleteIcon = (event, index) => {
    this.setState({
      isShowDeleteIcon: true,
      enterFileIndex: index,
    });
  };

  hideDeleteIcon = () => {
    this.setState({
      isShowDeleteIcon: false,
      enterFileIndex: -1,
    });
  };

  fileUploadAgain = (event, uploadFileInfo) => {
    this.uploaderFileRef.uploadFileAgain(uploadFileInfo);
  };

  tooltipToggle = () => {
    if (this.state.tooltipOpen) {
      this.setState({
        isShowDeleteIcon: false,
        enterFileIndex: -1,
      });
    }
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  renderMultipleFilesArr = () => {
    let { thumbnailSrcList } = this.state;
    let fileArr = [];
    if (Array.isArray(this.props.uploadLocalFileValue)) {
      let uploadedFileList = this.renderUploadedFile();
      if (uploadedFileList) {
        fileArr.push(...uploadedFileList);
      }
      if (Array.isArray(thumbnailSrcList) && thumbnailSrcList.length > 0) {
        let thumbnailList = thumbnailSrcList.map((fileThumbnailItem, index) => {
          let uploadFile = fileThumbnailItem.percent === 100 && !fileThumbnailItem.isErrorTip;
          return (
            <Fragment key={`dtable-file-wrapper-circle${index}`}>
              {fileThumbnailItem.isUploading && (
                <div className="dtable-file-wrapper">
                  <div className="dtable-file-upload-percent">
                    <img
                      src={fileThumbnailItem.fileIconUrl}
                      style={{
                        position: 'absolute',
                        zIndex: `${uploadFile ? 3 : 1}`,
                        maxHeight: '100%',
                      }}
                      alt=""
                    />
                    {fileThumbnailItem.percent < 100 && (
                      <UploadProgress uploadPercent={fileThumbnailItem.percent || 0} />
                    )}
                    {uploadFile && (
                      <div className="dtable-file-upload-success">
                        <div className="dtable-file-upload-success-scale">
                          <span className="dtable-file-upload-success-tip">
                            {intl.get('Indexing')}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="dtable-file-upload-mask"></div>
                    {fileThumbnailItem.isErrorTip && (
                      <div className="dtable-file-upload-error-tip">
                        <span>{intl.get('Network_Error')}</span>
                        <span
                          className="dtable-file-upload-again"
                          onClick={(event) => this.fileUploadAgain(event, fileThumbnailItem)}>
                          {intl.get('Re_upload')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Fragment>
          );
        });
        fileArr.push(...thumbnailList);
      }
    }
    return fileArr;
  };

  renderUploadedFile = () => {
    const { uploadLocalFileValue } = this.props;
    let uploadedFileList = [];
    uploadedFileList =
      uploadLocalFileValue.length > 0 &&
      uploadLocalFileValue.map((fileItem, index) => {
        let fileIconUrl = getFileThumbnailUrl(fileItem);
        return (
          <div
            key={'dtable-file-wrapper-' + index}
            className="dtable-file-wrapper"
            id={`file-content-tip-${index}`}
            onMouseEnter={(event) => this.showDeleteIcon(event, index)}
            onMouseLeave={this.hideDeleteIcon}>
            <div className="file-content">
              <img src={fileIconUrl} alt="" style={{ maxHeight: '100%' }} />
            </div>
            {this.state.isShowDeleteIcon && this.state.enterFileIndex === index && (
              <div className="delete-file-icon" onClick={(event) => this.deleteFile(event, index)}>
                <span className="file-delete-span">x</span>
              </div>
            )}
            {this.state.isShowDeleteIcon && this.state.enterFileIndex === index && (
              <Tooltip
                toggle={this.tooltipToggle}
                target={`file-content-tip-${index}`}
                placement="bottom"
                isOpen={this.state.tooltipOpen}>
                {fileItem.name}
              </Tooltip>
            )}
          </div>
        );
      });
    return uploadedFileList;
  };

  renderUploadFileWrapper = () => {
    const { isFileTipShow } = this.state;
    const fileArr = this.renderMultipleFilesArr();
    const className =
      fileArr.length === 0
        ? `dtable-file-upload-container ${
            isFileTipShow ? 'dtable-file-upload-container-active' : ''
          }`
        : 'dtable-file-wrapper';
    let editorContent;
    if (fileArr.length === 0) {
      editorContent = (
        <div className={`dtable-file-tip-addition ${isFileTipShow ? 'file-drop-active' : ''}`}>
          <div className="dtable-file-add-icon">
            <i className="dtable-font dtable-icon-add-files"></i>
          </div>
          {isFileTipShow ? (
            <div className="dtable-file-add-span">{intl.get('Drag_and_drop_to_add_a_file')}</div>
          ) : (
            <div className="dtable-file-add-span">
              {intl.get('Drag_and_drop_files_or_click_here_to_add')}
            </div>
          )}
        </div>
      );
    } else {
      editorContent = (
        <div className="image-add-box">
          <div
            className={`image-add-button ${
              isFileTipShow ? 'dtable-image-wrapper-drop-active' : ''
            }`}>
            <i className="dtable-font dtable-icon-add-table"></i>
            <span className="image-add-span">{intl.get('Add_images')}</span>
          </div>
        </div>
      );
    }

    return (
      <FileUploader
        uploadType="file"
        isSupportDragDrop={true}
        className={className}
        key={'dtable-file-wrapper-addition'}
        updateParentTips={this.setFileTipShow}
        onFileUploadSuccess={this.onFileUploadSuccess}
        onFileUploadProgress={this.onFileUploadProgress}
        updateUploadFileList={this.updateUploadFileList}
        onFileUploadFailed={this.onFileUploadFailed}
        ref={(ref) => (this.uploaderFileRef = ref)}>
        {editorContent}
      </FileUploader>
    );
  };

  render() {
    const fileArr = this.renderMultipleFilesArr();
    const editorUploader = this.renderUploadFileWrapper();
    return (
      <Fragment>
        {fileArr}
        {editorUploader}
      </Fragment>
    );
  }
}

LocalFileAdditionPreviewer.propTypes = propTypes;

export default LocalFileAdditionPreviewer;
