import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'
import * as THREE from 'three'

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

        itemsDataId = new Map<number, FRAGS.ItemData>()
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
            this.allCategories = await model.getCategories()
        }

    }
