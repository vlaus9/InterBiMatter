import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'
import * as THREE from 'three'
import { modelStore } from '../store/model-store'
import { workerUrlStore } from '../store/workerUrl-store'

type TTableData = {
    name: string;
    value?: string | number | boolean;
    localId: number;
    parentLocalId: number;
    parentName: string;
    type: 'relation' | 'related'
}

type TTableNode = {
    data: TTableData;
    children?: TTableNode[]
}

type TAttributeType = {
    name: string;
    type: string;
    value: string;
}

const model = modelStore.getModel()
const workerUrl = workerUrlStore.getWorkerUrl()
const fragments = new FRAGS.FragmentsModels(workerUrl)

class PropertyEditor {

    onItemCreated = new OBC.Event<void>()
    onPropertiesUpdated = new OBC.Event<TTableNode[]>()
    onCategoriesUpdated = new OBC.Event<void>()


    elementsConfig: FRAGS.ElementConfig = {
        data: {
            attributesDefault: true,
            relations: {
                isDefinedBy: { attributes: true, relations: true },
                definesOccurence: { attributes: false, relations: false }
                }
            }
        }
    // Конфиг данных для каждого элемента: все атрибуты по умолчанию
    // включены, для каждого экземпляра показываем атрибуты и связи,
    // для каждого типа не показываем атрибуты и связи

        currentElement: FRAGS.Element | null = null
        currentMesh: THREE.Group | null = null

        itemsDataById = new Map<number, FRAGS.ItemData>()
        updatedItems = new Set<number>()
        currentRelation: { id: number; name: string; ids: number[] } | null = null
        currentCategories: string | null = null
        currentAttributes: TAttributeType[] = []

        allCategories: string[] = []

        // private _world: OBC.World;
        // constructor(world: OBC.World) {
        //     this._world = world;
        //     this.setupEvents()
        // } РАЗОБРАТЬСЯ И ПЕРЕДЕЛАТЬ ПОД three

        async init() {
            if (model) {
                this.allCategories = await model.getCategories()
            }
        }

        //добавляет атрибут пустышку
        addEmptyAttribute() {
            this.currentAttributes.push({
                name: '',
                type: '',
                value: ''
            })
        }

        //удаляем атрибут
        deleteAttribute(attribute : TAttributeType) {
            const index = this.currentAttributes.indexOf(attribute)
            this.currentAttributes.splice(index, 1)
        }

        //обновляем атрибут
        updateAttribute(row: Partial<TTableData>, e: any) {
            if (!this.currentElement) {
                return
            }
            const localId = row.localId as number
            const item = this.itemsDataById.get(localId)
            if (!item) {
                throw new Error(`Элемент ${localId} не найден`)
            }
            const attr = item[row.name!] as FRAGS.ItemAttribute
            attr.value = e.target.value
            this.updatedItems.add(localId)
        }

        //обновляем таблицу свойств в пользовательском интерфейсе
        updatePropertiesTable = async() => {
            if (!this.currentElement) return
        
        this.itemsDataById.clear()
        this.updatedItems.clear()
        const data = this.currentElement.getData()
        const rootNode = this.getTableRecursively(data)
        this.onPropertiesUpdated.trigger([rootNode])
        }

        //применение изменений
        async applyChanges() {
            if (!this.currentElement) return

            for (const localId of this.updatedItems) {
                const item = this.itemsDataById.get(localId)
                if (!item) {
                    throw new Error(`Элемент ${localId} не найден`)
                }
            fragments.editor.setItem(model?.modelId as string, item)
            }

            await fragments.editor.applyChanges(model?.modelId as string)

            if (this.currentElement && this.currentMesh) {
                this.currentElement.disposeMeshes(this.currentMesh)
            }

            this.onPropertiesUpdated.trigger([])
            this.itemsDataById.clear()

            await fragments.update(true)
            this.currentElement = null
            this.updatePropertiesTable()
        }

        //добавить связь
        async relate() {
           if (!this.currentRelation) return
           const { id, name, ids } = this.currentRelation
           await fragments.editor.relate(model?.modelId as string, id, name, ids)
           await fragments.editor.applyChanges(model?.modelId as string)
           await this.updatePropertiesTable()
        }

        //удалить связь
        async unrelate(){
            if (!this.currentRelation) return
            const { id, name, ids } = this.currentRelation
            await fragments.editor.unrelate(model?.modelId as string, id, name, ids)
            await fragments.editor.applyChanges(model?.modelId as string)
            await this.updatePropertiesTable()
        }

        //создать элемент
        async createItem() {
            if (!this.currentCategories) return
            
            const data: Record<string, FRAGS.ItemAttribute> = {}
            const guid = THREE.MathUtils.generateUUID()

            for (const attribute of this.currentAttributes) {
                if (attribute.name && attribute.value) {
                    data[attribute.name] = {
                        type: attribute.type,
                        value: attribute.value
                    }
                }
            }
            
            fragments.editor.createItem(model?.modelId as string, {
                data,
                category: this.currentCategories,
                guid,
            })

            await fragments.editor.applyChanges(model?.modelId as string)

            this.allCategories = await model?.getCategories() as string[]
            this.onCategoriesUpdated.trigger()

            this.onItemCreated.trigger()
        }

        //удалить элемент
        async deleteItem(localId: number) {
            if (!this.currentElement) return
            await fragments.editor.deleteData(model?.modelId as string, {
                itemIds: [localId],
            })

            await fragments.editor.applyChanges(model?.modelId as string)
            await this.updatePropertiesTable()
        }
    }
    