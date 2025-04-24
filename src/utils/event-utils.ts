import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { getFieldDefinition, getFieldService, getFieldValue } from './field-definitions';
import { PlantEntityUtils } from './plant-entity-utils';

export interface EditingCell {
    entityId: string;
    column: string;
}

export interface EventHandlerOptions {
    hass: HomeAssistant;
    plant: HomeAssistantEntity;
    columnId: string;
    multiSelectMode: boolean;
    selectedPlants: Set<string>;
    editingCell: EditingCell | null;
    onUpdate: () => void;
}

export class EventUtils {
    static async handleInputUpdate(
        event: Event | KeyboardEvent,
        options: EventHandlerOptions,
        type: 'number' | 'select' | 'text' | 'date'
    ): Promise<void> {
        if (event instanceof KeyboardEvent && event.key === 'Escape') {
            options.onUpdate();
            return;
        }

        if (event instanceof KeyboardEvent && event.key !== 'Enter' && type !== 'select') {
            return;
        }

        const input = event.target as HTMLInputElement | HTMLSelectElement;
        let value: string | number = input.value;

        if (type === 'number') {
            const field = getFieldDefinition(options.columnId);
            const numberType = field?.validation?.numberType || 'integer';
            value = numberType === 'integer' ? parseInt(value) : parseFloat(value);
            if (isNaN(value)) return;
        }

        try {
            if (options.multiSelectMode && options.selectedPlants.size > 0) {
                await this.applyBulkUpdate(value, options.columnId, options);
            } else {
                await this.applySingleUpdate(value, options);
            }
            options.onUpdate();
        } catch (error) {
            console.error(`Fehler beim Aktualisieren von ${options.columnId}:`, error);
        }
    }

    private static async applyBulkUpdate(
        value: string | number,
        columnId: string,
        options: EventHandlerOptions
    ): Promise<void> {
        const { hass, selectedPlants } = options;
        
        for (const entityId of selectedPlants) {
            await this.applySingleUpdate(value, {
                ...options,
                plant: hass.states[entityId] as HomeAssistantEntity
            });
        }
    }

    private static async applySingleUpdate(
        value: string | number,
        options: EventHandlerOptions
    ): Promise<void> {
        const { hass, plant, columnId } = options;
        const field = getFieldDefinition(columnId);
        const service = field?.service;

        if (!service) return;

        if (service.action === 'move_to_area') {
            // Erstelle ein künstliches Event für handleAreaUpdate
            const event = new Event('change');
            Object.defineProperty(event, 'target', {
                value: { value: value.toString() }
            });
            await EventUtils.handleAreaUpdate(event, options);
            return;
        }

        // Verwende ausschließlich die Entity-ID aus der Sensor-Map
        if (service.entityPrefix && plant.attributes._sensorMap && plant.attributes._sensorMap[columnId]) {
            const entityId = plant.attributes._sensorMap[columnId];
            const serviceParams: Record<string, any> = {
                entity_id: entityId
            };

            if (service.valueKey) {
                serviceParams[service.valueKey] = value;
            } else {
                serviceParams[columnId] = value;
            }

            await hass.callService(service.domain, service.action, serviceParams);
        } else {
            // Wenn keine Sensor-Map-Eintrag vorhanden ist, verwenden wir die Plant-Entity für Attribute
            // direkt auf der Pflanze
            const serviceParams: Record<string, any> = {
                entity_id: plant.entity_id
            };

            if (service.valueKey) {
                serviceParams[service.valueKey] = value;
            } else {
                serviceParams[columnId] = value;
            }

            await hass.callService(service.domain, service.action, serviceParams);
        }
    }

    static async handleAreaUpdate(
        event: Event,
        options: EventHandlerOptions
    ): Promise<void> {
        const { hass, plant, multiSelectMode, selectedPlants } = options;
        const select = event.target as HTMLSelectElement;
        const areaName = select.value;
        const areaId = Object.entries(hass.areas || {}).find(([_, area]) => area.name === areaName)?.[0];

        if (multiSelectMode && selectedPlants.size > 0) {
            for (const entityId of selectedPlants) {
                const entity = hass.entities[entityId];
                if (entity?.device_id) {
                    await hass.callService('plant', 'move_to_area', {
                        device_id: entity.device_id,
                        area_id: areaId || null
                    });
                }
            }
        } else {
            const entity = hass.entities[plant.entity_id];
            if (entity?.device_id) {
                await hass.callService('plant', 'move_to_area', {
                    device_id: entity.device_id,
                    area_id: areaId || null
                });
            }
        }

        options.onUpdate();
    }

    static handleSearch(event: Event, onSearch: (query: string) => void): void {
        const input = event.target as HTMLInputElement;
        onSearch(input.value.toLowerCase());
    }

    static handleRowClick(
        event: Event,
        plant: HomeAssistantEntity,
        columnId: string,
        showMoreInfo: (entityId: string) => void
    ): void {
        event.stopPropagation();
        const field = getFieldDefinition(columnId);

        if (!field) {
            showMoreInfo(plant.entity_id);
            return;
        }

        // Nur Entity-ID aus Sensor-Map verwenden, keine Fallbacks
        if (plant.attributes._sensorMap && plant.attributes._sensorMap[columnId]) {
            const entityId = plant.attributes._sensorMap[columnId];
            showMoreInfo(entityId);
            return;
        }

        // Wenn keine Entity-ID in der Sensor-Map vorhanden ist, zeige die Pflanze direkt an
        showMoreInfo(plant.entity_id);
    }

    static handleInputEvent(
        event: Event | KeyboardEvent,
        type: 'number' | 'select' | 'text' | 'date',
        columnId: string
    ): string | number | undefined {
        const input = event.target as HTMLInputElement;
        let value: string | number = input.value;

        if (type === 'number') {
            const field = getFieldDefinition(columnId);
            const numberType = field?.validation?.numberType || 'integer';
            value = numberType === 'integer' ? parseInt(value) : parseFloat(value);
            if (isNaN(value)) return;
        }

        return value;
    }
} 