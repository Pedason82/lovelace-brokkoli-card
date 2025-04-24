import { CSSResult, HTMLTemplateResult, LitElement, html, TemplateResult } from 'lit';
import {customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { style } from './styles';
import { DisplayType, BrokkoliCardConfig, HomeAssistantEntity, PlantInfo } from './types/brokkoli-card-types';
import * as packageJson from '../package.json';
import { renderAttributes, renderBattery } from './utils/attributes';
import { CARD_EDITOR_NAME, CARD_NAME, default_show_bars, default_show_elements, default_option_elements, missingImage, getGrowthPhaseIcon } from './utils/constants';
import { moreInfo } from './utils/utils';
import './components/gallery';
import './components/timeline';
import './components/graph';
import './components/consumption';
import './components/history';

console.info(
    `%c BROKKOLI-CARD %c ${packageJson.version}`,
    'color: cyan; background: black; font-weight: bold;',
    'color: darkblue; background: white; font-weight: bold;'
);

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: CARD_NAME,
    name: 'Brokkoli card',
    preview: true,
    description: 'Custom brokkoli card for https://github.com/Olen/homeassistant-plant',
});
/* eslint-disable @typescript-eslint/no-explicit-any */

@customElement(CARD_NAME)
export default class BrokkoliCard extends LitElement {
    @property() _hass?: any;
    @property() config?: BrokkoliCardConfig;
    @state() private _expanded: { [key: string]: boolean } = {
        attributes: false,
        timeline: false,
        consumption: false,
        history: false,
        details: false,
    };
    @state() private _expandedOrder: string[] = [];
    @state() private _showGallery = false;
    @state() private _currentImageIndex = 0;
    @state() private _nextImageIndex = 1;
    @state() private _isFading = false;
    @state() private _activePopup: string | null = null;
    @state() private _showFlyoutMenu = false;
    @state() private _popupData: any = {};
    @state() private _showPlantDropdown = false;
    @state() public selectedPlantEntity: string | null = null;
    @state() private _listenToSelector: string | null = null;
    @state() private _selectedEntities: string[] = [];
    private _imageRotationInterval?: NodeJS.Timeout;

    private stateObj: HomeAssistantEntity | undefined;
    private previousFetchDate: number;
    private _imageUrls: string[] = [];

    plantinfo: PlantInfo;

    private getGrowthPhaseIcon(phase: string): string {
        return getGrowthPhaseIcon(phase);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }
        
        // Event-Listener für Cycle-Member-Wechsel entfernen
        window.removeEventListener('brokkoli-card-cycle-member-selected', this._handleCycleMemberSelected);
        
