<template>
    <div class="v-table">
        <div class="table-container flex" ref="scrollviewRef" @scroll.native="handleScroll">
            <div v-if="fixedLeftTableHeads.length" class="table-fixed fixed-left">
                <tr class="table-head">
                    <th v-for="validTableHead in fixedLeftTableHeads" :style="calcTableColumnStyle(validTableHead)"
                        class="table-head-item">
                        {{ validTableHead.label }}
                    </th>
                </tr>
                <div class="fixed-line-wrapper left">
                    <tr class="table-line" v-for="data in tableData">
                        <td class="table-fixed-item" :style="calcTableColumnStyle(col)"
                            :class="{['fixed-' + col.fixed]:true}" v-for="col in fixedLeftTableHeads">
                            <div class="cell">
                                <template v-if="col.slot">
                                    <slot :name="col.prop" :row="data"></slot>
                                </template>
                                <template v-else>{{ data[col.prop || ''] || '' }}</template>
                            </div>
                        </td>
                    </tr>
                </div>
            </div>
            <div class="main-table">
                <tr class="table-head with-scroll">
                    <th v-for="validTableHead in validTableHeads" :style="calcTableColumnStyle(validTableHead)"
                        class="table-head-item">
                        {{ validTableHead.label }}
                    </th>
                </tr>
                <div class="table-line-container">
                    <tr v-for="data in tableData" class="table-line">
                        <td class="table-line-item" v-for="col in validTableHeads" :style="calcTableColumnStyle(col)">
                            <div class="cell">
                                <template v-if="col.slot">
                                    <slot :name="col.prop" :row="data"></slot>
                                </template>
                                <template v-else>{{ data[col.prop || ''] || '' }}</template>
                            </div>
                        </td>
                    </tr>
                </div>
            </div>
            <div v-if="fixedRightTableHeads.length" class="table-fixed fixed-right">
                <tr class="table-head">
                    <th v-for="validTableHead in fixedRightTableHeads" :style="calcTableColumnStyle(validTableHead)"
                        class="table-head-item">
                        {{ validTableHead.label }}
                    </th>
                </tr>
                <div class="fixed-line-wrapper right">
                    <tr class="table-line" v-for="data in tableData">
                        <td class="table-fixed-item" :style="calcTableColumnStyle(col)"
                            :class="{['fixed-' + col.fixed]:true}" v-for="col in fixedRightTableHeads">
                            <div class="cell">
                                <template v-if="col.slot">
                                    <slot :name="col.prop" :row="data"></slot>
                                </template>
                                <template v-else>{{ data[col.prop || ''] || '' }}</template>
                            </div>
                        </td>
                    </tr>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'
import type { TableHead } from '../types/index'
// import VTableColumn from '../components/v-table-column.vue';
const props = defineProps({
    height: String,
    tableData: Array as () => Array<any>,
    tableHead: Array as () => Array<TableHead>,
    lineHeight: String,
    rowKey: { type: String, default: 'id' },
})
const scrollX = ref(0)
const scrollY = ref(0)
const scrollviewRef = ref()
// 表格高度
const calcHeight = computed(() => {
    return props.height || '300px'
})
// 表格滚动事件
const handleScroll = () => {
    scrollX.value = scrollviewRef.value.scrollLeft
    scrollY.value = scrollviewRef.value.scrollTop

}
// XTranslate
const calcXTranslate = computed(() => '-' + scrollX.value + 'px')
// YTranslate
const calcYTranslate = computed(() => '-' + scrollY.value + 'px')
// 固定栏高度 为了能看见滚动条所以-9px
const calcFixedColumnHeight = computed(() => {
    return (parseInt(calcHeight.value) - 9) + 'px' || '292px'
})
// 表格行高
const calcTableLineHeight = computed(() => {
    return props.lineHeight || '55px'
})
// 计算原始dom高度
const calcOriginDomHeight = computed(() => {
    return parseInt(props.height || '55') * (props.tableData?.length || 0)
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
// 获取一般列
const validTableHeads = computed(() => {
    return props.tableHead?.filter((i) => i.prop && !i.fixed) || []
})
// 获取fixed-left列
const fixedLeftTableHeads = computed(() => {
    return props.tableHead?.filter((i) => i.fixed === 'left') || []
})
// 获取fixed-right列
const fixedRightTableHeads = computed(() => {
    return props.tableHead?.filter((i) => i.fixed === 'right') || []
})
// 计算表格fixed left padding
const fixedLeftPadding = computed(() => {
    return fixedLeftTableHeads.value.reduce((prev, curr) => prev += parseInt(curr.width || '0'), 0) + 'px'
})
// 计算表格fixed right padding
const fixedRightPadding = computed(() => {
    return fixedRightTableHeads.value.reduce((prev, curr) => prev += parseInt(curr.width || '0'), 9) + 'px'
})
</script>


<style lang="scss" scoped>
$border-color: #ebeef5;

.virtualized-dom {
    height: v-bind(calcOriginDomHeight);
}

.v-table {
    position: relative;
    overflow: hidden;
    font-size: 14px;
    height: v-bind(calcHeight);
    border-bottom: 1px solid $border-color;
}

.flex {
    display: flex;
}

.table-container {
    box-sizing: border-box;
    overflow: overlay;
    border: 1px solid $border-color;
    height: v-bind(calcHeight);

    .cell {
        flex: 1;
        margin: auto 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .main-table {
        padding-top: 48px;
        margin-left: v-bind(fixedLeftPadding);
        margin-right: v-bind(fixedRightPadding);

        .table-head {
            top: 1px;
        }
    }

    .table-head {
        z-index: 5;
        display: flex;
        position: absolute;
        top: 0;
        height: 48px;
        cursor: default;
        user-select: none;

        &.with-scroll {
            transform: translateX(v-bind(calcXTranslate));
        }

        .table-head-item {
            text-align: left;
            min-width: 180px;
            background: white;
            box-sizing: border-box;
            padding: 14px 10px;
            border: 1px solid $border-color;
            border-top: 0;
        }
    }

    .table-line-container {
        overflow: hidden;
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

    .table-fixed {
        padding-top: 48px;
        position: absolute;
        top: 0;
        box-sizing: border-box;
        z-index: 10;
        background: white;
        border: 1px solid $border-color;
        border-right: 0;
        border-bottom: 0;
        height: v-bind(calcFixedColumnHeight);
        overflow: hidden;

        .fixed-line-wrapper {
            transform: translateY(v-bind(calcYTranslate));

        }

        .table-fixed-item {
            height: v-bind(calcTableLineHeight);
            display: flex;
            padding: 0 10px;
            box-sizing: border-box;
            min-width: 180px;
            border-bottom: 1px solid $border-color;
        }

        &.fixed-left {
            left: 0;

            .table-fixed-item {
                border-right: 1px solid $border-color;

            }
        }

        &.fixed-right {
            right: 9px;

            // box-shadow: 0 0 10px rgb(0 0 0 / 12%);
            .table-fixed-item {
                border-left: 1px solid $border-color;
                border-right: 1px solid $border-color;

            }
        }
    }
}

::-webkit-scrollbar-thumb {
    width: 8px;
    background-color: #e1e6f0;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #c4ccdd;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: white;
    border-top: 1px solid $border-color;
}
</style>