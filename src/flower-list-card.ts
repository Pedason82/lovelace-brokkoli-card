import { CSSResult, HTMLTemplateResult, LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { style } from './styles';
import { FlowerListCardConfig, HomeAssistantEntity } from './types/flower-list-card-types';
import * as packageJson from '../package.json';

console.info(
    `%c FLOWER-LIST-CARD %c ${packageJson.version}`,
    'color: cyan; background: black; font-weight: bold;',
    'color: darkblue; background: white; font-weight: bold;'
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'flower-list-card',
    name: 'Flower List Card',
    preview: true,
    description: 'Eine tabellarische Übersicht aller Pflanzen',
});

@customElement('flower-list-card')
export default class FlowerListCard extends LitElement {
    @property() _hass?: HomeAssistant;
    @property() config?: FlowerListCardConfig;
    @state() private _sortColumn: string = 'friendly_name';
    @state() private _sortDirection: 'asc' | 'desc' = 'asc';
    @state() private _editingCell: {entityId: string, column: string} | null = null;
    @state() private _plantInfo: Map<string, any> = new Map();
    @state() private _searchQuery: string = '';
    @state() private _multiSelectMode: boolean = false;
    @state() private _selectedPlants: Set<string> = new Set();
    @state() private _filterMode = false;
    @state() private _activeFilters: { 
        [key: string]: Set<string> | { min: number; max: number } 
    } = {};
    @state() private _entityTypes: Set<string> = new Set(['plant', 'cycle']);

    private plantEntities: HomeAssistantEntity[] = [];

    static getStubConfig(): FlowerListCardConfig {
        return {
            type: 'custom:flower-list-card',
            title: 'Pflanzenübersicht',
            search: {
                enabled: true,
                placeholder: 'Suche...'
            },
            multiselect: {
                enabled: true,
                showbydefault: false
            },
            filter: {
                enabled: true,
                showbydefault: false,
                filters: {}
            },
            show_columns: {
                name: true,
                basic: true,
                growing: true,
                genetics: true,
                phasebegin: true,
                phasedauer: true,
                metrics: false,
                soil_moisture: true,
                temperature: true,
                conductivity: true,
                illuminance: true,
                air_humidity: true,
                dli: true,
                ppfd: true,
                total_ppfd: true,
                water_consumption: true,
                fertilizer_consumption: true,
                total_water_consumption: true,
                total_fertilizer_consumption: true,
                min_max: false,
                details: true,
                notes: true
            }
        };
    }

