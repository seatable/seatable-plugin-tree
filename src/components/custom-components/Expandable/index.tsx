import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableRow } from '@/utils/template-utils/interfaces/Table.interface';
import React, { useState } from 'react';
import { getRowsByTableId, temporaryFunctionName } from '../../../utils/custom-utils/utils';

const ExpandableStructure: React.FC<{ levelSelections: ILevelSelections }> = ({
  levelSelections,
}) => {
  const allTables = window.dtableSDK.getTables();

  if (levelSelections !== undefined) {
    const infoMocked = {
      first: {
        selected: {
          value: '7YB2',
          label: 'PROJECTS',
        },
      },
      second: {
        selected: {
          value: 'jEtf',
          label: 'MILESTONES',
        },
      },
      third: {
        selected: {
          value: '3f2D',
          label: 'TASKS',
        },
      },
    };

    const firstRows = getRowsByTableId(infoMocked.first.selected.value, allTables);

    if (firstRows !== undefined) {
      const firstTableId = infoMocked.first.selected.value;
      temporaryFunctionName(firstTableId, firstRows, infoMocked.second.selected.value, allTables);
    }

    // FIRST LEVEL ROWS are the rows of the FIRST TABLE
    // SECOND LEVEL ROWS--- > find the rows of the second level table that are connected in column
    // [one: [M1, M4, M5], two: [M2, M1, M4]....]
    // THIRD LEVEL ROWS ---> ROWS OF THE THIRD LEVEL TABLE THAT ARE CONNECTED IN COLUMN
    // [one: [T1, T4, T5], two: [T2, T1, T4]....]

    const mockedData = [
      {
        name: 'row 1 from PROJECTS',
        // other row info
        linked_rows: [
          {
            name: 'row 1 from MILESTONES',
            // other row info
            linked_rows: [
              {
                name: 'row 1 from TASKS',
                // other row info
              },
            ],
          },
        ],
      },
      // and so on
    ];

    // linkCol is the selected column that links to another table e.g PROJECTS or MILESTONES
    // let linkedRows = window.dtableSDK.getTableLinkRows(rows, table);
    // let allTables = window.dtableSDK.getTables();
    // let arr1: any[] = [];
    // allTables.map((t: Table) => {
    //   arr1.push(t.rows);
    // });
    // arr1 = arr1.flat();

    // const arr2: any[] = [];

    // rows.map((r: any) => {
    //   let _ids = linkedRows[r._id][linkCol?.key!];
    //   let linked_rows = [];
    //   for (let i in _ids) {
    //     let linked_row = arr1.find((r: any) => r._id === _ids[i]);
    //     linked_rows.push(linked_row);
    //   }

    //   arr2.push({ ...r, linked_rows });
    // });

    // console.log(arr2); // final data is an array of each rows with their linked rows

    // console.log(
    //   'levelSelections.first.rows',
    //   levelSelections.first.rows[0]._id,
    //   levelSelections.first.columns[1]
    // );
    // console.log('levelSelections.first.columns', levelSelections.first.columns);
    // const { key, type, data } = levelSelections.first.columns[1] || '';
    // const row = levelSelections.first?.rows[0] || '';
    // const cellValue = row;
    // const CV = getCellValue(row, key, type, data);
    // console.log('key, type, data', key, type, data);
    // console.log('cellValue', CV);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {levelSelections && levelSelections.first.rows.map((i) => <ExpandableItem item={i} />)}
    </div>
  );
};

export default ExpandableStructure;

const ExpandableItem: React.FC<{ item: TableRow }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // console.log('item', item);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}>
        {item['0000']}
      </div>
      {/* {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div>
            <strong>Selected:</strong> {item['0000']}
          </div>
          <div>
            <strong>Options:</strong>
            <ul>
              {item.options.map((option) => (
                <li key={option.value}>{option.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};
