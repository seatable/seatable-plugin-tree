import pluginContext from '../../../../../../plugin-context';

const FILEEXT_ICON_MAP = {
  // text file
  md: 'txt.png',
  txt: 'txt.png',

  // pdf file
  pdf: 'pdf.png',

  // document file
  doc: 'word.png',
  docx: 'word.png',
  odt: 'word.png',
  fodt: 'word.png',

  ppt: 'ppt.png',
  pptx: 'ppt.png',
  odp: 'ppt.png',
  fodp: 'ppt.png',

  xls: 'excel.png',
  xlsx: 'excel.png',
  ods: 'excel.png',
  fods: 'excel.png',

  // video
  mp4: 'video.png',
  ogv: 'video.png',
  webm: 'video.png',
  mov: 'video.png',
  flv: 'video.png',
  wmv: 'video.png',
  rmvb: 'video.png',

  // music file
  mp3: 'music.png',
  oga: 'music.png',
  ogg: 'music.png',
  flac: 'music.png',
  aac: 'music.png',
  ac3: 'music.png',
  wma: 'music.png',

  // image file
  jpg: 'pic.png',
  jpeg: 'pic.png',
  png: 'pic.png',
  svg: 'pic.png',
  gif: 'pic.png',
  bmp: 'pic.png',
  ico: 'pic.png',

  // folder dir
  folder: 'folder-192.png',

  // default
  default: 'file.png',
};

export const getServer = () => {
  return pluginContext && pluginContext.getSetting('server');
};

export const getMediaUrl = () => {
  return pluginContext && pluginContext.getSetting('mediaUrl');
};

export const getWorkspaceID = () => {
  return pluginContext && pluginContext.getSetting('workspaceID');
};

export const getDtableUuid = () => {
  return pluginContext && pluginContext.getSetting('dtableUuid');
};

const imageCheck = (filename) => {
  // no file ext
  if (!filename || typeof filename !== 'string') return false;
  if (filename.lastIndexOf('.') === -1) {
    return false;
  }
  const file_ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
  const image_exts = ['gif', 'jpeg', 'jpg', 'png', 'ico', 'bmp', 'tif', 'tiff', 'webp'];
  return image_exts.includes(file_ext);
};

const isTargetUrl = (target, url) => {
  if (!url || typeof url !== 'string') return false;
  return target && url ? url.indexOf(target) > -1 : false;
};

const isSeafileConnectorUrl = (url) => {
  return isTargetUrl('seafile-connector://', url);
};

const isCustomAssetUrl = (url) => {
  return isTargetUrl('custom-asset://', url);
};

const getFileIconUrl = (filename, direntType) => {
  let commonUrl = '';
  let file_ext = '';
  if (filename.lastIndexOf('.') === -1) {
    commonUrl = 'img/file/192/' + FILEEXT_ICON_MAP['default'];
  } else {
    file_ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
  }

  if (FILEEXT_ICON_MAP[file_ext]) {
    commonUrl = 'img/file/192/' + FILEEXT_ICON_MAP[file_ext];
  } else if (direntType === 'dir') {
    commonUrl = 'img/' + FILEEXT_ICON_MAP['folder'];
  } else {
    commonUrl = 'img/file/192/' + FILEEXT_ICON_MAP['default'];
  }

  const mediaUrl = getMediaUrl();
  let url = mediaUrl + commonUrl;
  return url;
};

const isDigitalSignsUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return isTargetUrl('/digital-signs/', url) && !url.includes('http');
};

const generateCurrentBaseImageThumbnailUrl = ({
  server,
  workspaceID,
  dtableUuid,
  partUrl,
  size,
}) => {
  if (!partUrl || typeof partUrl !== 'string') return '';
  return `${server}/thumbnail/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}?size=${size}`;
};

const checkSVGImage = (url) => {
  if (!url || typeof url !== 'string') return false;
  const isSVGImage = url.substring(-4).toLowerCase() === '.svg';
  return isSVGImage;
};

const isInternalUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const server = getServer();
  return url.indexOf(server) > -1;
};

const getImageThumbnailUrl = (url, size = 256) => {
  if (!url || typeof url !== 'string') return '';
  const server = getServer();
  const workspaceID = getWorkspaceID();
  const dtableUuid = getDtableUuid();
  if (isCustomAssetUrl(url)) {
    let assetUuid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return (
      server + '/dtable/' + dtableUuid + '/custom-asset-thumbnail/' + assetUuid + '?size=' + size
    );
  }
  if (isDigitalSignsUrl(url)) {
    return generateCurrentBaseImageThumbnailUrl({
      server,
      workspaceID,
      dtableUuid,
      size,
      partUrl: url,
    });
  }
  if (checkSVGImage(url) || !isInternalUrl(url)) {
    return url;
  }
  return url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
};

export const getFileThumbnailUrl = (file) => {
  const { type: fileType, name: fileName, url: fileUrl } = file;
  if (!fileName) return FILEEXT_ICON_MAP['default'];
  let isImage = imageCheck(fileName);
  let fileIconUrl;
  if (isSeafileConnectorUrl(fileUrl) || isCustomAssetUrl(fileUrl)) {
    fileIconUrl = getFileIconUrl(fileName, fileType);
  } else if (isImage) {
    fileIconUrl = getImageThumbnailUrl(fileUrl);
  } else {
    fileIconUrl = getFileIconUrl(fileName, fileType);
  }
  return fileIconUrl;
};
