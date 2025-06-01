import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { PlantEntityUtils } from '../utils/plant-entity-utils';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'sensor' | 'badge' | 'website' | 'plant-name';

export type ClickAction = 'none' | 'more-info' | 'edit';

export interface FieldService {
    domain: string;
    action: string;
    entityPrefix?: string;
    valueKey?: string;
}

export interface FieldDefinition {
    id: string;
    name: string;
    group: string;
    type: FieldType;
    clickAction: ClickAction;
    service?: FieldService;
    options?: (hass: HomeAssistant, plant: HomeAssistantEntity) => string[];
    unit?: string;
    validation?: {
        min?: number;
        max?: number;
        step?: number;
        numberType?: 'float' | 'integer';
    };
    getValue?: (hass: HomeAssistant, plant: HomeAssistantEntity) => string | number;
    isSensor?: boolean;
    hasExternalLink?: boolean;
    showStatusBar?: boolean;
    getServiceData?: (hass: HomeAssistant, plant: HomeAssistantEntity, value: string) => { device_id: string; area_id: string };
}

// Standard-Services
const PLANT_ATTRIBUTE_SERVICE: FieldService = {
    domain: 'plant',
    action: 'update_plant_attributes'
};

const SELECT_SERVICE: FieldService = {
    domain: 'select',
    action: 'select_option',
    entityPrefix: 'select.',
    valueKey: 'option'
};

const NUMBER_SERVICE: FieldService = {
    domain: 'number',
    action: 'set_value',
    entityPrefix: 'number.',
    valueKey: 'value'
};

// Konstanten
const PHASES = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'entfernt', 'geerntet'] as const;
const SENSOR_FIELDS = ['air_humidity', 'soil_moisture', 'temperature', 'conductivity', 'illuminance', 'dli', 'water_consumption', 'fertilizer_consumption', 'power_consumption', 'energy_consumption', 'ph'] as const;

// Helper-Funktionen
const getEntityState = (hass: HomeAssistant, plant: HomeAssistantEntity, entityType: string, attribute: string): string => {
    // Nur _sensorMap nutzen - keine Fallbacks
    if (plant.attributes._sensorMap && plant.attributes._sensorMap[attribute]) {
        // Direkten Zugriff auf die korrekte Entity-ID
        const entityId = plant.attributes._sensorMap[attribute];
        return hass?.states[entityId]?.state || '';
    }
    return '';
};

const getEntityOptions = (hass: HomeAssistant, plant: HomeAssistantEntity, entityType: string, attribute: string): string[] => {
    // Nur _sensorMap nutzen - keine Fallbacks
    if (plant.attributes._sensorMap && plant.attributes._sensorMap[attribute]) {
        // Direkten Zugriff auf die korrekte Entity-ID
        const entityId = plant.attributes._sensorMap[attribute];
        return hass?.states[entityId]?.attributes?.options || [];
    }
    return [];
};

