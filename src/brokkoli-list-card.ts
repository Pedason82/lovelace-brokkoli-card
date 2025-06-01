import { CSSResult, HTMLTemplateResult, LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { style } from './styles';
import { flowerListStyle } from './styles/brokkoli-list-styles';
import { BrokkoliListCardConfig, HomeAssistantEntity } from './types/brokkoli-list-card-types';
import * as packageJson from '../package.json';
import { FilterUtils } from './utils/filter-utils';
import { ConfigUtils } from './utils/config-utils';
import { BrokkoliListComponents } from './utils/brokkoli-list-components';
import { SortUtils } from './utils/sort-utils';
import { PlantEntityUtils } from './utils/plant-entity-utils';
import { CellRenderer } from './utils/cell-renderer';
import { StateManager } from './utils/state-manager';
import './components/plant-create-dialog';
import './components/gallery';

console.info(
    `%c BROKKOLI-LIST-CARD %c ${packageJson.version}`,
    'color: cyan; background: black; font-weight: bold;',
    'color: darkblue; background: white; font-weight: bold;'
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'brokkoli-list-card',
    name: 'Brokkoli List Card',
    preview: true,
    description: 'Eine tabellarische Übersicht aller Pflanzen',
});

@customElement('brokkoli-list-card')
export default class BrokkoliListCard extends LitElement {
    @property() _hass?: HomeAssistant;
    @property() config?: BrokkoliListCardConfig;
    @state() private _showPlantDialog = false;
    @state() private _dialogPosition = { x: 0, y: 0 };
    @state() private _lastSelectedEntityId: string | null = null;

    private plantEntities: HomeAssistantEntity[] = [];
    private readonly EDITABLE_PLANT_ATTRIBUTES = ConfigUtils.EDITABLE_PLANT_ATTRIBUTES;
    private stateManager?: StateManager;

    static getStubConfig(): BrokkoliListCardConfig {
        return ConfigUtils.getDefaultConfig();
    }

    setConfig(config: BrokkoliListCardConfig): void {
        this.config = {
            ...ConfigUtils.getDefaultConfig(),
            ...config
        };
        if (this.stateManager) {
            this.stateManager.updateConfig(this.config);
        }
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        if (!this.stateManager && hass) {
            this.stateManager = new StateManager(
                hass,
                this.config,
                () => this.requestUpdate()
            );
        }
        
        // Nur beim ersten Setzen der hass-Property die volle Aktualisierung durchführen
        if (!this.plantEntities.length) {
            this.updatePlantEntities();
        } else {
            // Bei nachfolgenden Updates nur die vorhandenen Entitäten aktualisieren
            this._refreshExistingEntities();
        }
    }

    // Neue Methode, die nur vorhandene Entitäten aus dem Cache aktualisiert
    private async _refreshExistingEntities(): Promise<void> {
        if (!this._hass) return;
        
        let hasChanges = false;
        
        // Für jede vorhandene Pflanze-Entity prüfen, ob neue Daten im Cache sind
        for (let i = 0; i < this.plantEntities.length; i++) {
            const plant = this.plantEntities[i];
            const apiInfo = await PlantEntityUtils.getPlantInfo(this._hass, plant.entity_id);
            
            // Wenn neue Daten vorhanden sind und die sich von den aktuellen unterscheiden
            if (apiInfo && 
                (!plant.attributes._apiInfo || 
                 JSON.stringify(plant.attributes._apiInfo) !== JSON.stringify(apiInfo))) {
                
                // Entity mit neuen Daten aktualisieren
                const sensorMap = this._buildSensorMap(apiInfo);
                
                this.plantEntities[i] = {
                    ...plant,
                    attributes: {
                        ...plant.attributes,
                        _sensorMap: sensorMap,
                        _apiInfo: apiInfo
                    }
                } as HomeAssistantEntity;
                
                hasChanges = true;
            }
        }
        
        // Nur bei Änderungen neu rendern
        if (hasChanges) {
            this.requestUpdate();
        }
    }
    
