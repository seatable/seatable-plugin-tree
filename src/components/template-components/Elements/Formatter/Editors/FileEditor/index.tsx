import { IFile } from '@/utils/template-utils/interfaces/Formatter/File.interface';
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ListGroup, ListGroupItem } from 'reactstrap';

interface FileModalProps {
  isOpen: boolean;
  toggle: () => void;
  files: IFile[];
}

const FileEditor: React.FC<FileModalProps> = ({ isOpen, toggle, files }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>All files</span>
          <Button color="link">Select</Button>
        </div>
      </ModalHeader>
      <ModalBody>
        <ListGroup>
          {files.map((file, index) => (
            <ListGroupItem key={index} className="d-flex align-items-center">
              {file.type.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  style={{ width: '50px', marginRight: '10px' }}
                />
              ) : file.type === 'application/pdf' ? (
                <iframe
                  src={file.url}
                  title={file.name}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
              ) : (
                <iframe
                  src={file.url}
                  title={file.name}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
              )}{' '}
              <div>
                <div>{file.name}</div>
                <small>
                  {file.upload_time}, {file.size}
                </small>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
        <div className="text-center mt-3">
          <Button color="link">+ Add files</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FileEditor;
