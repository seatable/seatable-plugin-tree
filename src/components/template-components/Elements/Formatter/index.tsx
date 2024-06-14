/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect } from 'react';
import { CellType } from 'dtable-utils';
import { isValidEmail } from '../../../../utils/template-utils/utils';
import TextFormatter from '../Formatter/TextFormatter';
import CollaboratorFormatter from '../Formatter/CollaboratorFormatter';
import SimpleLongTextFormatter from '../Formatter/SimpleLongTextFormatter';
import ImageFormatter from '../Formatter/ImageFormatter';
import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import GeolocationFormatter from '../Formatter/GeolocationFormatter';
import MultipleSelectFormatter from '../Formatter/MultipleSelectFormatter';
import FileFormatter from './FileFormatter/FileFormatter';
import CheckboxFormatter from '../Formatter/CheckboxFormatter';
import CTimeFormatter from '../Formatter/CTimeFormatter';
import FormulaFormatter from '../Formatter/FormulaFormatter';
import LinkFormatter from '../Formatter/LinkFormatter';
import DurationFormatter from '../Formatter/DurationFormatter';
import RateFormatter from '../Formatter/RateFormatter';
import { IFormatterProps } from '@/utils/template-utils/interfaces/Formatter/Formatter.interface';
import { ICollaborator } from '@/utils/template-utils/interfaces/Formatter/Collaborator.interface';
import { ILongText } from '@/utils/template-utils/interfaces/Formatter/LongText.interface';
import { IGeolocation } from '@/utils/template-utils/interfaces/Formatter/Geolocation.interface';
import { IFile } from '@/utils/template-utils/interfaces/Formatter/File.interface';
import SingleSelectFormatter from './SingleSelectFormatter';

