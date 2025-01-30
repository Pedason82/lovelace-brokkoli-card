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
        samen_beginn?: string;
        keimen_beginn?: string;
        wurzeln_beginn?: string;
        wachstum_beginn?: string;
        blüte_beginn?: string;
        entfernt?: string;
        geerntet?: string;
        samen_dauer?: number;
        keimen_dauer?: number;
        wurzeln_dauer?: number;
        wachstum_dauer?: number;
        blüte_dauer?: number;
        entfernt_dauer?: number;
        geerntet_dauer?: number;
        [key: string]: any;
    };
    area_id?: string;
}

export interface FlowerListCardConfig {
    type: string;
    title?: string;
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
    show_columns: {
        name: boolean;
        basic: boolean;
        growing: boolean;
        genetics: boolean;
        phasebegin: boolean;
        phasedauer: boolean;
        metrics: boolean;
        soil_moisture: boolean;
        temperature: boolean;
        conductivity: boolean;
        illuminance: boolean;
        air_humidity: boolean;
        dli: boolean;
        ppfd: boolean;
        total_ppfd: boolean;
        water_consumption: boolean;
        fertilizer_consumption: boolean;
        total_water_consumption: boolean;
        total_fertilizer_consumption: boolean;
        min_max: boolean;
        details: boolean;
        notes: boolean;
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