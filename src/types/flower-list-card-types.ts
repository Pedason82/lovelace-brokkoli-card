import { HassEntity } from 'home-assistant-js-websocket';

export interface HomeAssistantEntity extends HassEntity {
    attributes: {
        friendly_name?: string;
        entity_picture?: string;
        strain?: string;
        breeder?: string;
        feminized?: string;
        effects?: string;
        smell?: string;
        taste?: string;
        phenotype?: string;
        hunger?: string;
        growth_stretch?: string;
        flower_stretch?: string;
        mold_resistance?: string;
        difficulty?: string;
        yield?: string;
        notes?: string;
        website?: string;
        unit_of_measurement?: string;
        [key: string]: any;
    };
    area_id?: string;
}

export interface FlowerListCardConfig {
    type: string;
    show_columns: {
        name: boolean;
        basic: boolean;
        growing: boolean;
        genetics: boolean;
        characteristics: boolean;
        growth: boolean;
        metrics: boolean;
        sensors: boolean;
        diagnostics: boolean;
        min_max: boolean;
        details: boolean;
        notes: boolean;
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