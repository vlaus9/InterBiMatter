import * as BUI from '@thatopen/ui'
import * as OBC from '@thatopen/components'
import type { TTableData } from '../editing/usePropertiesEditor'
import { editor } from '../editing/usePropertiesEditor'
import { modelStore } from '../store/model-store'
import { useEffect, useRef, useState } from 'react'


BUI.Manager.init()


const AddItemModal:React.FC = () => {

    const modalRef = useRef<HTMLDivElement>(null)
    const [model, setModel] = useState(modelStore.getModel())
    const [isOpen, setIsOpen] = useState(false)
    const onCloseAddItemModalRef = useRef(new OBC.Event<void>())
   

    //подписываемся на обновление model
    useEffect(() => {
        editor.onModelReady.add((model) => {
            setModel(model)
        })
    }, [])

    const openModal = () => {
        setIsOpen(true)
        console.log('нажал')
    }

    useEffect(() => {
        if (!model) {
            console.log('модель не передалась')
            return
        }


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
        <bim-dropdown label='Выбрать элемент' multiple @change=${(e: any) => {
            if (!editor.currentRelation) {
                console.log('ytf')
                return
            }
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

    onCloseAddItemModalRef.current.reset()
    onCloseAddItemModalRef.current.add(() => {
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
                    } else {
                        console.log([editor.currentElement && editor.currentRelation])
                    }
                }}></bim-button>
            </bim-panel-section>
        </bim-panel>
    </dialog>
    `
}, {})


if (modalRef.current) {
    modalRef.current.appendChild(addItemModal)
}

if (isOpen) {
    addItemModal.showModal()
    console.log(addItemModal)
}

addItemModal.addEventListener('close', () => {
    setIsOpen(false)
    onCloseAddItemModalRef.current.trigger()
})

const updateHandler = () => updateAddItemModal()
editor.onCategoriesUpdated.add(updateHandler) 
//обернуть в useRef

return () => {
    addItemModal.remove()
    editor.onCategoriesUpdated.remove(updateHandler)
    onCloseAddItemModalRef.current.reset()
}

}, [model, isOpen])
   
return (
    <>
        {/* <button onClick={cate} className='text-white'>Посмотреть категории</button> */}
        <button onClick={openModal} className='text-white'>Добавить элемент</button>
        <div ref={modalRef} className='absolute left-[500px] top-[500px] bg-white' />
    </>
)

}

export default AddItemModal


