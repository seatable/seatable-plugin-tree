import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import './../../../styles/template-styles/DSelect.scss';

const MenuSelectStyle = {
  option: (provided, state) => {
    const { isDisabled, isSelected, value } = state;
    return {
      ...provided,
      color: value === '00000' ? '#999999' : '#333',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isSelected ? '#f5f5f5' : '#fff',
      '.header-icon .dtable-font': {
        color: isSelected ? '#fff' : '#aaa',
      },
    };
  },
  control: (provided) => ({
    ...provided,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '1.5',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  indicatorSeparator: () => {},
  singleValue: (provided, state) => {
    const value = state.getValue()[0].label;
    return {
      ...provided,
      color: value === 'Not used' ? '#999999' : '#333',
    };
  },
};

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-drop-down" style={{ fontSize: '12px' }}></span>
      </components.DropdownIndicator>
    )
  );
};

const MenuList = (props) => (
  <div
    onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
    onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
    <components.MenuList {...props}>{props.children}</components.MenuList>
  </div>
);

MenuList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const Option = (props) => {
  return (
    <div style={props.data.style}>
      <components.Option {...props} />
    </div>
  );
};

Option.propTypes = {
  data: PropTypes.shape({
    style: PropTypes.object,
  }),
};

class DtableSelect extends React.Component {
  static propTypes = {
    isMulti: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isSearchable: PropTypes.bool,
    isClearable: PropTypes.bool,
    placeholder: PropTypes.string,
    classNamePrefix: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    menuPortalTarget: PropTypes.string,
    menuPosition: PropTypes.string,
    noOptionsMessage: PropTypes.func,
    isDisabled: PropTypes.bool,
  };

  static defaultProps = {
    options: [],
    value: {},
    isSearchable: false,
    isClearable: false,
    placeholder: '',
    isMulti: false,
    menuPortalTarget: '.modal',
    noOptionsMessage: () => {
      return null;
    },
    isDisabled: false, // Set default value for isDisabled
  };

  getMenuPortalTarget = () => {
    let { menuPortalTarget } = this.props;
    return document.querySelector(menuPortalTarget);
  };

  render() {
    const {
      options,
      onChange,
      value,
      isSearchable,
      placeholder,
      isMulti,
      menuPosition,
      isClearable,
      noOptionsMessage,
      classNamePrefix,
      isDisabled, // Destructure isDisabled from props
    } = this.props;
    return (
      <Select
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        classNamePrefix={classNamePrefix || 'react-select'}
        styles={MenuSelectStyle}
        components={{ Option, DropdownIndicator, MenuList }}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        menuPosition={menuPosition || 'fixed'} // when use default menuPosition(absolute), menuPortalTarget is unnecessary.
        menuShouldScrollIntoView
        menuPortalTarget={this.getMenuPortalTarget()}
        captureMenuScroll={false}
        noOptionsMessage={noOptionsMessage}
        isDisabled={isDisabled} // Pass isDisabled to Select component
      />
    );
  }
}

export default DtableSelect;
