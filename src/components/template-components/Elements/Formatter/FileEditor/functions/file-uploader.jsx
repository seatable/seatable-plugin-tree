import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import intl from 'react-intl-universal';
import pluginContext from '../../../../../../plugin-context';
import { getFileIconUrl, getEventTransfer } from '../../FileFormatter/utils';

dayjs.extend(utc);

const propTypes = {
  uploadType: PropTypes.string,
  className: PropTypes.string,
  isSupportDragDrop: PropTypes.bool,
  isSupportPaste: PropTypes.bool,
  /** either cellContentRenderer or children */
  cellContentRenderer: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onFileUploadSuccess: PropTypes.func.isRequired,
  updateParentTips: PropTypes.func,
  onCellTipShow: PropTypes.func,
  updateUploadFileList: PropTypes.func,
  onFileUploadProgress: PropTypes.func,
  onFileUploadFailed: PropTypes.func,
};

const MAX_UPLOAD_FILES = 10;

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.enteredCounter = 0; // Determine whether to enter the child element to avoid dragging bubbling bugs。
    this.start = 0;
  }

  componentWillUnmount() {
    // prevent async operation
    this.setState = (state, callback) => {
      return;
    };
  }

  onInputFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  };

  uploadFileClick = () => {
    this.uploadFileRef.click();
  };

  onDragEnter = (e) => {
    const { isSupportDragDrop, updateParentTips } = this.props;
    if (isSupportDragDrop) {
      e.preventDefault();
      this.enteredCounter++;
      if (this.enteredCounter !== 0) {
        updateParentTips(true);
      }
    }
  };

  onDragOver = (e) => {
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  onDragLeave = (e) => {
    const { isSupportDragDrop, updateParentTips, cellContentRenderer } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter--;
      if (this.enteredCounter === 0 || cellContentRenderer) {
        updateParentTips(false);
      }
    }
  };

  onDrop = (event) => {
    const { isSupportDragDrop, updateParentTips, onCellTipShow } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter = 0;
      updateParentTips(false);
      let files = event.dataTransfer.files;
      if (files.length === 0) {
        let message = intl.get('No_support_dragging_files_from_cell_to_cell');
        if (onCellTipShow) onCellTipShow(message);
        return;
      }
      this.handleFilesChange(files);
    }
  };

  onPaste = (event) => {
    const { isSupportPaste } = this.props;
    if (isSupportPaste) {
      event.stopPropagation();
      let cliperData = getEventTransfer(event);
      if (cliperData.files) {
        let files = cliperData.files;
        this.handleFilesChange(files, true);
      }
    }
  };

  onMouseEnter = () => {
    const { updateParentTips, uploadType } = this.props;
    if (uploadType === 'image') {
      if (updateParentTips) updateParentTips(true, uploadType);
    }
  };

  onMouseLeave = () => {
    const { updateParentTips, uploadType } = this.props;
    if (uploadType === 'image') {
      if (updateParentTips) updateParentTips(false, uploadType);
    }
  };

  uploadFilesChange = (event) => {
    this.handleFilesChange(event.target.files);
  };

  handleFilesChange = (files, isPasteUpload = false) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const { uploadType, updateUploadFileList, onCellTipShow } = this.props;
    let uploadFileList = [];
    let dealFileCnt = 0;
    let allFileLen = files.length;
    function checkLoadFinish() {
      if (dealFileCnt === allFileLen - 1) {
        if (uploadFileList.length === 0) {
          if (uploadType === 'image') {
            let message;
            if (files.length > 1) {
              message = intl.get('There_are_no_images_in_this_file_list');
            } else {
              message = intl.get('The_file_is_not_an_image');
            }

            if (onCellTipShow) onCellTipShow(message);
          }
          return;
        }
        if (updateUploadFileList) updateUploadFileList(uploadFileList);
        _this.uploadFilesInBatch(uploadFileList);
      }
      dealFileCnt++;
    }
    for (let i = 0; i < allFileLen; i++) {
      let uploadFile = files[i];
      if (isPasteUpload && uploadFile.name === 'image.png') {
        let newName = `image-${dayjs().format('YYYY-MM-DD-HH-mm')}.png`;
        uploadFile = new File([uploadFile], newName, { type: uploadFile.type });
      }
      try {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(uploadFile);

        fileReader.addEventListener(
          'load',
          function (event) {
            let isImage = /image/i.test(uploadFile.type);
            if (uploadType === 'file' || isImage) {
              let uploadFileItem = {
                name: uploadFile.name,
                fileIconUrl: isImage ? event.target.result : getFileIconUrl(uploadFile.name),
                isUploading: true,
                isErrorTip: false,
                uploadFile: uploadFile,
                size: uploadFile.size,
                url: '',
                type: uploadType === 'file' ? 'file' : '',
                percent: 0,
              };
              uploadFileList.push(uploadFileItem);
            }
            checkLoadFinish();
          },
          false
        );
        fileReader.addEventListener(
          'error',
          function (e) {
            checkLoadFinish();
          },
          false
        );
      } catch (event) {
        checkLoadFinish();
      }
    }
  };

  uploadFilesInBatch = (files) => {
    const fileUploadPromises = [];
    const length =
      MAX_UPLOAD_FILES + this.start > files.length ? files.length : MAX_UPLOAD_FILES + this.start;
    for (let i = this.start; i < length; i++) {
      let file = files[i];
      fileUploadPromises.push(this.createPromise(file));
    }
    this.uploadFilesPromise(fileUploadPromises, files);
  };

  uploadFilesPromise = (fileUploadPromises, files) => {
    Promise.all(fileUploadPromises).then((res) => {
      this.start += MAX_UPLOAD_FILES;
      if (this.start + MAX_UPLOAD_FILES - files.length >= 10) {
        this.start = 0;
        return;
      }
      this.uploadFilesInBatch(files);
    });
  };

  createPromise = (uploadFileInfo) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.handleFileChange(uploadFileInfo, resolve);
    });
  };

  handleFileChange = (uploadFileInfo, callback) => {
    const { uploadType, onFileUploadFailed } = this.props;
    const { uploadFile } = uploadFileInfo;
    let parentPath;
    let relativePath;
    const appUuid = pluginContext.getSetting('appUuid');
    pluginContext.api &&
      pluginContext.api
        .getUploadLink(appUuid, uploadType)
        .then((res) => {
          const { upload_link, parent_path, img_relative_path, file_relative_path } = res.data;
          parentPath = parent_path;
          relativePath = uploadType === 'image' ? img_relative_path : file_relative_path;

          const newFile = new File([uploadFile], uploadFile.name, { type: uploadFile.type });
          const formData = new FormData();
          formData.append('file', newFile);
          formData.append('parent_dir', parentPath);
          formData.append('relative_path', relativePath);
          const uploadLink = upload_link + '?ret-json=1';
          return pluginContext.api.uploadImage(uploadLink, formData, (event) =>
            this.onUploadProgress(event, uploadFileInfo)
          );
        })
        .then((res) => {
          const { name, size } = res.data[0];
          const newFileName = encodeURIComponent(name);

          const server = pluginContext.getSetting('server');
          const serverURL = server ? server.replace(/\/+$/, '') : '';
          const workspaceID = pluginContext.getSetting('workspaceID');
          const url = `${serverURL}/workspace/${workspaceID}${parentPath}/${relativePath}/${newFileName}`;
          const isUploading = false;
          uploadFileInfo = {
            ...uploadFileInfo,
            ...{
              name,
              size,
              url,
              isUploading,
              upload_time: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            },
          };
          callback && callback();
          this.props.onFileUploadSuccess(uploadFileInfo);
        })
        .catch((error) => {
          uploadFileInfo.isErrorTip = true;
          if (onFileUploadFailed) onFileUploadFailed(uploadFileInfo);
          return;
        });
  };

  uploadFileAgain = (uploadFileInfo) => {
    uploadFileInfo.isErrorTip = false;
    this.handleFileChange(uploadFileInfo);
  };

  onUploadProgress = (event, uploadFileMessage) => {
    const { onFileUploadProgress } = this.props;
    let uploadPercent = Math.floor((event.loaded / event.total) * 100);
    uploadFileMessage.percent = uploadPercent;
    if (onFileUploadProgress) onFileUploadProgress(uploadFileMessage);
  };

  renderUploaderElement = () => {
    const { uploadType, cellContentRenderer } = this.props;
    if (cellContentRenderer) {
      return cellContentRenderer({
        events: {
          onDragEnter: this.onDragEnter,
          onDragLeave: this.onDragLeave,
          onDrop: this.onDrop,
        },
      });
    }

    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onPaste={this.onPaste}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.uploadFileClick}
        className={this.props.className}>
        {this.props.children}
        {uploadType === 'file' && (
          <input
            type="file"
            className="dtable-upload-image"
            ref={(ref) => (this.uploadFileRef = ref)}
            onClick={this.onInputFile}
            onChange={this.uploadFilesChange}
            value=""
            multiple
          />
        )}
        {uploadType === 'image' && (
          <input
            type="file"
            className="dtable-upload-image"
            accept="image/*"
            ref={(ref) => (this.uploadFileRef = ref)}
            onClick={this.onInputFile}
            onChange={this.uploadFilesChange}
            value=""
            multiple
          />
        )}
      </div>
    );
  };

  render() {
    return this.renderUploaderElement();
  }
}

FileUploader.propTypes = propTypes;

export default FileUploader;