    // Liste der editierbaren Plant-Attribute
    private readonly EDITABLE_PLANT_ATTRIBUTES = [
        'strain',
        'breeder',
        'original_flowering_duration',
        'pid',
        'sorte',
        'feminized',
        'effects',
        'smell',
        'taste',
        'phenotype',
        'hunger',
        'growth_stretch',
        'flower_stretch',
        'mold_resistance',
        'difficulty',
        'yield',
        'notes',
        'website',
        'samen_beginn',
        'keimen_beginn',
        'wurzeln_beginn',
        'wachstum_beginn',
        'blüte_beginn',
        'entfernt',
        'geerntet',
        'samen_dauer',
        'keimen_dauer',
        'wurzeln_dauer',
        'wachstum_dauer',
        'blüte_dauer',
        'entfernt_dauer',
        'geerntet_dauer'
    ];

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        this.updatePlantEntities();
    }

    private async updatePlantEntities(): Promise<void> {
        if (!this._hass) return;
        
        this.plantEntities = Object.values(this._hass.states)
            .filter((entity): entity is HomeAssistantEntity => 
                typeof entity === 'object' && 
                entity !== null && 
                'entity_id' in entity && 
                'attributes' in entity &&
                typeof entity.entity_id === 'string' && 
                (entity.entity_id.startsWith('plant.') || 
                (entity.entity_id.startsWith('cycle.') && 'member_count' in (entity.attributes as any)))
            );
        
        // Plant-Info für alle Entities laden
        for (const plant of this.plantEntities) {
            if (!this._plantInfo.has(plant.entity_id)) {
                const info = await this.get_plant_info(plant.entity_id);
                this._plantInfo.set(plant.entity_id, info);
            }
        }
        
        this.requestUpdate();
    }

    private handleSort(column: string): void {
        if (this._sortColumn === column) {
            this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this._sortColumn = column;
            this._sortDirection = 'asc';
        }
        this.requestUpdate();
    }

    private getSortedPlants(): HomeAssistantEntity[] {
        return [...this.plantEntities].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (this._sortColumn) {
                case 'friendly_name':
                    aValue = a.attributes.friendly_name;
                    bValue = b.attributes.friendly_name;
                    break;
                case 'state':
                    aValue = a.state;
                    bValue = b.state;
                    break;
                case 'area':
                    const aAreaId = this.getAreaForEntity(a.entity_id);
                    const bAreaId = this.getAreaForEntity(b.entity_id);
                    aValue = aAreaId && this._hass?.areas[aAreaId]?.name || '';
                    bValue = bAreaId && this._hass?.areas[bAreaId]?.name || '';
                    break;
                case 'growth_phase':
                    const aPlantId = a.entity_id.split('.')[1];
                    const bPlantId = b.entity_id.split('.')[1];
                    aValue = this._hass?.states[`select.${aPlantId}_growth_phase`]?.state || '';
                    bValue = this._hass?.states[`select.${bPlantId}_growth_phase`]?.state || '';
                    break;
                case 'cycle':
                    const aCycleId = a.entity_id.split('.')[1];
                    const bCycleId = b.entity_id.split('.')[1];
                    aValue = this._hass?.states[`select.${aCycleId}_cycle`]?.state || '';
                    bValue = this._hass?.states[`select.${bCycleId}_cycle`]?.state || '';
                    break;
                case 'pot_size':
                case 'flowering_duration':
                    const aPotId = a.entity_id.split('.')[1];
                    const bPotId = b.entity_id.split('.')[1];
                    aValue = Number(this._hass?.states[`number.${aPotId}_${this._sortColumn}`]?.state || 0);
                    bValue = Number(this._hass?.states[`number.${bPotId}_${this._sortColumn}`]?.state || 0);
                    break;
                case 'soil_moisture':
                case 'temperature':
                case 'conductivity':
                case 'illuminance':
                case 'air_humidity':
                case 'dli':
                case 'ppfd':
                case 'total_ppfd':
                case 'water_consumption':
                case 'fertilizer_consumption':
                    const aSensorName = a.entity_id.split('.')[1];
                    const bSensorName = b.entity_id.split('.')[1];
                    const sensorSuffix = this._sortColumn === 'ppfd' ? 'ppfd_mol' :
                                       this._sortColumn === 'total_ppfd' ? 'total_ppfd_mol_integral' :
                                       this._sortColumn;
                    aValue = Number(this._hass?.states[`sensor.${aSensorName}_${sensorSuffix}`]?.state || 0);
                    bValue = Number(this._hass?.states[`sensor.${bSensorName}_${sensorSuffix}`]?.state || 0);
                    break;
                case 'min_air_humidity':
                case 'max_air_humidity':
                case 'min_soil_moisture':
                case 'max_soil_moisture':
                case 'min_temperature':
                case 'max_temperature':
                case 'min_conductivity':
                case 'max_conductivity':
                case 'min_illuminance':
                case 'max_illuminance':
                case 'min_dli':
                case 'max_dli':
                    const aHelperName = a.entity_id.split('.')[1];
                    const bHelperName = b.entity_id.split('.')[1];
                    aValue = Number(this._hass?.states[`number.${aHelperName}_${this._sortColumn}`]?.state || 0);
                    bValue = Number(this._hass?.states[`number.${bHelperName}_${this._sortColumn}`]?.state || 0);
                    break;
                default:
                    aValue = a.attributes[this._sortColumn] || '';
                    bValue = b.attributes[this._sortColumn] || '';
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this._sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
            
            return this._sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
    }

    private getAllAvailableColumns(): Array<{id: string, name: string, group: string}> {
        const columns = [];

        // Name group
        columns.push(
            { id: 'friendly_name', name: 'Name', group: 'name' }
        );

        // Basic group
        columns.push(
            { id: 'state', name: 'Status', group: 'basic' }
        );

        // Growing group
        columns.push(
            { id: 'area', name: 'Bereich', group: 'growing' },
            { id: 'growth_phase', name: 'Phase', group: 'growing' },
            { id: 'cycle', name: 'Durchgang', group: 'growing' },
            { id: 'pot_size', name: 'Topfgröße', group: 'growing' },
            { id: 'flowering_duration', name: 'Blütezeit', group: 'growing' }
        );

        // Genetics group
        columns.push(
            { id: 'strain', name: 'Sorte', group: 'genetics' },
            { id: 'breeder', name: 'Züchter', group: 'genetics' },
            { id: 'feminized', name: 'Feminisiert', group: 'genetics' },
            { id: 'original_flowering_duration', name: 'Original Blütezeit', group: 'genetics' }
        );

        // Phase Begin group
        columns.push(
            { id: 'samen_beginn', name: 'Samen Start', group: 'phasebegin' },
            { id: 'keimen_beginn', name: 'Keimen Start', group: 'phasebegin' },
            { id: 'wurzeln_beginn', name: 'Wurzeln Start', group: 'phasebegin' },
            { id: 'wachstum_beginn', name: 'Wachstum Start', group: 'phasebegin' },
            { id: 'blüte_beginn', name: 'Blüte Start', group: 'phasebegin' },
            { id: 'entfernt', name: 'Entfernt', group: 'phasebegin' },
            { id: 'geerntet', name: 'Geerntet', group: 'phasebegin' }
        );

        // Phase Duration group
        columns.push(
            { id: 'samen_dauer', name: 'Samen Dauer', group: 'phasedauer' },
            { id: 'keimen_dauer', name: 'Keimen Dauer', group: 'phasedauer' },
            { id: 'wurzeln_dauer', name: 'Wurzeln Dauer', group: 'phasedauer' },
            { id: 'wachstum_dauer', name: 'Wachstum Dauer', group: 'phasedauer' },
            { id: 'blüte_dauer', name: 'Blüte Dauer', group: 'phasedauer' },
            { id: 'entfernt_dauer', name: 'Entfernt Dauer', group: 'phasedauer' },
            { id: 'geerntet_dauer', name: 'Geerntet Dauer', group: 'phasedauer' }
        );

        // Sensors group
        columns.push(
            { id: 'soil_moisture', name: 'Feuchtigkeit', group: 'sensors' },
            { id: 'temperature', name: 'Temperatur', group: 'sensors' },
            { id: 'conductivity', name: 'Leitfähigkeit', group: 'sensors' },
            { id: 'illuminance', name: 'Beleuchtung', group: 'sensors' },
            { id: 'air_humidity', name: 'Luftfeuchtigkeit', group: 'sensors' },
            { id: 'dli', name: 'DLI', group: 'sensors' },
            { id: 'water_consumption', name: 'Wasserverbrauch', group: 'sensors' },
            { id: 'fertilizer_consumption', name: 'Düngerverbrauch', group: 'sensors' },
            { id: 'health', name: 'Gesundheit', group: 'sensors' }
        );

        // Diagnostics group
        columns.push(
            { id: 'ppfd', name: 'PPFD', group: 'diagnostics' },
            { id: 'total_ppfd', name: 'Total PPFD', group: 'diagnostics' },
            { id: 'total_water_consumption', name: 'Gesamt Wasserverbrauch', group: 'diagnostics' },
            { id: 'total_fertilizer_consumption', name: 'Gesamt Düngerverbrauch', group: 'diagnostics' }
        );

        // Min/Max group
        columns.push(
            { id: 'max_air_humidity', name: 'Max Luftfeuchte', group: 'min_max' },
            { id: 'min_air_humidity', name: 'Min Luftfeuchte', group: 'min_max' },
            { id: 'max_soil_moisture', name: 'Max Bodenfeuchte', group: 'min_max' },
            { id: 'min_soil_moisture', name: 'Min Bodenfeuchte', group: 'min_max' },
            { id: 'max_temperature', name: 'Max Temp', group: 'min_max' },
            { id: 'min_temperature', name: 'Min Temp', group: 'min_max' },
            { id: 'max_conductivity', name: 'Max Leitfähigkeit', group: 'min_max' },
            { id: 'min_conductivity', name: 'Min Leitfähigkeit', group: 'min_max' },
            { id: 'max_illuminance', name: 'Max Beleuchtung', group: 'min_max' },
            { id: 'min_illuminance', name: 'Min Beleuchtung', group: 'min_max' },
            { id: 'max_dli', name: 'Max DLI', group: 'min_max' },
            { id: 'min_dli', name: 'Min DLI', group: 'min_max' },
            { id: 'max_water_consumption', name: 'Max Wasserverbrauch', group: 'min_max' },
            { id: 'min_water_consumption', name: 'Min Wasserverbrauch', group: 'min_max' },
            { id: 'max_fertilizer_consumption', name: 'Max Düngerverbrauch', group: 'min_max' },
            { id: 'min_fertilizer_consumption', name: 'Min Düngerverbrauch', group: 'min_max' }
        );

        // Details group
        columns.push(
            { id: 'timestamp', name: 'Zeitstempel', group: 'details' },
            { id: 'difficulty', name: 'Schwierigkeit', group: 'details' },
            { id: 'yield', name: 'Ertrag', group: 'details' },
            { id: 'mold_resistance', name: 'Schimmelresistenz', group: 'details' },
            { id: 'hunger', name: 'Hunger', group: 'details' },
            { id: 'effects', name: 'Effekte', group: 'details' },
            { id: 'smell', name: 'Geruch', group: 'details' },
            { id: 'taste', name: 'Geschmack', group: 'details' },
            { id: 'phenotype', name: 'Phänotyp', group: 'details' },
            { id: 'growth_stretch', name: 'Wachstumsdehnung', group: 'details' },
            { id: 'flower_stretch', name: 'Blütendehnung', group: 'details' }
        );

        // Metrics group
        columns.push(
            { id: 'moisture_status', name: 'St. Feuchtigkeit', group: 'metrics' },
            { id: 'temperature_status', name: 'St. Temperatur', group: 'metrics' },
            { id: 'conductivity_status', name: 'St. Leitfähigkeit', group: 'metrics' },
            { id: 'illuminance_status', name: 'St. Beleuchtung', group: 'metrics' },
            { id: 'humidity_status', name: 'St. Luftfeuchtigkeit', group: 'metrics' },
            { id: 'dli_status', name: 'St. DLI', group: 'metrics' }
        );

        // Notes group
        columns.push(
            { id: 'notes', name: 'Notizen', group: 'notes' },
            { id: 'website', name: 'Website', group: 'notes' }
        );

        return columns;
    }

    private getDefaultConfig(): FlowerListCardConfig {
        return {
            type: 'flower-list-card',
            title: 'Pflanzenübersicht',
            search: {
                enabled: true,
                placeholder: 'Suche...'
            },
            multiselect: {
                enabled: true,
                showbydefault: false
            },
            filter: {
                enabled: true,
                showbydefault: false,
                filters: {
                    entity_type: ['plant', 'cycle'],
                    state: ['ok', 'problem'],
                    soil_moisture: { min: 20, max: 80 }
                }
            },
            show_columns: {
                name: true,
                basic: true,
                growing: true,
                genetics: true,
                phasebegin: true,
                phasedauer: true,
                metrics: false,
                soil_moisture: true,
                temperature: true,
                conductivity: true,
                illuminance: true,
                air_humidity: true,
                dli: true,
                ppfd: true,
                total_ppfd: true,
                water_consumption: true,
                fertilizer_consumption: true,
                total_water_consumption: true,
                total_fertilizer_consumption: true,
                min_max: false,
                details: true,
                notes: true
            }
        };
    }

    setConfig(config: FlowerListCardConfig): void {
        this.config = {
            ...this.getDefaultConfig(),
            ...config
        };
    }

    private getVisibleColumns(): Array<{id: string, name: string, group: string}> {
        const allColumns = this.getAllAvailableColumns();
        const config = this.config?.show_columns || this.getDefaultConfig().show_columns;
        
        // Create a map of all available columns for quick lookup
        const columnMap = new Map<string, {id: string, name: string, group: string}>(
            allColumns.map(col => [col.id, col])
        );
        
        // Create a map of all column groups for quick lookup
        const groupMap = new Map<string, Array<{id: string, name: string, group: string}>>();
        allColumns.forEach(col => {
            if (!groupMap.has(col.group)) {
                groupMap.set(col.group, []);
            }
            groupMap.get(col.group)!.push(col);
        });

        const visibleColumns: Array<{id: string, name: string, group: string}> = [];
        
        // Iterate through the config in order
        for (const [key, value] of Object.entries(config)) {
            if (value) {
                // If it's a group
                if (groupMap.has(key)) {
                    visibleColumns.push(...groupMap.get(key)!);
                }
                // If it's a column ID
                else if (columnMap.has(key)) {
                    visibleColumns.push(columnMap.get(key)!);
                }
            }
        }

        return visibleColumns;
    }

    private handleCellClick(e: Event, plant: HomeAssistantEntity, columnId: string): void {
        e.stopPropagation();

        // Prüfe, ob die Spalte editierbar ist
        const isEditable = columnId === 'pot_size' || 
            columnId === 'growth_phase' || 
            columnId === 'cycle' || 
            columnId === 'area' || 
            columnId === 'flowering_duration' ||
            columnId.startsWith('min_') || 
            columnId.startsWith('max_') || 
            columnId.endsWith('_beginn') || 
            columnId === 'entfernt' || 
            columnId === 'geerntet' ||
            columnId.endsWith('_dauer') ||
            this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId);

        if (this._multiSelectMode && this._selectedPlants.size === 0) {
            // Wenn im Multiselect-Modus und keine Pflanzen ausgewählt sind, füge die aktuelle Pflanze hinzu
            this._selectedPlants.add(plant.entity_id);
        }

        if (isEditable) {
            this._editingCell = {
                entityId: plant.entity_id,
                column: columnId
            };
            this.requestUpdate();
        }
    }

    private handlePotSizeUpdate(event: KeyboardEvent, plant: HomeAssistantEntity) {
        if (event.key === 'Enter') {
            const input = event.target as HTMLInputElement;
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                if (this._multiSelectMode && this._selectedPlants.size > 0) {
                    this.applyBulkUpdate(value, 'pot_size');
                } else {
                    const plantId = plant.entity_id.split('.')[1];
                    this._hass?.callService('number', 'set_value', {
                        entity_id: `number.${plantId}_pot_size`,
                        value: value
                    });
                    this._editingCell = null;
                    this.requestUpdate();
                }
            }
        } else if (event.key === 'Escape') {
            this._editingCell = null;
            this.requestUpdate();
        }
    }

    private async handleGrowthPhaseUpdate(e: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = e.target as HTMLSelectElement;
        const value = select.value;

        if (this._multiSelectMode && this._selectedPlants.size > 0) {
            await this.applyBulkUpdate(value, 'growth_phase');
        } else {
            const plantName = plant.entity_id.split('.')[1];
            try {
                await this._hass?.callService('select', 'select_option', {
                    entity_id: `select.${plantName}_growth_phase`,
                    option: value
                });
                this._editingCell = null;
                this.requestUpdate();
            } catch (error) {
                console.error('Fehler beim Aktualisieren der Wachstumsphase:', error);
            }
        }
    }

    private getGrowthPhaseOptions(plantName: string): string[] {
        const entity = this._hass?.states[`select.${plantName}_growth_phase`];
        return entity?.attributes?.options || [];
    }

    private async handleCycleUpdate(e: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = e.target as HTMLSelectElement;
        const value = select.value;

        if (this._multiSelectMode && this._selectedPlants.size > 0) {
            await this.applyBulkUpdate(value, 'cycle');
        } else {
            const plantName = plant.entity_id.split('.')[1];
            try {
                await this._hass?.callService('select', 'select_option', {
                    entity_id: `select.${plantName}_cycle`,
                    option: value
                });
                this._editingCell = null;
                this.requestUpdate();
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Zyklus:', error);
            }
        }
    }

    private getCycleOptions(plantName: string): string[] {
        const entity = this._hass?.states[`select.${plantName}_cycle`];
        return entity?.attributes?.options || [];
    }

    private async handlePlantAttributeUpdate(e: KeyboardEvent | Event, plant: HomeAssistantEntity, columnId: string): Promise<void> {
        const isKeyboardEvent = e instanceof KeyboardEvent;
        
        if (isKeyboardEvent && e.key !== 'Enter') {
            if (e.key === 'Escape') {
                this._editingCell = null;
                this.requestUpdate();
            }
            return;
        }

        const input = e.target as HTMLInputElement | HTMLSelectElement;
        let value: string | number = input.value;

        // Konvertiere Zahlenwerte für Dauerattribute
        if (columnId.endsWith('_dauer')) {
            value = Number(value);
            if (isNaN(value)) return;
        }

        if (this._multiSelectMode && this._selectedPlants.size > 0) {
            await this.applyBulkUpdate(value, columnId);
        } else {
            try {
                const data: any = {
                    entity_id: plant.entity_id,
                    [columnId]: value
                };

                await this._hass?.callService('plant', 'update_plant_attributes', data);
                this._editingCell = null;
                this.requestUpdate();
            } catch (error) {
                console.error(`Fehler beim Aktualisieren von ${columnId}:`, error);
            }
        }
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            this._editingCell = null;
            this.requestUpdate();
        }
    }

    private formatNumber(value: string | number, decimals: number = 2): string {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '-';
        return num.toFixed(decimals);
    }

    private async handleHelperUpdate(e: KeyboardEvent, plant: HomeAssistantEntity, columnId: string): Promise<void> {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            const value = parseFloat(input.value);
            
            if (!isNaN(value)) {
                if (this._multiSelectMode && this._selectedPlants.size > 0) {
                    await this.applyBulkUpdate(value, columnId);
                } else {
                    const plantName = plant.entity_id.split('.')[1];
                    try {
                        await this._hass?.callService('number', 'set_value', {
                            entity_id: `number.${plantName}_${columnId}`,
                            value: value
                        });
                        this._editingCell = null;
                        this.requestUpdate();
                    } catch (error) {
                        console.error('Fehler beim Aktualisieren des Helpers:', error);
                    }
                }
            }
        } else if (e.key === 'Escape') {
            this._editingCell = null;
            this.requestUpdate();
        }
    }

    private async get_plant_info(plantEntityId: string): Promise<any> {
        try {
            return await this._hass?.callWS({
                type: "plant/get_info",
                entity_id: plantEntityId,
            });
        } catch (err) {
            return { result: {} };
        }
    }

    private getCellValue(plant: HomeAssistantEntity, columnId: string): string | HTMLTemplateResult {
        const plantName = plant.entity_id.split('.')[1];

        if (this._editingCell?.entityId === plant.entity_id && this._editingCell?.column === columnId) {
            // Datumspicker für Phasebegin-Attribute
            if (columnId.endsWith('_beginn') || columnId === 'entfernt' || columnId === 'geerntet') {
                const phaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
                const dateValue = phaseEntity?.attributes[columnId];
                return html`
                    <input
                        type="date"
                        .value="${dateValue?.split('T')[0] || ''}"
                        @change=${(e: Event) => this.handlePlantAttributeUpdate(e, plant, columnId)}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: 140px;"
                    >
                `;
            }

            // Zahleneingabe für Dauerattribute
            if (columnId.endsWith('_dauer')) {
                const phaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
                const duration = phaseEntity?.attributes[columnId];
                return html`
                    <input
                        type="number"
                        min="0"
                        .value="${duration || ''}"
                        @change=${(e: Event) => this.handlePlantAttributeUpdate(e, plant, columnId)}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: 80px;"
                    > Tage
                `;
            }

            if (columnId === 'pot_size' || columnId === 'flowering_duration') {
                const entity = this._hass?.states[`number.${plantName}_${columnId}`];
                const valueUnit = columnId === 'flowering_duration' ? 'Tage' : 'L';
                return html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${entity?.state || ''}"
                        @keydown=${(e: KeyboardEvent) => this.handleHelperUpdate(e, plant, columnId)}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: 80px;"
                    > ${valueUnit}
                `;
            }

            if (columnId === 'growth_phase') {
                const growthPhaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
                const options = this.getGrowthPhaseOptions(plantName);
                return html`
                    <select
                        @change=${(e: Event) => this.handleGrowthPhaseUpdate(e, plant)}
                        @click=${(e: Event) => e.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        ${options.map(option => html`
                            <option value="${option}" ?selected=${option === growthPhaseEntity?.state}>
                                ${option}
                            </option>
                        `)}
                    </select>
                `;
            }

            if (columnId === 'cycle') {
                if (plant.entity_id.startsWith('cycle.')) {
                    return html`${plant.attributes.member_count || 0} Mitglieder`;
                }
                
                if ((this._editingCell?.entityId === plant.entity_id) && (this._editingCell?.column === 'cycle')) {
                    const cycleEntity = this._hass?.states[`select.${plantName}_cycle`];
                    const options = this.getCycleOptions(plantName);
                    return html`
                        <select
                            @change=${(e: Event) => this.handleCycleUpdate(e, plant)}
                            @click=${(e: Event) => e.stopPropagation()}
                            @keydown=${this.handleKeyDown}
                            style="width: 120px;"
                        >
                            ${options.map(option => html`
                                <option value="${option}" ?selected=${option === cycleEntity?.state}>
                                    ${option}
                                </option>
                            `)}
                        </select>
                    `;
                }
                
                const cycleEntity = this._hass?.states[`select.${plantName}_cycle`];
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, 'cycle')}>
                        ${cycleEntity?.state && cycleEntity.state !== 'unknown' ? cycleEntity.state : '-'}
                    </span>
                `;
            }

            if (this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
                if (columnId === 'notes') {
                    return html`
                        <textarea
                            .value="${plant.attributes[columnId] || ''}"
                            @keydown=${(e: KeyboardEvent) => {
                                if (e.key === 'Escape') {
                                    this.handleKeyDown(e);
                                } else {
                                    this.handlePlantAttributeUpdate(e, plant, columnId);
                                }
                            }}
                            @click=${(e: Event) => e.stopPropagation()}
                            style="width: 200px; height: 60px;"
                        ></textarea>
                    `;
                }
                return html`
                    <input
                        type="text"
                        .value="${plant.attributes[columnId] || ''}"
                        @keydown=${(e: KeyboardEvent) => {
                            if (e.key === 'Escape') {
                                this.handleKeyDown(e);
                            } else {
                                this.handlePlantAttributeUpdate(e, plant, columnId);
                            }
                        }}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: ${columnId === 'website' ? '200px' : '120px'};"
                    >
                `;
            }

            if (columnId.startsWith('min_') || columnId.startsWith('max_')) {
                const helperEntity = this._hass?.states[`number.${plantName}_${columnId}`];
                const helperUnit = helperEntity?.attributes.unit_of_measurement || '';
                return html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${helperEntity?.state || ''}"
                        @keydown=${(e: KeyboardEvent) => this.handleHelperUpdate(e, plant, columnId)}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: 80px;"
                    > ${helperUnit}
                `;
            }

            if (columnId === 'area') {
                const currentAreaId = this.getAreaForEntity(plant.entity_id);
                const currentArea = currentAreaId ? this._hass?.areas[currentAreaId]?.name : '';
                const options = this.getAreaOptions();
                return html`
                    <select
                        @change=${(e: Event) => this.handleAreaUpdate(e, plant)}
                        @click=${(e: Event) => e.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        <option value="">Kein Bereich</option>
                        ${options.map(option => html`
                            <option value="${option}" ?selected=${option === currentArea}>
                                ${option}
                            </option>
                        `)}
                    </select>
                `;
            }
        }

        // Formatierung für Phasebegin-Attribute
        if (columnId.endsWith('_beginn') || columnId === 'entfernt' || columnId === 'geerntet') {
            const phaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
            const dateValue = phaseEntity?.attributes[columnId];
            if (!dateValue) return html`
                <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                    -
                </span>
            `;
            const date = new Date(dateValue);
            return html`
                <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                    ${date.toLocaleDateString('de-DE')}
                </span>
            `;
        }

        // Formatierung für Phasedauer-Attribute
        if (columnId.endsWith('_dauer')) {
            const phaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
            const duration = phaseEntity?.attributes[columnId];
            return html`
                <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                    ${duration ? `${duration} Tage` : '-'}
                </span>
            `;
        }

        switch (columnId) {
            case 'friendly_name':
                return html`
                    <div class="plant-name">
                        ${plant.attributes.entity_picture ? html`
                            <img src="${plant.attributes.entity_picture}" alt="${plant.attributes.friendly_name}">
                        ` : html`
                            <div class="plant-icon">
                                <ha-icon icon="mdi:flower"></ha-icon>
                            </div>
                        `}
                        ${plant.attributes.friendly_name}
                    </div>
                `;
            case 'state':
                return html`
                    <ha-icon .icon="mdi:${plant.state.toLowerCase() === 'problem' ? 'alert-circle-outline' : 'check-circle-outline'}">
                    </ha-icon>
                    ${plant.state}
                `;
            case 'timestamp':
                const timestamp = plant.attributes.timestamp;
                if (!timestamp) return '-';
                const date = new Date(timestamp);
                return date.toLocaleString('de-DE', { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            case 'growth_phase':
                const growthPhaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, 'growth_phase')}>
                        ${growthPhaseEntity?.state || 'Nicht verfügbar'}
                    </span>
                `;
            case 'pot_size':
                const potSizeEntity = this._hass?.states[`number.${plantName}_${columnId}`];
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                        ${potSizeEntity ? `${potSizeEntity.state} L` : 'Nicht verfügbar'}
                    </span>
                `;
            case 'flowering_duration':
                const floweringDurationEntity = this._hass?.states[`number.${plantName}_${columnId}`];
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                        ${floweringDurationEntity ? `${floweringDurationEntity.state} Tage` : 'Nicht verfügbar'}
                    </span>
                `;
            case 'website':
                return html`
                    <div style="display: inline-flex; align-items: center; gap: 4px; width: fit-content; white-space: nowrap;">
                        <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)} style="min-width: 0; overflow: hidden; text-overflow: ellipsis;">
                            ${plant.attributes.website || '-'}
                        </span>
                        ${plant.attributes.website ? html`
                            <ha-icon-button
                                .label=${"Öffnen"}
                                @click=${(e: Event) => {
                                    e.stopPropagation();
                                    window.open(plant.attributes.website, '_blank');
                                }}
                                style="--mdc-icon-button-size: 24px; margin: -8px; display: flex; align-items: center; justify-content: center; min-width: 24px; padding: 0;"
                            >
                                <ha-icon icon="mdi:open-in-new" style="width: 16px; height: 16px; display: flex;"></ha-icon>
                            </ha-icon-button>
                        ` : ''}
                    </div>
                `;
            case 'cycle':
                if (plant.entity_id.startsWith('cycle.')) {
                    return html`${plant.attributes.member_count || 0} Mitglieder`;
                }
                const cycleEntity = this._hass?.states[`select.${plantName}_cycle`];
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, 'cycle')}>
                        ${cycleEntity?.state && cycleEntity.state !== 'unknown' ? cycleEntity.state : '-'}
                    </span>
                `;
            case 'soil_moisture':
            case 'temperature':
            case 'conductivity':
            case 'illuminance':
            case 'air_humidity':
            case 'dli':
            case 'water_consumption':
            case 'fertilizer_consumption':
            case 'health':
                const sensorEntity = this._hass?.states[`sensor.${plantName}_${columnId}`];
                if (!sensorEntity) return '-';

                // Spezielle Behandlung für Health-Sensor
                if (columnId === 'health') {
                    const current = Number(sensorEntity.state);
                    const min = 0;
                    const max = 5;
                    const pct = 100 * Math.max(0, Math.min(1, current / max));
                    const isAvailable = !isNaN(current);

                    return html`
                        <div class="sensor-cell" @click=${(e: Event) => this.handleRowClick(e, plant, columnId)}>
                            <div class="meter-container">
                                <div class="meter red">
                                    <span class="${isAvailable ? (current < min || current > max ? "bad" : "good") : "unavailable"}" 
                                          style="width: 100%;"></span>
                                </div>
                                <div class="meter green">
                                    <span class="${isAvailable ? (current > max ? "bad" : "good") : "unavailable"}" 
                                          style="width:${isAvailable ? pct : "0"}%;"></span>
                                </div>
                                <div class="meter red">
                                    <span class="bad" style="width:${isAvailable ? (current > max ? 100 : 0) : "0"}%;"></span>
                                </div>
                            </div>
                            <div class="sensor-value">
                                ${current}
                            </div>
                        </div>
                    `;
                }

                // Versuche zuerst die Helper zu lesen
                let minEntity = this._hass?.states[`number.${plantName}_min_${columnId}`];
                let maxEntity = this._hass?.states[`number.${plantName}_max_${columnId}`];
                let min = minEntity?.state ? Number(minEntity.state) : 0;
                let max = maxEntity?.state ? Number(maxEntity.state) : 100;

                // Wenn die Helper nicht verfügbar sind oder Fehler haben, hole die Werte aus der Plant Integration
                if (!minEntity || !maxEntity || minEntity.state === 'unavailable' || maxEntity.state === 'unavailable') {
                    const plantInfo = this._plantInfo.get(plant.entity_id);
                    if (plantInfo?.result?.[columnId]) {
                        min = Number(plantInfo.result[columnId].min);
                        max = Number(plantInfo.result[columnId].max);
                    }
                }
                
                const current = Number(sensorEntity.state);
                const unit = sensorEntity.attributes.unit_of_measurement || '';
                
                const pct = 100 * Math.max(0, Math.min(1, (current - min) / (max - min)));
                const isAvailable = !isNaN(current);
                
                return html`
                    <div class="sensor-cell" @click=${(e: Event) => this.handleRowClick(e, plant, columnId)}>
                        <div class="meter-container">
                            <div class="meter red">
                                <span class="${isAvailable ? (current < min || current > max ? "bad" : "good") : "unavailable"}" 
                                      style="width: 100%;"></span>
                            </div>
                            <div class="meter green">
                                <span class="${isAvailable ? (current > max ? "bad" : "good") : "unavailable"}" 
                                      style="width:${isAvailable ? pct : "0"}%;"></span>
                            </div>
                            <div class="meter red">
                                <span class="bad" style="width:${isAvailable ? (current > max ? 100 : 0) : "0"}%;"></span>
                            </div>
                        </div>
                        <div class="sensor-value">
                            ${current} ${unit}
                        </div>
                    </div>
                `;

            case 'ppfd':
                const ppfdSensor = this._hass?.states[`sensor.${plantName}_ppfd_mol`];
                if (!ppfdSensor) return '-';
                const ppfdUnit = ppfdSensor.attributes.unit_of_measurement || '';
                return html`${this.formatNumber(ppfdSensor.state, 6)} ${ppfdUnit}`;

            case 'total_ppfd':
                const totalPpfdSensor = this._hass?.states[`sensor.${plantName}_total_ppfd_mol_integral`];
                if (!totalPpfdSensor) return '-';
                const totalPpfdUnit = totalPpfdSensor.attributes.unit_of_measurement || '';
                return html`${this.formatNumber(totalPpfdSensor.state, 2)} ${totalPpfdUnit}`;

            case 'min_air_humidity':
            case 'max_air_humidity':
            case 'min_soil_moisture':
            case 'max_soil_moisture':
            case 'min_temperature':
            case 'max_temperature':
            case 'min_conductivity':
            case 'max_conductivity':
            case 'min_illuminance':
            case 'max_illuminance':
            case 'min_dli':
            case 'max_dli':
            case 'min_water_consumption':
            case 'max_water_consumption':
            case 'min_fertilizer_consumption':
            case 'max_fertilizer_consumption':
                const helperEntity = this._hass?.states[`number.${plantName}_${columnId}`];
                if (!helperEntity) return '-';
                const helperUnit = helperEntity.attributes.unit_of_measurement || '';
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                        ${helperEntity.state} ${helperUnit}
                    </span>
                `;

            case 'area':
                const areaId = this.getAreaForEntity(plant.entity_id);
                const areaName = areaId ? this._hass?.areas[areaId]?.name : '-';
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                        ${areaName}
                    </span>
                `;

            case 'total_water_consumption':
            case 'total_fertilizer_consumption':
                const totalSensor = this._hass?.states[`sensor.${plantName}_${columnId}`];
                if (!totalSensor) return '-';
                const totalUnit = totalSensor.attributes.unit_of_measurement || '';
                return html`${totalSensor.state} ${totalUnit}`;

            default:
                if (this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
                    return html`
                        <span @click=${(e: Event) => this.handleCellClick(e, plant, columnId)}>
                            ${plant.attributes[columnId]?.toString() || '-'}
                        </span>
                    `;
                }
                return plant.attributes[columnId]?.toString() || '-';
        }
    }

    private handleRowClick(e: Event, plant: HomeAssistantEntity, columnId: string): void {
        // Nur für bestimmte Spalten die Hauptentität öffnen
        const mainEntityColumns = ['friendly_name', 'state', 
            'moisture_status', 'temperature_status', 'conductivity_status', 
            'illuminance_status', 'humidity_status', 'dli_status'];

        if (mainEntityColumns.includes(columnId)) {
            const event = new CustomEvent('hass-more-info', {
                detail: { entityId: plant.entity_id },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
        }

        // Für Sensorwerte den Sensorverlauf öffnen
        const plantName = plant.entity_id.split('.')[1];
        let sensorEntity = '';

        switch (columnId) {
            case 'ppfd':
                sensorEntity = `sensor.${plantName}_ppfd_mol`;
                break;
            case 'total_ppfd':
                sensorEntity = `sensor.${plantName}_total_ppfd_mol_integral`;
                break;
            case 'soil_moisture':
            case 'temperature':
            case 'conductivity':
            case 'illuminance':
            case 'air_humidity':
            case 'dli':
            case 'water_consumption':
            case 'fertilizer_consumption':
                sensorEntity = `sensor.${plantName}_${columnId}`;
                break;
            default:
                return;
        }

        if (sensorEntity) {
            const event = new CustomEvent('hass-more-info', {
                detail: { entityId: sensorEntity },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
        }
    }

    private handleSearch(e: Event): void {
        const input = e.target as HTMLInputElement;
        this._searchQuery = input.value.toLowerCase();
        this.requestUpdate();
    }

    private getFilteredPlants(): HomeAssistantEntity[] {
        let filteredPlants = this.getSortedPlants();

        // Filtern nach Entity-Typ
        filteredPlants = filteredPlants.filter(plant => {
            const entityType = plant.entity_id.split('.')[0];
            return this._entityTypes.has(entityType);
        });

        // Anwenden der aktiven Filter und konfigurierten Filter
        const activeFilters = { ...this._activeFilters };
        
        // Wenn Filter nicht aktiv sind, nur konfigurierte Filter anwenden
        if (!this.config?.filter?.enabled && this.config?.filter?.filters) {
            for (const [column, filter] of Object.entries(this.config.filter.filters)) {
                if (column !== 'entity_type') { // entity_type wurde bereits behandelt
                    if (Array.isArray(filter)) {
                        activeFilters[column] = new Set(filter);
                    } else {
                        activeFilters[column] = filter;
                    }
                }
            }
        }

        if (Object.keys(activeFilters).length > 0) {
            filteredPlants = filteredPlants.filter(plant => {
                return Object.entries(activeFilters).every(([column, filter]) => {
                    if (column === 'entity_type') return true; // Bereits behandelt
                    
                    const plantId = plant.entity_id.split('.')[1];
                    
                    if (this.isSensorColumn(column)) {
                        const value = this.getSensorValue(plant, column);
                        const range = filter as { min: number; max: number };
                        return value >= range.min && value <= range.max;
                    }

                    let currentValue: string;
                    switch(column) {
                        case 'area':
                            const areaId = this.getAreaForEntity(plant.entity_id);
                            currentValue = areaId ? this._hass?.areas[areaId]?.name || '-' : '-';
                            break;
                        case 'state':
                            currentValue = plant.state;
                            break;
                        case 'growth_phase':
                            const phaseEntity = this._hass?.states[`select.${plantId}_growth_phase`];
                            currentValue = phaseEntity?.state || '-';
                            break;
                        case 'cycle':
                            const cycleEntity = this._hass?.states[`select.${plantId}_cycle`];
                            currentValue = cycleEntity?.state && cycleEntity.state !== 'unknown' ? cycleEntity.state : '-';
                            break;
                        case 'pot_size':
                            const potSizeEntity = this._hass?.states[`number.${plantId}_pot_size`];
                            currentValue = potSizeEntity ? `${potSizeEntity.state}L` : '-';
                            break;
                        default:
                            currentValue = plant.attributes[column]?.toString() || '-';
                    }
                    return (filter as Set<string>).has(currentValue);
                });
            });
        }

        // Anwenden der Suchfilterung
        if (this._searchQuery) {
            filteredPlants = filteredPlants.filter(plant => {
                const searchableValues = [
                    plant.attributes.friendly_name,
                    plant.state,
                    this.getAreaForEntity(plant.entity_id) ? this._hass?.areas[this.getAreaForEntity(plant.entity_id)!]?.name : '',
                    ...this.EDITABLE_PLANT_ATTRIBUTES.map(attr => plant.attributes[attr])
                ].filter(Boolean);

                return searchableValues.some(value => 
                    value.toString().toLowerCase().includes(this._searchQuery)
                );
            });
        }

        return filteredPlants;
    }

    private getSearchableValue(plant: HomeAssistantEntity, columnId: string): string {
        const plantName = plant.entity_id.split('.')[1];

        switch (columnId) {
            case 'friendly_name':
                return plant.attributes.friendly_name || '';
            case 'state':
                return plant.state || '';
            case 'area':
                const areaId = this.getAreaForEntity(plant.entity_id);
                return areaId ? this._hass?.areas[areaId]?.name || '' : '';
            case 'growth_phase':
                return this._hass?.states[`select.${plantName}_growth_phase`]?.state || '';
            case 'cycle':
                return plant.entity_id.startsWith('cycle.') ? 
                    `${plant.attributes.member_count || 0} Mitglieder` : 
                    this._hass?.states[`select.${plantName}_cycle`]?.state || '';
            case 'pot_size':
                return this._hass?.states[`number.${plantName}_pot_size`]?.state || '';
            default:
                if (this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
                    return plant.attributes[columnId]?.toString() || '';
                }
                return '';
        }
    }

    render(): HTMLTemplateResult {
        if (!this._hass) return html``;

        const plants = this.getFilteredPlants();
        const columns = this.getVisibleColumns();

        return html`
            <ha-card>
                ${this.config?.title !== '' ? html`
                    <div class="card-header">
                        <div class="name">${this.config?.title || 'Pflanzenübersicht'}</div>
                    </div>
                ` : ''}
                ${(this.config?.multiselect?.enabled || this.config?.search?.enabled || this.config?.filter?.enabled) ? html`
                    <div class="toolbar">
                        ${(this.config?.multiselect?.enabled || this.config?.search?.enabled || this.config?.filter?.enabled) ? html`
                            ${this.config?.filter?.enabled ? html`
                                <ha-icon-button
                                    .label=${this._filterMode ? "Filter schließen" : "Filter"}
                                    @click=${this.toggleFilterMode}
                                >
                                    <ha-icon icon="mdi:${this._filterMode ? "filter-off" : "filter"}"></ha-icon>
                                </ha-icon-button>
                            ` : ""}
                            ${this.config?.multiselect?.enabled ? html`
                                <ha-icon-button
                                    .label=${this._multiSelectMode ? "Mehrfachauswahl beenden" : "Mehrfachauswahl"}
                                    @click=${this.toggleMultiSelect}
                                >
                                    <ha-icon icon="mdi:${this._multiSelectMode ? "close" : "checkbox-multiple-outline"}"></ha-icon>
                                </ha-icon-button>
                            ` : ""}
                            ${this.config?.search?.enabled ? html`
                                <div class="search-container">
                                    <ha-icon icon="mdi:magnify"></ha-icon>
                                    <input
                                        type="text"
                                        .value=${this._searchQuery}
                                        placeholder="${this.config?.search?.placeholder || "Suche..."}"
                                        @input=${this.handleSearch}
                                    >
                                    ${this._searchQuery ? html`
                                        <ha-icon-button
                                            .label=${"Suche zurücksetzen"}
                                            @click=${() => {
                                                this._searchQuery = "";
                                                this.requestUpdate();
                                            }}
                                        >
                                            <ha-icon icon="mdi:close"></ha-icon>
                                        </ha-icon-button>
                                    ` : ""}
                                </div>
                            ` : ""}
                        ` : ""}
                    </div>
                ` : ''}
                ${this._filterMode ? html`
                    <div class="filter-sidebar">
                        ${this.getVisibleColumns().map(column => html`
                            ${this.renderFilterContent(column)}
                        `)}
                    </div>
                ` : ''}
                <div class="table-container${this._filterMode ? ' filtered' : ''}">
                    <table>
                        <thead>
                            <tr>
                                ${this._multiSelectMode ? html`
                                    <th style="width: 48px"></th>
                                ` : ''}
                                ${columns.map(column => html`
                                    <th @click=${() => this.handleSort(column.id)} data-column="${column.id}">
                                        ${column.name}
                                        ${this._sortColumn === column.id ? 
                                            html`<ha-icon icon="mdi:${this._sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}"></ha-icon>` : ''}
                                    </th>
                                `)}
                            </tr>
                        </thead>
                        <tbody>
                            ${plants.map(plant => html`
                                <tr>
                                    ${this._multiSelectMode ? html`
                                        <td>
                                            <input 
                                                type="checkbox"
                                                .checked=${this._selectedPlants.has(plant.entity_id)}
                                                @change=${(e: Event) => this.togglePlantSelection(plant.entity_id, e)}
                                                style="width: 20px; height: 20px; margin: 0 8px;"
                                            >
                                        </td>
                                    ` : ''}
                                    ${columns.map(column => html`
                                        <td data-column="${column.id}" 
                                            @click=${(e: Event) => {
                                                if (this._multiSelectMode && this._selectedPlants.size > 0) {
                                                    this.handleCellClick(e, plant, column.id);
                                                } else if (!this._multiSelectMode) {
                                                    this.handleRowClick(e, plant, column.id);
                                                }
                                            }}
                                            style="cursor: ${this.getCursorStyle(column.id)}"
                                        >
                                            ${this.getCellValue(plant, column.id)}
                                        </td>
                                    `)}
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </ha-card>
        `;
    }

    private getCursorStyle(columnId: string): string {
        if (['friendly_name', 'state', 'moisture_status', 'temperature_status', 'conductivity_status', 
             'illuminance_status', 'humidity_status', 'dli_status'].includes(columnId)) {
            return 'pointer';
        }
        
        if (['soil_moisture', 'temperature', 'conductivity', 'illuminance', 'air_humidity', 'dli',
             'ppfd', 'total_ppfd', 'water_consumption', 'fertilizer_consumption', 'health'].includes(columnId)) {
            return 'pointer';
        }

        if (['pot_size', 'growth_phase', 'cycle', 'area', 'flowering_duration'].includes(columnId) || 
            columnId.startsWith('min_') || columnId.startsWith('max_') || 
            this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId) ||
            columnId.endsWith('_beginn') || columnId === 'entfernt' || columnId === 'geerntet' ||
            columnId.endsWith('_dauer')) {
            return 'text';
        }

        return 'default';
    }

    getCardSize(): number {
        return 1 + Math.ceil(this.plantEntities.length / 2);
    }

    private getAreaOptions(): string[] {
        if (!this._hass) return [];
        
        // Hole alle Areas aus Home Assistant
        const areas = Object.values(this._hass.areas || {});
        return areas.map(area => area.name).sort();
    }

    private async handleAreaUpdate(event: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = event.target as HTMLSelectElement;
        const areaName = select.value;
        const areaId = Object.entries(this._hass?.areas || {}).find(([_, area]) => area.name === areaName)?.[0];
        
        if (this._multiSelectMode && this._selectedPlants.size > 0) {
            for (const entityId of this._selectedPlants) {
                const entity = (this._hass?.entities || {})[entityId];
                if (entity?.device_id) {
                    await this._hass?.callService('plant', 'move_to_area', {
                        device_id: [entity.device_id],
                        ...(areaId ? { area_id: areaId } : {})
                    });
                }
            }
        } else {
            const entity = (this._hass?.entities || {})[plant.entity_id];
            if (entity?.device_id) {
                await this._hass?.callService('plant', 'move_to_area', {
                    device_id: [entity.device_id],
                    ...(areaId ? { area_id: areaId } : {})
                });
            }
        }
        
        this._editingCell = null;
        this.requestUpdate();
    }

    private getAreaForEntity(entityId: string): string | undefined {
        if (!this._hass) return undefined;
        
        // Hole die Area Registry Einträge
        const areaRegistry = this._hass.areas || {};
        const deviceRegistry = this._hass.devices || {};
        const entityRegistry = this._hass.entities || {};
        
        // Finde den Entity Registry Eintrag
        const entityEntry = entityRegistry[entityId];
        if (!entityEntry) return undefined;

        // Wenn die Entity direkt einer Area zugeordnet ist
        if (entityEntry.area_id) {
            return entityEntry.area_id;
        }

        // Wenn die Entity einem Device zugeordnet ist, prüfe die Area des Devices
        if (entityEntry.device_id) {
            const deviceEntry = deviceRegistry[entityEntry.device_id];
            if (deviceEntry?.area_id) {
                return deviceEntry.area_id;
            }
        }

        return undefined;
    }

    private toggleMultiSelect(): void {
        this._multiSelectMode = !this._multiSelectMode;
        if (!this._multiSelectMode) {
            this._selectedPlants.clear();
        }
        this.requestUpdate();
    }

    private togglePlantSelection(entityId: string, event: Event): void {
        event.stopPropagation();
        if (this._selectedPlants.has(entityId)) {
            this._selectedPlants.delete(entityId);
        } else {
            this._selectedPlants.add(entityId);
        }
        this.requestUpdate();
    }

    private async applyBulkUpdate(value: any, columnId: string): Promise<void> {
        for (const entityId of this._selectedPlants) {
            const plant = this.plantEntities.find(p => p.entity_id === entityId);
            if (plant) {
                const plantName = entityId.split('.')[1];

                if (columnId === 'growth_phase') {
                    await this._hass?.callService('select', 'select_option', {
                        entity_id: `select.${plantName}_growth_phase`,
                        option: value
                    });
                } else if (columnId === 'cycle') {
                    await this._hass?.callService('select', 'select_option', {
                        entity_id: `select.${plantName}_cycle`,
                        option: value
                    });
                } else if (columnId === 'pot_size') {
                    await this._hass?.callService('number', 'set_value', {
                        entity_id: `number.${plantName}_pot_size`,
                        value: parseFloat(value)
                    });
                } else if (columnId.startsWith('min_') || columnId.startsWith('max_')) {
                    await this._hass?.callService('number', 'set_value', {
                        entity_id: `number.${plantName}_${columnId}`,
                        value: parseFloat(value)
                    });
                } else if (this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
                    await this._hass?.callService('plant', 'update_plant_attributes', {
                        entity_id: entityId,
                        [columnId]: value
                    });
                }
            }
        }
        this._editingCell = null;
        this.requestUpdate();
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (this.config?.multiselect?.showbydefault) {
            this._multiSelectMode = true;
        }
        if (this.config?.filter?.showbydefault) {
            this._filterMode = true;
        }
        
        // Initialisiere Filter aus der Konfiguration
        if (this.config?.filter?.filters) {
            for (const [column, filter] of Object.entries(this.config.filter.filters)) {
                if (column === 'entity_type') {
                    this._entityTypes = new Set(filter as string[]);
                } else if (Array.isArray(filter)) {
                    this._activeFilters[column] = new Set(filter);
                } else {
                    this._activeFilters[column] = filter;
                }
            }
        } else {
            // Standard: beide Entity-Typen aktivieren
            this._entityTypes.add('plant');
            this._entityTypes.add('cycle');
        }
    }

    private toggleFilterMode() {
        if (this.config?.filter?.enabled) {
            this._filterMode = !this._filterMode;
            this.requestUpdate();
        }
    }

    private toggleFilter(column: string, value: string | { min: number; max: number }) {
        if (this.isSensorColumn(column)) {
            this._activeFilters[column] = value as { min: number; max: number };
            if (!this._activeFilters[column]) {
                delete this._activeFilters[column];
            }
        } else {
            if (!this._activeFilters[column]) {
                this._activeFilters[column] = new Set();
            }
            const filter = this._activeFilters[column] as Set<string>;
            if (filter.has(value as string)) {
                filter.delete(value as string);
                if (filter.size === 0) {
                    delete this._activeFilters[column];
                }
            } else {
                filter.add(value as string);
            }
        }
        this.requestUpdate();
    }

    private getUniqueValues(column: string): string[] {
        return [...new Set(this.plantEntities.map(plant => {
            const plantId = plant.entity_id.split('.')[1];
            
            switch(column) {
                case 'area':
                    const areaId = this.getAreaForEntity(plant.entity_id);
                    return areaId ? this._hass?.areas[areaId]?.name || '-' : '-';
                case 'state':
                    return plant.state;
                case 'growth_phase':
                    const phaseEntity = this._hass?.states[`select.${plantId}_growth_phase`];
                    return phaseEntity?.state || '-';
                case 'cycle':
                    const cycleEntity = this._hass?.states[`select.${plantId}_cycle`];
                    return cycleEntity?.state && cycleEntity.state !== 'unknown' ? cycleEntity.state : '-';
                case 'pot_size':
                    const potSizeEntity = this._hass?.states[`number.${plantId}_pot_size`];
                    return potSizeEntity ? `${potSizeEntity.state}L` : '-';
                default:
                    return plant.attributes[column]?.toString() || '-';
            }
        }))].sort();
    }

    private isSensorColumn(column: string): boolean {
        return [
            'soil_moisture',
            'temperature',
            'conductivity',
            'illuminance',
            'air_humidity',
            'dli',
            'water_consumption',
            'fertilizer_consumption',
            'health'
        ].includes(column);
    }

    private getSensorValue(plant: HomeAssistantEntity, column: string): number {
        const plantId = plant.entity_id.split('.')[1];
        const sensorSuffix = column === 'ppfd' ? 'ppfd_mol' :
                            column === 'total_ppfd' ? 'total_ppfd_mol_integral' :
                            column;
        const sensorEntity = this._hass?.states[`sensor.${plantId}_${sensorSuffix}`];
        return sensorEntity ? Number(sensorEntity.state) : 0;
    }

    private getSensorRange(column: string): { min: number; max: number; unit: string } {
        const values = this.plantEntities.map(plant => this.getSensorValue(plant, column));
        const unit = this.getSensorUnit(column);
        return {
            min: Math.min(...values),
            max: Math.max(...values),
            unit
        };
    }

    private getSensorUnit(column: string): string {
        if (!this.plantEntities.length) return '';
        const plantId = this.plantEntities[0].entity_id.split('.')[1];
        const sensorSuffix = column === 'ppfd' ? 'ppfd_mol' :
                            column === 'total_ppfd' ? 'total_ppfd_mol_integral' :
                            column;
        const sensorEntity = this._hass?.states[`sensor.${plantId}_${sensorSuffix}`];
        return sensorEntity?.attributes?.unit_of_measurement || '';
    }

    private renderFilterContent(column: {id: string, name: string}): HTMLTemplateResult {
        // Entity-Type-Filter am Anfang
        if (column.id === this.getVisibleColumns()[0].id) {
            return html`
                <div class="filter-group entity-type-filter">
                    <div class="filter-header">Entity Typ</div>
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${this._entityTypes.has('plant')}
                            @change=${() => this.toggleEntityType('plant')}
                        >
                        Pflanzen
                    </label>
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${this._entityTypes.has('cycle')}
                            @change=${() => this.toggleEntityType('cycle')}
                        >
                        Cycles
                    </label>
                </div>
                ${this.renderColumnFilter(column)}
            `;
        }

        return this.renderColumnFilter(column);
    }

    private renderColumnFilter(column: {id: string, name: string}): HTMLTemplateResult {
        if (this.isSensorColumn(column.id)) {
            const range = this.getSensorRange(column.id);
            const currentFilter = this._activeFilters[column.id] as { min: number; max: number } || range;
            return html`
                <div class="filter-range">
                    <div class="filter-header">${column.name}</div>
                    <div class="filter-range-inputs">
                        <input
                            class="filter-input"
                            type="number"
                            .value=${currentFilter.min}
                            @change=${(e: Event) => {
                                const input = e.target as HTMLInputElement;
                                const value = Number(input.value);
                                this.toggleFilter(column.id, {
                                    min: value,
                                    max: (this._activeFilters[column.id] as { min: number; max: number })?.max || range.max
                                });
                            }}
                            step="0.1"
                        >
                        <span>bis</span>
                        <input
                            class="filter-input"
                            type="number"
                            .value=${currentFilter.max}
                            @change=${(e: Event) => {
                                const input = e.target as HTMLInputElement;
                                const value = Number(input.value);
                                this.toggleFilter(column.id, {
                                    min: (this._activeFilters[column.id] as { min: number; max: number })?.min || range.min,
                                    max: value
                                });
                            }}
                            step="0.1"
                        >
                        <span>${range.unit}</span>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="filter-group">
                <div class="filter-header">${column.name}</div>
                ${this.getUniqueValues(column.id).map(value => html`
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${(this._activeFilters[column.id] as Set<string>)?.has(value) || false}
                            @change=${() => this.toggleFilter(column.id, value)}
                        >
                        ${value}
                    </label>
                `)}
            </div>
        `;
    }

    private toggleEntityType(type: string): void {
        if (this._entityTypes.has(type)) {
            // Nur löschen wenn mindestens ein Typ übrig bleibt
            if (this._entityTypes.size > 1) {
                this._entityTypes.delete(type);
            }
        } else {
            this._entityTypes.add(type);
        }
        this.requestUpdate();
    }

    static get styles(): CSSResult {
        return css`
            ${style}

            .filter-sidebar {
                padding: 16px;
                border-right: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
                max-height: calc(100vh - 200px);
                overflow-y: auto;
                overflow-x: hidden;
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }

            .entity-type-filter {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
            }

            .filter-sidebar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .filter-sidebar::-webkit-scrollbar-track {
                background: transparent;
            }

            .filter-sidebar::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .filter-sidebar::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .table-container {
                overflow-x: auto;
                overflow-y: auto;
                max-height: calc(100vh - 200px);
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }

            .table-container::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .table-container::-webkit-scrollbar-track {
                background: transparent;
            }

            .table-container::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .table-container::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .plant-name {
                display: flex;
                align-items: center;
                gap: 8px;
                max-width: 100%;
                min-height: 32px;
            }

            .plant-name img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
            }

            .plant-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                padding: 0;
                margin: 0;
            }

            .plant-icon ha-icon {
                --mdc-icon-size: 20px;
                color: var(--text-primary-color, white);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                margin: 0;
                padding: 0;
            }
        `;
    }
}