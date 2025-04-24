import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { isSensorField, getFieldDefinition } from './field-definitions';

export interface SensorInfo {
    value: number;
    unit: string;
    state: string;
    min?: number | null;
    max?: number | null;
}

export class SensorUtils {
    static getSensorInfo(hass: HomeAssistant, plant: HomeAssistantEntity, sensorId: string): SensorInfo {
        const field = getFieldDefinition(sensorId);
        
        // Nur Entity-ID aus Sensor-Map verwenden
        if (plant.attributes._sensorMap && plant.attributes._sensorMap[sensorId]) {
            const entityId = plant.attributes._sensorMap[sensorId];
            const entity = hass?.states[entityId];
            
            if (entity) {
                return {
                    value: Number(entity.state) || 0,
                    state: entity.state,
                    unit: field?.unit || entity.attributes.unit_of_measurement || '',
                    min: entity.attributes.min_value,
                    max: entity.attributes.max_value
                };
            }
        }
        
        // Prüfen, ob wir API-Infos haben
        if (plant.attributes._apiInfo) {
            const apiInfo = plant.attributes._apiInfo;
            
            // Mapping von Kartenattributen zu API-Attributen
            const apiSensorMap: Record<string, string> = {
                "soil_moisture": "moisture",
                "air_humidity": "humidity",
                "total_ppfd_mol_integral": "total_integral",
                "total_water_consumption": "total_water",
                "total_fertilizer_consumption": "total_fertilizer"
            };
            
            const apiSensorId = apiSensorMap[sensorId] || sensorId;
            
            // Für Hauptsensoren (direkt im Root-Objekt)
            if (apiInfo[apiSensorId] && apiInfo[apiSensorId].current) {
                return {
                    value: Number(apiInfo[apiSensorId].current) || 0,
                    state: apiInfo[apiSensorId].current,
                    unit: field?.unit || apiInfo[apiSensorId].unit_of_measurement || '',
                    min: apiInfo[apiSensorId].min ? Number(apiInfo[apiSensorId].min) : null,
                    max: apiInfo[apiSensorId].max ? Number(apiInfo[apiSensorId].max) : null
                };
            }
            
            // Für Diagnosesensoren
            if (apiInfo.diagnostic_sensors && 
                apiInfo.diagnostic_sensors[apiSensorId] && 
                apiInfo.diagnostic_sensors[apiSensorId].current) {
                return {
                    value: Number(apiInfo.diagnostic_sensors[apiSensorId].current) || 0,
                    state: apiInfo.diagnostic_sensors[apiSensorId].current,
                    unit: field?.unit || apiInfo.diagnostic_sensors[apiSensorId].unit_of_measurement || '',
                    min: null,
                    max: null
                };
            }
        }
        
        // Wenn keine Entity-ID in der Sensor-Map oder API-Info, gib leeren Status zurück
        return {
            value: 0,
            state: 'N/A',
            unit: field?.unit || '',
            min: null,
            max: null
        };
    }

    static getSensorRange(hass: HomeAssistant, plants: HomeAssistantEntity[], columnId: string): { min: number | null; max: number | null; unit: string } {
        const field = getFieldDefinition(columnId);
        
        return {
            min: null,
            max: null,
            unit: field?.unit || ''
        };
    }

    static getSensorThresholds(hass: HomeAssistant, plant: HomeAssistantEntity, columnId: string): { min: number; max: number } {
        // Prüfen, ob wir API-Infos haben
        if (plant.attributes._apiInfo) {
            const apiInfo = plant.attributes._apiInfo;
            
            // Mapping von Kartenattributen zu API-Attributen
            const apiColumnMap: Record<string, string> = {
                "soil_moisture": "moisture",
                "air_humidity": "humidity",
                "total_ppfd_mol_integral": "total_integral",
                "total_water_consumption": "total_water",
                "total_fertilizer_consumption": "total_fertilizer"
            };
            
            const apiColumnId = apiColumnMap[columnId] || columnId;
            
            // Für Hauptsensoren
            if (apiInfo[apiColumnId] && apiInfo[apiColumnId].min !== undefined && apiInfo[apiColumnId].max !== undefined) {
                return {
                    min: Number(apiInfo[apiColumnId].min) || 0,
                    max: Number(apiInfo[apiColumnId].max) || 100
                };
            }
        }
        
        // Prüfen, ob wir eine Sensor-Map für die Min/Max-Helper haben
        if (plant.attributes._sensorMap) {
            const minEntityId = plant.attributes._sensorMap[`min_${columnId}`];
            const maxEntityId = plant.attributes._sensorMap[`max_${columnId}`];
            
            if (minEntityId && maxEntityId && 
                hass.states[minEntityId]?.state !== 'unavailable' && 
                hass.states[maxEntityId]?.state !== 'unavailable') {
                return {
                    min: Number(hass.states[minEntityId].state) || 0,
                    max: Number(hass.states[maxEntityId].state) || 100
                };
            }
        }
        
        // Standard-Werte, wenn nichts gefunden wurde
        return { min: 0, max: 100 };
    }

    static isSensorColumn(columnId: string): boolean {
        return isSensorField(columnId);
    }

    static calculateSensorStatus(value: number, min: number, max: number): 'good' | 'bad' | 'unavailable' {
        if (isNaN(value)) return 'unavailable';
        return value >= min && value <= max ? 'good' : 'bad';
    }
} 