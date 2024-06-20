import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import {
  checkSVGImage,
  generateCurrentBaseImageUrl,
  getImageThumbnailUrl,
  isCustomAssetUrl,
  isDigitalSignsUrl,
  isInternalURL,
  needUseThumbnailImage,
} from '../../../../../../utils/template-utils/utils';
import { PREVIEWER } from '../../../Formatter/FileEditor/constants/constants';
import '@seafile/react-image-lightbox/style.css';
import './image-previewer-lightbox.css';

function ImagePreviewerLightbox(props) {
  let {
    imageItems,
    imageIndex,
    deleteImage,
    onRotateImage,
    downloadImage,
    moveToPrevRowImage,
    moveToNextRowImage,
    readOnly,
  } = props;
  const { server, workspaceID, dtableUuid } = window.dtable;

  const imageItemsLength = imageItems.length;
  imageItems = imageItems.map((url) => {
    if (isCustomAssetUrl(url)) {
      let assetUuid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
      return server + '/dtable/' + dtableUuid + '/custom-asset/' + assetUuid;
    }
    if (isDigitalSignsUrl(url)) {
      return generateCurrentBaseImageUrl({
        server,
        workspaceID,
        dtableUuid,
        partUrl: url,
      });
    }
    return url;
  });
  const URL = imageItems[imageIndex];

  // Handle URL has special symbol %$
  let imageTitle = '';
  try {
    imageTitle = URL ? decodeURI(URL.slice(URL.lastIndexOf('/') + 1)) : '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  // svg image is vectorgraph and can't rotate, external image can't rotate
  const canRotateImage = onRotateImage && !readOnly && !checkSVGImage(URL) && isInternalURL(URL);

  let mainSrc = URL;
  if (needUseThumbnailImage(URL)) {
    let imageThumbnailUrl = getImageThumbnailUrl(URL, 512);
    mainSrc = imageThumbnailUrl;
  }
  const imageTitleEl = (
    <span className="d-flex">
      <span className="text-truncate">{imageTitle}</span>
      <span className="flex-shrink-0">
        ({imageIndex + 1}/{imageItemsLength})
      </span>
    </span>
  );

  return (
    <Lightbox
      imageTitle={imageTitleEl}
      mainSrc={mainSrc}
      nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
      prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
      onCloseRequest={props.closeImagePopup}
      onMovePrevRequest={props.moveToPrevImage}
      onMoveNextRequest={props.moveToNextImage}
      onClickMoveUp={moveToPrevRowImage}
      onClickMoveDown={moveToNextRowImage}
      onRotateImage={
        canRotateImage
          ? (deg) => {
              onRotateImage(imageIndex, deg);
            }
          : null
      }
      onClickDelete={
        !readOnly && deleteImage
          ? () => {
              deleteImage(imageIndex, PREVIEWER);
            }
          : null
      }
      onClickDownload={
        downloadImage
          ? () => {
              downloadImage(URL);
            }
          : null
      }
    />
  );
}

ImagePreviewerLightbox.propTypes = {
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  closeImagePopup: PropTypes.func.isRequired,
  moveToPrevImage: PropTypes.func.isRequired,
  moveToNextImage: PropTypes.func.isRequired,
  moveToPrevRowImage: PropTypes.func,
  moveToNextRowImage: PropTypes.func,
  downloadImage: PropTypes.func,
  deleteImage: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default ImagePreviewerLightbox;
