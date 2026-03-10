import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { editor } from "../editing/usePropertiesEditor"
import { useRef, useEffect, useState } from "react"
import { modelStore } from "../store/model-store"


BUI.Manager.init()


const CreateItemModal: React.FC = () => {
    
    const modalRef = useRef<HTMLDivElement>(null)
    const [model, setModel] = useState(modelStore.getModel())
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const onCloseCreateItemModalRef = useRef(new OBC.Event<void>())

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
            console.log('Модель не передалась')
            return
        }
        
        const [createItemModal, updateCreateItemModal] = BUI.Component.create<HTMLDialogElement, any>((_) => {
            const formContainer = BUI.Component.create<HTMLDivElement>(() => {
                return BUI.html`
                <div style='display: flex; flex-direction: column; gap: 0.5 rem'></div>
                `
                })
        
                //если аттрибутов еще нет добавляем пустышку атрибут
                if (editor.currentAttributes.length === 0) {
                    editor.addEmptyAttribute()
                }
        
                //форма для заполнения атрибутов
                for (const attribute of editor.currentAttributes) {
                    const entry = BUI.Component.create<HTMLDivElement>(() => {
                        return BUI.html`
        
                        <div style='display: flex; align-items: center; gap: 0.5rem>
                            <bim-text-input placeholder='Имя' value=${attribute.attributeName} @input=${(e: any) => {
                                attribute.attributeName = e.target.value
                            }}></bim-text-input>
                            <bim-text-input placeholder='Тип' value=${attribute.type} @input=${(e: any) => {
                                attribute.attributeName = e.target.value
                            }}></bim-text-input>
                            <bim-text-input placeholder='Значение' value=${attribute.value} @input=${(e: any) => {
                                attribute.attributeName = e.target.value
                            }}></bim-text-input>
                            <bim-button icon='material-symbols:delete' @click=${() => {
                                editor.deleteAttribute(attribute)
                                updateCreateItemModal()
                            }}</bim-button>
                        </div>
                        `
                    })
        
                    formContainer.appendChild(entry)
                }
        
                //когда закрываем окно очищаем дату
                onCloseCreateItemModalRef.current.reset()
                onCloseCreateItemModalRef.current.add(() => {
                    editor.currentAttributes = []
                    updateCreateItemModal()
                })
        
                return BUI.html`
                <dialog class='blurred-dialog'>
                    <bim-panel style='border-radius: var(--bim-ui_size-base); width: 22rem>
        
                        <bim-panel-section fixed label='Создать новый элемент'>
        
                        <bim-text-input label='Категории' @input=${(e: any) => {
                            editor.currentCategories = e.target.value as string
                        }}></bim-text-input>
                        
                        ${formContainer}
        
                        <bim-button label='Добавить' @click=${() => {
                            editor.createItem()
                        }}</bim-button>
        
                        </bim-panel-section>
                    </bim-panel>
                </dialog>
                `
        }, {})
        
        
        if (modalRef.current) {
            modalRef.current.appendChild(createItemModal)
        }

        if (isOpen) {
            createItemModal.showModal()
        }
        
        editor.onItemCreated.add(() => {
            createItemModal.close()
        })
        
        createItemModal.addEventListener('close', () => {
            setIsOpen(false)
            onCloseCreateItemModalRef.current.trigger()
        })
        
        editor.onCategoriesUpdated.add(() => {
            updateCreateItemModal()
        })

        return () => {
            createItemModal.remove()
            onCloseCreateItemModalRef.current.reset()
        }
    }, [model, isOpen])

return (
    <>
        <button onClick={openModal} className='text-white'>Создать элемент</button>
        <div ref={modalRef} className='absolute top-[50%] right-[10%]'></div>
    </>
)}

export default CreateItemModal
