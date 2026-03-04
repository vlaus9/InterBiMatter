import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'
import * as THREE from 'three'
import { workerUrlStore } from '../store/workerUrl-store'
import { all } from 'axios'


export type TTableData = {
    itemName: string;
    value?: string | number | boolean;
    localId: number;
    parentLocalId?: number;
    parentName?: string;
    type?: 'relation' | 'related'
}

type TTableNode = {
    data: TTableData;
    children?: TTableNode[]
}

type TAttributeType = {
    attributName: string;
    type: string;
    value: string;
}




class PropertiesEditor {

        onItemCreated = new OBC.Event<void>()
        onPropertiesUpdated = new OBC.Event<TTableNode[]>()
        onCategoriesUpdated = new OBC.Event<void>()


        // Конфиг данных для каждого элемента: все атрибуты по умолчанию
        // включены, для каждого экземпляра показываем атрибуты и связи,
        // для каждого типа не показываем атрибуты и связи
        elementsConfig: FRAGS.ElementConfig = {
            data: {
                attributesDefault: true,
                relations: {
                    isDefinedBy: { attributes: true, relations: true },
                    definesOccurence: { attributes: false, relations: false }
                    }
                }
            }
        

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

        private _model: FRAGS.FragmentsModel | null = null
        private _modelId: string | null = null
        private _fragments: FRAGS.FragmentsModels | null = null
        private _renderer: THREE.WebGLRenderer | null = null
        private _camera: THREE.PerspectiveCamera | null = null
        private _scene: THREE.Scene | null = null
        private _worker: string = ''
        private _eventsSetup: boolean = false


        async init() {
            if (this._model) {
                this.allCategories = await this._model.getCategories()
            }
        }


        setModel(model: FRAGS.FragmentsModel) {
            if (!model) {
                throw new Error('Model отсутствует')
            }

            this._model = model
            this._modelId = this._model.modelId
            this.init()
            this._fragments?.models.list.set(this._model.modelId, this._model)
            this._eventsSetup = false
        }

        setRenderer(renderer: THREE.WebGLRenderer) {
            if (!renderer) {
                throw new Error('Renderer отсутствует')
            }
            this._renderer = renderer

            if (!this._eventsSetup) {
                this.setupEvents()
                this._eventsSetup = true
            }
        }

        setCamera(camera: THREE.PerspectiveCamera) {
            if (!camera) {
                throw new Error('Camera отсутствует')
            }
            this._camera = camera
        }

        setScene(scene: THREE.Scene) {
            if (!scene) {
                throw new Error('Scene отсутствует')
            }
            this._scene = scene
        }

        setWorker(worker: string) {
            this._worker = worker
            this._fragments = new FRAGS.FragmentsModels(this._worker)
        }



