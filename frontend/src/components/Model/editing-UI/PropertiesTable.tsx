import * as BUI from '@thatopen/ui'
import type { TTableData } from '../editing/usePropertiesEditor'
import { useEffect, useRef, useState } from 'react'
import { modelStore } from '../store/model-store'
import { editor } from '../editing/usePropertiesEditor'
import AddItemModal from './AddItemModal'
import AddRelationModal from './AddRelationModal'
import CreateItemModal from './CreateItemModal'

BUI.Manager.init()

const PropertiesTable: React.FC = () => {

    const panelPropertiesRef = useRef<HTMLDivElement>(null)
    const [model, setModel] = useState(modelStore.getModel())
    const [isOpen, setIsOpen] = useState<boolean>(false)


useEffect(() => {
    editor.onModelReady.add((model) => {
        setModel(model)
    })
}, [])

const openTable = () => {
    setIsOpen(true)
    console.log(panelPropertiesRef)
}


useEffect(() => {
    if (!model) {
        console.log('Модели еще нет')
        return
    }

    const propertiesTable = document.createElement('bim-table') as BUI.Table<TTableData>
    propertiesTable.className = 'w-[300px] h-[300px] bg-[green] text-white'
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
                        }}></bim-button>
                        ${AddRelationModal}
                    </div>
                `
            }

            return value
        },
        value: (value: any, row: Partial<TTableData>) => {
 
            if (!row.itemName || row.itemName[0] === '_') {
                return value
            }

            if (typeof value === 'string') {
                return BUI.html`
                    <bim-text-input value=${value} @input=${(e: any) => {
                        editor.updateAttribute(row, e)
                    }}></bim-text-input>
                `
            }

            return BUI.html`
                <bim-checkbox ?checked=${value} @change=${(e: any) => {
                    editor.updateAttribute(row, e)
                }}></bim-checkbox>
            `
        }
    }

    //кнопка обновления таблицы свойств
    const updateTableButton = BUI.Component.create<BUI.Button>(() => {
        return BUI.html`
            <bim-button label='Добавить изменения' @click=${() => {
                editor.applyChanges()
            }}></bim-button>
        `
    })


    editor.onPropertiesUpdated.add((data) => {
        propertiesTable.data = data
        const tableVisible = propertiesTable.data.length > 0
        updateTableButton.style.display = tableVisible ? 'block' : 'none'
    })


    //панель управления
    const [panelProperties] = BUI.Component.create<BUI.PanelSection, any>((_) => {
        return BUI.html`
            <bim-panel style='min-width:25rem' id='controls-panel' active label='Редактор элемента' class='options-menu'>
                <bim-panel-section label='Элементы управления'>
                    <bim-button label='Создать новый элемент"></bim-button>
                    <CreateItemModal />

                    ${updateTableButton}
                    ${propertiesTable}
                </bim-panel-section>
            </bim-panel>
        `
    }, {})

    if (panelPropertiesRef.current) {
        panelPropertiesRef.current.appendChild(panelProperties)
    }


    return () => {
        propertiesTable.remove()
        panelProperties.remove()
    }

}, [model, isOpen])


    return (
        <>
            <button onClick={openTable} className='text-white m-[10px]'>Открыть таблицу</button>
            <div ref={panelPropertiesRef} className='absolute top-[10px] w-[500px] h-[500px] z-[1000]'></div>
            <CreateItemModal />
        </>
    )

}

export default PropertiesTable