    // Hilfsmethode zum Erstellen der Sensor-Map aus API-Infos
    private _buildSensorMap(apiInfo: Record<string, any>): Record<string, string> {
        if (!apiInfo) return {};
        
        const sensorMap: Record<string, string> = {};
        
        // Hauptsensoren verarbeiten
        for (const sensorType in apiInfo) {
            if (apiInfo[sensorType] && 
                typeof apiInfo[sensorType] === 'object' && 
                apiInfo[sensorType].sensor) {
                
                // Mapping für Hauptsensoren
                const sensorTypeMap: Record<string, string> = {
                    "moisture": "soil_moisture",
                    "humidity": "air_humidity",
                    "ph": "ph"
                };
                
                const cardSensorType = sensorTypeMap[sensorType] || sensorType;
                sensorMap[cardSensorType] = apiInfo[sensorType].sensor;
            }
        }
        
        // Diagnosesensoren verarbeiten
        if (apiInfo.diagnostic_sensors) {
            for (const sensorType in apiInfo.diagnostic_sensors) {
                if (apiInfo.diagnostic_sensors[sensorType] && 
                    apiInfo.diagnostic_sensors[sensorType].entity_id) {
                    
                    // Mapping für Diagnosesensoren
                    const diagSensorTypeMap: Record<string, string> = {
                        "moisture": "soil_moisture",
                        "humidity": "air_humidity",
                        "total_integral": "total_ppfd_mol_integral",
                        "total_water": "total_water_consumption",
                        "total_fertilizer": "total_fertilizer_consumption"
                    };
                    
                    const cardSensorType = diagSensorTypeMap[sensorType] || sensorType;
                    sensorMap[cardSensorType] = apiInfo.diagnostic_sensors[sensorType].entity_id;
                }
            }
        }
        
        // Helper-Entities verarbeiten
        if (apiInfo.helpers) {
            for (const helperType in apiInfo.helpers) {
                if (apiInfo.helpers[helperType] && 
                    apiInfo.helpers[helperType].entity_id) {
                    sensorMap[helperType] = apiInfo.helpers[helperType].entity_id;
                }
            }
        }
        
        return sensorMap;
    }

    private async updatePlantEntities(): Promise<void> {
        if (!this._hass) return;
        
        // Pflanzenentitäten abrufen
        const plantEntities = PlantEntityUtils.getPlantEntities(this._hass);
        
        // Starte die Pflanzendaten-Ladung für alle erkannten Pflanzenenitäten
        PlantEntityUtils.initPlantDataLoading(
            this._hass, 
            plantEntities.map(plant => plant.entity_id)
        );
        
        // Für jede Pflanze die API-Informationen abrufen und verarbeiten
        const enrichedEntities: HomeAssistantEntity[] = [];
        
        for (const plant of plantEntities) {
            try {
                // API-Informationen abrufen - nutzt jetzt den Cache
                const apiInfo = await PlantEntityUtils.getPlantInfo(this._hass, plant.entity_id);
                
                // Sensor-Map erstellen
                const sensorMap = this._buildSensorMap(apiInfo);
                
                // Klonen der Plant-Entity und anreichern mit den Sensor-IDs
                const enrichedPlant = {
                    ...plant,
                    attributes: {
                        ...plant.attributes,
                        // Füge die Sensor-Map und API-Infos den Attributen hinzu
                        _sensorMap: sensorMap,
                        _apiInfo: apiInfo
                    }
                } as HomeAssistantEntity;
                
                enrichedEntities.push(enrichedPlant);
            } catch (error) {
                console.error(`[FLOWER-LIST] Fehler beim Anreichern von ${plant.entity_id}:`, error);
                // Ursprüngliche Entity trotzdem hinzufügen
                enrichedEntities.push(plant);
            }
        }
        
        this.plantEntities = enrichedEntities;
        this.requestUpdate();
    }

    private getVisibleColumns(): Array<{id: string, name: string, group: string}> {
        return ConfigUtils.getVisibleColumns(this.config);
    }

    private _handleAddPlant() {
        this._showPlantDialog = true;
        // Standardposition für Dialog setzen
        this._dialogPosition = { x: 50, y: 50 };
        this.requestUpdate();
    }

    private _handleDialogClosed() {
        this._showPlantDialog = false;
        this.requestUpdate();
        // Nach dem Schließen des Dialogs Pflanzen aktualisieren
        this.updatePlantEntities();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('flower-image-click', this._handleFlowerImageClick.bind(this));
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('flower-image-click', this._handleFlowerImageClick.bind(this));
        
        // Alle Timeouts bereinigen, wenn die Karte entfernt wird
        PlantEntityUtils.clearAllTimeouts();
    }

    private _handleFlowerImageClick(e: CustomEvent): void {
        if (!this.stateManager) return;
        const entityId = e.detail.entityId;
        if (entityId) {
            this.stateManager.handleGalleryOpen(entityId);
        }
    }

