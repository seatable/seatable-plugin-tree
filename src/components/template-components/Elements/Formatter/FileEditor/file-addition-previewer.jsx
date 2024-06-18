import React from 'react';
import PropTypes from 'prop-types';
import { ModalFooter, Button } from 'reactstrap';
import classNames from 'classnames';
import intl from 'react-intl-universal';
import LocalFileAdditionPreviewer from './local-file-addition-previewer';
import LibraryFileAdditionPreviewer from './library-file-addition-previewer';
import RecentUploadAdditionPreviewer from './recent-upload-addition-previewer';

const propTypes = {
  togglePreviewer: PropTypes.func,
  uploadLocalFileValue: PropTypes.array,
  uploadLibraryFileValue: PropTypes.array,
  deleteFile: PropTypes.func,
  addUploadedFile: PropTypes.func,
  fileUploadCompleted: PropTypes.func,
  showFileListPreviewer: PropTypes.func,
  onFileChooserToggle: PropTypes.func,
};

class FileAdditionPreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'localFiles',
      fileSelectedList: []
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  onSelectFile = (formatedFileItem, isChecked) => {
    let fileSelectedList = this.state.fileSelectedList.slice(0);
    if (isChecked) {
      fileSelectedList.push(formatedFileItem);
    } else {
      fileSelectedList.splice(fileSelectedList.indexOf(formatedFileItem), 1);
    }
    this.setState({ fileSelectedList });
  };

  addFiles = () => {
    const { fileSelectedList } = this.state;
    this.props.addUploadedFile(fileSelectedList);
    setTimeout(() => {
      this.props.showFileListPreviewer();
    }, 0);
  };

  getTabClass = (tab) => {
    const { activeTab } = this.state;
    return classNames('dtable-addition-item', {
      'selected-dtable-addition-item': tab === activeTab
    });
  };

  render() {
    const isSupportLibrary = false;
    const isSupportRecent = false;
    const { activeTab } = this.state;
    return (
      <div className="dtable-file-addition-container">
        <div className="dtable-file-addition-left">
          <div className="dtable-file-addition-nav">
            <div className={this.getTabClass('localFiles')} onClick={this.toggle.bind(this, 'localFiles')}>
              {intl.get('Local_Files')}
            </div>
            {isSupportLibrary && (
              <div className={this.getTabClass('libraryFiles')} onClick={this.toggle.bind(this, 'libraryFiles')}>
                {intl.get('Library_Files')}
              </div>
            )}
            {isSupportRecent && (
              <div className={this.getTabClass('recentUpload')} onClick={this.toggle.bind(this, 'recentUpload')}>
                {intl.get('Recent_uploaded')}
              </div>
            )}
          </div>
        </div>
        <div className={`dtable-file-addition-right ${activeTab === 'recentUpload' ? 'dtable-file-addition-right-recent' : ''}`}>
          <div className="dtable-file-addition-right-container">
            {this.state.activeTab === 'localFiles' &&
              <LocalFileAdditionPreviewer
                uploadLocalFileValue={this.props.uploadLocalFileValue}
                deleteFile={this.props.deleteFile}
                fileUploadCompleted={this.props.fileUploadCompleted}
              />
            }
            {this.state.activeTab === 'libraryFiles' &&
              <LibraryFileAdditionPreviewer
                onFileChooserToggle={this.props.onFileChooserToggle}
                uploadLibraryFileValue={this.props.uploadLibraryFileValue}
                deleteFile={this.props.deleteFile}
              />
            }
            {activeTab === 'recentUpload' &&
              <>
                <div className="file-recent-upload">
                  <RecentUploadAdditionPreviewer
                    deleteFile={this.props.deleteFile}
                    onSelectFile={this.onSelectFile}
                  />
                </div>
                <ModalFooter className="w-100">
                  <Button color="secondary" onClick={this.props.showFileListPreviewer}>{intl.get('Cancel')}</Button>
                  <Button color="primary" onClick={this.addFiles}>{intl.get('Submit')}</Button>
                </ModalFooter>
              </>
            }
          </div>
        </div>
      </div>
    );
  }
}

FileAdditionPreviewer.propTypes = propTypes;

export default FileAdditionPreviewer;
