import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { DTableSearchInput } from 'dtable-ui-component';
import './option-selector.css';

class SingleSelectEditor extends Component {
  constructor(props) {
    super(props);
    const options = this.getSelectColumnOptions();
    this.initIdOptionMap(options);

    this.isFormPage = 'form';
    const highlightIndex = this.getInitHighLightIndex(options, props.value);
    this.state = {
      value: props.value || '',
      searchVal: '',
      options,
      highlightIndex,
      maxItemNum: 0,
      itemHeight: 0,
    };
    this.filteredOptions = options;
    this.timer = null;
  }

  componentDidMount() {
    if (this.selectContainer && this.selectItem) {
      this.setState({
        maxItemNum: this.getMaxItemNum(),
        itemHeight: parseInt(getComputedStyle(this.selectItem, null).height),
      });
    }
    document.addEventListener('keydown', this.onHotKey, true);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({ value });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    document.removeEventListener('keydown', this.onHotKey, true);
  }

  initIdOptionMap = (options) => {
    this.idOptionMap = {};
    options.forEach((option) => {
      this.idOptionMap[option.id] = option;
    });
  };

  getInitHighLightIndex = (options, value) => {
    if (!this.isFormPage) return -1;
    const highlightIndex = options.findIndex((option) => option.id === value);
    return highlightIndex;
  };

  getSelectColumnOptions = () => {
    const { column, rowData, columns } = this.props;
    const options = getSelectColumnOptions(column);
    const { data } = column;
    const { cascade_column_key, cascade_settings } = data || {};
    if (
      !cascade_column_key ||
      !columns ||
      !columns.find((column) => column.key === cascade_column_key)
    ) {
      return options;
    }
    if (cascade_column_key && rowData) {
      const cascadeColumnValue = rowData[cascade_column_key];
      if (!cascadeColumnValue) return [];

      const cascadeSetting = cascade_settings[cascadeColumnValue];
      if (!cascadeSetting || !Array.isArray(cascadeSetting) || cascadeSetting.length === 0) {
        return [];
      }
      return options.filter((option) => cascadeSetting.includes(option.id));
    }
    return options;
  };

  onBlur = () => {
    if (this.props.onCommit) this.props.onCommit();
  };

  getValue = () => {
    const { column } = this.props;
    const { value } = this.state;
    const option = this.idOptionMap[value];
    return {
      [column.key]: (option && option.name) || '',
    };
  };

  getOldValue = () => {
    const { column, value } = this.props;
    const option = this.idOptionMap[value];
    return {
      [column.key]: (option && option.name) || '',
    };
  };

  getValueOfOptionId = () => {
    const { column } = this.props;
    return {
      [column.key]: this.state.value,
    };
  };

  onChangeSearch = (searchVal) => {
    const { searchVal: oldSearchVal, options } = this.state;
    if (oldSearchVal === searchVal) return;

    this.setState({ searchVal });
    const val = searchVal.toLowerCase();
    this.filteredOptions = val
      ? options.filter((item) => item.name && item.name.toLowerCase().indexOf(val) > -1)
      : options;
    const highlightIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.setState({ highlightIndex });
  };

  onMenuMouseEnter = (index) => {
    this.setState({ highlightIndex: index });
  };

  onMenuMouseLeave = (index) => {
    this.timer = setTimeout(() => {
      if (this.state.highlightIndex === index) {
        this.setState({ highlightIndex: -1 });
      }
    }, 300);
  };

  onSelectOption = (optionID) => {
    // Determine the value based on whether it's the currently selected option
    let value = optionID;
    if (optionID === this.props.value) {
      value = null;
    }

    // Set the new value in state and then call onCommit with the updated value
    this.setState({ value }, () => {
      this.props.onCommit({ updatedValue: value });
    });
  };

  handleEditorOptionClick = (event) => {
    event.nativeEvent.stopImmediatePropagation();
  };

  onHotKey = (e) => {
    if (e.keyCode === keyCodes.Enter) {
      this.onEnter(e);
    } else if (e.keyCode === keyCodes.UpArrow) {
      this.onUpArrow(e);
    } else if (e.keyCode === keyCodes.DownArrow) {
      this.onDownArrow(e);
    } else if (e.keyCode === keyCodes.Tab) {
      if (this.props.onPressTab) {
        this.props.onPressTab(e);
      }
    } else if (e.keyCode === keyCodes.Escape) {
      this.onEsc(e);
    }
  };

  onEsc = () => {
    const { onEscape } = this.props;
    if (!onEscape) return;
    const closeEditor = onEscape();
    closeEditor && closeEditor(true);
  };

  onEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let option;
    if (this.filteredOptions.length === 1) {
      option = this.filteredOptions[0];
    } else if (this.state.highlightIndex > -1) {
      option = this.filteredOptions[this.state.highlightIndex];
    }
    // if option is exist, select it
    if (option) {
      const { value } = this.state;
      let newOptionId = value === option.id ? null : option.id;
      this.onSelectOption(newOptionId);
      return;
    }
  };

  onUpArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex > 0) {
      this.setState({ highlightIndex: highlightIndex - 1 }, () => {
        if (highlightIndex < this.filteredOptions.length - maxItemNum) {
          this.selectContainer.scrollTop -= itemHeight;
        }
      });
    }
  };

  onDownArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex < this.filteredOptions.length - 1) {
      this.setState({ highlightIndex: highlightIndex + 1 }, () => {
        if (highlightIndex >= maxItemNum) {
          this.selectContainer.scrollTop += itemHeight;
        }
      });
    }
  };

  onKeyDown = (e) => {
    if (
      e.keyCode === keyCodes.ChineseInputMethod ||
      e.keyCode === keyCodes.Enter ||
      e.keyCode === keyCodes.LeftArrow ||
      e.keyCode === keyCodes.RightArrow
    ) {
      e.stopPropagation();
    }
  };

  getMaxItemNum = () => {
    let selectContainerStyle = getComputedStyle(this.selectContainer, null);
    let selectItemStyle = getComputedStyle(this.selectItem, null);
    let maxSelectItemNum = Math.floor(
      parseInt(selectContainerStyle.maxHeight) / parseInt(selectItemStyle.height)
    );
    return maxSelectItemNum - 1;
  };

  renderMenuContent = () => {
    const { value, highlightIndex } = this.state;
    const { column } = this.props;

    if (this.filteredOptions.length === 0) {
      return <span className="none-search-result">{intl.get('No_options_available')}</span>;
    }

    // maxWidth = single-selects-container's width - single-selects-container's padding-left and padding-right - single-select-container's padding-left - single-select-check-icon's width - The gap between the single-select-check-icon and single-select-name or scroll's width
    // maxWidth = column.width > 200 ? column.width - 20 - 12 - 20 - 10 : 200 - 20 - 12 - 20 - 10
    // maxWidth = column.width > 200 ? column.width - 62 : 200 - 62
    const maxWidth = column.width > 200 ? column.width - 62 : 200 - 62;
    return this.filteredOptions.map((option, i) => {
      const singleSelectNameStyle = {
        backgroundColor: option.color,
        color: option.textColor || null,
        maxWidth,
      };
      const isSelected = value === option.id;
      const isActive = i === highlightIndex;
      const containerClass = `single-select-container option-selector-item-container ${isActive ? 'option-selector-item-container--highlight' : ''} `;
      return (
        <div
          key={option.id}
          className="dropdown-item option-selector-item single-select-item"
          ref={(ref) => (this.selectItem = ref)}>
          <div
            className={containerClass}
            onMouseDown={this.onSelectOption.bind(this, isSelected ? null : option.id)}
            onMouseEnter={this.onMenuMouseEnter.bind(this, i)}
            onMouseLeave={this.onMenuMouseLeave.bind(this, i)}>
            <div className="option-selector-item-content single-select">
              <span
                className="option-selector-name single-select-name"
                style={singleSelectNameStyle}
                title={option.name}
                aria-label={option.name}>
                {option.name}
              </span>
            </div>
            <div className="option-selector-check-icon single-select-check-icon">
              {isSelected && <i className="dtable-font dtable-icon-check-mark"></i>}
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { enableSearch, column, height, expandedRow } = this.props;
    let menuStyle = { width: column.width };
    if (height) {
      menuStyle.top = height - 2;
    }
    if (expandedRow) {
      menuStyle.width = '320px';
    }

    return (
      <div
        className={`dropdown-menu option-selector-wrapper single-selects-editor-list ${this.isFormPage ? 'form' : ''} show`}
        style={menuStyle}
        ref={(ref) => (this.singleSelectsRef = ref)}>
        {(enableSearch || this.filteredOptions.length > 10) && (
          <div className="option-selector-searcher search-single-selects">
            <DTableSearchInput
              autoFocus
              placeholder={intl.get('search_option')}
              onKeyDown={this.onKeyDown}
              onChange={this.onChangeSearch}
            />
          </div>
        )}
        <div
          className="option-selector-container single-selects-container"
          ref={(ref) => (this.selectContainer = ref)}>
          {this.renderMenuContent()}
        </div>
      </div>
    );
  }
}

SingleSelectEditor.propTypes = {
  readOnly: PropTypes.bool,
  enableSearch: PropTypes.bool,
  value: PropTypes.string,
  column: PropTypes.object,
  expandedRow: PropTypes.object,
  height: PropTypes.number,
  rowData: PropTypes.object,
  onPressTab: PropTypes.func,
  onCommit: PropTypes.func,
};

export default SingleSelectEditor;

export function getSelectColumnOptions(column) {
  if (!column || !column.data || !Array.isArray(column.data.options)) {
    return [];
  }
  return column.data.options;
}

export const PAGE_TYPE = {
  TABLE: 'table',
  FORM: 'form',
  GALLERY: 'gallery',
  CALENDAR: 'calendar',
  CUSTOM_PAGE: 'custom_page',
  KANBAN: 'kanban',
  TIMELINE: 'timeline',
  DATA_SEARCH: 'data_search',
  MAP_CN: 'map_cn',
  SINGLE_RECORD_PAGE: 'single_record_page',
  AI_ASSISTANT: 'ai_assistant',
};

const keyCodes = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  PauseBreak: 19,
  CapsLock: 20,
  Escape: 27,
  Esc: 27,
  Space: 32,
  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,
  LeftArrow: 37,
  UpArrow: 38,
  RightArrow: 39,
  DownArrow: 40,
  Insert: 45,
  Delete: 46,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  LeftWindowKey: 91,
  RightWindowKey: 92,
  SelectKey: 93,
  NumPad0: 96,
  NumPad1: 97,
  NumPad2: 98,
  NumPad3: 99,
  NumPad4: 100,
  NumPad5: 101,
  NumPad6: 102,
  NumPad7: 103,
  NumPad8: 104,
  NumPad9: 105,
  Multiply: 106,
  Add: 107,
  Subtract: 109,
  DecimalPoint: 110,
  Divide: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F12: 123,
  NumLock: 144,
  ScrollLock: 145,
  SemiColon: 186,
  EqualSign: 187,
  Comma: 188,
  Dash: 189,
  Period: 190,
  ForwardSlash: 191,
  GraveAccent: 192,
  OpenBracket: 219,
  BackSlash: 220,
  CloseBracket: 221,
  SingleQuote: 222,
  ChineseInputMethod: 229,
};
