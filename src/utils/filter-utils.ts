import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { SensorUtils } from './sensor-utils';
import { getFieldDefinition, getFieldValue, isSensorField } from './field-definitions';

export interface FilterState {
    entityTypes: Set<string>;
    activeFilters: {
        [key: string]: Set<string> | { min: number; max: number };
    };
}

export class FilterUtils {
    static getEntityValue(hass: HomeAssistant, plant: HomeAssistantEntity, column: string): string {
        return getFieldValue(column, hass, plant).toString();
    }

    static getUniqueValues(hass: HomeAssistant, plants: HomeAssistantEntity[], column: string): string[] {
        return [...new Set(plants.map(plant => this.getEntityValue(hass, plant, column)))].sort();
    }

    static getAreaForEntity(hass: HomeAssistant, entityId: string): string | undefined {
        if (!hass) return undefined;
        
        const areaRegistry = hass.areas || {};
        const deviceRegistry = hass.devices || {};
        const entityRegistry = hass.entities || {};
        
        const entityEntry = entityRegistry[entityId];
        if (!entityEntry) return undefined;

        if (entityEntry.area_id) {
            return entityEntry.area_id;
        }

        if (entityEntry.device_id) {
            const deviceEntry = deviceRegistry[entityEntry.device_id];
            if (deviceEntry?.area_id) {
                return deviceEntry.area_id;
            }
        }

        return undefined;
    }

    static applyFilters(
        hass: HomeAssistant,
        plants: HomeAssistantEntity[],
        filterState: FilterState
    ): HomeAssistantEntity[] {
        // Filtern nach Entity-Typ
        let filteredPlants = plants.filter(plant => {
            const entityType = plant.entity_id.split('.')[0];
            return filterState.entityTypes.has(entityType);
        });

        // Anwenden der aktiven Filter
        if (Object.keys(filterState.activeFilters).length > 0) {
            filteredPlants = filteredPlants.filter(plant => {
                return Object.entries(filterState.activeFilters).every(([column, filter]) => {
                    if (column === 'entity_type') return true; // Bereits behandelt
                    
                    if (isSensorField(column)) {
                        const sensorInfo = SensorUtils.getSensorInfo(hass, plant, column);
                        const range = filter as { min: number; max: number };
                        return sensorInfo.value >= range.min && sensorInfo.value <= range.max;
                    }

                    const currentValue = this.getEntityValue(hass, plant, column);
                    return (filter as Set<string>).has(currentValue);
                });
            });
        }

        return filteredPlants;
    }

    static toggleFilter(
        column: string,
        value: string | { min: number; max: number },
        filterState: FilterState
    ): void {
        if (isSensorField(column)) {
            filterState.activeFilters[column] = value as { min: number; max: number };
            if (!filterState.activeFilters[column]) {
                delete filterState.activeFilters[column];
            }
        } else {
            if (!filterState.activeFilters[column]) {
                filterState.activeFilters[column] = new Set();
            }
            const filter = filterState.activeFilters[column] as Set<string>;
            if (filter.has(value as string)) {
                filter.delete(value as string);
                if (filter.size === 0) {
                    delete filterState.activeFilters[column];
                }
            } else {
                filter.add(value as string);
            }
        }
    }

    static toggleEntityType(type: string, filterState: FilterState): void {
        if (filterState.entityTypes.has(type)) {
            // Nur löschen wenn mindestens ein Typ übrig bleibt
            if (filterState.entityTypes.size > 1) {
                filterState.entityTypes.delete(type);
            }
        } else {
            filterState.entityTypes.add(type);
        }
    }

    static getFilteredPlants(
        hass: HomeAssistant,
        plants: HomeAssistantEntity[],
        filterState: FilterState,
        searchQuery: string,
        editablePlantAttributes: string[]
    ): HomeAssistantEntity[] {
        let filteredPlants = FilterUtils.applyFilters(hass, plants, filterState);

        // Anwenden der Suchfilterung
        if (searchQuery) {
            filteredPlants = filteredPlants.filter(plant => {
                const searchableValues = [
                    getFieldValue('friendly_name', hass, plant),
                    getFieldValue('state', hass, plant),
                    getFieldValue('area', hass, plant),
                    ...editablePlantAttributes.map(attr => getFieldValue(attr, hass, plant))
                ].filter(Boolean);

                return searchableValues.some(value => 
                    value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        }

        return filteredPlants;
    }
} 