const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const FIELD_DEFINITIONS: FieldDefinition[] = [
    // Name group
    {
        id: 'friendly_name',
        name: 'Name',
        group: 'name',
        type: 'plant-name',
        clickAction: 'none' as ClickAction,
        getValue: (_, plant) => plant.attributes.friendly_name || ''
    },

    // Basic group
    {
        id: 'state',
        name: 'Status',
        group: 'basic',
        type: 'badge',
        clickAction: 'more-info' as ClickAction,
        getValue: (_, plant) => plant.state
    },

    // Growing group
    {
        id: 'area',
        name: 'Bereich',
        group: 'growing',
        type: 'select',
        clickAction: 'edit' as ClickAction,
        service: {
            domain: 'plant',
            action: 'move_to_area'
        },
        options: (hass) => Object.values(hass.areas || {}).map(area => area.name).sort(),
        getValue: (hass, plant) => {
            // Holt die Location-Entity-ID und verarbeitet den State, der ein Object/Array ist
            if (plant.attributes._sensorMap && plant.attributes._sensorMap['location']) {
                const locationEntityId = plant.attributes._sensorMap['location'];
                const locationState = hass?.states[locationEntityId]?.state;
                
                if (locationState) {
                    try {
                        // Versuche den State als JSON zu parsen
                        const locationObject = JSON.parse(locationState);
                        return locationObject.area || '';
                    } catch (e) {
                        // Falls kein JSON, gib den State direkt zurück
                        return locationState;
                    }
                }
            }
            return '';
        }
    },
    {
        id: 'growth_phase',
        name: 'Phase',
        group: 'growing',
        type: 'select',
        clickAction: 'edit' as ClickAction,
        service: SELECT_SERVICE,
        options: (hass, plant) => getEntityOptions(hass, plant, 'select', 'growth_phase'),
        getValue: (hass, plant) => getEntityState(hass, plant, 'select', 'growth_phase')
    },
    {
        id: 'cycle',
        name: 'Durchgang',
        group: 'growing',
        type: 'select',
        clickAction: 'edit' as ClickAction,
        service: SELECT_SERVICE,
        options: (hass, plant) => getEntityOptions(hass, plant, 'select', 'cycle'),
        getValue: (hass, plant) => getEntityState(hass, plant, 'select', 'cycle')
    },
    {
        id: 'pot_size',
        name: 'Topfgröße',
        group: 'growing',
        type: 'number',
        clickAction: 'edit' as ClickAction,
        service: NUMBER_SERVICE,
        unit: 'L',
        validation: {
            min: 0,
            step: 0.1,
            numberType: 'float'
        },
        getValue: (hass, plant) => getEntityState(hass, plant, 'number', 'pot_size')
    },
    {
        id: 'flowering_duration',
        name: 'Blütezeit',
        group: 'growing',
        type: 'number',
        clickAction: 'edit' as ClickAction,
        service: NUMBER_SERVICE,
        unit: 'Tage',
        validation: {
            min: 0,
            step: 1,
            numberType: 'integer'
        },
        getValue: (hass, plant) => getEntityState(hass, plant, 'number', 'flowering_duration')
    },

    // Genetics group
    {
        id: 'strain',
        name: 'Sorte',
        group: 'genetics',
        type: 'text',
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE
    },
    {
        id: 'breeder',
        name: 'Züchter',
        group: 'genetics',
        type: 'text',
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE
    },
    {
        id: 'feminized',
        name: 'Feminisiert',
        group: 'genetics',
        type: 'text',
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE
    },
    {
        id: 'original_flowering_duration',
        name: 'Original Blütezeit',
        group: 'genetics',
        type: 'text',
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE
    },

    // Phase Begin group
    ...PHASES.map(phase => ({
        id: `${phase}_beginn`,
        name: `${capitalizeFirstLetter(phase)} Start`,
        group: 'phasebegin',
        type: 'date' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE
    })),

    // Phase Duration group
    ...PHASES.map(phase => ({
        id: `${phase}_dauer`,
        name: `${capitalizeFirstLetter(phase)} Dauer`,
        group: 'phasedauer',
        type: 'number' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        unit: 'Tage',
        validation: {
            min: 0,
            step: 1
        }
    })),

    // Sensors group
    {
        id: 'soil_moisture',
        name: 'Feuchtigkeit',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: '%',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'soil_moisture')
    },
    {
        id: 'temperature',
        name: 'Temperatur',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: '°C',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'temperature')
    },
    {
        id: 'conductivity',
        name: 'Leitfähigkeit',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'µS/cm',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'conductivity')
    },
    {
        id: 'ph',
        name: 'pH-Wert',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'pH',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'ph')
    },
    {
        id: 'illuminance',
        name: 'Beleuchtung',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'lx',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'illuminance')
    },
    {
        id: 'air_humidity',
        name: 'Luftfeuchtigkeit',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: '%',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'air_humidity')
    },
    {
        id: 'dli',
        name: 'DLI',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'mol/d⋅m²',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'dli')
    },
    {
        id: 'water_consumption',
        name: 'Wasserverbrauch',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'ml',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'water_consumption')
    },
    {
        id: 'fertilizer_consumption',
        name: 'Düngerverbrauch',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'ml',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'fertilizer_consumption')
    },
    {
        id: 'power_consumption',
        name: 'Stromverbrauch',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'W',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'power_consumption')
    },
    {
        id: 'energy_consumption',
        name: 'Energieverbrauch',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'kWh',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'energy_consumption')
    },
    {
        id: 'health',
        name: 'Gesundheit',
        group: 'sensors',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: '',
        isSensor: true,
        showStatusBar: true,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'health')
    },

    // Diagnostics group
    {
        id: 'ppfd_mol',
        name: 'PPFD',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'µmol/m²/s',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => {
            const value = getEntityState(hass, plant, 'sensor', 'ppfd_mol');
            return value ? Number(value).toFixed(6) : value;
        }
    },
    {
        id: 'total_ppfd_mol_integral',
        name: 'Total PPFD',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'mol/m²',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'total_ppfd_mol_integral')
    },
    {
        id: 'total_water_consumption',
        name: 'Gesamt Wasserverbrauch',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'L',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'total_water_consumption')
    },
    {
        id: 'total_fertilizer_consumption',
        name: 'Gesamt Düngerverbrauch',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'ml',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'total_fertilizer_consumption')
    },
    {
        id: 'total_power_consumption',
        name: 'Gesamt Stromverbrauch',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'kWh',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'total_power_consumption')
    },
    {
        id: 'total_energy_consumption',
        name: 'Gesamt Energieverbrauch',
        group: 'diagnostics',
        type: 'sensor',
        clickAction: 'more-info' as ClickAction,
        unit: 'kWh',
        isSensor: true,
        showStatusBar: false,
        getValue: (hass, plant) => getEntityState(hass, plant, 'sensor', 'total_energy_consumption')
    },

    // Min/Max group
    ...SENSOR_FIELDS.flatMap(sensor => [
        {
            id: `min_${sensor}`,
            name: `Min ${sensor}`,
            group: 'min_max',
            type: 'number' as FieldType,
            clickAction: 'edit' as ClickAction,
            service: NUMBER_SERVICE,
            getValue: (hass: HomeAssistant, plant: HomeAssistantEntity) => getEntityState(hass, plant, 'number', `min_${sensor}`)
        },
        {
            id: `max_${sensor}`,
            name: `Max ${sensor}`,
            group: 'min_max',
            type: 'number' as FieldType,
            clickAction: 'edit' as ClickAction,
            service: NUMBER_SERVICE,
            getValue: (hass: HomeAssistant, plant: HomeAssistantEntity) => getEntityState(hass, plant, 'number', `max_${sensor}`)
        }
    ]),

    // Details group
    {
        id: 'timestamp',
        name: 'Zeitstempel',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'none' as ClickAction,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.timestamp || ''
    },
    {
        id: 'difficulty',
        name: 'Schwierigkeit',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.difficulty || ''
    },
    {
        id: 'yield',
        name: 'Ertrag',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.yield || ''
    },
    {
        id: 'mold_resistance',
        name: 'Schimmelresistenz',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.mold_resistance || ''
    },
    {
        id: 'hunger',
        name: 'Hunger',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.hunger || ''
    },
    {
        id: 'effects',
        name: 'Effekte',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.effects || ''
    },
    {
        id: 'smell',
        name: 'Geruch',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.smell || ''
    },
    {
        id: 'taste',
        name: 'Geschmack',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.taste || ''
    },
    {
        id: 'phenotype',
        name: 'Phänotyp',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.phenotype || ''
    },
    {
        id: 'growth_stretch',
        name: 'Wachstumsdehnung',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.growth_stretch || ''
    },
    {
        id: 'flower_stretch',
        name: 'Blütendehnung',
        group: 'details',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.flower_stretch || ''
    },

    // Notes group
    {
        id: 'notes',
        name: 'Notizen',
        group: 'notes',
        type: 'textarea' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.notes || ''
    },
    {
        id: 'website',
        name: 'Website',
        group: 'notes',
        type: 'text' as FieldType,
        clickAction: 'edit' as ClickAction,
        service: PLANT_ATTRIBUTE_SERVICE,
        getValue: (_: HomeAssistant, plant: HomeAssistantEntity) => plant.attributes.website || '',
        hasExternalLink: true
    }
];

