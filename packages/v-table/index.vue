<template>
    <div class="v-table">
        <div class="table-container flex" ref="scrollviewRef" @scroll.native="handleScroll">
            <div class="main-table">
                <tr class="table-head with-scroll">
                    <th v-for="validTableHead in validTableHeads" :style="calcTableColumnStyle(validTableHead)"
                        class="table-head-item">
                        {{ validTableHead.label }}
                    </th>
                </tr>
                <div class="table-line-container">
                    <div class="dom-blocks top" ref="topLines">
                        <tr v-for="data in domBlocks.top" class="table-line ">
                            <td class="table-line-item" v-for="col in validTableHeads"
                                :style="calcTableColumnStyle(col)">
                                <div class="cell">
                                    <template v-if="col.slot">
                                        <slot :name="col.prop" :row="data"></slot>
                                    </template>
                                    <template v-else>{{ data[col.prop || ''] || '' }}</template>
                                </div>
                            </td>
                        </tr>
                    </div>
                    <div v-if="domBlocks.middle.length" class="dom-blocks middle" ref="middleLines">
                        <tr v-for="data in domBlocks.middle" class="table-line middle-line" ref="middleLines">
                            <td class="table-line-item" v-for="col in validTableHeads"
                                :style="calcTableColumnStyle(col)">
                                <div class="cell">
                                    <template v-if="col.slot">
                                        <slot :name="col.prop" :row="data"></slot>
                                    </template>
                                    <template v-else>{{ data[col.prop || ''] || '' }}</template>
                                </div>
                            </td>
                        </tr>
                    </div>
                    <div v-if="domBlocks.bottom.length" class="dom-blocks bottom" ref="bottomLines">
                        <tr v-for="data in domBlocks.bottom" class="table-line bottom-line" ref="bottomLines">
                            <td class="table-line-item" v-for="col in validTableHeads"
                                :style="calcTableColumnStyle(col)">
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
    </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, reactive, ref, watch } from 'vue'
