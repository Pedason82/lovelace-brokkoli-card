import { BrokkoliListCardConfig } from '../types/brokkoli-list-card-types';
import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { getFieldDefinition, getFieldsByGroup, FIELD_DEFINITIONS } from './field-definitions';

export class ConfigUtils {
    static readonly EDITABLE_PLANT_ATTRIBUTES = FIELD_DEFINITIONS
        .filter(field => field.clickAction === 'edit')
        .map(field => field.id);

    private static getDefaultShowColumns(): Record<string, boolean> {
        // Sammle alle einzigartigen Gruppen
        const groups = new Set(FIELD_DEFINITIONS.map(field => field.group));
        
        // Erstelle ein Objekt mit allen Gruppen und Sensor-IDs
        const showColumns: Record<string, boolean> = {};
        
        // Setze Standardwerte für Gruppen
        groups.forEach(group => {
            showColumns[group] = group !== 'min_max' && group !== 'metrics';
        });

        // Setze Standardwerte für Sensor-Spalten
        FIELD_DEFINITIONS
            .filter(field => field.type === 'sensor')
            .forEach(field => {
                showColumns[field.id] = true;
            });

        return showColumns;
    }

    static getDefaultConfig(): BrokkoliListCardConfig {
        return {
            type: 'custom:brokkoli-list-card',
            title: 'Pflanzenübersicht',
            search: {
                enabled: true,
                placeholder: 'Suche nach Pflanzen...'
            },
            multiselect: {
                enabled: false,
                showbydefault: false
            },
            filter: {
                enabled: true,
                showbydefault: false
            },
            add_plant: {
                enabled: true,
                position: 'bottom'
            },
            show_columns: {
                friendly_name: true,
                state: true,
                area: true,
                moisture: true,
                temperature: true,
                brightness: false,
                conductivity: false,
                fertility: false,
                humidity: false,
                health: true,
                dew_point: false,
                battery: false,
                growth_phase: false,
                lifecycle: false,
                pot_size: false,
                sensor_ph: false,
                nitrogen: false,
                phosphorus: false,
                potassium: false,
                total_ppfd_mol_integral: false,
                total_water_consumption: false,
                total_fertilizer_consumption: false,
                website: false,
                flowering_duration: false,
                harvest_ready: false,
                harvest_date: false,
                images: false,
                notes: false,
                cycle: false,
                variant: false
            }
        };
    }

    static getVisibleColumns(config: BrokkoliListCardConfig | undefined): Array<{id: string, name: string, group: string}> {
        const showColumns = config?.show_columns || this.getDefaultConfig().show_columns;
        
        // Erstelle eine Map aller verfügbaren Spalten für schnellen Zugriff
        const columnMap = new Map<string, {id: string, name: string, group: string}>(
            FIELD_DEFINITIONS.map(field => [field.id, { id: field.id, name: field.name, group: field.group }])
        );
        
        // Erstelle eine Map aller Spaltengruppen für schnellen Zugriff
        const groupMap = new Map<string, Array<{id: string, name: string, group: string}>>();
        FIELD_DEFINITIONS.forEach(field => {
            if (!groupMap.has(field.group)) {
                groupMap.set(field.group, []);
            }
            groupMap.get(field.group)!.push({ id: field.id, name: field.name, group: field.group });
        });

        const visibleColumns: Array<{id: string, name: string, group: string}> = [];
        
        // Iteriere durch die Konfiguration in der Reihenfolge
        for (const [key, value] of Object.entries(showColumns)) {
            if (value) {
                // Wenn es eine Gruppe ist
                if (groupMap.has(key)) {
                    visibleColumns.push(...groupMap.get(key)!);
                }
                // Wenn es eine Spalten-ID ist
                else if (columnMap.has(key)) {
                    visibleColumns.push(columnMap.get(key)!);
                }
            }
        }

        return visibleColumns;
    }

    static getAllAvailableColumns(): string[] {
        return FIELD_DEFINITIONS.map(field => field.id);
    }
} 