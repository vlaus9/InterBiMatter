import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { editor } from "../editing/usePropertiesEditor"

const onCloseCreateItemModal = new OBC.Event<void>()

const [createItemModal, updateCreateItemModal] = BUI.Component.create<HTMLDialogElement, any>((_) => {
    const formContainer = BUI.Component.create<HTMLDivElement>(() => {
        return BUI.html`
        <div style='display: flex; flex-direction: column; gap: 0.5 rem'></div>
        `

        //если аттрибутов еще нет добавляем пустышку атрибут
        if (editor.currentAttributes.length === 0) {
            editor.addEmptyAttribute()
        }
    })
})