import type { TableHead } from '../types/index'
import { throttle } from '../utils/common'
// import VTableColumn from '../components/v-table-column.vue';
const props = defineProps({
    height: String,
    tableData: Array as () => Array<any>,
    tableHead: Array as () => Array<TableHead>,
    lineHeight: String,
    rowKey: { type: String, default: 'id' },
})
const topLines = ref()
const middleLines = ref()
const bottomLines = ref()
const domBlocks = reactive({
    top: [] as any[],
    middle: [] as any[],
    bottom: [] as any[],
})
const blockVisible = reactive({
    top: true,
    middle: false,
    bottom: false,
})
const blockTranslate = reactive({
    top: '0',
    middle: '0',
    bottom: '0',
})
watch(props.tableData!, () => {
    if (scrollY.value === 0) initDomData()
})
const initDomData = () => {
    domBlocks.top = props.tableData?.slice(0, eachBlockCound.value) || []
    domBlocks.middle = props.tableData?.slice(eachBlockCound.value, eachBlockCound.value * 2) || []
    domBlocks.bottom = props.tableData?.slice(eachBlockCound.value * 2, eachBlockCound.value * 3) || []
    blockTranslate.top = '0'
    blockTranslate.middle = eachBlockHeight.value + 'px'
    blockTranslate.bottom = eachBlockHeight.value * 2 + 'px'
    beforeDataIndex.value = 0
    afterDataIndex.value = eachBlockCound.value * 3
}
onMounted(() => {
    // const topObserver = new IntersectionObserver((val) => {
    //     blockVisible.top = val[0].isIntersecting
    //     blockVisibleChange('top', val[0].isIntersecting)
    // });
    // const middleObserver = new IntersectionObserver((val) => {
    //     blockVisible.middle = val[0].isIntersecting
    //     blockVisibleChange('middle', val[0].isIntersecting)
    // });
    // const bottomObserver = new IntersectionObserver((val) => {
    //     blockVisible.bottom = val[0].isIntersecting
    //     blockVisibleChange('bottom', val[0].isIntersecting)
    // });
    // topObserver.observe(topLines.value)
    // middleObserver.observe(middleLines.value)
    // bottomObserver.observe(bottomLines.value)
})
const scrollX = ref(0)
const scrollY = ref(0)
const yUporDown = ref(true) // up true - down false
const scrollviewRef = ref()
const headHeight = ref('48px')
const beforeDataIndex = ref(0)
const afterDataIndex = ref(0)
// 重新计算该scrollY下的数据和布局
const reCalDomData = () => {
    const topFirstIndex = scrollY.value / parseInt(props.lineHeight || '55')
    domBlocks.top = props.tableData?.slice(topFirstIndex, topFirstIndex + eachBlockCound.value) || []
    domBlocks.middle = props.tableData?.slice(topFirstIndex + eachBlockCound.value, topFirstIndex + eachBlockCound.value * 2) || []
    domBlocks.bottom = props.tableData?.slice(topFirstIndex + eachBlockCound.value * 2 + eachBlockCound.value, topFirstIndex + eachBlockCound.value * 3) || []
    const trueYTranslate = ((scrollY.value / eachBlockHeight.value) >>> 0) * eachBlockHeight.value
    blockTranslate.top = trueYTranslate + 'px'
    blockTranslate.middle = trueYTranslate + eachBlockHeight.value + 'px'
    blockTranslate.bottom = trueYTranslate + eachBlockHeight.value * 2 + 'px'
}
// block 可视改变
const blockVisibleChange = (area: 'top' | 'middle' | 'bottom', isIntersecting) => {
    // if (scrollY.value === 0) return
    // if (isIntersecting) return
    // const nextTranslate = yUporDown.value ? -eachBlockHeight.value * 2 : eachBlockHeight.value * 3
    // if (!yUporDown.value) {
    //     // 如果是向下滚动
    //     blockTranslate[area] = (parseInt(blockTranslate[area]) + nextTranslate) + 'px'
    //     domBlocks[area] = props.tableData?.slice(afterDataIndex.value, afterDataIndex.value + eachBlockCound.value) || []
    //     afterDataIndex.value += eachBlockCound.value
    //     beforeDataIndex.value += eachBlockCound.value
    // }
    // if (yUporDown.value) {
    //     const nextArea = {
    //         middle: 'bottom',
    //         bottom: 'top',
    //         top: 'middle',
    //     }
    //     blockTranslate[nextArea[area]] = (parseInt(blockTranslate[area]) + nextTranslate) + 'px'
    //     const sliceArr = props.tableData?.slice(beforeDataIndex.value - eachBlockCound.value, beforeDataIndex.value) || []
    //     afterDataIndex.value -= eachBlockCound.value
    //     beforeDataIndex.value -= eachBlockCound.value
    //     domBlocks[nextArea[area]] = sliceArr

    // }
}
// 表格高度
const calcHeight = computed(() => {
    return props.height || '300px'
})
// 表格滚动事件
const handleScroll = () => {
    scrollX.value = scrollviewRef.value.scrollLeft
    const nextY = scrollviewRef.value.scrollTop
    yUporDown.value = nextY < scrollY.value
    scrollY.value = nextY
    if (scrollY.value === 0) initDomData()
    reCalDomData()


}
// 每个block height
const eachBlockHeight = computed(() => {
    return eachBlockCound.value * parseInt(props.lineHeight || '55')
})
// 每个block元素个数
const eachBlockCound = computed(() => {
    return (((parseInt(props.height || '300') - parseInt(headHeight.value)) / parseInt(props.lineHeight || '55')) >>> 0) + 1
})
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
    return parseInt(props.height || '55') * (props.tableData?.length || 0) - parseInt(props.height || '300') + 'px'
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
// 计算一般列，出滚动条min-width
const calcMiddleMinWidth = computed(() => {
    return validTableHeads.value.reduce((prev, curr) =>
        prev += parseInt(curr.width || curr.minWidth || '180')
        , 0) - 8 + 'px'
})
</script>


<style lang="scss" scoped>
$border-color: #ebeef5;

.dom-blocks {
    position: absolute;
    top: 0;

    &.top {
        transform: translateY(v-bind('blockTranslate.top'));
    }

    &.middle {
        transform: translateY(v-bind('blockTranslate.middle'));
    }

    &.bottom {
        transform: translateY(v-bind('blockTranslate.bottom'));
    }
}

.v-table {
    box-sizing: border-box;
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
        position: relative;
        height: v-bind(calcOriginDomHeight);
        width: v-bind(calcMiddleMinWidth);
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
        box-sizing: border-box;
        padding-top: 48px;
        position: absolute;
        top: 0;
        z-index: 10;
        background: white;
        border: 1px solid $border-color;
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