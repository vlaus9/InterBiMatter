import * as BUI from '@thatopen/ui'
import * as OBC from '@thatopen/components'
import type { TTableData } from '../editing/usePropertiesEditor'
import { editor } from '../editing/usePropertiesEditor'
import { modelStore } from '../store/model-store'



BUI.Manager.init()
editor.init()

const propertiesTable = document.createElement('bim-table') as BUI.Table<TTableData>
propertiesTable.headersHidden = true
propertiesTable.expanded = true
propertiesTable.hiddenColumns = ['localId', 'type', 'parentLocalId', 'parentName']

const model = modelStore.getModel()

const onCloseAddItemModal = new OBC.Event<void>()



//окно для добавления новых элементов отношения
const [addItemModal, updateAddItemModal] = BUI.Component.create<HTMLDialogElement, any>((_) => {
    const itemIdsDropDownContainer = BUI.Component.create<HTMLDivElement>(() => {
        return BUI.html`<div></div>`
    })

    //функция для получения списка элементов для выбора
    const updateItemsIds = async(category: string | undefined) => {

        //очищаем
        const children = [...itemIdsDropDownContainer.children]
        for (const child of children) {
            child.remove()
        }
    
    const itemIdsDropDown = BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
        <bim-dropdown label='Выбрать элемент' multiply @change=${(e: any) => {
            if (!editor.currentRelation) return
            editor.currentRelation.ids = e.target.value as number[]
        }}
        </bim-dropdown>
        `
    })

    itemIdsDropDownContainer.appendChild(itemIdsDropDown)

    if (!category) return

    const regexp = new RegExp(category)

    if (!model) return

    const itemIdsByCategory = await model.getItemsOfCategories([regexp])

    for (const categoryName in itemIdsByCategory) {
        const itemIds = itemIdsByCategory[categoryName]
        for (const itemId of itemIds) {
            const itemIdOption = BUI.Component.create<BUI.Option>(() => {
                return BUI.html`
                <bim-option value=${itemId} label=${itemId}></bim-option>
                `
            })
            itemIdsDropDown.appendChild(itemIdOption)
        }
    }
    }

    const categoriesDropDown = BUI.Component.create<BUI.Dropdown>(() => {
        return BUI.html`
        <bim-dropdown label='Выбрать категорию' @change=${(e: any) => {
            if (e.target.value[0]) {
                updateItemsIds(e.target.value[0])
            }
        }}>
        ${editor.allCategories.map((category) => {
            return BUI.html`
            <bim-option value=${category} label=${category}></bim-option>
            `
        })}
        </bim-dropdown
        `
    })

    onCloseAddItemModal.reset()
    onCloseAddItemModal.add(() => {
        categoriesDropDown.value = []
        updateAddItemModal()
    })

    return BUI.html`
    <dialog class='blurred-dialog'>
        <bim-panel style='border-radius: var(--bim-ui_size-base); width: 22rem'>
            <bim-panel-section fixed label='Добавить элемент в связь'>
                ${categoriesDropDown}
                ${itemIdsDropDownContainer}
                <bim-button label='Добавить' @click=${() => {
                    if (editor.currentElement && editor.currentRelation) {
                        editor.relate().then(() => {
                            addItemModal.close()
                        })
                    }
                }}></bim-button>
            </bim-panel-section>
        </bim-panel>
    </dialog>
    `
}, {})

document.body.appendChild(addItemModal)

addItemModal.addEventListener('close', () => {
    onCloseAddItemModal.trigger()
})

editor.onCategoriesUpdated.add(() => {
    updateAddItemModal()
})

//обернуть в useRef