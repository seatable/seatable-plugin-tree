import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../../../styles/template-styles/formatter/FileFormatter.module.scss';
import { getFileIconUrl } from './utils';

export default class FileItemFormatter extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
  };

  getFileIconData = (item) => {
    const fileIconUrl = getFileIconUrl(item.name, item.type);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fileIconData = require('./' + fileIconUrl);
    return fileIconData;
  };

  render() {
    const { file } = this.props;
    return <img className={styles.fileItemIcon} src={this.getFileIconData(file)} alt={file.name} />;
  }
}
