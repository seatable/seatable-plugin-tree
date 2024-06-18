import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import CommonAddTool from '../FileEditor/functions/common-add-tool';
import ImagePreviewerLightbox from '../Editors/ImageEditor/image-previewer-lightbox';
import FileListItem from './file-list-previewer-item';
import {
  downloadFile,
  downloadFiles,
  imageCheck,
  assetUrlAddParams,
} from '../../Formatter/FileFormatter/utils';
import { ADDITION } from './constants/constants';

const propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.array,
  togglePreviewer: PropTypes.func,
  deleteFile: PropTypes.func,
  deleteFiles: PropTypes.func,
  resetFileValue: PropTypes.func.isRequired,
  updateFileName: PropTypes.func,
  appPage: PropTypes.object,
  column: PropTypes.object,
  rowData: PropTypes.object,
};

class FileListPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isItemFreezed: false,
      isShowLargeImage: false,
      isSelectMultipleFiles: false,
      fileImageUrlList: [],
      selectedFilesList: [],
    };
  }

  componentDidMount() {
    this.getFileItemImageUrlList(this.props.value);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      this.getFileItemImageUrlList(nextProps.value);
    }
  }

  getFileItemImageUrlList = (value) => {
    let fileImageUrlList = [];
    value.forEach((fileItem) => {
      const { url, name } = fileItem;
      let assetFileIndex = typeof url === 'string' ? url.indexOf('/asset') : -1;
      if (assetFileIndex > -1) {
        const isImage = imageCheck(name);
        if (isImage) {
          fileImageUrlList.push(url);
        }
      }
    });
    this.setState({ fileImageUrlList });
  };

  showLargeImage = (itemUrl) => {
    let { fileImageUrlList } = this.state;
    this.setState({
      isShowLargeImage: true,
      largeImageIndex: fileImageUrlList.indexOf(itemUrl),
    });
  };

  moveNext = () => {
    let { fileImageUrlList } = this.state;
    this.setState((prevState) => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % fileImageUrlList.length,
    }));
  };

  movePrev = () => {
    let { fileImageUrlList } = this.state;
    this.setState((prevState) => ({
      largeImageIndex:
        (prevState.largeImageIndex + fileImageUrlList.length - 1) % fileImageUrlList.length,
    }));
  };

  hideLargeImage = () => {
    this.setState({
      isShowLargeImage: false,
      largeImageIndex: -1,
    });
  };

  downloadImage = (imageItemUrl) => {
    let rotateIndex = imageItemUrl.indexOf('?a=');
    if (rotateIndex > -1) {
      imageItemUrl = imageItemUrl.slice(0, rotateIndex);
    }
    let imageUrlSuffix = imageItemUrl.indexOf('?dl=1');
    let downloadUrl = imageUrlSuffix !== -1 ? imageItemUrl : imageItemUrl + '?dl=1';
    downloadFile(downloadUrl);
  };

  deleteImage = (index, type) => {
    const { value } = this.props;
    let { fileImageUrlList } = this.state;
    const imageUrl = fileImageUrlList[index];
    let fileItemIndex = value.findIndex((fileItem) => fileItem.url === imageUrl);
    this.props.deleteFile(fileItemIndex, type);
    if (index > fileImageUrlList.length - 2) {
      if (fileImageUrlList.length - 2 < 0) {
        this.hideLargeImage();
      } else {
        this.setState({ largeImageIndex: 0 });
      }
    }
  };

  togglePreviewer = () => {
    this.props.togglePreviewer(ADDITION);
    this.props.resetFileValue();
  };

  freezeItem = () => {
    this.setState({
      isItemFreezed: true,
    });
  };

  unFreezeItem = () => {
    this.setState({
      isItemFreezed: false,
    });
  };

  onSelectFiles = (name) => {
    const { selectedFilesList } = this.state;
    let filesList = selectedFilesList.slice(0);
    const selectedFileIndex = selectedFilesList.indexOf(name);
    if (selectedFileIndex > -1) {
      filesList.splice(selectedFileIndex, 1);
    } else {
      filesList.push(name);
    }
    this.setState({ selectedFilesList: filesList });
  };

  onSelectAllFiles = () => {
    const { value } = this.props;
    const { selectedFilesList } = this.state;
    if (value.length === 0) return;
    let allFilesList = selectedFilesList.slice(0);
    value.forEach((item) => {
      if (selectedFilesList.indexOf(item.name) === -1) {
        allFilesList.push(item.name);
      }
    });
    this.setState({ selectedFilesList: allFilesList });
  };

  onChangeSelectMultipleFiles = (state) => {
    this.setState({
      isSelectMultipleFiles: state,
      selectedFilesList: [],
    });
  };

  onDownloadAllSelectedFiles = () => {
    const { value, appPage, column, rowData } = this.props;
    const { selectedFilesList } = this.state;
    if (selectedFilesList.length === 0) return;
    let downloadFilesUrlList = [];
    selectedFilesList.forEach((fileName) => {
      const fileItem = value.find((file) => file.name === fileName);
      let downloadUrl = fileItem.url;
      // todo 暂不支持
      // let seafileFileIndex = downloadUrl.indexOf('seafile-connector');
      // if (seafileFileIndex > -1) {
      //   const { repoApiToken } = window.dtable;
      //   let selectPath = downloadUrl.substring(downloadUrl.lastIndexOf(repoApiToken) + repoApiToken.length);// select path after repoApiToken
      //   seafileAPI.getSeafileDownloadFileLink(selectPath).then(res => {
      //     downloadFilesUrlList.push(res.data);
      //   }).catch(error => {
      //     toaster.danger(t('The_file_does_not_exist_It_may_have_been_deleted'));
      //   });
      // }
      downloadUrl = assetUrlAddParams(downloadUrl, { page: appPage, column: column, row: rowData });
      downloadFilesUrlList.push(`${downloadUrl}${downloadUrl.indexOf('?') === -1 ? '?' : '&'}dl=1`);
    });
    downloadFiles(downloadFilesUrlList);
    this.onChangeSelectMultipleFiles(false);
  };

  onDeleteAllSelectedFiles = () => {
    const { selectedFilesList } = this.state;
    this.props.deleteFiles(selectedFilesList);
    this.onChangeSelectMultipleFiles(false);
  };

  renderFilesOperation = () => {
    const { value, readOnly } = this.props;
    const { isSelectMultipleFiles, selectedFilesList } = this.state;
    if (value.length === 0) return;
    return (
      <div className="files-operation-content">
        {!isSelectMultipleFiles ? (
          <span onClick={this.onChangeSelectMultipleFiles.bind(this, true)}>
            {intl.get('Select')}
          </span>
        ) : (
          <>
            {selectedFilesList.length > 0 && (
              <>
                {!readOnly && (
                  <span onClick={this.onDeleteAllSelectedFiles}>{intl.get('Delete')}</span>
                )}
                {
                  <span className="ml-2" onClick={this.onDownloadAllSelectedFiles}>
                    {intl.get('Download')}
                  </span>
                }
              </>
            )}
            <span className="ml-2" onClick={this.onSelectAllFiles}>
              {intl.get('Select_all')}
            </span>
            <span className="ml-2" onClick={this.onChangeSelectMultipleFiles.bind(this, false)}>
              {intl.get('Cancel')}
            </span>
          </>
        )}
      </div>
    );
  };

  render() {
    const { readOnly, value, appPage, column, rowData } = this.props;
    const { isSelectMultipleFiles, selectedFilesList } = this.state;
    return (
      <div className="dtable-file-previewer-container">
        <div className="dtable-file-previewer-wrapper">
          <div className="dtable-file-previewer-header d-flex align-items-center">
            {selectedFilesList.length > 0 ? (
              <span className="files-count-content">
                {selectedFilesList.length === 1
                  ? intl.get('1_file_selected')
                  : intl.get('Selected_xxx_files', { count: selectedFilesList.length })}
              </span>
            ) : (
              <span className="files-count-content">
                {value.length <= 1
                  ? intl.get('xxx_existing_file', { count: value.length })
                  : intl.get('xxx_existing_files', { count: value.length })}
              </span>
            )}
            {this.renderFilesOperation()}
          </div>
          <div className="dtable-file-previewer-content">
            {value.length > 0 &&
              value.map((fileItem, index) => {
                const isSelected = selectedFilesList.indexOf(fileItem.name) === -1 ? false : true;
                return (
                  <FileListItem
                    key={fileItem.url + index}
                    fileItem={fileItem}
                    deleteFile={this.props.deleteFile}
                    freezeItem={this.freezeItem}
                    unFreezeItem={this.unFreezeItem}
                    isItemFreezed={this.state.isItemFreezed}
                    itemIndex={index}
                    readOnly={readOnly}
                    isSelected={isSelected}
                    showLargeImage={this.showLargeImage}
                    onSelectFiles={this.onSelectFiles}
                    isSelectMultipleFiles={isSelectMultipleFiles}
                    updateFileName={this.props.updateFileName}
                    appPage={appPage}
                    column={column}
                    rowData={rowData}
                  />
                );
              })}
          </div>
        </div>
        {this.state.isShowLargeImage && (
          <ImagePreviewerLightbox
            imageItems={this.state.fileImageUrlList}
            imageIndex={this.state.largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            deleteImage={this.deleteImage}
            downloadImage={this.downloadImage}
            readOnly={readOnly}
          />
        )}
        {!readOnly && (
          <CommonAddTool callBack={this.togglePreviewer} footerName={intl.get('Add_files')} />
        )}
      </div>
    );
  }
}

FileListPreviewer.propTypes = propTypes;

export default FileListPreviewer;
