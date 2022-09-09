import VTable from './v-table/index.vue'
import Table from './table/index.vue'
import type { App } from 'vue'

const components = [
    VTable, Table
]
export function install(app: App) {
    components.forEach(component => {
        app.component(component.name, component)
    })
}
export default {
    install
}

export {
    VTable, Table
}