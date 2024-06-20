import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const propTypes = {
  itemIndex: PropTypes.number,
  fileItem: PropTypes.object,
  deleteFile: PropTypes.func,
  renameFile: PropTypes.func,
  downloadFile: PropTypes.func,
  freezeItem: PropTypes.func,
  unFreezeItem: PropTypes.func,
  resetState: PropTypes.func,
};

class ItemDropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isItemMenuShow: false,
      isRenameDialogShow: false,
    };
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

  deleteFile = (event) => {
    this.props.resetState();
    this.props.deleteFile(this.props.itemIndex);
  };

  renameFile = () => {
    this.props.renameFile(this.props.itemIndex);
  };

  render() {
    return (
      <Fragment>
        <Dropdown
          isOpen={this.state.isItemMenuShow}
          toggle={this.onDropdownToggleClick}
          className="item-dropdown-menu">
          <DropdownToggle
            className="item-dropdown"
            tag="span"
            role="button"
            data-toggle="dropdown"
            title={intl.get('More_operations')}
            aria-label={intl.get('More_operations')}
            aria-expanded={this.state.isItemMenuShow}>
            <span className="dtable-font dtable-icon-more-vertical item-dropdown-more"></span>
          </DropdownToggle>
          <DropdownMenu className="dtable-dropdown-menu dropdown-menu large">
            <DropdownItem onClick={this.deleteFile}>
              <i className="item-icon dtable-font dtable-icon-delete"></i>
              {intl.get('Delete')}
            </DropdownItem>
            <DropdownItem onClick={this.renameFile}>
              <i className="item-icon dtable-font dtable-icon-rename"></i>
              {intl.get('Rename')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Fragment>
    );
  }
}

ItemDropdownMenu.propTypes = propTypes;

export default ItemDropdownMenu;
