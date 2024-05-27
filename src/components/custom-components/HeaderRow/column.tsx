import { Fragment } from 'react';
import { INDEX_COLUMN_TYPE } from '../../../utils/custom-utils/constants';

const Column = ({ column, className, style }: { column: any; className: any; style: any }) => {
  // const [downloadFileList, setDownloadFileList] = useState([]);
  // const [otherDTableFilesLength, setOtherDTableFilesLength] = useState(0);
  // const [isShowDownloadFilesDialog, setIsShowDownloadFilesDialog] = useState(false);

  // const onDownloadAllFiles = () => {
  //   setIsShowDownloadFilesDialog(true);
  // };

  // const closeDownloadFilesDialog = () => {
  //   setIsShowDownloadFilesDialog(false);
  // };

  const { name, width, left, type } = column;

  return (
    <Fragment>
      <div
        className={`sql-query-result-table-cell column ${className} ${
          type === INDEX_COLUMN_TYPE ? 'index' : ''
        }`}
        style={{ ...style, width, maxWidth: width, minWidth: width, left }}>
        <div className="sql-query-result-column-content text-truncate">
          {type === INDEX_COLUMN_TYPE ? '' : name}
        </div>
      </div>
    </Fragment>
  );
};

export default Column;
