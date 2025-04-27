import React, { useState, useEffect } from 'react';
import styles from 't_styles/PluginTree.module.scss';
import stylesPPresets from 't_styles/PluginPresets.module.scss';
import { IHeaderProps } from '@/utils/template-utils/interfaces/Header.interface';
import { PLUGIN_ID } from 'utils/template-utils/constants';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';

const Header: React.FC<IHeaderProps> = (props) => {
  const { presetName, isShowPresets, onTogglePresets, togglePlugin } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customComponentContent, setCustomComponentContent] = useState<string | null>(null);

  useEffect(() => {
    const input = document.getElementById(PLUGIN_ID);
    if (input) {
      setCustomComponentContent(input.innerHTML);
    }
  }, []);

  return (
    <div className={styles.plugin_header}>
      <div className={'d-flex align-items-center justify-content-start'}>
        <div className={`align-items-center ${isShowPresets ? 'd-none' : 'd-flex'} `}>
          <button
            className={stylesPPresets.presets_uncollapse_btn2_settings}
            onClick={onTogglePresets}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div className={styles.plugin_header_pluginName}>
          <p className="font-weight-bold">{presetName}</p>
        </div>
      </div>
      <div
        className={`d-flex align-items-center justify-content-end ${styles.plugin_header_settings}`}>
        <span className={styles.plugin_header_icon_btn} onClick={togglePlugin}>
          <span className="dtable-font dtable-icon-x"></span>
        </span>
      </div>
    </div>
  );
};

export default Header;
