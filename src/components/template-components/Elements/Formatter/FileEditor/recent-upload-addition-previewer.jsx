import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RecentUploadList from './recent-upload-list';

const propTypes = {
  deleteFile: PropTypes.func,
  onSelectFile: PropTypes.func,
};

class RecentUploadAdditionPreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  componentDidMount() {
    this.listRecentUploadedFiles();
  }

  listRecentUploadedFiles = () => {
    const { dtableUuid } = window.dtable;
    window.dtableWebAPI.listRecentUploadedFiles(dtableUuid).then((res) => {
      const fileList = res.data.file_list;
      this.setState({ fileList });
    });
  };

  handleDelete = (fileItem, uploadDate) => {
    let fileList = this.state.fileList;
    let newFileList = fileList.filter((item) => {
      return item.date === uploadDate;
    });
    let newFileItemList = newFileList[0].file_items.filter((item) => {
      return item !== fileItem;
    });
    for (let f of fileList) {
      if (f.date === uploadDate) {
        f['file_items'] = newFileItemList;
        break;
      }
    }
    this.setState({ fileList: fileList });
  };

  deleteFile = (fileItem, uploadDate) => {
    let { dtableUuid } = window.dtable;
    let fileName = encodeURIComponent(fileItem.obj_name);
    let parentPath = '/files/' + encodeURIComponent(uploadDate);
    window.dtableWebAPI.deleteDTableAsset(dtableUuid, parentPath, fileName).then((res) => {
      this.handleDelete(fileItem, uploadDate);
    });
  };

  render() {
    const { fileList } = this.state;
    if (fileList.length === 0) return null;

    return (
      <Fragment>
        {fileList.map((content, index) => {
          const props = {
            fileContent: content,
            deleteFile: this.deleteFile,
            onSelectFile: this.props.onSelectFile,
          };
          return <RecentUploadList key={index} {...props} />;
        })}
      </Fragment>
    );
  }
}

RecentUploadAdditionPreviewer.propTypes = propTypes;

export default RecentUploadAdditionPreviewer;
