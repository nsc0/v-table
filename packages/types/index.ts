export interface TableHead {
    prop?: string,
    type?: string,
    label?: string,
    fixed?: 'left' | 'right',
    slot?: boolean,
    width?: string,
    minWidth?: string,
    rowKey?: string,
    align?: 'left' | 'center'| 'right'
}