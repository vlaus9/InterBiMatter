import * as BUI from '@thatopen/ui'
import type { TTableData } from '../editing/usePropertiesEditor'
import { useEffect, useRef, useState } from 'react'
import { modelStore } from '../store/model-store'
import { editor } from '../editing/usePropertiesEditor'
import AddItemModal from './AddItemModal'



const PropertiesTable: React.FC = () => {

    const [model, setModel] = useState(modelStore.getModel())

useEffect(() => {
    editor.onModelReady.add((model) => {
        setModel(model)
    })
}, [])

useEffect(() => {
    if (!model) {
        console.log('Модели еще нет')
        return
    }

    const propertiesTable = document.createElement('bim-table') as BUI.Table<TTableData>
    propertiesTable.headersHidden = true
    propertiesTable.expanded = true
    propertiesTable.hiddenColumns = ['localId', 'type', 'parentLocalId', 'parentName']

    //определяем таблицу свойств
    propertiesTable.dataTransform = {
        itemName: (value: any, row: Partial<TTableData>) => {

            if (!row.itemName || row.itemName === '_') {
                return value
            }

            if (row.type === 'relation') {
                return BUI.html`
                     <div style='display: flex; align-items: center; gap: 0.5rem'>
                        <bim-label>${value}</bim-label>
                        <bim-button icon='ic:baseline-plus' style='border: 1px solid var(--bim-ui_main-base); transform: scale(0.8)' @click=${() => {
                            //Добавить существующий элемент для связи
                            editor.currentRelation = {
                                id: row.localId as number,
                                name: value,
                                ids: []
                            }
                        }}
                        ${AddItemModal}
                     </div>
                `
            }

            if (row.type === 'related') {
                return BUI.html`
                    <div style='display: flex; align-items: center'>
                        <bim-panel>${value}</bim-panel>
                        ${
                            row.parentLocalId !== undefined ? 
                            BUI.html`
                            <bim-button icon='ic:baseline-close' style='transform: scale(0.8)' @click=${() => {
                                //удаляем элемент полностью
                                if (editor.currentElement) {
                                    editor.deleteItem(row.localId as number)
                                }
                            }}></bim-button>
                            ` : ''
                        }

                        <bim-button icon='flowbite: paper-clip-outline' style='transform: scale(0.8)' @click=${() => {
                            //Добавить новое отношение
                            if (editor.currentElement) {
                                editor.currentRelation = {
                                    id: row.localId as number,
                                    name: value,
                                    ids: []
                                }
                            }
                        }}>
                        $${AddRelatio}
                    </div>
                `
            }

        }
    }


}, [])

}