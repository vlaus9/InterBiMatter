import * as OBC from '@thatopen/components'
import * as BUI from '@thatopen/ui'
import { editor } from '../editing/usePropertiesEditor'
import { useEffect, useState, useRef } from 'react'
import { modelStore } from '../store/model-store'

BUI.Manager.init()

const [model, setModel] = useState(modelStore.getModel())
const onCloseAddRelationModal = new OBC.Event<void>()

const [addRelationModal, updateAddRelationModal] = BUI.Component.create<HTMLDialogElement, any>((_) => {

    const itemsIdsDropdownContainer = BUI.Component.create<HTMLDivElement>(() => {
        return BUI.html`
            <div></div>
        `
    })

    //Поле ввода имени для отношения
    const relationNameInput = BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html `
            <bim-text-input label="Имя отношения" @input=${(e: any) => {
                if (!editor.currentRelation) return
                editor.currentRelation.name = e.target.value as string
            }}></bim-text-input>
        `
    })

    //Получение списка элементов для выбора
    const updateItemsIds = async (category: string | undefined) => {
        
        //сначала очищаем
        const children = [...itemsIdsDropdownContainer.children]
        for (const child of children) {
            child.remove()
        }
    

    const itemIdsDropdown = BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
            <bim-dropdown label='Выбрать элемент' multiple @change=${(e: any) => {
                if (!editor.currentRelation) return
                editor.currentRelation.ids = e.target.value as number[]
            }} </bim-dropdown>
        `
    })

    itemsIdsDropdownContainer.appendChild(itemIdsDropdown)

    if (!category || !model) return

    const regexp = new RegExp(category)
    const itemIdsByCategory = await model.getItemsOfCategories([regexp])

    for (const categoryName in itemIdsByCategory) {
        const itemsId = itemIdsByCategory[categoryName]
        for (const itemId of itemsId) {
            const itemIdOption = BUI.Component.create<BUI.Option>(() => {
                return BUI.html`
                    <bim-option value=${itemId} label=${itemId}></bim-option>
                `
            })
            itemIdsDropdown.appendChild(itemIdOption)
        }
    }}


    //Список для выбора категории элемента, к которому надо привязать элемент
    const categoriesDropdown = BUI.Component.create<BUI.Dropdown>(() => {
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
            </bim-dropdown>
        `
    })

    onCloseAddRelationModal.reset()
    onCloseAddRelationModal.add(() => {
        categoriesDropdown.value = []
        updateAddRelationModal()
    })

    return BUI.html`
        <dialog>
            <bim-panel style='border-radius: var(--bim-ui_size-base); width: 22rem'>
                <bim-panel-section fixed label='Добавить новое отношение'>
                ${relationNameInput}
                ${categoriesDropdown}
                ${itemsIdsDropdownContainer}
                <bim-button label='Создать отношение' @click=${(() => {
                    if (editor.currentElement && editor.currentRelation) {
                        editor.elementsConfig.data.relations[editor.currentRelation.name] = {
                            attributes: true,
                            relations: true
                        }
                        editor.relate().then(() => {
                            addRelationModal.close()
                        })
                    }
                })}
                </bim-panel-section>
            </bim-panel>
        </dialog>
    `
}, {})

addRelationModal.addEventListener('close', () => {
    onCloseAddRelationModal.trigger()
})