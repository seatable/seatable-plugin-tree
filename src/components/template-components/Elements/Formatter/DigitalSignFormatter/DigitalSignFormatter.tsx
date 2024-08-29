import React, { useState, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import ImagesLazyLoad from './image-lazy-load';
import ImagePreviewerLightbox from '../Editors/ImageEditor/image-previewer-lightbox';
import { getDigitalSignImageUrl } from './utils';
import { downloadFile } from './utils';
import './index.css';

interface DigitalSignFormatterProps {
  isSample?: boolean;
  readOnly?: boolean;
  isSupportPreview?: boolean;
  value?: string | object;
  config?: {
    server?: string;
    workspaceID?: string | number;
    dtableUuid?: string;
  };
  containerClassName?: string;
  onCloseCallback?: () => void;
  renderItem?: (item: any) => JSX.Element;
}

const DigitalSignFormatter: React.FC<DigitalSignFormatterProps> = ({
  isSample = false,
  isSupportPreview = false,
  readOnly = true,
  value = '',
  config = {},
  containerClassName = '',
  onCloseCallback,
  renderItem,
}) => {
  const [isPreviewSignImage, setIsPreviewSignImage] = useState(false);
  const [largeSignImageIndex, setLargeSignImageIndex] = useState(-1);

  const signImages = useMemo(() => {
    return [getDigitalSignImageUrl(value, config)].filter(Boolean);
  }, [value, config]);

  const onClickSignImage = useCallback(
    (index: number) => {
      if (!isSupportPreview) return;
      setIsPreviewSignImage(true);
      setLargeSignImageIndex(index);
    },
    [isSupportPreview]
  );

  const hideLargeSignImage = useCallback(() => {
    if (!isSupportPreview) return;
    if (onCloseCallback) {
      onCloseCallback();
    }
    setIsPreviewSignImage(false);
    setLargeSignImageIndex(-1);
  }, [isSupportPreview, onCloseCallback]);

  const downloadImage = useCallback((url: string) => {
    let availableUrl = url;
    const rotateIndex = availableUrl.indexOf('?a=');
    if (rotateIndex > -1) {
      availableUrl = availableUrl.slice(0, rotateIndex);
    }
    const urlSuffix = availableUrl.indexOf('?dl=1');
    const downloadUrl = urlSuffix !== -1 ? availableUrl : `${availableUrl}?dl=1`;
    downloadFile(downloadUrl);
  }, []);

  const className = classnames(
    'dtable-ui cell-formatter-container digital-sign-formatter',
    containerClassName
  );

  if (signImages.length === 0) return null;

  return (
    <>
      <div className={className}>
        <ImagesLazyLoad
          images={signImages}
          server={config.server}
          onImageClick={onClickSignImage}
          renderItem={renderItem}
        />
      </div>
      {isPreviewSignImage && (
        <ImagePreviewerLightbox
          // className="digital-sign-formatter-image-previewer"
          readOnly={readOnly}
          // server={isSample ? config.server : ''}
          imageItems={signImages}
          imageIndex={largeSignImageIndex}
          closeImagePopup={hideLargeSignImage}
          downloadImage={downloadImage}
          moveToPrevImage={() => {}}
          moveToNextImage={() => {}}
        />
      )}
    </>
  );
};

export default DigitalSignFormatter;