        //добавляет атрибут пустышку
        addEmptyAttribute() {
            this.currentAttributes.push({
                attributName: '',
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

            const localId = row.localId

            if (localId === undefined) {
                throw new Error('LocalId является undefined')
            }

            const item = this.itemsDataById.get(localId)

            if (!item) {
                throw new Error(`Элемент ${localId} не найден`)
            }

            const attr = item[row.itemName!] as FRAGS.ItemAttribute
            attr.value = e.target.value
            this.updatedItems.add(localId)
        }

        //обновляем таблицу свойств в пользовательском интерфейсе
        updatePropertiesTable = async() => {
            if (!this.currentElement) return
        
        this.itemsDataById.clear()
        this.updatedItems.clear()
        const data = await this.currentElement.getData()
        const rootNode = this.getTableRecursively(data)
        this.onPropertiesUpdated.trigger([rootNode])
        }

        //применение изменений
        async applyChanges() {
            if (!this.currentElement || !this._fragments || !this._modelId) return

            for (const localId of this.updatedItems) {

                const item = this.itemsDataById.get(localId)

                if (!item) {
                    throw new Error(`Элемент ${localId} не найден`)
                }

            this._fragments.editor.setItem(this._modelId, item)
            }

            await this._fragments.editor.applyChanges(this._modelId)

            if (this.currentElement && this.currentMesh) {
                this.currentElement.disposeMeshes(this.currentMesh)
            }

            this.onPropertiesUpdated.trigger([])
            this.itemsDataById.clear()

            await this._fragments.update(true)

            this.currentElement = null
            this.updatePropertiesTable()
        }

        //добавить связь
        async relate() {
           if (!this.currentRelation || !this._fragments || !this._modelId) return
           const { id, name, ids } = this.currentRelation
           await this._fragments.editor.relate(this._modelId, id, name, ids)
           await this._fragments.editor.applyChanges(this._modelId)
           await this.updatePropertiesTable()
        }

        //удалить связь
        async unrelate(){
            if (!this.currentRelation || !this._fragments || !this._modelId) return
            const { id, name, ids } = this.currentRelation
            await this._fragments.editor.unrelate(this._modelId, id, name, ids)
            await this._fragments.editor.applyChanges(this._modelId)
            await this.updatePropertiesTable()
        }

        //создать элемент
        async createItem() {
            if (!this.currentCategories || !this._fragments || !this._model || !this._modelId) return
            
            const data: Record<string, FRAGS.ItemAttribute> = {}
            const guid = THREE.MathUtils.generateUUID()

            for (const attribute of this.currentAttributes) {
                if (attribute.attributName && attribute.value) {
                    data[attribute.attributName] = {
                        type: attribute.type,
                        value: attribute.value
                    }
                }
            }
            
            this._fragments.editor.createItem(this._modelId, {
                data,
                category: this.currentCategories,
                guid,
            })

            await this._fragments.editor.applyChanges(this._modelId)

            this.allCategories = await this._model.getCategories()
            this.onCategoriesUpdated.trigger()

            this.onItemCreated.trigger()
        }

        //удалить элемент
        async deleteItem(localId: number) {
            if (!this.currentElement || !this._fragments || !this._modelId) return
            await this._fragments.editor.deleteData(this._modelId, {
                itemIds: [localId],
            })

            await this._fragments.editor.applyChanges(this._modelId)
            await this.updatePropertiesTable()
        }

        //формирование древа связей элемента
        private getTableRecursively(data: FRAGS.ItemData, parent?: TTableNode) {
            const localId = (data._localId as FRAGS.ItemAttribute).value
            this.itemsDataById.set(localId, data)

            const currentNode: TTableNode = {
                data: {
                    itemName: localId,
                    localId: localId,
                    type: 'related'
                },
                children: []
            }

            //если есть родитель, записываем в родители
            if (parent) {
                parent.children!.push(currentNode)
                currentNode.data.parentLocalId = parent.data.localId
                currentNode.data.parentName = parent.data.itemName
            }
        

            for (const valueName in data) {
                const current = data[valueName]

                //если массив, значит это связь и формируем продолжение ветки связей
                if (Array.isArray(current)) {
                    const relNode: TTableNode = {
                        data: {
                            itemName: valueName,
                            localId: localId,
                            type: 'relation'
                        },
                        children: []
                    }

                    currentNode.children!.push(relNode)
                    for (const item of current) {
                        this.getTableRecursively(item, relNode)
                    }
                } else {
                    //если пустое значение значит пропускам
                    if (current.value === undefined || current.value === null) {
                        continue
                    }
                    //если служебное поле значит пропускаем 
                    if (valueName.startsWith('_')) {
                        continue
                    }
                    currentNode.children!.push({
                        data: {
                            itemName: valueName,
                            value: current.value,
                            localId: localId
                            
                        }
                    })
                } 
            }
            return currentNode
        }

        //события кликов: два клика - выделить объект, esc - сбросить выделение
        private setupEvents() {
            const mouse = new THREE.Vector2()

            if (!this._renderer) return 

            const canvas = this._renderer.domElement
            canvas.addEventListener('dblclick',  async(event) => {
                mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1
                mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1

                let result: any

                if (this.currentElement && this.currentMesh) {
                    this.currentElement.disposeMeshes(this.currentMesh)
                }




if (!this._camera || !this._renderer || !this._scene) return

// Создаем луч из камеры через точку мыши
const raycaster = new THREE.Raycaster()
raycaster.setFromCamera(mouse, this._camera)
raycaster.far = 3000000

const meshes: THREE.Mesh[] = [] 
this._model?.object.traverse((child) => {
    if (child instanceof THREE.Mesh) 
        
        if (child.geometry && child.geometry.attributes.position && child.geometry.attributes.position.array) {
            console.log(child.geometry.attributes.position)
            meshes.push(child)
        //     const posAttr = child.geometry.attributes.position
        //     if (posAttr.count > 0 && posAttr.array && posAttr.array.length > 0) {
        //         meshes.push(child)
        //     }
        //     else {
        //         console.log('Плохая геометрия у меша', child)
        //     }
        // }
        //     else {
        //         console.log('Меш без геометрии', child)
            }
        
        
        
        
        
        
})
console.log(meshes)
console.log(raycaster)

const threeJsIntersects = raycaster.intersectObjects(meshes)
console.log(threeJsIntersects)
// Создаем визуализацию луча
const arrowHelper = new THREE.ArrowHelper(
    raycaster.ray.direction,           // направление
    raycaster.ray.origin,               // начало
    10,                                 // длина
    0xff0000                            // красный цвет
)

// Добавляем на сцену
this._scene.add(arrowHelper)

// Удаляем через 1 секунду (чтобы не засорять сцену)
setTimeout(() => {
    if (!this._camera || !this._renderer || !this._scene) return
    this._scene.remove(arrowHelper)
}, 1000)






                //рейкаст для моделей

                this._camera?.updateMatrixWorld()
                this._camera?.updateProjectionMatrix()

                if (!this._fragments) {
                    console.log('нет фрагментов')
                    return
                }

                for (const [, model] of this._fragments.models.list) {
                    if (!this._camera || !this._renderer || !this._scene) continue
                
                    console.log(model)
                    const promises: Promise<FRAGS.RaycastResult | null>[] = []
                    promises.push(
                        model.raycast({
                            camera: this._camera,
                            mouse,
                            dom: this._renderer?.domElement
                        })
                    )


                    const results = await Promise.all(promises)
                    console.log([this._camera.far, this._camera.near])
                    console.log('РЕЗУЛЬТАТ RAYCAST:', results)

                    let smallerDistance = Infinity
                    for (const current of results) {
                        if (current) {
                            if (current.distance < smallerDistance) {
                                smallerDistance = current.distance
                                result = current
                            }
                        }
                    }
                }

                if (!result) {
                    console.log('нет результата')
                    return
                }

                const [element] = await this._fragments.editor.getElements(this._modelId!, [result.localId])

                this.currentElement = element
                this.currentElement.config = this.elementsConfig

                if (!element) return

                this.currentMesh = await element.getMeshes()
                
                if (this._model) {
                    const worldMatrix = this._model.object.matrixWorld
                    console.log(worldMatrix)
                    
                    this.currentMesh.applyMatrix4(worldMatrix)
                }

                this.currentMesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        const mat = child.material  as THREE.MeshLambertMaterial
                        mat.depthTest = false
                        mat.color.set('gold')
                    }
                })

                
                this._scene!.add(this.currentMesh)
                
                this.updatePropertiesTable()
                console.log('feee', this.currentElement)
            })



            window.addEventListener('keydown', async(event) => {
                if (event.key === 'Escape') {
                    if (!this.currentElement || !this._fragments) {
                        console.log('чего то нет')
                        return
                    }
                    if(this.currentElement && this.currentMesh) {
                        this.currentElement.disposeMeshes(this.currentMesh)
                    }

                    this.currentElement.getRequests()

                    this.currentAttributes = []
                    this.onPropertiesUpdated.trigger([])
                    this.itemsDataById.clear()
                    await this._fragments.update(true)
                    this.currentElement = null
                    this.updatePropertiesTable()

                    this.onPropertiesUpdated.trigger([])
                }
            })
        }
    }

export const editor = new PropertiesEditor()
    