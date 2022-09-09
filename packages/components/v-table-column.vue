<template>
    <tr v-for="data in tableData" class="table-line">
        <td class="table-line-item" v-for="col in tableHead" :style="calcTableColumnStyle(col)">
            <div class="cell">
                <template v-if="col.slot">
                    <slot :name="col.prop" :row="data"></slot>
                </template>
                <template v-else>{{ data[col.prop || ''] || '' }}</template>
            </div>
        </td>
    </tr>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import type { TableHead } from '../types/index'
const props = defineProps({
    tableData: Array as () => Array<any>,
    tableHead: Array as () => Array<TableHead>,
    tableLineHeight: String,
})
// 表格样式
const calcTableColumnStyle = (row: TableHead) => {
    const styleList: string[] = []
    row.width && styleList.push(`width:${row.width}`)
    row.minWidth && styleList.push(`min-width:${row.minWidth}`)
    !row.width && styleList.push('flex:1')
    row.align && styleList.push(`text-align: ${row.align}`)
    return styleList.join(';') + ';'
}
const calcTableLineHeight = computed(() => props.tableLineHeight)
</script>
<style lang="scss" scoped>
$border-color: #ebeef5;

.cell {
    flex: 1;
    margin: auto 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table-line {
    display: flex;
    height: v-bind(calcTableLineHeight);
    position: relative;

    .table-line-item {
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        min-width: 180px;
        border: 1px solid $border-color;
        border-top: 0;

    }
}
</style>