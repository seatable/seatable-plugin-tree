import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import intl from 'react-intl-universal';

import './locale';

import './assets/css/plugin-layout.css';
import { IAppProps } from './utils/Interfaces/App.interface';

const App: React.FC<IAppProps> = ({ isDevelopment, showDialog, row }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [_showDialog, setShowDialog] = useState(showDialog || false);

  useEffect(() => {
    initPluginDTableData();
    return () => {
      unsubscribeLocalDtableChanged();
      unsubscribeRemoteDtableChanged();
    };
  }, []);

  const initPluginDTableData = async () => {
    if (isDevelopment) {
      // local develop
      window.dtableSDK.subscribe('dtable-connect', () => {
        onDTableConnect();
      });
    }
    unsubscribeLocalDtableChanged = window.dtableSDK.subscribe(
      'local-dtable-changed',
      () => {
        onDTableChanged();
      }
    );
    unsubscribeRemoteDtableChanged = window.dtableSDK.subscribe(
      'remote-dtable-changed',
      () => {
        onDTableChanged();
      }
    );
    resetData();
  };

  let unsubscribeLocalDtableChanged = () => {
    throw new Error('Method not implemented.');
  };
  let unsubscribeRemoteDtableChanged = () => {
    throw new Error('Method not implemented.');
  };

  const onDTableConnect = () => {
    resetData();
  };

  const onDTableChanged = () => {
    resetData();
  };

  const resetData = () => {
    setIsLoading(false);
  };

  const onPluginToggle = () => {
    setShowDialog(false);
    window.app.onClosePlugin();
  };

  const { collaborators } = window.app.state;
  const subtables = window.dtableSDK.getTables();

  return isLoading ? (
    <div></div>
  ) : (
    <Modal
      isOpen={showDialog}
      toggle={onPluginToggle}
      className='dtable-plugin plugin-container'
      size='lg'
    >
      <ModalHeader className='test-plugin-header' toggle={onPluginToggle}>
        {'Plugin'}
      </ModalHeader>
      <ModalBody className='test-plugin-content'>
        <div>{`'dtable-subtables: '${JSON.stringify(subtables)}`}</div>
        <br></br>
        <div>{`'dtable-collaborators: '${JSON.stringify(collaborators)}`}</div>
      </ModalBody>
    </Modal>
  );
};

export default App;