export const getFieldDefinition = (id: string): FieldDefinition | undefined => {
    return FIELD_DEFINITIONS.find(field => field.id === id);
};

export const getFieldsByGroup = (group: string): FieldDefinition[] => {
    return FIELD_DEFINITIONS.filter(field => field.group === group);
};

export const isFieldEditable = (id: string): boolean => {
    return getFieldDefinition(id)?.clickAction === 'edit';
};

export const getFieldType = (id: string): string => {
    return getFieldDefinition(id)?.type || 'text';
};

export const getFieldService = (id: string): FieldService | undefined => {
    return getFieldDefinition(id)?.service;
};

export const isSensorField = (id: string): boolean => {
    return getFieldDefinition(id)?.isSensor || false;
};

export const getFieldValue = (id: string, hass: HomeAssistant, plant: HomeAssistantEntity): string | number => {
    const field = getFieldDefinition(id);
    if (!field) return '';
    
    if (field.getValue) {
        return field.getValue(hass, plant);
    }
    
    return plant.attributes[id]?.toString() || '';
};

export const getFieldOptions = (id: string, hass: HomeAssistant, plant: HomeAssistantEntity): string[] => {
    const field = getFieldDefinition(id);
    if (!field?.options) return [];
    
    return field.options(hass, plant);
}; 