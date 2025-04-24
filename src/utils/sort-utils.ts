import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { getFieldDefinition, getFieldValue } from './field-definitions';

export class SortUtils {
    static getSortedPlants(
        plants: HomeAssistantEntity[],
        sortColumn: string,
        sortDirection: 'asc' | 'desc',
        hass: HomeAssistant
    ): HomeAssistantEntity[] {
        return [...plants].sort((a, b) => {
            const aValue = getFieldValue(sortColumn, hass, a);
            const bValue = getFieldValue(sortColumn, hass, b);

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            
            return sortDirection === 'asc'
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        });
    }
} 