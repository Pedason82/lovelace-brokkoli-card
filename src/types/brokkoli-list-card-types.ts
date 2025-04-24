import { HassEntity } from 'home-assistant-js-websocket';
import { FIELD_DEFINITIONS } from '../utils/field-definitions';

// Generiere die Attributtypen aus den Felddefinitionen
type GeneratedAttributes = {
    [K in typeof FIELD_DEFINITIONS[number]['id']]?: 
        typeof FIELD_DEFINITIONS[number] extends { id: K, type: 'number' } ? number :
        typeof FIELD_DEFINITIONS[number] extends { id: K, type: 'date' } ? string :
        string;
};

export interface HomeAssistantEntity extends HassEntity {
    attributes: GeneratedAttributes & {
        friendly_name?: string;
        entity_picture?: string;
        unit_of_measurement?: string;
        _sensorMap?: Record<string, string>;
        _apiInfo?: any;
        [key: string]: any;
    };
    area_id?: string;
}

export interface BrokkoliListCardConfig {
    type: string;
    title?: string;
    area?: string;
    identifier?: string;
    search?: {
        enabled: boolean;
        placeholder: string;
    };
    multiselect?: {
        enabled: boolean;
        showbydefault: boolean;
    };
    filter?: {
        enabled: boolean;
        showbydefault: boolean;
        filters?: {
            [key: string]: string[] | { min: number; max: number };
        };
    };
    add_plant?: {
        enabled: boolean;
        position: 'top' | 'bottom';
    };
    show_columns: {
        [key: string]: boolean;
    };
}

export interface HomeAssistantArea {
    name: string;
    picture?: string;
}

export interface HomeAssistantDevice {
    id: string;
    area_id?: string;
    name_by_user?: string;
    name?: string;
}

export interface HomeAssistantEntityRegistryEntry {
    entity_id: string;
    device_id?: string;
    area_id?: string;
    name?: string;
}

declare module 'custom-card-helpers' {
    interface HomeAssistant {
        areas: { [key: string]: HomeAssistantArea };
        devices: { [key: string]: HomeAssistantDevice };
        entities: { [key: string]: HomeAssistantEntityRegistryEntry };
    }
} 