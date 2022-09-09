<template>
    <VTable :tableData="tableData" :tableHead="tableHead" lineHeight="55px">
        <template #address3="{ row }">
            <span>{{ row.address3 }}</span>
        </template>
        <template #opts="{ row }">
            <span>123123123</span>
        </template>
    </VTable>
    <div style="height:30px"></div>
    <Table :tableData="tableData" :tableHead="tableHead" lineHeight="55px">
        <template #address3="{ row }">
            <span>{{ row.address3 }}</span>
        </template>
        <template #opts="{ row }">
            <span>123123123</span>
        </template>
    </Table>
</template>
<script setup lang="ts">
import { Table, VTable } from '@nsc0/v-table'
// import VTable from '../packages/v-table/index.vue'
// import Table from '../packages/table/index.vue'
import { onMounted, ref } from 'vue'
import type { TableHead } from '../packages/types/index'

interface TestData {
    [x: string]: any
}
const tableData = ref<TestData[]>([])
const tableHead = ref<TableHead[]>([
    // { label: '序号', prop: 'index', minWidth: '50px', width: '50px', fixed: 'left' },
    { label: '姓名', prop: 'name' },
    { label: '地址1', prop: 'address1', width: '180px' },
    { label: '地址2', prop: 'address2', width: '180px' },
    { label: '地址3', prop: 'address3', width: '180px', slot: true },
    // { label: '操作', prop: 'opts', fixed: 'right', width: '300px', slot: true },
])
onMounted(() => {
    for (let i = 0; i < 68; i++) {
        tableData.value.push({
            id: i + 1,
            index: i + 1,
            name: `小明${i + 1}`,
            address1: `苏州市${i + 4}街${i * 5 + 6}号6666666666666666666`,
            address2: `苏州市${i + 7}街${i * 55 + 9}号`,
            address3: `苏州市${i + 11}街${i * 36 + 1}号`,
        })
    }
    setTimeout(() => {
        tableData.value[0].name = '667'
    }, 3000);
})
</script>