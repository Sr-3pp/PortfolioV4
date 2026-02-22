export interface TableSortRule {
  id: string
  desc?: boolean
}

export type TableSortingState = TableSortRule[]
