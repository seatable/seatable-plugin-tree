import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import RecentUploadItem from './recent-upload-item';

const propTypes = {
  fileRecenteUploadList: PropTypes.object,
  deleteFile: PropTypes.func,
  onSelectFile: PropTypes.func,
};

class RecentUploadList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isItemFreezed: false,
    };
  }

  freezeItem = () => {
    this.setState({ isItemFreezed: true });
  };

  unFreezeItem = () => {
    this.setState({ isItemFreezed: false });
  };

  render() {
    const { fileRecenteUploadList } = this.props;
    const { date, file_items } = fileRecenteUploadList;
    if (file_items.length === 0) {
      return (
        <Fragment>
          <div className='file-date'>{date}</div>
          <div className='file-empty'>({intl.get('Empty')})</div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className='file-date'>{date}</div>
        <div className='file-content'>
          {file_items.map((item, index) => {
            return (
              <RecentUploadItem
                key={item.obj_name}
                fileItem={item}
                itemIndex={index}
                uploadDate={date}
                isItemFreezed={this.state.isItemFreezed}
                freezeItem={this.freezeItem}
                unFreezeItem={this.unFreezeItem}
                deleteFile={this.props.deleteFile}
                onSelectFile={this.props.onSelectFile}
              />
            );
          })}
        </div>
      </Fragment>
    );
  }
}

RecentUploadList.propTypes = propTypes;

export default RecentUploadList;
