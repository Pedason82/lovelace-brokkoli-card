import { ConfigUtils } from './config-utils';
import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { FilterUtils } from './filter-utils';
import { getFieldDefinition, getFieldType, isFieldEditable, getFieldValue, ClickAction } from './field-definitions';

export class CellTypeUtils {
    static getClickAction(columnId: string): ClickAction {
        const field = getFieldDefinition(columnId);
        return field?.clickAction || 'none';
    }

    static getCursorStyle(columnId: string): string {
        const clickAction = this.getClickAction(columnId);
        
        switch(clickAction) {
            case 'more-info':
            case 'edit':
                return 'pointer';
            default:
                return 'default';
        }
    }

    static isDateInput(columnId: string): boolean {
        return getFieldType(columnId) === 'date';
    }

    static isDurationInput(columnId: string): boolean {
        return columnId.endsWith('_dauer');
    }

    static isNumberInput(columnId: string): boolean {
        return getFieldType(columnId) === 'number';
    }

    static isSelectInput(columnId: string): boolean {
        return getFieldType(columnId) === 'select';
    }

    static isTextInput(columnId: string): boolean {
        return getFieldType(columnId) === 'text';
    }

    static isTextArea(columnId: string): boolean {
        return getFieldType(columnId) === 'textarea';
    }

    static getCycleOptions(hass: HomeAssistant, plant: any): string[] {
        // Verwende ausschließlich die Sensor-Map
        if (plant.attributes?._sensorMap && plant.attributes._sensorMap['cycle']) {
            const entityId = plant.attributes._sensorMap['cycle'];
            const entity = hass?.states[entityId];
            return entity?.attributes?.options || [];
        }
        
        // Wenn keine Sensor-Map verfügbar, leeres Array zurückgeben
        return [];
    }

    static getGrowthPhaseOptions(hass: HomeAssistant, plant: any): string[] {
        // Verwende ausschließlich die Sensor-Map
        if (plant.attributes?._sensorMap && plant.attributes._sensorMap['growth_phase']) {
            const entityId = plant.attributes._sensorMap['growth_phase'];
            const entity = hass?.states[entityId];
            return entity?.attributes?.options || [];
        }
        
        // Wenn keine Sensor-Map verfügbar, leeres Array zurückgeben
        return [];
    }

    static getAreaOptions(hass: HomeAssistant): string[] {
        if (!hass) return [];
        const areas = Object.values(hass.areas || {});
        return areas.map(area => area.name).sort();
    }

    static formatNumber(value: string | number, decimals: number = 2): string {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '-';
        return num.toFixed(decimals);
    }

    static getSearchableValue(hass: HomeAssistant, plant: HomeAssistantEntity, columnId: string): string {
        return getFieldValue(columnId, hass, plant).toString();
    }
} 