import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import deepCopy from 'deep-copy';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import FileListPreviewer from './file-list-previewer';
import FileAdditionPreviewer from './file-addition-previewer';
import { PREVIEWER, ADDITION } from './constants/constants';

import './index.css';

const FileEditorPropTypes = {
  mode: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.array,
  column: PropTypes.object,
  onCommit: PropTypes.func,
  onCommitData: PropTypes.func,
  appPage: PropTypes.object,
  rowData: PropTypes.object,
};

class FileEditor extends React.Component {
  static defaultProps = {
    mode: PREVIEWER,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      value: props.value || [],
      editorView: this.getEditorView(),
      isShowFileChooser: false,
      uploadLibraryFileValue: [],
      uploadLocalFileValue: [],
      isUpdated: false,
    };
  }

  componentDidMount() {
    if (this.props.readOnly) {
      this.setState({ editorView: PREVIEWER });
    }
  }

  getEditorView = () => {
    const { value, mode } = this.props;
    if (!value || value.length === 0) {
      return ADDITION;
    }
    return mode;
  };

  getValue = () => {
    const updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
  };

  toggle = (e) => {
    const { toggle } = this.props;
    if (this.state.isOpen && this.state.isUpdated) {
      if (this.state.editorView === ADDITION) {
        let { value, uploadLocalFileValue, uploadLibraryFileValue } = this.state;
        let newValue = value.concat(uploadLocalFileValue, uploadLibraryFileValue);
        this.setState({ value: newValue }, () => {
          this.props.onCommit(this.getValue(), this.props.column);
        });
        return;
      }
      this.props.onCommit(this.getValue(), this.props.column);
    }
    this.setState({ isOpen: !this.state.isOpen });
    toggle && toggle(e);
  };

  closeEditor = () => {
    this.setState({ isOpen: false });
  };

  fileUploadCompleted = (fileMessage) => {
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    let fileUploadMessage = {
      name: fileMessage.name,
      size: fileMessage.size,
      type: fileMessage.type,
      url: fileMessage.url,
      upload_time: fileMessage.upload_time,
    };
    uploadLocalFileValue.push(fileUploadMessage);
    this.setState({
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true,
    });
  };

  addUploadedFile = (fileMessageList) => {
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    for (let fileMessage of fileMessageList) {
      let fileUploadMessage = {
        name: fileMessage.name,
        size: fileMessage.size,
        type: fileMessage.type,
        url: fileMessage.url,
      };
      uploadLocalFileValue.push(fileUploadMessage);
    }
    this.setState({
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true,
    });
  };

  deleteFile = (index, type) => {
    let uploadLibraryFileValue = this.state.uploadLibraryFileValue.slice(0);
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    let value = this.state.value.slice(0);
    if (this.state.editorView === PREVIEWER) {
      value.splice(index, 1);
    } else {
      if (type === 'libraryFile') {
        uploadLibraryFileValue.splice(index, 1);
      }
      if (type === 'localFile') {
        uploadLocalFileValue.splice(index, 1);
      }
    }
    this.setState({
      uploadLibraryFileValue: uploadLibraryFileValue,
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true,
      value: value,
    });
  };

  updateFileName = (newName, editingItemIndex) => {
    const { value } = this.state;
    const { onCommitData, column } = this.props;
    if (editingItemIndex !== null) {
      const clonedValue = deepCopy(value);
      clonedValue[editingItemIndex].name = newName;
      this.setState(
        {
          value: clonedValue,
        },
        () => {
          onCommitData({ value: clonedValue }, column);
        }
      );
    }
  };

  // Only previewer can delete multiple files now
  deleteFilesByPreviewer = (fileList) => {
    const result = this.state.value.filter((file) => !fileList.includes(file.name));
    this.setState({
      isUpdated: true,
      value: result,
    });
  };

  selectSeafileFile = (dirent, selectedPath) => {
    let uploadLibraryFileValue = this.state.uploadLibraryFileValue.slice(0);
    const { repoApiToken } = window.dtable;
    let url = 'seafile-connector://' + repoApiToken + selectedPath;
    let option = {
      name: dirent.name,
      size: dirent.size,
      type: dirent.type,
      url: url,
    };
    uploadLibraryFileValue.push(option);
    this.setState({
      uploadLibraryFileValue: uploadLibraryFileValue,
      isUpdated: true,
    });
  };

  selectMultiSeafileFile = (direntFilesMap) => {
    let uploadLibraryFileValue = this.state.uploadLibraryFileValue.slice(0);
    const { repoApiToken } = window.dtable;

    let direntFileKeys = Object.keys(direntFilesMap);
    direntFileKeys.forEach((key) => {
      let url = 'seafile-connector://' + repoApiToken + key;
      const dirent = direntFilesMap[key];
      let option = {
        name: dirent.name,
        size: dirent.size,
        type: dirent.type,
        url: url,
      };
      uploadLibraryFileValue.push(option);
    });
    this.setState({
      uploadLibraryFileValue,
      isUpdated: true,
    });
  };

  onFileChooserToggle = () => {
    this.setState({ isShowFileChooser: !this.state.isShowFileChooser });
  };

  togglePreviewer = (type) => {
    this.setState({ editorView: type });
  };

  showFileListPreviewer = () => {
    let { value, uploadLocalFileValue, uploadLibraryFileValue } = this.state;
    let newValue = value.concat(uploadLocalFileValue, uploadLibraryFileValue);
    this.setState({ value: newValue });
    this.togglePreviewer(PREVIEWER);
  };

  resetFileValue = () => {
    this.setState({
      uploadLocalFileValue: [],
      uploadLibraryFileValue: [],
    });
  };

  renderHeader = () => {
    switch (this.state.editorView) {
      case PREVIEWER:
        return <span key="dtable-file-editor-title">{intl.get('All_files')}</span>;
      case ADDITION:
        return (
          <span
            onClick={this.showFileListPreviewer}
            className="dtable-font dtable-icon-return mr-2"
            key="dtable-file-editor-title">
            <span className="dtable-file-editor-title">{intl.get('Add_files')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  render() {
    const { appPage, column, rowData } = this.props;
    return (
      <Modal isOpen={this.state.isOpen} toggle={this.toggle} className="dtable-file-editor-modal">
        <ModalHeader toggle={this.toggle}>{this.renderHeader()}</ModalHeader>
        <ModalBody className="p-0">
          <div ref="fileEditorContainer" className="dtable-file-editor-container">
            {this.state.editorView === PREVIEWER && (
              <FileListPreviewer
                readOnly={this.props.readOnly}
                value={this.state.value}
                togglePreviewer={this.togglePreviewer}
                deleteFile={this.deleteFile}
                deleteFiles={this.deleteFilesByPreviewer}
                resetFileValue={this.resetFileValue}
                updateFileName={this.updateFileName}
                appPage={appPage}
                column={column}
                rowData={rowData}
              />
            )}
            {this.state.editorView === ADDITION && (
              <FileAdditionPreviewer
                uploadLibraryFileValue={this.state.uploadLibraryFileValue}
                uploadLocalFileValue={this.state.uploadLocalFileValue}
                deleteFile={this.deleteFile}
                addUploadedFile={this.addUploadedFile}
                fileUploadCompleted={this.fileUploadCompleted}
                showFileListPreviewer={this.showFileListPreviewer}
                onFileChooserToggle={this.onFileChooserToggle}
              />
            )}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

FileEditor.propTypes = FileEditorPropTypes;

export default FileEditor;
