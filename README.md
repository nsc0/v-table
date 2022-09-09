# v-table

## 虚拟化表格，万行数据不卡顿。以Vue3.2重构。
### 使用方式
```
npm install @nsc0/v-table
```
```typescript
// 在main.ts中引入css
import '@nsc0/v-table/style.css'
```
```typescript
// 在需要使用的地方引入表格组件
import { Table, VTable } from '@nsc0/v-table'
```
```html
<!-- 虚拟化表格 -->
<VTable :tableData="tableData" :tableHead="tableHead" lineHeight="55px">
        <!--可以使用slot插入自定义行  -->
        <template #name="{ row }">
            <span>{{ row.name }}</span>
        </template>
</VTable>

<!-- 普通表格 -->
<Table :tableData="tableData" :tableHead="tableHead" lineHeight="55px">
        <!--可以使用slot插入自定义行  -->
        <template #name="{ row }">
            <span>{{ row.name }}</span>
        </template>
</Table>
```

|  参数名   | 作用  |
|  ----  | ----  |
| tableData  | 传入表格数据 (数据中需要指定一个唯一key值，默认为'id') |
| lineHeight  | 每一行的行高，不填默认55px |
| height  | 表格显示高度，不填默认300px |
| rowKey  | 数据唯一Key名，不填默认'id' |
| tableHead  | 表头数据，详见下表 |
``` javascript
// tableHead支持以下参数
// label - 表头名称
// prop - 表头键名
// minWidth - 最小宽度(default 180px)
// width - 宽度(default 180px)
// fixed - 'left'|'right' 固定在左还是右。(VTable暂时不支持)
// slot - @Boolean 是否启用自定义列，会根据prop匹配插槽名。
const tableHead = ref<TableHead[]>([
    { label: '序号', prop: 'index', minWidth: '50px', width: '50px', fixed: 'left' },
    { label: '姓名', prop: 'name' },
    { label: '地址1', prop: 'address1', width: '180px' },
    { label: '地址2', prop: 'address2', width: '180px' },
    { label: '地址3', prop: 'address3', width: '180px', slot: true },
    { label: '操作', prop: 'opts', fixed: 'right', width: '300px', slot: true },
])
```

#### TODO
* VTable的暂时不支持fixed属性，因为fixed列就是一个表格，实现是一样的。会加上的, soon。
* 样式还没仔细调整。会有表头遮住滚动条，border重叠的问题，后面会仔细调一下。