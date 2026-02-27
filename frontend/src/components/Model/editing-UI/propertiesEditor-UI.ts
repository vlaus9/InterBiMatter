import * as BUI from '@thatopen/ui'
import * as OBC from '@thatopen/components'
import type { TTableData } from '../editing/usePropertiesEditor'
import { editor } from '../editing/usePropertiesEditor'



BUI.Manager.init()
editor.init()

const propertiesTable = document.createElement('bim-table') as BUI.Table<TTableData>
propertiesTable.headersHidden = true
propertiesTable.expanded = true
propertiesTable.hiddenColumns = ['localId', 'type', 'parentLocalId', 'parentName']


//окно для добавления новых элементов отношения

const onCloseAddItemModal = new OBC.Event<void>()

const [addItemModal, updateAddItemModal] = BUI.Component.create<HTMLDialogElement, any>((_) => {
    const itemIdsDropDownContainer = BUI.Component.create<HTMLDivElement>(() => {
        return BUI.html`<div></div>`
    })


    //функция для получения списка элементов для выбора

    //очищаем
    const updateItemsIds = async(category: string | undefined) => {
        const children = [...itemIdsDropDownContainer.children]
        for (const child of children) {
            child.remove()
        }
    }

    const itemIdsDropDown = BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
        <bim-dropdown label='Select items' multiply @change=${(e: any) => {
            if (!editor.currentRelation) return
            editor.currentRelation.ids = e.target.value as number[]
        }}
        </bim-dropdown>
        `
    })

}, {})