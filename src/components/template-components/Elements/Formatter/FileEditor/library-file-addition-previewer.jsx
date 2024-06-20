import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { getFileIconUrl } from '../FileFormatter/utils';

const propTypes = {
  deleteFile: PropTypes.func,
  onFileChooserToggle: PropTypes.func,
  uploadLibraryFileValue: PropTypes.array,
};

class LibraryFileAdditionPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDeleteIcon: false,
      enterFileIndex: -1,
    };
  }

  onFileChooserToggle = () => {
    this.props.onFileChooserToggle();
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

  deleteFile = (event, index) => {
    this.props.deleteFile(index, 'libraryFile');
    this.hideDeleteIcon();
  };

  calculateFileArr = () => {
    let fileArr = [];
    if (Array.isArray(this.props.uploadLibraryFileValue)) {
      fileArr = this.props.uploadLibraryFileValue.map((fileItem, index) => {
        let fileIconUrl = getFileIconUrl(fileItem.name, fileItem.type);
        return (
          <div
            key={'dtable-file-wrapper-' + index}
            className="dtable-file-wrapper"
            onMouseEnter={(event) => this.showDeleteIcon(event, index)}
            onMouseLeave={this.hideDeleteIcon}>
            <div className="file-content">
              <img src={fileIconUrl} alt="" />
            </div>
            {this.state.isShowDeleteIcon && this.state.enterFileIndex === index && (
              <div className="delete-file-icon" onClick={(event) => this.deleteFile(event, index)}>
                <span className="file-delete-span">x</span>
              </div>
            )}
          </div>
        );
      });
      fileArr.push(
        <div className="dtable-file-wrapper" key={'dtable-file-wrapper-addition'}>
          <div className="dtable-file-add-box" onClick={this.onFileChooserToggle}>
            <div className="dtable-file-add-button">
              <i className="dtable-font dtable-icon-add-files"></i>
            </div>
          </div>
        </div>
      );
    }
    return fileArr;
  };

  render() {
    const fileArr = this.calculateFileArr();
    return (
      <Fragment>
        {fileArr.length > 1 && fileArr}
        {fileArr.length === 1 && (
          <div className="dtable-file-upload-container" onClick={this.onFileChooserToggle}>
            <div className="dtable-file-tip-addition">
              <div className="dtable-file-add-icon">
                <i className="dtable-font dtable-icon-add-files"></i>
              </div>
              <div className="dtable-file-add-span">{intl.get('Add_files')}</div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

LibraryFileAdditionPreviewer.propTypes = propTypes;

export default LibraryFileAdditionPreviewer;