        // Event-Listener für Card-Selection entfernen
        window.removeEventListener('brokkoli-card-entity-selected', this._handleCardEntitySelected);
    }

    connectedCallback() {
        super.connectedCallback();
        this._startImageRotation();
        
        // Event-Listener für Cycle-Member-Wechsel hinzufügen
        window.addEventListener('brokkoli-card-cycle-member-selected', this._handleCycleMemberSelected);
        
        // Event-Listener für Card-Selection hinzufügen
        window.addEventListener('brokkoli-card-entity-selected', this._handleCardEntitySelected);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        
        // Wenn eine Plant ausgewählt wurde, verwende diese statt der Entity aus der Konfiguration
        if (this.selectedPlantEntity) {
            this.stateObj = hass.states[this.selectedPlantEntity];
        } else if (this.config?.entity) {
            this.stateObj = hass.states[this.config.entity];
        } else {
            // Wenn weder eine ausgewählte Plant noch eine konfigurierte Entity vorhanden ist
            this.stateObj = undefined;
        }

        if (!this.previousFetchDate) {
            this.previousFetchDate = 0;
        }
        if (Date.now() > this.previousFetchDate + 1000) {
            this.previousFetchDate = Date.now();
            this.get_data(hass).then(() => {
                this.requestUpdate();
            });
        }
    }

    public static async getConfigElement(): Promise<LovelaceCardEditor> {
        await import("./editor");
        return document.createElement(CARD_EDITOR_NAME) as LovelaceCardEditor;
    }

    static getStubConfig(ha: HomeAssistant) {
        const isPlant = (entity: HomeAssistantEntity | unknown): entity is HomeAssistantEntity => {
            if (typeof entity == 'object' && 'entity_id' in entity && typeof entity.entity_id == 'string' && 
                (entity.entity_id.indexOf('plant.') === 0 || entity.entity_id.indexOf('cycle.') === 0)) {
                return !!entity;
            }
        }
        let supportedEntities: Array<any> = [];
        try {
            supportedEntities = Object.values(ha.states).filter(isPlant);
        }
        catch(e) {
            console.info(`Unable to get ha-data: ${e}`);
        }
        const entity = supportedEntities.length > 0 ? supportedEntities[0].entity_id : 'plant.my_plant';

        return {
            entity: entity,
            battery_sensor: "sensor.myflower_battery",
            show_bars: [...default_show_bars],
            show_elements: [...default_show_elements],
            option_elements: [...default_option_elements]
        }
    }

    setConfig(config: BrokkoliCardConfig): void {
        if (!config.entity && !config.listen_to) {
            throw new Error("Du musst entweder eine Entity oder listen_to definieren");
        }

        // Erstelle ein neues Konfigurationsobjekt mit Standardwerten
        this.config = {
            ...config,
            // Setze Standardwerte nur, wenn die entsprechenden Eigenschaften nicht definiert sind
            show_elements: config.show_elements || [...default_show_elements],
            option_elements: config.option_elements || [...default_option_elements]
        };
        
        // Setze den Card-Selektor, falls vorhanden
        if (config.listen_to) {
            this._listenToSelector = config.listen_to;
        }
        
        // Setze _expandedOrder zurück, wenn die Konfiguration geändert wird
        this._expandedOrder = [];
        
        // Setze die standardmäßig geöffneten Optionsbereiche, wenn konfiguriert
        if (this.config.default_expanded_options?.length) {
            // Filtere nur gültige Optionen
            const validOptions = this.config.default_expanded_options.filter(
                option => this.config.option_elements.includes(option)
            );
            
            // Setze den Expanded-Status für jede gültige Option
            this._expanded = {
                ...this._expanded,
                ...Object.fromEntries(validOptions.map(option => [option, true]))
            };
            
            // Setze die Reihenfolge der geöffneten Optionen
            this._expandedOrder = [...validOptions];
        }
    }

    // Hilfsfunktion zum Rendern eines Elements basierend auf der Konfiguration
    private _renderElement(element: string): TemplateResult {
        switch(element) {
            case 'header':
                return this._renderHeader();
            case 'attributes':
                return this._renderAttributes();
            case 'options':
                return this._renderOptions();
            case 'timeline':
                return this._renderTimeline();
            case 'consumption':
                return this._renderConsumption();
            case 'history':
                return this._renderHistory();
            case 'details':
                return this._renderDetails();
            default:
                return html``;
        }
    }

    private _renderHeader(): TemplateResult {
        const headerCssClass = this.config.display_type === DisplayType.Compact ? "header-compact" : "header";
        const plantName = this.stateObj.entity_id.split('.')[1];
        
        // Prüfe, ob es sich um einen Cycle handelt
        const isCycle = this.stateObj.entity_id.startsWith('cycle.');
        const isSelectedPlant = this.selectedPlantEntity !== null;
        
        // Informationen für Plants oder Cycles unterschiedlich darstellen
        let infoLine = '';
        let memberPlants: string[] = [];
        
        // Hole die member_plants aus dem ursprünglichen Cycle, wenn eine Plant ausgewählt ist
        if (isSelectedPlant && this._popupData.originalEntity) {
            const originalCycleName = this._popupData.originalEntity.split('.')[1];
            const growthPhaseEntity = this._hass.states[`select.${originalCycleName}_growth_phase`];
            
            if (growthPhaseEntity && growthPhaseEntity.attributes.member_plants) {
                memberPlants = growthPhaseEntity.attributes.member_plants;
            }
        } else if (isCycle) {
            // Bei einem Cycle die member_plants direkt aus dem Cycle holen
            const cycleName = this.stateObj.entity_id.split('.')[1];
            const growthPhaseEntity = this._hass.states[`select.${cycleName}_growth_phase`];
            
            if (growthPhaseEntity && growthPhaseEntity.attributes.member_plants) {
                memberPlants = growthPhaseEntity.attributes.member_plants;
            }
        }
        
        // Setze die Info-Zeile basierend auf dem Typ (Cycle oder Plant)
        if (isCycle) {
            // Bei einem Cycle zeigen wir die Anzahl der Plants an
            const memberCount = this.stateObj.attributes.member_count || 0;
            infoLine = `${memberCount} Plants`;
        } else if (this._listenToSelector && this._selectedEntities.length > 1) {
            // Bei Mehrfachauswahl zeigen wir die Anzahl der ausgewählten Pflanzen an
            infoLine = `${this._selectedEntities.length} Plants ausgewählt`;
        } else {
            // Bei einer Plant zeigen wir Strain und Breeder an
            infoLine = this.stateObj.attributes.strain + " - " + this.stateObj.attributes.breeder;
        }
        
        const growthPhaseEntity = this._hass.states[`select.${plantName}_growth_phase`];
        const potSizeEntity = this._hass.states[`number.${plantName}_pot_size`];

        const growthPhase = growthPhaseEntity ? growthPhaseEntity.state : 'Nicht verfügbar';
        const potSize = potSizeEntity ? potSizeEntity.state + 'L' : 'Nicht verfügbar';

        // Prüfe, ob der Header das einzige Element ist
        const showDivider = this.config.show_elements.length > 1;

        return html`
            <div class="${headerCssClass}">
                <div class="menu-button" @click="${this._toggleFlyoutMenu}">
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </div>
                ${this._showFlyoutMenu ? this._renderFlyoutMenu() : ''}
                <div class="image-container">
                    <img class="back-image" 
                         src="${this._imageUrls[this._nextImageIndex] || this._imageUrls[this._currentImageIndex] || missingImage}">
                    <img class="front-image ${this._isFading ? 'fade' : ''}" 
                         src="${this._imageUrls[this._currentImageIndex] || missingImage}" 
                         @click="${() => this._showGallery = true}">
                </div>
                <span id="name" @click="${() => moreInfo(this, this.stateObj.entity_id)}"> ${this.stateObj.attributes.friendly_name
                } <ha-icon .icon="mdi:${this.stateObj.state.toLowerCase() == "problem"
                    ? "alert-circle-outline"
                    : ""
                }"></ha-icon>
                </span>
                <span id="battery">${renderBattery(this)}</span>
                ${isCycle || isSelectedPlant || (this._listenToSelector !== null && this._selectedEntities.length > 0) ? 
                    html`
                    <div id="species" class="plant-dropdown-container">
                        <div @click="${this._togglePlantDropdown}" class="clickable-plants">
                            ${infoLine}
                            <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </div>
                        ${this._showPlantDropdown ? this._renderPlantDropdown(memberPlants) : ''}
                    </div>
                    ` : 
                    html`<span id="species">${infoLine}</span>`
                }
                ${this.config.display_type !== DisplayType.Compact ? html`
                <div id="status-container">
                    <span @click="${() => moreInfo(this, `number.${plantName}_pot_size`)}">
                        <ha-icon icon="mdi:cup"></ha-icon>${potSize}
                    </span>
                    <span @click="${() => moreInfo(this, `select.${plantName}_growth_phase`)}">
                        <ha-icon icon="${this.getGrowthPhaseIcon(growthPhase)}"></ha-icon>${growthPhase}
                    </span>
                    </div>
                ` : ''}
                </div>
                ${showDivider ? html`<div class="divider"></div>` : ''}
            ${this._renderPopups()}
        `;
    }

    private _togglePlantDropdown(e: Event) {
        e.stopPropagation();
        this._showPlantDropdown = !this._showPlantDropdown;
        this.requestUpdate();
        
        // Wenn das Dropdown geöffnet wird, fügen wir einen Event-Listener hinzu, um es zu schließen, wenn außerhalb geklickt wird
        if (this._showPlantDropdown) {
            document.addEventListener('click', this._handleOutsideDropdownClick, { once: true });
        }
    }

    private _handleOutsideDropdownClick = (e: MouseEvent) => {
        this._showPlantDropdown = false;
        this.requestUpdate();
    }

    private _renderPlantDropdown(plants: string[]): TemplateResult {
        // Wenn keine Plants übergeben wurden, aber wir haben ausgewählte Entities, verwende diese
        if (!plants.length && this._selectedEntities.length > 0) {
            plants = [...this._selectedEntities];
        }

        if (!plants.length) {
            return html`
                <div class="plant-dropdown">
                    <div class="plant-dropdown-item">Keine Pflanzen gefunden</div>
                </div>
            `;
        }
        
        // Füge den Cycle selbst als erste Option hinzu, wenn eine Plant ausgewählt ist
        const isSelectedPlant = this.selectedPlantEntity !== null;
        const cycleOption = isSelectedPlant && this._popupData.originalEntity ? [this._popupData.originalEntity] : [];
        const allOptions = [...cycleOption, ...plants];
        
        return html`
            <div class="plant-dropdown">
                ${allOptions.map(plant => {
                    const plantEntity = this._hass.states[plant];
                    
                    if (!plantEntity) return html`
                        <div class="plant-dropdown-item">
                            <div class="plant-dropdown-name">${plant}</div>
                            <div class="plant-dropdown-info">Entity nicht gefunden</div>
                        </div>
                    `;
                    
                    // Prüfe, ob es sich um den Cycle handelt
                    const isCycle = plant.startsWith('cycle.');
                    const plantName = plantEntity.attributes.friendly_name || plant.split('.')[1];
                    
                    if (isCycle) {
                        return html`
                            <div class="plant-dropdown-item" @click="${() => this._returnToCycle()}">
                                <div class="plant-dropdown-name">${plantName}</div>
                                <div class="plant-dropdown-info">Zurück zum Cycle</div>
                            </div>
                        `;
                    }
                    
                    const strain = plantEntity.attributes.strain || '';
                    const breeder = plantEntity.attributes.breeder || '';
                    
                    return html`
                        <div class="plant-dropdown-item" @click="${() => this._selectPlant(plant)}">
                            <div class="plant-dropdown-name">${plantName}</div>
                            <div class="plant-dropdown-info">${strain} - ${breeder}</div>
                        </div>
                    `;
                })}
            </div>
        `;
    }

    private _selectPlant(entityId: string) {
        // Speichere die ausgewählte Plant
        this.selectedPlantEntity = entityId;
        
        // Schließe das Dropdown
        this._showPlantDropdown = false;
        
        // Speichere die ursprüngliche Entity-ID, um zurückkehren zu können
        if (!this._popupData.originalEntity && this.stateObj) {
            this._popupData.originalEntity = this.stateObj.entity_id;
        }
        
        // Lade die Daten der ausgewählten Plant
        if (this._hass) {
            // Temporär die stateObj auf die ausgewählte Plant setzen
            const originalStateObj = this.stateObj;
            this.stateObj = this._hass.states[entityId];
            
            // Daten laden und UI aktualisieren
            this.get_data(this._hass).then(() => {
                // Aktualisiere die Graph-Komponenten
                const graphElements = this.shadowRoot?.querySelectorAll('flower-graph') as NodeListOf<any>;
                if (graphElements) {
                    graphElements.forEach(graph => {
                        if (graph) {
                            graph.entityId = entityId;
                            // Zuerst den Datumsbereich aktualisieren, dann die Daten
                            if (typeof graph.updateDateRange === 'function') {
                                graph.updateDateRange().then(() => {
                                    if (typeof graph.updateGraphData === 'function') {
                                        graph.updateGraphData(true);
                                    }
                                });
                            } else if (typeof graph.updateGraphData === 'function') {
                                // Fallback, falls updateDateRange nicht verfügbar ist
                                graph.updateGraphData(true);
                            }
                        }
                    });
                }
                
                // Aktualisiere die Consumption-Komponenten
                const consumptionElements = this.shadowRoot?.querySelectorAll('flower-consumption') as NodeListOf<any>;
                if (consumptionElements) {
                    consumptionElements.forEach(consumption => {
                        if (consumption) {
                            consumption.entityId = entityId;
                        }
                    });
                }
                
                // Event auslösen, um andere Flower-Cards zu informieren
                const cycleMemberSelectedEvent = new CustomEvent('brokkoli-card-cycle-member-selected', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        originalEntityId: this._popupData.originalEntity || this.config?.entity,
                        selectedEntityId: entityId,
                        sourceCardId: this
                    }
                });
                window.dispatchEvent(cycleMemberSelectedEvent);
                
                this.requestUpdate();
            });
        }
    }

    private _toggleFlyoutMenu(e: Event) {
        e.stopPropagation();
        this._showFlyoutMenu = !this._showFlyoutMenu;
        
        if (this._showFlyoutMenu) {
            // Füge Event-Listener hinzu, um Klicks außerhalb des Menüs zu erkennen
            document.addEventListener('click', this._handleOutsideClick);
        } else {
            // Entferne Event-Listener, wenn das Menü geschlossen wird
            document.removeEventListener('click', this._handleOutsideClick);
        }
    }

    private _handleOutsideClick = (e: MouseEvent) => {
        const path = e.composedPath();
        if (!path.some(el => el instanceof HTMLElement && el.classList.contains('flyout-menu'))) {
            this._showFlyoutMenu = false;
            document.removeEventListener('click', this._handleOutsideClick);
        }
    }

    private _renderFlyoutMenu(): TemplateResult {
        // Zeige unterschiedliche Menüoptionen für Plants und Cycles
        const isCycle = this.stateObj.entity_id.startsWith('cycle.');
        const isSelectedPlant = this.selectedPlantEntity !== null;
        
        return html`
            <div class="flyout-menu">
                ${isSelectedPlant ? html`
                    <div class="flyout-menu-item" @click="${this._returnToCycle}">
                        <ha-icon icon="mdi:arrow-left"></ha-icon>
                        <span>Zurück zum Cycle</span>
                    </div>
                    <div class="flyout-menu-divider"></div>
                ` : ''}
                <div class="flyout-menu-item" @click="${() => { this._activePopup = 'clone'; this._showFlyoutMenu = false; }}">
                    <ha-icon icon="mdi:content-duplicate"></ha-icon>
                    <span>Pflanze klonen</span>
                </div>
                <div class="flyout-menu-item" @click="${() => { this._activePopup = 'move'; this._showFlyoutMenu = false; }}">
                    <ha-icon icon="mdi:arrow-decision"></ha-icon>
                    <span>Zu Zyklus verschieben</span>
                </div>
                <div class="flyout-menu-item" @click="${() => { this._activePopup = 'replace'; this._showFlyoutMenu = false; }}">
                    <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                    <span>Sensoren ersetzen</span>
                </div>
                <div class="flyout-menu-item" @click="${() => { this._activePopup = 'remove'; this._showFlyoutMenu = false; }}">
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                    <span>Pflanze löschen</span>
                </div>
            </div>
        `;
    }

    private _returnToCycle() {
        if (this._popupData.originalEntity && this._hass) {
            // Zurück zum ursprünglichen Cycle
            this.selectedPlantEntity = null;
            this.stateObj = this._hass.states[this._popupData.originalEntity];
            
            // Daten laden und UI aktualisieren
            this.get_data(this._hass).then(() => {
                // Aktualisiere die Graph-Komponenten
                const graphElements = this.shadowRoot?.querySelectorAll('flower-graph') as NodeListOf<any>;
                if (graphElements) {
                    graphElements.forEach(graph => {
                        if (graph) {
                            graph.entityId = this._popupData.originalEntity;
                            // Zuerst den Datumsbereich aktualisieren, dann die Daten
                            if (typeof graph.updateDateRange === 'function') {
                                graph.updateDateRange().then(() => {
                                    if (typeof graph.updateGraphData === 'function') {
                                        graph.updateGraphData(true);
                                    }
                                });
                            } else if (typeof graph.updateGraphData === 'function') {
                                // Fallback, falls updateDateRange nicht verfügbar ist
                                graph.updateGraphData(true);
                            }
                        }
                    });
                }
                
                // Aktualisiere die Consumption-Komponenten
                const consumptionElements = this.shadowRoot?.querySelectorAll('flower-consumption') as NodeListOf<any>;
                if (consumptionElements) {
                    consumptionElements.forEach(consumption => {
                        if (consumption) {
                            consumption.entityId = this._popupData.originalEntity;
                        }
                    });
                }
                
                // Event auslösen, um andere Flower-Cards zu informieren
                const cycleMemberSelectedEvent = new CustomEvent('brokkoli-card-cycle-member-selected', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        originalEntityId: this._popupData.originalEntity,
                        selectedEntityId: this._popupData.originalEntity,
                        sourceCardId: this
                    }
                });
                window.dispatchEvent(cycleMemberSelectedEvent);
                
                // Zurücksetzen der originalEntity
                this._popupData.originalEntity = null;
                
                this.requestUpdate();
            });
        }
        
        // Schließe das Dropdown
        this._showPlantDropdown = false;
    }

    private async _handleClonePlant() {
        const result = await this._hass.callService('plant', 'clone_plant', {
            source_entity_id: this.stateObj.entity_id,
            ...this._popupData
        });
        this._closePopup();
    }

    private async _handleMoveToCycle() {
        await this._hass.callService('plant', 'move_to_cycle', {
            plant_entity: this.stateObj.entity_id,
            cycle_entity: this._popupData.cycle_entity
        });
        this._closePopup();
    }

    private async _handleRemovePlant() {
        await this._hass.callService('plant', 'remove_plant', {
            plant_entity: this.stateObj.entity_id
        });
        this._closePopup();
    }

    private async _handleReplaceSensors() {
        const sensorTypes = ['temperature', 'moisture', 'illuminance', 'humidity', 'conductivity', 'power_consumption'];
        const plantName = this.stateObj.entity_id.split('.')[1];
        
        for (const type of sensorTypes) {
            const newSensor = this._popupData[`new_${type}_sensor`];
            
            if (newSensor) {
                const currentSensor = `sensor.${plantName}_${type}`;
                await this._hass.callService('plant', 'replace_sensor', {
                    meter_entity: currentSensor,
                    new_sensor: newSensor
                });
            }
        }
        this._closePopup();
    }

    private _closePopup() {
        this._activePopup = null;
        this._popupData = {};
        this.requestUpdate();
    }

    private _renderPopups(): TemplateResult {
        if (!this._activePopup) return html``;

        switch (this._activePopup) {
            case 'clone':
                return this._renderClonePopup();
            case 'move':
                return this._renderMovePopup();
            case 'remove':
                return this._renderRemovePopup();
            case 'replace':
                return this._renderReplacePopup();
            default:
                return html``;
        }
    }

    private _renderClonePopup(): TemplateResult {
        return html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="popup-title">Pflanze klonen</div>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" .value="${this._popupData.name || ''}"
                               @input="${(e: InputEvent) => this._popupData.name = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Temperatursensor</label>
                        <input type="text" .value="${this._popupData.temperature_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.temperature_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Feuchtigkeitssensor</label>
                        <input type="text" .value="${this._popupData.moisture_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.moisture_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Beleuchtungssensor</label>
                        <input type="text" .value="${this._popupData.illuminance_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.illuminance_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Luftfeuchtigkeitssensor</label>
                        <input type="text" .value="${this._popupData.humidity_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.humidity_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Leitfähigkeitssensor</label>
                        <input type="text" .value="${this._popupData.conductivity_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.conductivity_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="form-field">
                        <label>Stromverbrauchssensor</label>
                        <input type="text" .value="${this._popupData.power_consumption_sensor || ''}"
                               @input="${(e: InputEvent) => this._popupData.power_consumption_sensor = (e.target as HTMLInputElement).value}">
                    </div>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleClonePlant}">Klonen</button>
                    </div>
                </div>
            </div>
        `;
    }

    private _renderMovePopup(): TemplateResult {
        const cycles = Object.entries(this._hass.states)
            .filter(([entity_id]) => entity_id.startsWith('cycle.'))
            .map(([entity_id, state]: [string, any]) => ({
                entity_id,
                name: state.attributes?.friendly_name || entity_id.split('.')[1]
            }));

        return html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="popup-title">Zu Zyklus verschieben</div>
                    <div class="form-field">
                        <label>Zyklus auswählen</label>
                        <select @change="${(e: Event) => this._popupData.cycle_entity = (e.target as HTMLSelectElement).value}">
                            <option value="">Bitte wählen...</option>
                            ${cycles.map(cycle => html`
                                <option value="${cycle.entity_id}">${cycle.name}</option>
                            `)}
                        </select>
                    </div>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleMoveToCycle}" ?disabled="${!this._popupData.cycle_entity}">
                            Verschieben
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    private _renderRemovePopup(): TemplateResult {
        return html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="popup-title">Pflanze löschen</div>
                    <p>Möchten Sie diese Pflanze wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleRemovePlant}" class="danger">
                            Löschen bestätigen
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    private _renderReplacePopup(): TemplateResult {
        const plantName = this.stateObj.entity_id.split('.')[1];
        
        const sensorTypes = [
            { key: 'temperature', label: 'Temperatursensor', icon: 'mdi:thermometer' },
            { key: 'moisture', label: 'Bodenfeuchtigkeit', icon: 'mdi:water-percent' },
            { key: 'illuminance', label: 'Beleuchtungssensor', icon: 'mdi:brightness-5' },
            { key: 'humidity', label: 'Luftfeuchtigkeitssensor', icon: 'mdi:water' },
            { key: 'conductivity', label: 'Leitfähigkeitssensor', icon: 'mdi:flash' },
            { key: 'power_consumption', label: 'Stromverbrauchssensor', icon: 'mdi:power-plug' }
        ];

        // Filtere alle verfügbaren Sensoren nach Typ
        const getSensorsByType = (type: string): Array<{entity_id: string, name: string}> => {
            // Erstelle ein Muster, um Sensoren der Plant Integration zu identifizieren
            // Wir müssen für alle Typen ein allgemeines Muster verwenden
            const plantSensorPattern = new RegExp(`^sensor\\..*_(${type}|min_${type}|max_${type}|soil_moisture|air_humidity)$`);
            
            return Object.entries(this._hass.states)
                .filter(([entity_id]) => {
                    // Nur Sensoren berücksichtigen
                    if (!entity_id.startsWith('sensor.')) return false;
                    
                    // Sensoren der Plant Integration ausschließen
                    if (plantSensorPattern.test(entity_id)) return false;
                    
                    // Spezifische Sensoren dieser Pflanze ausschließen
                    if (entity_id.includes(`${plantName}_`)) return false;
                    
                    // Alle Sensoren mit "plant" im Namen ausschließen
                    if (entity_id.includes('plant')) return false;
                    
                    return true;
                })
                .filter(([entity_id, state]: [string, any]) => {
                    // Filtere nach Sensortyp basierend auf Attributen oder Einheiten
                    const deviceClass = state.attributes?.device_class;
                    const unit = state.attributes?.unit_of_measurement;
                    
                    switch(type) {
                        case 'temperature':
                            return deviceClass === 'temperature' || unit === '°C' || unit === '°F';
                        case 'moisture':
                            return deviceClass === 'humidity' || unit === '%';
                        case 'illuminance':
                            return deviceClass === 'illuminance' || unit === 'lx' || unit === 'lm';
                        case 'humidity':
                            return deviceClass === 'humidity' || unit === '%';
                        case 'conductivity':
                            return unit === 'µS/cm' || unit === 'mS/cm';
                        case 'power_consumption':
                            return deviceClass === 'power' || 
                                   deviceClass === 'energy' || 
                                   unit === 'W' || 
                                   unit === 'kW' || 
                                   unit === 'kWh' || 
                                   unit === 'Wh';
                        default:
                            return false;
                    }
                })
                .map(([entity_id, state]: [string, any]) => ({
                    entity_id,
                    name: state.attributes?.friendly_name || entity_id
                }));
        };

        return html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="popup-title">Sensoren ersetzen</div>
                    ${sensorTypes.map(type => {
                        const availableSensors = getSensorsByType(type.key);
                        
                        return html`
                            <div class="form-field">
                                <label>
                                    <ha-icon icon="${type.icon}"></ha-icon>
                                    ${type.label}
                                </label>
                                <select @change="${(e: Event) => this._popupData[`new_${type.key}_sensor`] = (e.target as HTMLSelectElement).value}">
                                    <option value="">Bitte wählen...</option>
                                    ${availableSensors.length > 0 ? 
                                        availableSensors.map(sensor => html`
                                            <option value="${sensor.entity_id}">${sensor.name}</option>
                                        `) : 
                                        html`<option value="" disabled>Keine passenden Sensoren gefunden</option>`
                                    }
                                </select>
                            </div>
                        `;
                    })}
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleReplaceSensors}">Sensoren ersetzen</button>
                    </div>
                </div>
            </div>
        `;
    }

    private _renderOptions(): TemplateResult {
        // Verwende die Werte aus this.config, da wir sie bereits in setConfig gesetzt haben
        const optionElements = this.config.option_elements;
        
        // Überprüfe, ob es Optionen gibt
        if (optionElements.length === 0) {
            return html``;
        }
        
        // Definiere ein Mapping von Element-Namen zu Icons und Render-Funktionen
        const elementConfig: Record<string, { icon: string; expanded: boolean | undefined }> = {
            'attributes': {
                icon: 'mdi:tune',
                expanded: this._expanded?.attributes
            },
            'timeline': {
                icon: 'mdi:chart-timeline-variant',
                expanded: this._expanded?.timeline
            },
            'consumption': {
                icon: 'mdi:chart-box-outline',
                expanded: this._expanded?.consumption
            },
            'history': {
                icon: 'mdi:history',
                expanded: this._expanded?.history
            },
            'details': {
                icon: 'mdi:information-outline',
                expanded: this._expanded?.details
            }
        };
        
        return html`
            <div class="options-container">
                ${optionElements.map((element: string) => {
                    if (element in elementConfig) {
                        const config = elementConfig[element];
                        return html`
                            <div class="options-section ${config.expanded ? 'expanded' : ''}" 
                                 @click="${(e: Event) => this._toggleExpand(e, element)}">
                                <ha-icon icon="${config.icon}"></ha-icon>
                            </div>
                        `;
                    }
                    return '';
                })}
            </div>
        `;
    }

    private _renderTimeline(): TemplateResult {
        // Verwende die ausgewählte Plant, wenn vorhanden, sonst die konfigurierte Entity
        const entityId = this.selectedPlantEntity || this.config.entity;
        
        if (this.config.show_elements.includes('timeline')) {
            // Wenn timeline direkt angezeigt wird, in einen Container einbetten
            return html`
                <div class="timeline-container">
                    <flower-graph
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-graph>
                    <flower-timeline
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-timeline>
                </div>
            `;
        } else if (this._expanded?.timeline) {
            // Wenn timeline über das Optionsmenü angezeigt wird
            return html`
                <div class="expanded-content show" data-section="timeline">
                    <flower-graph
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-graph>
                    <flower-timeline
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-timeline>
                </div>
            `;
        }
        // Leeres div zurückgeben, wenn nicht angezeigt werden soll
        return html`<div class="expanded-content" data-section="timeline"></div>`;
    }

    private _renderConsumption(): TemplateResult {
        // Verwende die ausgewählte Plant, wenn vorhanden, sonst die konfigurierte Entity
        const entityId = this.selectedPlantEntity || this.config.entity;
        
        if (this.config.show_elements.includes('consumption')) {
            // Wenn consumption direkt angezeigt wird
            return html`
                <div class="component-container">
                    <flower-consumption
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-consumption>
                </div>
            `;
        } else if (this._expanded?.consumption) {
            // Wenn consumption über das Optionsmenü angezeigt wird
            return html`
                <div class="expanded-content show" data-section="consumption">
                    <flower-consumption
                        .hass=${this._hass}
                        .entityId=${entityId}
                    ></flower-consumption>
                </div>
            `;
        }
        // Leeres div zurückgeben, wenn nicht angezeigt werden soll
        return html`<div class="expanded-content" data-section="consumption"></div>`;
    }

    private _renderHistory(): TemplateResult {
        // Verwende die ausgewählte Plant, wenn vorhanden, sonst die konfigurierte Entity
        const entityId = this.selectedPlantEntity || this.config.entity;
        
        if (this.config.show_elements.includes('history')) {
            // Wenn history direkt angezeigt wird
            return html`
                <div class="component-container">
                    <flower-history
                        .hass=${this._hass}
                        .entityId=${entityId}
                        .historyGroups=${this.config.history_groups}
                        .linePosition=${this.config.history_line_position}
                    ></flower-history>
                </div>
            `;
        } else if (this._expanded?.history) {
            // Wenn history über das Optionsmenü angezeigt wird
            return html`
                <div class="expanded-content show" data-section="history">
                    <flower-history
                        .hass=${this._hass}
                        .entityId=${entityId}
                        .historyGroups=${this.config.history_groups}
                        .linePosition=${this.config.history_line_position}
                    ></flower-history>
                </div>
            `;
        }
        // Leeres div zurückgeben, wenn nicht angezeigt werden soll
        return html`<div class="expanded-content" data-section="history"></div>`;
    }

    private _renderDetails(): TemplateResult {
        if (this.config.show_elements.includes('details')) {
            // Wenn details direkt angezeigt wird
            return html`
                <div class="plant-details">
                    <div class="detail-item">
                        <span class="label">Sorte</span>
                        <span class="value">${this.stateObj.attributes.variety || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Feminized</span>
                        <span class="value">${this.stateObj.attributes.feminized || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Effects</span>
                        <span class="value">${this.stateObj.attributes.effects || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Smell</span>
                        <span class="value">${this.stateObj.attributes.smell || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Taste</span>
                        <span class="value">${this.stateObj.attributes.taste || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Phenotype</span>
                        <span class="value">${this.stateObj.attributes.phenotype || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Hunger</span>
                        <span class="value">${this.stateObj.attributes.hunger || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Growth stretch</span>
                        <span class="value">${this.stateObj.attributes.growth_stretch || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Flower stretch</span>
                        <span class="value">${this.stateObj.attributes.flower_stretch || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Mold resistance</span>
                        <span class="value">${this.stateObj.attributes.mold_resistance || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Difficulty</span>
                        <span class="value">${this.stateObj.attributes.difficulty || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Yield</span>
                        <span class="value">${this.stateObj.attributes.yield || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Website</span>
                        ${this.stateObj.attributes.website ? html`
                            <a href="${this.stateObj.attributes.website}" target="_blank" class="value link">${this.stateObj.attributes.website}</a>
                        ` : html`<span class="value">-</span>`}
                    </div>
                    <div class="detail-item">
                        <span class="label">Notes</span>
                        <span class="value">${this.stateObj.attributes.notes || '-'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="label">Infotext 1</span>
                        <span class="value">${this.stateObj.attributes.infotext1 || '-'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="label">Infotext 2</span>
                        <span class="value">${this.stateObj.attributes.infotext2 || '-'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="label">Lineage</span>
                        <span class="value">${this.stateObj.attributes.lineage || '-'}</span>
                    </div>
                </div>
            `;
        } else if (this._expanded?.details) {
            // Wenn details über das Optionsmenü angezeigt wird
            return html`
                <div class="expanded-content show" data-section="details">
                    <div class="plant-details">
                        <div class="detail-item">
                            <span class="label">Sorte</span>
                            <span class="value">${this.stateObj.attributes.variety || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Feminized</span>
                            <span class="value">${this.stateObj.attributes.feminized || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Effects</span>
                            <span class="value">${this.stateObj.attributes.effects || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Smell</span>
                            <span class="value">${this.stateObj.attributes.smell || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Taste</span>
                            <span class="value">${this.stateObj.attributes.taste || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Phenotype</span>
                            <span class="value">${this.stateObj.attributes.phenotype || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Hunger</span>
                            <span class="value">${this.stateObj.attributes.hunger || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Growth stretch</span>
                            <span class="value">${this.stateObj.attributes.growth_stretch || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Flower stretch</span>
                            <span class="value">${this.stateObj.attributes.flower_stretch || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Mold resistance</span>
                            <span class="value">${this.stateObj.attributes.mold_resistance || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Difficulty</span>
                            <span class="value">${this.stateObj.attributes.difficulty || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Yield</span>
                            <span class="value">${this.stateObj.attributes.yield || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Website</span>
                            ${this.stateObj.attributes.website ? html`
                                <a href="${this.stateObj.attributes.website}" target="_blank" class="value link">${this.stateObj.attributes.website}</a>
                            ` : html`<span class="value">-</span>`}
                        </div>
                        <div class="detail-item">
                            <span class="label">Notes</span>
                            <span class="value">${this.stateObj.attributes.notes || '-'}</span>
                        </div>
                        <div class="detail-item full-width">
                            <span class="label">Infotext 1</span>
                            <span class="value">${this.stateObj.attributes.infotext1 || '-'}</span>
                        </div>
                        <div class="detail-item full-width">
                            <span class="label">Infotext 2</span>
                            <span class="value">${this.stateObj.attributes.infotext2 || '-'}</span>
                        </div>
                        <div class="detail-item full-width">
                            <span class="label">Lineage</span>
                            <span class="value">${this.stateObj.attributes.lineage || '-'}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        // Leeres div zurückgeben, wenn nicht angezeigt werden soll
        return html`<div class="expanded-content" data-section="details"></div>`;
    }

    private _renderAttributes(): TemplateResult {
        if (this.config.show_elements.includes('attributes')) {
            // Wenn attributes direkt angezeigt werden
            return html`${renderAttributes(this)}`;
        } else if (this._expanded?.attributes) {
            // Wenn attributes über das Optionsmenü angezeigt werden
            return html`
                <div class="expanded-content show" data-section="attributes">
                    ${renderAttributes(this)}
                </div>
            `;
        }
        // Leeres div zurückgeben, wenn nicht angezeigt werden soll
        return html`<div class="expanded-content" data-section="attributes"></div>`;
    }

    render(): HTMLTemplateResult {
        if (!this.config || !this._hass) return html``;

        if (!this.stateObj && !this._listenToSelector) {
            return html`
                <hui-warning>
                Entity nicht verfügbar: ${this.config.entity || "Keine Entity oder listen_to konfiguriert"}
                </hui-warning>
              `;
        }

        if (!this.stateObj && this._listenToSelector) {
            // Karte komplett ausblenden, wenn auf Auswahl gewartet wird
            return html``;
        }

        const showElements = this.config.show_elements;
        // Setze die CSS-Klasse nur, wenn das erste Element der Header ist
        const haCardCssClass = (showElements[0] === 'header' && this.config.display_type !== DisplayType.Compact) 
            ? "card-margin-top" 
            : "";

        // Alle Elemente, die in show_elements enthalten sind
        const visibleElements = showElements.map((element: string) => this._renderElement(element));
        
        // Rendere die erweiterbaren Elemente in der Reihenfolge, in der sie geöffnet wurden
        const expandableElements = this._expandedOrder
            .filter((element: string) => !showElements.includes(element) && this._expanded[element])
            .map((element: string) => {
                switch(element) {
                    case 'attributes':
                        return this._renderAttributes();
                    case 'timeline':
                        return this._renderTimeline();
                    case 'consumption':
                        return this._renderConsumption();
                    case 'history':
                        return this._renderHistory();
                    case 'details':
                        return this._renderDetails();
                    default:
                        return html``;
                }
            });
        
        // Stelle sicher, dass alle erweiterbaren Elemente im DOM vorhanden sind (auch wenn nicht sichtbar)
        const hiddenElements = this.config.option_elements
            .filter((element: string) => 
                !showElements.includes(element) && 
                !this._expandedOrder.includes(element))
            .map((element: string) => {
                switch(element) {
                    case 'attributes':
                        return this._renderAttributes();
                    case 'timeline':
                        return this._renderTimeline();
                    case 'consumption':
                        return this._renderConsumption();
                    case 'history':
                        return this._renderHistory();
                    case 'details':
                        return this._renderDetails();
                    default:
                        return html``;
                }
            });

        return html`
            <ha-card class="${haCardCssClass}">
                ${visibleElements}
                ${expandableElements}
                ${hiddenElements}
            </ha-card>
            ${this._showGallery ? html`
                <flower-gallery
                    .hass=${this._hass}
                    .entityId=${this.stateObj.entity_id}
                    .images=${this._imageUrls}
                    .onClose=${() => this._showGallery = false}
                ></flower-gallery>
            ` : ''}
        `;
    }

    private _toggleExpand(e: Event, section: string) {
        e.stopPropagation();
        
        // Erstelle eine neue Kopie des _expanded-Objekts
        const newExpanded = { ...this._expanded };
        
        // Ändere den Wert für die angegebene Sektion
        const isExpanding = !newExpanded[section];
        newExpanded[section] = isExpanding;
        
        // Aktualisiere die Reihenfolge der geöffneten Elemente
        let newExpandedOrder = [...this._expandedOrder];
        
        if (isExpanding) {
            // Wenn das Element geöffnet wird, füge es am Ende der Liste hinzu
            if (!newExpandedOrder.includes(section)) {
                newExpandedOrder.push(section);
            }
        } else {
            // Wenn das Element geschlossen wird, entferne es aus der Liste
            newExpandedOrder = newExpandedOrder.filter(item => item !== section);
        }
        
        // Setze die neuen Objekte
        this._expanded = newExpanded;
        this._expandedOrder = newExpandedOrder;
        
        // Erzwinge ein Update der Komponente
        this.requestUpdate();
    }

    private async get_data(hass: HomeAssistant): Promise<void> {
        try {
            // Wenn eine Plant ausgewählt ist, verwende deren Entity-ID, sonst die konfigurierte Entity
            const entityId = this.selectedPlantEntity || this.config?.entity;
            
            this.plantinfo = await hass.callWS({
                type: "plant/get_info",
                entity_id: entityId,
            });

            if (this.stateObj?.attributes.images) {
                const downloadPath = this.stateObj.attributes.download_path || '/local/images/plants/';
                const allImages = [...this.stateObj.attributes.images];
                
                const sortedImages = allImages.sort((a, b) => {
                    const dateA = a.match(/_(\d{8}_\d{6})/)?.[1] || '';
                    const dateB = b.match(/_(\d{8}_\d{6})/)?.[1] || '';
                    return dateA.localeCompare(dateB);
                });

                this._imageUrls = sortedImages.map(img => `${downloadPath}${img}`);
                
                if (this.stateObj.attributes.entity_picture) {
                    this._imageUrls.unshift(this.stateObj.attributes.entity_picture);
                }
                
                // Setze den Bildindex zurück, wenn eine neue Pflanze geladen wird
                this._currentImageIndex = 0;
                this._nextImageIndex = this._imageUrls.length > 1 ? 1 : 0;
                this._isFading = false;
            } else {
                // Wenn keine Bilder vorhanden sind, leere die URL-Liste
                this._imageUrls = [];
                this._currentImageIndex = 0;
                this._nextImageIndex = 0;
            }
        } catch (err) {
            this.plantinfo = { result: {} };
            this._imageUrls = [];
            this._currentImageIndex = 0;
            this._nextImageIndex = 0;
        }
    }

    getCardSize(): number {
        return 5;
    }

    static get styles(): CSSResult {
        return style;
    }

    private async _changeImage() {
        if (this._imageUrls.length <= 1) return;

        this._nextImageIndex = (this._currentImageIndex + 1) % this._imageUrls.length;
        
        const img = new Image();
        img.src = this._imageUrls[this._nextImageIndex];
        
        await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });

        this._isFading = true;
        this.requestUpdate();

        await new Promise(resolve => setTimeout(resolve, 500));

        this._currentImageIndex = this._nextImageIndex;
        
        this._isFading = false;
        this.requestUpdate();
    }

    private _startImageRotation() {
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }
        this._imageRotationInterval = setInterval(() => {
            this._changeImage();
        }, 10000);
    }

    // Handler für den Cycle-Member-Wechsel-Event
    private _handleCycleMemberSelected = (event: CustomEvent) => {
        // Prüfen, ob die Karte einen Cycle verwendet und ob die Entity-ID im Event mit der Entity-ID der Karte übereinstimmt
        if (this.config?.entity && this.stateObj && event.detail) {
            const { originalEntityId, selectedEntityId, sourceCardId } = event.detail;
            
            // Wenn der Event von dieser Karte selbst ausgelöst wurde, ignorieren wir ihn
            if (sourceCardId === this) {
                return;
            }
            
            // Prüfen, ob die ursprüngliche Entity-ID mit der Entity-ID der Karte übereinstimmt
            // oder ob die Karte bereits einen ausgewählten Plant hat, der von der gleichen ursprünglichen Entity stammt
            const isFromSameCycle = 
                originalEntityId === this.config.entity || 
                (this._popupData.originalEntity && this._popupData.originalEntity === originalEntityId);
            
            if (isFromSameCycle) {
                // Speichere die ausgewählte Plant
                this.selectedPlantEntity = selectedEntityId;
                
                // Speichere die ursprüngliche Entity-ID, um zurückkehren zu können
                if (!this._popupData.originalEntity && this.stateObj) {
                    this._popupData.originalEntity = this.stateObj.entity_id;
                }
                
                // Lade die Daten der ausgewählten Plant
                if (this._hass) {
                    // Temporär die stateObj auf die ausgewählte Plant setzen
                    this.stateObj = this._hass.states[selectedEntityId];
                    
                    // Daten laden und UI aktualisieren
                    this.get_data(this._hass).then(() => {
                        // Aktualisiere die Graph-Komponenten
                        const graphElements = this.shadowRoot?.querySelectorAll('flower-graph') as NodeListOf<any>;
                        if (graphElements) {
                            graphElements.forEach(graph => {
                                if (graph) {
                                    graph.entityId = selectedEntityId;
                                    // Zuerst den Datumsbereich aktualisieren, dann die Daten
                                    if (typeof graph.updateDateRange === 'function') {
                                        graph.updateDateRange().then(() => {
                                            if (typeof graph.updateGraphData === 'function') {
                                                graph.updateGraphData(true);
                                            }
                                        });
                                    } else if (typeof graph.updateGraphData === 'function') {
                                        // Fallback, falls updateDateRange nicht verfügbar ist
                                        graph.updateGraphData(true);
                                    }
                                }
                            });
                        }
                        
                        // Aktualisiere die Consumption-Komponenten
                        const consumptionElements = this.shadowRoot?.querySelectorAll('flower-consumption') as NodeListOf<any>;
                        if (consumptionElements) {
                            consumptionElements.forEach(consumption => {
                                if (consumption) {
                                    consumption.entityId = selectedEntityId;
                                }
                            });
                        }
                        
                        this.requestUpdate();
                    });
                }
            }
        }
    };

    // Handler für den Event, wenn eine Entity in einer anderen Karte ausgewählt wurde
    private _handleCardEntitySelected = (event: CustomEvent) => {
        // Prüfen, ob die Karte auf diesen Selektor hört
        if (this._listenToSelector && event.detail) {
            const { sourceIdentifier, selectedEntityId, selectedEntities } = event.detail;
            
            // Wenn der Event von einer Karte kommt, auf die wir hören sollen
            if (sourceIdentifier === this._listenToSelector) {
                // Speichere die ausgewählten Entities, falls vorhanden
                if (selectedEntities && Array.isArray(selectedEntities)) {
                    this._selectedEntities = [...selectedEntities];
                } else {
                    // Alte Version ohne Array von ausgewählten Elementen wird weiterhin unterstützt
                    this._selectedEntities = selectedEntityId ? [selectedEntityId] : [];
                }
                
                // Speichere die ausgewählte Entity
                this.selectedPlantEntity = selectedEntityId;
                
                // Wenn selectedEntityId null oder undefined ist, Karte ausblenden
                if (!selectedEntityId) {
                    this.stateObj = undefined;
                    this.requestUpdate();
                    return;
                }
                
                // Lade die Daten der ausgewählten Entity
                if (this._hass && selectedEntityId && this._hass.states[selectedEntityId]) {
                    // Setze die stateObj auf die ausgewählte Entity
                    this.stateObj = this._hass.states[selectedEntityId];
                    
                    // Daten laden und UI aktualisieren
                    this.get_data(this._hass).then(() => {
                        // Aktualisiere die Graph-Komponenten
                        const graphElements = this.shadowRoot?.querySelectorAll('flower-graph') as NodeListOf<any>;
                        if (graphElements) {
                            graphElements.forEach(graph => {
                                if (graph) {
                                    graph.entityId = selectedEntityId;
                                    if (typeof graph.updateDateRange === 'function') {
                                        graph.updateDateRange().then(() => {
                                            if (typeof graph.updateGraphData === 'function') {
                                                graph.updateGraphData(true);
                                            }
                                        });
                                    } else if (typeof graph.updateGraphData === 'function') {
                                        graph.updateGraphData(true);
                                    }
                                }
                            });
                        }
                        
                        // Aktualisiere die Consumption-Komponenten
                        const consumptionElements = this.shadowRoot?.querySelectorAll('flower-consumption') as NodeListOf<any>;
                        if (consumptionElements) {
                            consumptionElements.forEach(consumption => {
                                if (consumption) {
                                    consumption.entityId = selectedEntityId;
                                }
                            });
                        }
                        
                        this.requestUpdate();
                    });
                }
            }
        }
    };
}