import { CSSResult, HTMLTemplateResult, LitElement, html } from 'lit';
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

    private plantEntities: HomeAssistantEntity[] = [];

    static getStubConfig(): FlowerListCardConfig {
        return {
            type: 'custom:flower-list-card',
            show_columns: {
                name: true,
                growing: true,
                basic: true,
                metrics: false,
                genetics: true,
                sensors: true,
                min_max: false,
                diagnostics: true,
                characteristics: true,
                growth: true,
                details: true,
                notes: true
            }
        };
    }

    // Liste der editierbaren Plant-Attribute
    private readonly EDITABLE_PLANT_ATTRIBUTES = [
        'strain', 'breeder', 'flowering_duration', 'pid', 'sorte', 'feminized',
        'effects', 'smell', 'taste', 'phenotype', 'hunger', 'growth_stretch',
        'flower_stretch', 'mold_resistance', 'difficulty', 'yield', 'notes', 'website'
    ];

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        this.updatePlantEntities();
    }

    private updatePlantEntities(): void {
        if (!this._hass) return;
        
        this.plantEntities = Object.values(this._hass.states)
            .filter((entity): entity is HomeAssistantEntity => 
                typeof entity === 'object' && 
                entity !== null && 
                'entity_id' in entity && 
                typeof entity.entity_id === 'string' && 
                entity.entity_id.startsWith('plant.')
            );
        
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
            let aValue: any;
            let bValue: any;

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
                    aValue = aAreaId ? this._hass?.areas[aAreaId]?.name || '' : '';
                    bValue = bAreaId ? this._hass?.areas[bAreaId]?.name || '' : '';
                    break;
                case 'growth_phase':
                    const aName = a.entity_id.split('.')[1];
                    const bName = b.entity_id.split('.')[1];
                    aValue = this._hass?.states[`select.${aName}_growth_phase`]?.state || '';
                    bValue = this._hass?.states[`select.${bName}_growth_phase`]?.state || '';
                    break;
                case 'cycle':
                    const aCycleName = a.entity_id.split('.')[1];
                    const bCycleName = b.entity_id.split('.')[1];
                    aValue = this._hass?.states[`select.${aCycleName}_cycle`]?.state || '';
                    bValue = this._hass?.states[`select.${bCycleName}_cycle`]?.state || '';
                    break;
                case 'pot_size':
                    const aPotName = a.entity_id.split('.')[1];
                    const bPotName = b.entity_id.split('.')[1];
                    aValue = Number(this._hass?.states[`number.${aPotName}_pot_size`]?.state || 0);
                    bValue = Number(this._hass?.states[`number.${bPotName}_pot_size`]?.state || 0);
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
        const columns: Array<{id: string, name: string, group: string}> = [];
        
        // Name
        columns.push(
            {id: 'friendly_name', name: 'Name', group: 'name'},
        );

        // Status
        columns.push(
            {id: 'state', name: 'Status', group: 'basic'},
        );

        // Wachstum & Topf
        columns.push(
            {id: 'area', name: 'Bereich', group: 'growing'},
            {id: 'growth_phase', name: 'Phase', group: 'growing'},
            {id: 'cycle', name: 'Durchgang', group: 'growing'},
            {id: 'pot_size', name: 'Topfgröße', group: 'growing'},
        );

        // Genetik
        columns.push(
            {id: 'strain', name: 'Sorte', group: 'genetics'},
            {id: 'breeder', name: 'Züchter', group: 'genetics'},
            {id: 'feminized', name: 'Feminisiert', group: 'genetics'},
        );

        // Sensoren
        columns.push(
            {id: 'soil_moisture', name: 'Feuchtigkeit', group: 'sensors'},
            {id: 'temperature', name: 'Temperatur', group: 'sensors'},
            {id: 'conductivity', name: 'Leitfähigkeit', group: 'sensors'},
            {id: 'illuminance', name: 'Beleuchtung', group: 'sensors'},
            {id: 'air_humidity', name: 'Luftfeuchtigkeit', group: 'sensors'},
            {id: 'dli', name: 'DLI', group: 'sensors'},
        );

        // Diagnosesensoren
        columns.push(
            {id: 'ppfd', name: 'PPFD', group: 'diagnostics'},
            {id: 'total_ppfd', name: 'Total PPFD', group: 'diagnostics'},
            {id: 'water_consumption', name: 'Wasserverbrauch', group: 'diagnostics'},
            {id: 'fertilizer_consumption', name: 'Düngerverbrauch', group: 'diagnostics'},
        );

        // Min/Max Helper
        columns.push(
            // Max/Min für Luftfeuchtigkeit
            {id: 'max_air_humidity', name: 'Max Luftfeuchte', group: 'min_max'},
            {id: 'min_air_humidity', name: 'Min Luftfeuchte', group: 'min_max'},
            // Max/Min für Bodenfeuchtigkeit
            {id: 'max_soil_moisture', name: 'Max Bodenfeuchte', group: 'min_max'},
            {id: 'min_soil_moisture', name: 'Min Bodenfeuchte', group: 'min_max'},
            // Max/Min für Temperatur
            {id: 'max_temperature', name: 'Max Temp', group: 'min_max'},
            {id: 'min_temperature', name: 'Min Temp', group: 'min_max'},
            // Max/Min für Leitfähigkeit
            {id: 'max_conductivity', name: 'Max Leitfähigkeit', group: 'min_max'},
            {id: 'min_conductivity', name: 'Min Leitfähigkeit', group: 'min_max'},
            // Max/Min für Beleuchtung
            {id: 'max_illuminance', name: 'Max Beleuchtung', group: 'min_max'},
            {id: 'min_illuminance', name: 'Min Beleuchtung', group: 'min_max'},
            // Max/Min für DLI
            {id: 'max_dli', name: 'Max DLI', group: 'min_max'},
            {id: 'min_dli', name: 'Min DLI', group: 'min_max'},
        );

        // Charakteristiken
        columns.push(
            {id: 'effects', name: 'Effekte', group: 'characteristics'},
            {id: 'smell', name: 'Geruch', group: 'characteristics'},
            {id: 'taste', name: 'Geschmack', group: 'characteristics'},
            {id: 'phenotype', name: 'Phänotyp', group: 'characteristics'},
        );

        // Wachstum
        columns.push(
            {id: 'growth_stretch', name: 'Wachstumsdehnung', group: 'growth'},
            {id: 'flower_stretch', name: 'Blütendehnung', group: 'growth'},
            {id: 'flowering_duration', name: 'Blütezeit', group: 'growth'},
        );

        // Metriken
        columns.push(
            {id: 'moisture_status', name: 'St. Feuchtigkeit', group: 'metrics'},
            {id: 'temperature_status', name: 'St. Temperatur', group: 'metrics'},
            {id: 'conductivity_status', name: 'St. Leitfähigkeit', group: 'metrics'},
            {id: 'illuminance_status', name: 'St. Beleuchtung', group: 'metrics'},
            {id: 'humidity_status', name: 'St. Luftfeuchtigkeit', group: 'metrics'},
            {id: 'dli_status', name: 'St. DLI', group: 'metrics'},
        );

        // Details
        columns.push(
            {id: 'difficulty', name: 'Schwierigkeit', group: 'details'},
            {id: 'yield', name: 'Ertrag', group: 'details'},
            {id: 'mold_resistance', name: 'Schimmelresistenz', group: 'details'},
            {id: 'hunger', name: 'Hunger', group: 'details'},
        );

        // Notizen
        columns.push(
            {id: 'notes', name: 'Notizen', group: 'notes'},
            {id: 'website', name: 'Website', group: 'notes'},
        );

        return columns;
    }

    private getDefaultConfig(): FlowerListCardConfig {
        return {
            type: 'flower-list-card',
            show_columns: {
                name: true,
                basic: true,
                growing: true,
                genetics: true,
                characteristics: false,
                growth: false,
                metrics: false,
                sensors: false,
                diagnostics: false,
                min_max: false,
                details: false,
                notes: false
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
        const cfg = this.config?.show_columns || this.getDefaultConfig().show_columns;
        
        // Erstelle ein Array von aktivierten Gruppen in der Reihenfolge der Konfiguration
        const enabledGroups = Object.entries(cfg)
            .filter(([_, enabled]) => enabled)
            .map(([group]) => group);

        // Filtere und sortiere die Spalten nach der Gruppenreihenfolge
        return allColumns
            .filter(column => cfg[column.group])
            .sort((a, b) => {
                const aIndex = enabledGroups.indexOf(a.group);
                const bIndex = enabledGroups.indexOf(b.group);
                return aIndex - bIndex;
            });
    }

    private handleCellClick(e: Event, plant: HomeAssistantEntity, columnId: string): void {
        e.stopPropagation();

        if (columnId === 'pot_size' || 
            columnId === 'growth_phase' || 
            columnId === 'cycle' || 
            columnId === 'area' ||
            columnId.startsWith('min_') || 
            columnId.startsWith('max_') || 
            this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
            this._editingCell = {
                entityId: plant.entity_id,
                column: columnId
            };
            this.requestUpdate();
        }
    }

    private async handlePotSizeUpdate(e: KeyboardEvent, plant: HomeAssistantEntity): Promise<void> {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            const value = parseFloat(input.value);
            const plantName = plant.entity_id.split('.')[1];
            
            if (!isNaN(value)) {
                try {
                    await this._hass?.callService('number', 'set_value', {
                        entity_id: `number.${plantName}_pot_size`,
                        value: value
                    });
                    this._editingCell = null;
                    this.requestUpdate();
                } catch (error) {
                    console.error('Fehler beim Aktualisieren der Topfgröße:', error);
                }
            }
        } else if (e.key === 'Escape') {
            this._editingCell = null;
            this.requestUpdate();
        }
    }

    private async handleGrowthPhaseUpdate(e: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = e.target as HTMLSelectElement;
        const value = select.value;
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

    private getGrowthPhaseOptions(plantName: string): string[] {
        const entity = this._hass?.states[`select.${plantName}_growth_phase`];
        return entity?.attributes?.options || [];
    }

    private async handleCycleUpdate(e: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = e.target as HTMLSelectElement;
        const value = select.value;
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

    private getCycleOptions(plantName: string): string[] {
        const entity = this._hass?.states[`select.${plantName}_cycle`];
        return entity?.attributes?.options || [];
    }

    private async handlePlantAttributeUpdate(e: KeyboardEvent | Event, plant: HomeAssistantEntity, columnId: string): Promise<void> {
        const isKeyboardEvent = e instanceof KeyboardEvent;
        
        // Wenn es ein Keyboard-Event ist, nur bei Enter fortfahren
        if (isKeyboardEvent && e.key !== 'Enter') {
            if (e.key === 'Escape') {
                this._editingCell = null;
                this.requestUpdate();
            }
            return;
        }

        const input = e.target as HTMLInputElement | HTMLSelectElement;
        const value = input.value;

        try {
            // Bereite die Daten für den Service-Aufruf vor
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
            const plantName = plant.entity_id.split('.')[1];
            
            if (!isNaN(value)) {
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
        } else if (e.key === 'Escape') {
            this._editingCell = null;
            this.requestUpdate();
        }
    }

    private getCellValue(plant: HomeAssistantEntity, columnId: string): string | HTMLTemplateResult {
        const plantName = plant.entity_id.split('.')[1];

        // Wenn die Zelle gerade bearbeitet wird
        if (this._editingCell?.entityId === plant.entity_id && this._editingCell?.column === columnId) {
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
                } else {
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
            }

            // Min/Max Helper
            if (columnId.startsWith('min_') || columnId.startsWith('max_')) {
                const helperEntity = this._hass?.states[`number.${plantName}_${columnId}`];
                const unit = helperEntity?.attributes.unit_of_measurement || '';
                return html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${helperEntity?.state || ''}"
                        @keydown=${(e: KeyboardEvent) => this.handleHelperUpdate(e, plant, columnId)}
                        @click=${(e: Event) => e.stopPropagation()}
                        style="width: 80px;"
                    > ${unit}
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

        // Normale Darstellung der Zelle
        switch (columnId) {
            case 'friendly_name':
                return html`
                    <div class="plant-name">
                        <img src="${plant.attributes.entity_picture || ''}" alt="${plant.attributes.friendly_name}">
                        ${plant.attributes.friendly_name}
                    </div>
                `;
            case 'state':
                return html`
                    <ha-icon .icon="mdi:${plant.state.toLowerCase() === 'problem' ? 'alert-circle-outline' : 'check-circle-outline'}">
                    </ha-icon>
                    ${plant.state}
                `;
            case 'growth_phase':
                const growthPhaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
                if (this._editingCell?.entityId === plant.entity_id && this._editingCell?.column === 'growth_phase') {
                    const options = this.getGrowthPhaseOptions(plantName);
                    return html`
                        <select
                            @change=${(e: Event) => this.handleGrowthPhaseUpdate(e, plant)}
                            @click=${(e: Event) => e.stopPropagation()}
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
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, 'growth_phase')}>
                        ${growthPhaseEntity?.state || 'Nicht verfügbar'}
                    </span>
                `;
            case 'pot_size':
                const potSizeEntity = this._hass?.states[`number.${plantName}_pot_size`];
                if (this._editingCell?.entityId === plant.entity_id && this._editingCell?.column === 'pot_size') {
                    return html`
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            .value="${potSizeEntity?.state || ''}"
                            @keydown=${(e: KeyboardEvent) => this.handlePotSizeUpdate(e, plant)}
                            @click=${(e: Event) => e.stopPropagation()}
                            style="width: 60px;"
                        >L
                    `;
                }
                return html`
                    <span @click=${(e: Event) => this.handleCellClick(e, plant, 'pot_size')}>
                        ${potSizeEntity ? `${potSizeEntity.state}L` : 'Nicht verfügbar'}
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
                const cycleEntity = this._hass?.states[`select.${plantName}_cycle`];
                if (this._editingCell?.entityId === plant.entity_id && this._editingCell?.column === 'cycle') {
                    const options = this.getCycleOptions(plantName);
                    return html`
                        <select
                            @change=${(e: Event) => this.handleCycleUpdate(e, plant)}
                            @click=${(e: Event) => e.stopPropagation()}
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
                const sensorEntity = this._hass?.states[`sensor.${plantName}_${columnId}`];
                if (!sensorEntity) return '-';
                const unit = sensorEntity.attributes.unit_of_measurement || '';
                return html`${sensorEntity.state} ${unit}`;

            case 'ppfd':
                const ppfdEntity = this._hass?.states[`sensor.${plantName}_ppfd_mol`];
                if (!ppfdEntity) return '-';
                const ppfdUnit = ppfdEntity.attributes.unit_of_measurement || '';
                return html`${this.formatNumber(ppfdEntity.state, 6)} ${ppfdUnit}`;

            case 'total_ppfd':
                const totalPpfdEntity = this._hass?.states[`sensor.${plantName}_total_ppfd_mol_integral`];
                if (!totalPpfdEntity) return '-';
                const totalPpfdUnit = totalPpfdEntity.attributes.unit_of_measurement || '';
                return html`${this.formatNumber(totalPpfdEntity.state, 6)} ${totalPpfdUnit}`;

            case 'water_consumption':
            case 'fertilizer_consumption':
                const consumptionEntity = this._hass?.states[`sensor.${plantName}_${columnId}`];
                if (!consumptionEntity) return '-';
                const consumptionUnit = consumptionEntity.attributes.unit_of_measurement || '';
                return html`${consumptionEntity.state} ${consumptionUnit}`;

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

    render(): HTMLTemplateResult {
        if (!this._hass) return html``;

        const sortedPlants = this.getSortedPlants();
        const visibleColumns = this.getVisibleColumns();

        return html`
            <ha-card>
                <div class="card-header">
                    <div class="name">Pflanzenübersicht</div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                ${visibleColumns.map(column => html`
                                    <th @click=${() => this.handleSort(column.id)} data-column="${column.id}">
                                        ${column.name}
                                        ${this._sortColumn === column.id ? 
                                            html`<ha-icon icon="mdi:${this._sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}"></ha-icon>` : ''}
                                    </th>
                                `)}
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedPlants.map(plant => html`
                                <tr>
                                    ${visibleColumns.map(column => html`
                                        <td data-column="${column.id}" 
                                            @click=${(e: Event) => this.handleRowClick(e, plant, column.id)}
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
        const mainEntityColumns = ['friendly_name', 'state', 
            'moisture_status', 'temperature_status', 'conductivity_status', 
            'illuminance_status', 'humidity_status', 'dli_status'];
        
        const sensorColumns = [
            'soil_moisture', 'temperature', 'conductivity', 'illuminance', 
            'air_humidity', 'dli', 'ppfd', 'total_ppfd', 'water_consumption', 
            'fertilizer_consumption'
        ];
        
        if (mainEntityColumns.includes(columnId) || sensorColumns.includes(columnId)) {
            return 'pointer';
        }
        if (columnId === 'pot_size' || 
            columnId === 'growth_phase' || 
            columnId === 'cycle' || 
            columnId === 'area' ||
            columnId.startsWith('min_') || 
            columnId.startsWith('max_') || 
            this.EDITABLE_PLANT_ATTRIBUTES.includes(columnId)) {
            return 'text';
        }
        return 'default';
    }

    getCardSize(): number {
        return 1 + Math.ceil(this.plantEntities.length / 2);
    }

    static get styles(): CSSResult {
        return style;
    }

    private getAreaOptions(): string[] {
        if (!this._hass) return [];
        
        // Hole alle Areas aus Home Assistant
        const areas = Object.values(this._hass.areas || {});
        return areas.map(area => area.name).sort();
    }

    private async handleAreaUpdate(e: Event, plant: HomeAssistantEntity): Promise<void> {
        const select = e.target as HTMLSelectElement;
        const areaName = select.value;
        const areas = Object.entries(this._hass?.areas || {});
        const areaId = areas.find(([_, area]) => area.name === areaName)?.[0];
        const entityRegistry = this._hass?.entities || {};
        const entityEntry = entityRegistry[plant.entity_id];
        
        if (entityEntry?.device_id) {
            try {
                if (areaId) {
                    // Area zuweisen
                    await this._hass?.callService('homeassistant', 'add_device_to_area', {
                        area_id: areaId,
                        device_id: [entityEntry.device_id]
                    });
                } else {
                    // Area entfernen
                    await this._hass?.callService('homeassistant', 'remove_device_from_area', {
                        device_id: [entityEntry.device_id]
                    });
                }
                this._editingCell = null;
                this.requestUpdate();
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Bereichs:', error);
            }
        }
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
}