    // Event-Handler für den Zeilen-Klick
    private _handleRowClick(event: Event, plant: HomeAssistantEntity): void {
        // Vermeide Doppelverarbeitung, wenn bereits ein Cell-Click verarbeitet wurde
        if ((event.target as HTMLElement).closest('.clickable')) {
            return;
        }

        if (!this.stateManager) return;
        
        const state = this.stateManager.getState();
        
        // Wenn Mehrfachauswahl aktiv ist, ignoriere einfache Zeilenklicks
        // Die Auswahllogik wird bereits über die entsprechenden Checkboxen gesteuert
        if (state.multiSelectMode) {
            return;
        }

        // Prüfe, ob die angeklickte Pflanze bereits ausgewählt ist
        const isAlreadySelected = this._lastSelectedEntityId === plant.entity_id;
        
        // Wenn die Pflanze bereits ausgewählt ist, setze sie auf null (Abwahl)
        // ansonsten auf die neue Plant-ID
        this._lastSelectedEntityId = isAlreadySelected ? null : plant.entity_id;

        // Sende ein Event, dass eine Plant ausgewählt oder abgewählt wurde
        if (this.config?.identifier) {
            const entitySelectedEvent = new CustomEvent('flower-card-entity-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    sourceIdentifier: this.config.identifier,
                    selectedEntityId: this._lastSelectedEntityId
                }
            });
            window.dispatchEvent(entitySelectedEvent);
        }
    }

    render(): HTMLTemplateResult {
        if (!this._hass || !this.stateManager) return html``;

        const state = this.stateManager.getState();
        const plants = SortUtils.getSortedPlants(
            FilterUtils.getFilteredPlants(
                this._hass,
                this.plantEntities,
                state.filterState,
                state.searchQuery,
                this.EDITABLE_PLANT_ATTRIBUTES
            ),
            state.sortColumn,
            state.sortDirection,
            this._hass
        );
        const columns = this.getVisibleColumns();
        const isAddPlantEnabled = this.config?.add_plant?.enabled !== false;
        const addPlantPosition = this.config?.add_plant?.position || 'bottom';

        return html`
            <div class="card-container">
                <ha-card>
                    ${BrokkoliListComponents.renderHeader(this.config?.title)}
                    
                    ${BrokkoliListComponents.renderToolbar(
                        this.config,
                        state.searchQuery,
                        state.filterMode,
                        state.multiSelectMode,
                        () => this.stateManager!.toggleFilterMode(),
                        () => this.stateManager!.toggleMultiSelect(),
                        (e: Event) => this.stateManager!.handleSearch(e),
                        () => this.stateManager!.clearSearch()
                    )}

                    ${state.filterMode ? 
                        BrokkoliListComponents.renderFilterSidebar(
                            columns,
                            state.filterState,
                            (type) => this.stateManager!.toggleEntityType(type),
                            (column, value) => this.stateManager!.toggleFilter(column, value),
                            this._hass,
                            this.plantEntities
                        ) : ''
                    }

                    <div class="table-container${state.filterMode ? ' filtered' : ''}">
                        <table>
                            ${BrokkoliListComponents.renderTableHeader(
                                columns,
                                state.multiSelectMode,
                                state.sortColumn,
                                state.sortDirection,
                                (columnId) => this.stateManager!.handleSort(columnId)
                            )}
                            <tbody>
                                ${isAddPlantEnabled && addPlantPosition === 'top' ? 
                                    BrokkoliListComponents.renderAddPlantButton(() => this._handleAddPlant()) : ''}
                                ${plants.map(plant => 
                                    BrokkoliListComponents.renderTableRow(
                                        plant,
                                        columns,
                                        state.multiSelectMode,
                                        state.selectedPlants,
                                        (entityId, event) => this.stateManager!.togglePlantSelection(entityId, event),
                                        (event, p, columnId) => this.stateManager!.handleCellClick(event, p, columnId, this.dispatchEvent.bind(this)),
                                        (event, p) => this._handleRowClick(event, p),
                                        (columnId) => this.stateManager!.getCursorStyle(columnId),
                                        (p, columnId) => CellRenderer.renderCell({
                                            hass: this._hass!,
                                            plant: p,
                                            columnId,
                                            editingCell: state.editingCell,
                                            onCellClick: (e) => this.stateManager!.handleCellClick(e, p, columnId, this.dispatchEvent.bind(this)),
                                            onInputUpdate: (e, type) => this.stateManager!.handleInputUpdate(e, p, columnId, type),
                                            onRowClick: (e) => this._handleRowClick(e, p)
                                        })
                                    )
                                )}
                                ${isAddPlantEnabled && addPlantPosition === 'bottom' ? 
                                    BrokkoliListComponents.renderAddPlantButton(() => this._handleAddPlant()) : ''}
                            </tbody>
                        </table>
                    </div>
                </ha-card>
            </div>
            
            ${this._showPlantDialog ? html`
                <plant-create-dialog
                    .hass=${this._hass}
                    .position=${this._dialogPosition}
                    .areaId=${this.config?.area || ''}
                    @dialog-closed=${this._handleDialogClosed}
                ></plant-create-dialog>
            ` : ''}

            ${state.showGallery ? html`
                <flower-gallery
                    .hass=${this._hass}
                    .entityId=${state.galleryEntityId || ''}
                    .images=${state.galleryImages}
                    .onClose=${() => this.stateManager!.closeGallery()}
                ></flower-gallery>
            ` : ''}
        `;
    }

    getCardSize(): number {
        return 1 + Math.ceil(this.plantEntities.length / 2);
    }

    static get styles(): CSSResult[] {
        return [
            style,
            flowerListStyle
        ];
    }
}