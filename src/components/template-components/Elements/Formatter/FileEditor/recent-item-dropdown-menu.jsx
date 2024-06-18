import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const propTypes = {
  onRef: PropTypes.func,
  itemIndex: PropTypes.number,
  fileItem: PropTypes.object,
  deleteFile: PropTypes.func,
  downloadFile: PropTypes.func,
  viewFile: PropTypes.func,
  freezeItem: PropTypes.func,
  unFreezeItem: PropTypes.func,
  resetState: PropTypes.func,
};

class RecentItemDropdownMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isItemMenuShow: false,
    };
  }

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }

  onDropdownToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isItemMenuShow: !this.state.isItemMenuShow }, () => {
      if (this.state.isItemMenuShow) {
        this.props.freezeItem();
      } else {
        this.props.unFreezeItem();
        this.props.resetState();
      }
    });
  };

  deleteFile = () => {
    this.props.resetState();
    this.props.deleteFile();
  };

  downloadFile = () => {
    this.props.downloadFile();
  };

  viewFile = () => {
    this.props.viewFile();
  };

  render() {
    return (
      <Fragment>
        <Dropdown isOpen={this.state.isItemMenuShow} toggle={this.onDropdownToggleClick} className="item-dropdown-menu" size="sm">
          <DropdownToggle
            className="item-dropdown"
            tag="span"
            role="button"
            data-toggle="dropdown"
            title={intl.get('More_operations')}
            aria-label={intl.get('More_operations')}
            aria-expanded={this.state.isItemMenuShow}
          >
            <span className="dtable-font dtable-icon-more-vertical item-dropdown-more"></span>
          </DropdownToggle>
          <DropdownMenu style={{ marginLeft: '-16px', transform: 'none' }} className="dtable-dropdown-menu large" >
            <DropdownItem onClick={this.viewFile}>
              <i className="item-icon dtable-font dtable-icon-eye"></i>
              <span className="item-text">{intl.get('View')}</span>
            </DropdownItem>
            <DropdownItem onClick={this.downloadFile}>
              <i className="item-icon dtable-font dtable-icon-download"></i>
              <span className="item-text">{intl.get('Download')}</span>
            </DropdownItem>
            <DropdownItem onClick={this.deleteFile}>
              <i className="item-icon dtable-font dtable-icon-delete"></i>
              <span className="item-text">{intl.get('Delete')}</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Fragment>
    );
  }
}

RecentItemDropdownMenu.propTypes = propTypes;

export default RecentItemDropdownMenu;