const Formatter: React.FC<IFormatterProps> = ({
  column,
  row,
  table,
  collaborators,
  formulaRows,
  getLinkCellValue,
  getRowsByID,
  getMediaUrl,
  getTableById,
  getUserCommonInfo,
}) => {
  const [isDataLoaded, setIsDataLoaded] = React.useState<boolean>(false);
  const [collaborator, setCollaborator] = React.useState<ICollaborator | null>(null);

  useEffect(() => {
    calculateCollaboratorData();
  }, [row, column]);

  const calculateCollaboratorData = () => {
    if (column.type === CellType.LAST_MODIFIER) {
      getCollaborator(row?._last_modifier!);
    } else if (column.type === CellType.CREATOR) {
      getCollaborator(row?._creator!);
    }
  };

  const getCollaborator = (value: string) => {
    if (!value) {
      setIsDataLoaded(true);
      setCollaborator(null);
      return;
    }
    setIsDataLoaded(false);
    setCollaborator(null);
    let collaborator = collaborators && collaborators.find((c) => c.email === value)!;
    if (collaborator) {
      setIsDataLoaded(true);
      setCollaborator(collaborator);
      return;
    }

    if (!isValidEmail(value)) {
      const mediaUrl = getMediaUrl();
      const defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
      collaborator = {
        name: value,
        avatar_url: defaultAvatarUrl,
        email: '',
        name_pinyin: '',
        id_in_org: '',
      };
      setIsDataLoaded(true);
      setCollaborator(collaborator);
      return;
    }

    getUserCommonInfo(value, null)
      .then((res: any) => {
        collaborator = res.data;
        setIsDataLoaded(true);
        setCollaborator(collaborator);
      })
      .catch(() => {
        const mediaUrl = getMediaUrl();
        const defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
        collaborator = {
          name: value,
          avatar_url: defaultAvatarUrl,
          email: '',
          name_pinyin: '',
          id_in_org: '',
        };
        setIsDataLoaded(true);
        setCollaborator(collaborator);
      });
  };

  const renderFormatter = () => {
    const { type: columnType, key: columnKey } = column;
    const _row = row?.[columnKey as keyof levelRowInfo];

    switch (columnType) {
      case CellType.TEXT:
      case CellType.NUMBER:
      case CellType.AUTO_NUMBER:
      case CellType.DATE:
      case CellType.EMAIL: {
        let textFormatter;
        if (!_row) {
          textFormatter = <div></div>;
        } else {
          const value: string = _row as string; 
          textFormatter = (
            <TextFormatter value={value} containerClassName={'ptl-text-editor'} url={false} />
          );
        }
        return textFormatter;
      }
      case CellType.COLLABORATOR: {
        let collaboratorFormatter;
        if (typeof _row === 'string' || Array.isArray(_row)) {
          const value: string | string[] = _row || [];
          if (!value || (Array.isArray(value) && value.length === 0)) {
            collaboratorFormatter = <div></div>;
          } else {
            collaboratorFormatter = (
              <CollaboratorFormatter
                value={value}
                collaborators={collaborators}
                containerClassName="ptl-collab-editor"
              />
            );
          }
          return collaboratorFormatter;
        }
        return null;
      }
      case CellType.LONG_TEXT: {
        let longTextFormatter;
        if (!_row) {
          longTextFormatter = <div></div>;
        } else {
          const value: ILongText = _row as unknown as ILongText; 
          longTextFormatter = <SimpleLongTextFormatter value={value} containerClassName="" />;
        }
        return longTextFormatter;
      }
      case CellType.IMAGE: {
        let imageFormatter;

        if (!Array.isArray(_row) || _row.length === 0) {
          imageFormatter = <div></div>;
        } else {
          imageFormatter = <ImageFormatter value={_row as string[]} containerClassName="" />;
        }
        return imageFormatter;
      }
      case CellType.GEOLOCATION: {
        let geolocationFormatter;
        if (!_row) {
          geolocationFormatter = <div></div>;
        } else {
          const value: IGeolocation = _row as unknown as IGeolocation;
          geolocationFormatter = (
            <GeolocationFormatter value={value} containerClassName="ptl-text-editor" />
          );
        }
        return geolocationFormatter;
      }

      case CellType.MULTIPLE_SELECT: {
        const options = (column.data && column.data.options) || [];
        let multipleSelectFormatter;

        if (!Array.isArray(_row) || _row.length === 0) {
          multipleSelectFormatter = <div></div>;
        } else {
          const value: string[] = _row as string[];
          multipleSelectFormatter = <MultipleSelectFormatter value={value} options={options} />;
        }
        return multipleSelectFormatter;
      }
      case CellType.SINGLE_SELECT: {
        const options = (column.data && column.data.options) || [];
        let singleSelectFormatter;

        if (!_row) {
          singleSelectFormatter = <div></div>;
        } else {
          const value: string = _row as string;
          singleSelectFormatter = <SingleSelectFormatter value={value} options={options} />;
        }
        return singleSelectFormatter;
      }

      case CellType.FILE: {
        let fileFormatter;
        if (!Array.isArray(_row) || _row.length === 0) {
          fileFormatter = <div></div>;
        } else {
          const values: IFile[] = _row as IFile[];
          fileFormatter = <FileFormatter value={values} />;
        }
        return fileFormatter;
      }
      case CellType.CHECKBOX: {
        const checkboxFormatter = <CheckboxFormatter value={!!_row} />;
        return checkboxFormatter;
      }
      case CellType.CTIME: {
        let cTimeFormatter;
        if (!row?._ctime) {
          cTimeFormatter = <div></div>;
        } else {
          cTimeFormatter = <CTimeFormatter value={row._ctime} containerClassName="" />;
        }
        return cTimeFormatter;
      }
      case CellType.MTIME: {
        let mTimeFormatter;
        if (!row?._mtime) {
          mTimeFormatter = <div></div>;
        } else {
          mTimeFormatter = <CTimeFormatter value={row._mtime} containerClassName="" />;
        }
        return mTimeFormatter;
      }
      case CellType.CREATOR: {
        const collaborator = collaborators && collaborators.find((c) => c.email === row?._creator);
        if (!row?._creator || !collaborator) return <div></div>;
        else {
          const creatorFormatter = (
            <CollaboratorFormatter
              containerClassName=""
              collaborators={[collaborator]}
              value={row._creator}
            />
          );
          return creatorFormatter;
        }
      }
      case CellType.LAST_MODIFIER: {
        if (!row?._last_modifier || !collaborator) return <div></div>;
        if (isDataLoaded) {
          const lastModifierFormatter = (
            <CollaboratorFormatter
              containerClassName=""
              collaborators={[collaborator]}
              value={row._last_modifier}
            />
          );

          return lastModifierFormatter;
        }
        return null;
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        const formulaValue = formulaRows[row!._id] ? formulaRows[row!._id][columnKey] : '';
        let formulaFormatter;
        if (!formulaValue) {
          formulaFormatter = <div></div>;
        } else {
          formulaFormatter = (
            <FormulaFormatter value={formulaValue} containerClassName="ptl-formula-container" />
          );
        }
        return formulaFormatter;
      }
      case CellType.LINK: {
        const linkMetaData = {
          getLinkedCellValue: function (
            linkId: string,
            table1Id: string,
            table2Id: string,
            row_id: string
          ) {
            return getLinkCellValue(linkId, table1Id, table2Id, row_id);
          },
          getLinkedRows: function (tableId: string, rowIds: string[]) {
            return getRowsByID(tableId, rowIds);
          },
          getLinkedTable: function (tableId: string) {
            return getTableById(tableId);
          },
          expandLinkedTableRow: function (row: levelRowInfo, tableId: string) {
            return false;
          },
        };
        const linkFormatter = (
          <LinkFormatter
            column={column}
            row={row!}
            currentTableId={table?._id!}
            linkMetaData={linkMetaData}
            containerClassName="ptl-link-container"
          />
        );

        return linkFormatter;
      }
      case CellType.URL: {
        let urlFormatter;
        if (!_row) {
          urlFormatter = <div></div>;
        } else {
          const value: string = _row as string; 
          urlFormatter = <TextFormatter value={value} containerClassName={'ptl-text-editor'} url />;
        }
        return urlFormatter;
      }
      case CellType.DURATION: {
        let durationFormatter;
        if (!_row) {
          durationFormatter = <div></div>;
        } else {
          const value: string = _row as string; 
          durationFormatter = (
            <DurationFormatter
              value={value}
              format={column.data.duration_format}
              containerClassName="ptl-text-editor"
            />
          );
        }
        return durationFormatter;
      }
      case CellType.RATE: {
        let rateFormatter;

        if (!_row) {
          rateFormatter = <div></div>;
        } else {
          const value: number = _row as unknown as number; 
          rateFormatter = (
            <RateFormatter value={value} data={column.data} containerClassName="ptl-text-editor" />
          );
        }
        return rateFormatter;
      }
      default:
        return null;
    }
  };

  return <>{renderFormatter()}</>;
};

export default Formatter;
