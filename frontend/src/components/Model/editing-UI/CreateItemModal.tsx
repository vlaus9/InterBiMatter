import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { editor } from "../editing/usePropertiesEditor"

BUI.Manager.init()
const onCloseCreateItemModal = new OBC.Event<void>()




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
        onCloseCreateItemModal.reset()
        onCloseCreateItemModal.add(() => {
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


document.body.appendChild(createItemModal)

editor.onItemCreated.add(() => {
    createItemModal.close()
})

createItemModal.addEventListener('close', () => {
    onCloseCreateItemModal.trigger()
})

editor.onCategoriesUpdated.add(() => {
    updateCreateItemModal()
})