import pluginContext from '../../../../../plugin-context';
import { getImageThumbnailUrl } from '../../../../../utils/template-utils/utils';
import transferTypes from '../FileEditor/constants/TransferTypes';
import TransferTypes from '../FileEditor/constants/TransferTypes';
import { FILEEXT_ICON_MAP } from '../FileEditor/constants/constants';
import { html2TableFragment, text2TableFragment } from '../FileEditor/functions/get-event-transfer';
const { HTML, FRAGMENT, TEXT, FILES, DTABLE_FRAGMENT } = transferTypes;

export const getFileIconUrl = (filename: string, direntType: string): string => {
  if (direntType === 'dir') {
    return 'assets/folder/' + FILEEXT_ICON_MAP['folder'];
  }

  const identifierIndex = filename.lastIndexOf('.');
  if (identifierIndex === -1) {
    return 'assets/file/192/' + FILEEXT_ICON_MAP['default'];
  }

  const file_ext = filename.slice(identifierIndex + 1).toLowerCase() || 'default';
  const iconUrl = FILEEXT_ICON_MAP[file_ext]
    ? 'assets/file/192/' + FILEEXT_ICON_MAP[file_ext]
    : 'assets/file/192/' + FILEEXT_ICON_MAP['default'];
  return iconUrl;
};

export const downloadFile = (url: string, fileName: string) => {
  const token = pluginContext.getSetting('accessToken');
  fetch(url, { headers: new Headers({ Authorization: `Bearer ${token}` }) })
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    })
    .catch((e) => console.error('download error:', e));
};

export const downloadFiles = (downloadUrlList: any) => {
  const downloadFrame = document.getElementById('downloadFrame');
  if (downloadFrame != null) {
    document.body.removeChild(downloadFrame);
  }
  downloadUrlList.forEach((url: string, index: number) => {
    const path = url;
    const timer1 = setTimeout(
      (function (path) {
        return function () {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('id', 'downloadFrame');
          iframe.style.display = 'none';
          iframe.src = path;
          document.body.appendChild(iframe);
          const timer2 = setTimeout(function () {
            iframe.remove();
            clearTimeout(timer2);
          }, 5000);
          clearTimeout(timer1);
        };
      })(path),
      1000 * index
    );
  });
};

export const getMediaUrl = () => {
  return pluginContext && pluginContext.getSetting('mediaUrl');
};
export const bytesToSize = (bytes: number | undefined): string => {
  if (typeof bytes === 'undefined') return ' ';
  if (bytes < 0) return '--';

  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes === 0) return '0 ' + sizes[0];

  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return (bytes / Math.pow(1000, i)).toFixed(1) + ' ' + sizes[i];
};

export const getFileThumbnailUrl = (fileItem: any) => {
  if (!fileItem.name) {
    const mediaUrl = getMediaUrl();
    return `${mediaUrl}img/file/192/${FILEEXT_ICON_MAP['default']}`;
  }
  const isImage = imageCheck(fileItem.name);
  const seafileFileIndex = fileItem.url.indexOf('seafile-connector');
  let fileIconUrl;
  if (seafileFileIndex > -1) {
    fileIconUrl = getFileIconUrl(fileItem.name, fileItem.type);
  } else if (isImage) {
    fileIconUrl = getImageThumbnailUrl(fileItem.url, fileItem.size);
  } else {
    fileIconUrl = getFileIconUrl(fileItem.name, fileItem.type);
  }
  return fileIconUrl;
};

export const imageCheck = (filename: string) => {
  // no file ext
  if (!filename || typeof filename !== 'string') return false;
  if (filename.lastIndexOf('.') === -1) {
    return false;
  }
  const file_ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
  const image_exts = ['gif', 'jpeg', 'jpg', 'png', 'ico', 'bmp', 'tif', 'tiff'];
  return image_exts.includes(file_ext);
};

export function getEventTransfer(event: any) {
  const transfer = event.dataTransfer || event.clipboardData;
  const dtableFragment = getType(transfer, FRAGMENT);
  const html = getType(transfer, HTML);
  const text = getType(transfer, TEXT);
  const files = getFiles(transfer);

  // paste dtable
  if (dtableFragment) {
    return {
      [TransferTypes.DTABLE_FRAGMENT]: JSON.parse(dtableFragment),
      type: TransferTypes.DTABLE_FRAGMENT,
    };
  }

  // paste html
  if (html) {
    const copiedTableNode = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('table');
    if (copiedTableNode) {
      return {
        [TransferTypes.DTABLE_FRAGMENT]: html2TableFragment(copiedTableNode),
        html,
        text,
        type: 'html',
      };
    }
    return { [TransferTypes.DTABLE_FRAGMENT]: text2TableFragment(text), html, text, type: 'html' };
  }

  // paste local picture or other files here
  if (files && files.length) {
    return {
      [TransferTypes.DTABLE_FRAGMENT]: text2TableFragment(text),
      files: files,
      type: 'files',
    };
  }

  // paste text
  if (text) {
    return { [TransferTypes.DTABLE_FRAGMENT]: text2TableFragment(text), text, type: 'text' };
  }
}

function getType(transfer: any, type: any) {
  if (!transfer.types || !transfer.types.length) {
    // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
    // is supported`. (2017/06/23)
    return type === transferTypes.TEXT ? transfer.getData('Text') || null : null;
  }

  return transfer.getData(type);
}

function getFiles(transfer: any) {
  let files;
  try {
    // Get and normalize files if they exist.
    if (transfer.items && transfer.items.length) {
      files = Array.from(transfer.items)
        .map((item: any) => (item.kind === 'file' ? item.getAsFile() : null))
        .filter((exists) => exists);
    } else if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  } catch (err) {
    if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  }
  return files;
}

export const assetUrlAddParams = (url: string, options: any) => {
  if (typeof url !== 'string') {
    return '';
  }
  const { page, column, row, block, otherColumn, otherRow } = options;
  let { pageId, columnKey, rowId, blockId, otherColumnKey, otherRowId } = options;
  if (!pageId && page) {
    pageId = page.id;
  }
  if (!columnKey && column) {
    columnKey = column.key;
  }
  if (!rowId && row) {
    rowId = row._id;
  }
  if (!blockId && block) {
    blockId = block.id;
  }
  let params = `page_id=${pageId}&column_key=${columnKey}&row_id=${rowId}`;
  if (!otherColumnKey && otherColumn) {
    otherColumnKey = otherColumn.key;
  }
  if (!otherRowId && otherRow) {
    otherRowId = otherRow._id;
  }
  if (otherColumnKey && otherRowId) {
    params = `${params}&other_column_key=${otherColumnKey}&other_row_id=${otherRowId}`;
  }
  return url.indexOf('?') === -1 ? `${url}?${params}` : `${url}&${params}`;
};
