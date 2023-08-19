
export interface FilterData {
  listId: number,
  name: string,
  value: string
}

const FilterLists = [];

export function useFilter( listId: number, filterId: number, initialData: { name: string, value: string } ): [FilterData, ( newData: FilterData )=>void ] {
  if (FilterLists[listId][filterId] != undefined) {
    alert('Invalid filter ID');
    return;
  }
  const filterInfo = {
    ...initialData,
    listId: listId,
  } as FilterData;

  FilterLists[listId][filterId] = filterInfo;

  return [filterInfo, ( newData: FilterData )=>{
    filterInfo.name = newData.name;
    filterInfo.value = newData.value;
  }];
} /* End of 'useFilter' function */

export function removeFilter( listId: number, filterId: number ) { 
  delete FilterLists[listId][filterId];
} /* End of 'removeFilter' function */

export function moveFilter( oldListId: number, newListId: number, filterId: number ) { 
  FilterLists[newListId][filterId] = FilterLists[oldListId][filterId];
  FilterLists[oldListId][filterId] = undefined;
  FilterLists[newListId][filterId].listId = newListId;
} /* End of 'moveFilter' function */

export function getListFilters( listId: number ): FilterData[] {
  return FilterLists[listId];
} /* End of 'getListFilters' function */
