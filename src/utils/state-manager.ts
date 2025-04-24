import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { FilterState } from './filter-utils';
import { PlantEntityUtils } from './plant-entity-utils';
import { FilterUtils } from './filter-utils';
import { EventUtils } from './event-utils';
import { CellTypeUtils } from './cell-type-utils';
import { BrokkoliListCardConfig } from '../types/brokkoli-list-card-types';
import { isSensorField } from './field-definitions';

export interface FlowerListState {
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    editingCell: {entityId: string, column: string} | null;
    searchQuery: string;
    multiSelectMode: boolean;
    selectedPlants: Set<string>;
    filterMode: boolean;
    filterState: FilterState;
    showGallery: boolean;
    galleryEntityId: string | null;
    galleryImages: string[];
}

export class StateManager {
    private state: FlowerListState;
    private hass: HomeAssistant;
    private config?: BrokkoliListCardConfig;
    private requestUpdate: () => void;

    constructor(
        hass: HomeAssistant,
        config: BrokkoliListCardConfig | undefined,
        requestUpdate: () => void
    ) {
        this.hass = hass;
        this.config = config;
        this.requestUpdate = requestUpdate;
        this.state = this.getInitialState();
    }

    private getInitialState(): FlowerListState {
        const state: FlowerListState = {
            sortColumn: 'friendly_name',
            sortDirection: 'asc',
            editingCell: null,
            searchQuery: '',
            multiSelectMode: this.config?.multiselect?.showbydefault || false,
            selectedPlants: new Set(),
            filterMode: this.config?.filter?.showbydefault || false,
            filterState: {
                entityTypes: new Set(['plant', 'cycle']),
                activeFilters: {}
            },
            showGallery: false,
            galleryEntityId: null,
            galleryImages: []
        };

        // Initialisiere Filter aus der Konfiguration
        if (this.config?.filter?.filters) {
            for (const [column, filter] of Object.entries(this.config.filter.filters)) {
                if (column === 'entity_type') {
                    state.filterState.entityTypes = new Set(filter as string[]);
                } else if (Array.isArray(filter)) {
                    state.filterState.activeFilters[column] = new Set(filter);
                } else {
                    state.filterState.activeFilters[column] = filter;
                }
            }
        }

        return state;
    }

    getState(): FlowerListState {
        return this.state;
    }

    updateConfig(config: BrokkoliListCardConfig): void {
        this.config = config;
        // Aktualisiere nur die konfigurierbaren Teile des States
        this.state.multiSelectMode = config?.multiselect?.showbydefault || false;
        this.state.filterMode = config?.filter?.showbydefault || false;
        
        // Aktualisiere Filter
        if (config?.filter?.filters) {
            for (const [column, filter] of Object.entries(config.filter.filters)) {
                if (column === 'entity_type') {
                    this.state.filterState.entityTypes = new Set(filter as string[]);
                } else if (Array.isArray(filter)) {
                    this.state.filterState.activeFilters[column] = new Set(filter);
                } else {
                    this.state.filterState.activeFilters[column] = filter;
                }
            }
        }
        
        this.requestUpdate();
    }

    // Sort-Handler
    handleSort(column: string): void {
        if (this.state.sortColumn === column) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortColumn = column;
            this.state.sortDirection = 'asc';
        }
        this.requestUpdate();
    }

    // Cell-Handler
    handleCellClick(
        e: Event, 
        plant: HomeAssistantEntity, 
        columnId: string, 
        dispatchEvent: (event: CustomEvent) => void
    ): void {
        e.stopPropagation();

        if (this.state.multiSelectMode && this.state.selectedPlants.size === 0) {
            this.state.selectedPlants.add(plant.entity_id);
        }

        const clickAction = CellTypeUtils.getClickAction(columnId);
        
        switch(clickAction) {
            case 'edit':
                this.state.editingCell = {
                    entityId: plant.entity_id,
                    column: columnId
                };
                break;
            case 'more-info':
                let entityId = plant.entity_id;
                
                // Nur Entity-ID aus Sensor-Map verwenden, keine Fallbacks
                if (isSensorField(columnId) && plant.attributes._sensorMap && plant.attributes._sensorMap[columnId]) {
                    entityId = plant.attributes._sensorMap[columnId];
                }
                    
                const event = new CustomEvent('hass-more-info', {
                    detail: { entityId },
                    bubbles: true,
                    composed: true
                });
                dispatchEvent(event);
                break;
            case 'none':
            default:
                // Keine Aktion
                break;
        }
        
        this.requestUpdate();
    }

    // Row-Handler
    handleRowClick(e: Event, plant: HomeAssistantEntity, columnId: string, dispatchEvent: (event: CustomEvent) => void): void {
        e.stopPropagation();
        
        // Leite den Klick an handleCellClick weiter
        this.handleCellClick(e, plant, columnId, dispatchEvent);
    }

    // Search-Handler
    handleSearch(e: Event): void {
        EventUtils.handleSearch(e, (query: string) => {
            this.state.searchQuery = query;
            this.requestUpdate();
        });
    }

    // Input-Handler
    async handleInputUpdate(
        event: Event | KeyboardEvent,
        plant: HomeAssistantEntity,
        columnId: string,
        type: 'number' | 'select' | 'text' | 'date'
    ): Promise<void> {
        await EventUtils.handleInputUpdate(event, {
            hass: this.hass,
            plant,
            columnId,
            multiSelectMode: this.state.multiSelectMode,
            selectedPlants: this.state.selectedPlants,
            editingCell: this.state.editingCell,
            onUpdate: () => {
                this.state.editingCell = null;
                this.requestUpdate();
            }
        }, type);
    }

    // Area-Handler
    async handleAreaUpdate(event: Event, plant: HomeAssistantEntity): Promise<void> {
        await EventUtils.handleAreaUpdate(event, {
            hass: this.hass,
            plant,
            columnId: 'area',
            multiSelectMode: this.state.multiSelectMode,
            selectedPlants: this.state.selectedPlants,
            editingCell: this.state.editingCell,
            onUpdate: () => {
                this.state.editingCell = null;
                this.requestUpdate();
            }
        });
    }

    // Toggle-Handler
    toggleMultiSelect(): void {
        this.state.multiSelectMode = !this.state.multiSelectMode;
        
        // Wenn wir den Mehrfachauswahlmodus verlassen, entfernen wir die Auswahl
        if (!this.state.multiSelectMode) {
            this.state.selectedPlants.clear();
        }
        
        this.requestUpdate();
    }

    togglePlantSelection(entityId: string, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        
        const wasSelected = this.state.selectedPlants.has(entityId);
        
        // Toggle selection
        if (wasSelected) {
            this.state.selectedPlants.delete(entityId);
        } else {
            this.state.selectedPlants.add(entityId);
        }
        
        // Löse ein Event aus, auch wenn keine Pflanzen mehr ausgewählt sind
        this.sendEntitySelectedEvent();
        
        this.requestUpdate();
    }
    
    // Sendet ein Event mit der aktuell ausgewählten Pflanze
    private sendEntitySelectedEvent(): void {
        if (!this.config?.identifier) {
            return;
        }
        
        if (this.state.selectedPlants.size === 0) {
            // Wenn keine Pflanzen ausgewählt sind, sende null als selectedEntityId
            const entitySelectedEvent = new CustomEvent('flower-card-entity-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    sourceIdentifier: this.config.identifier,
                    selectedEntityId: null,
                    selectedEntities: []
                }
            });
            
            window.dispatchEvent(entitySelectedEvent);
            return;
        }
        
        // Wandle das Set in ein Array um für die ausgewählten Pflanzen
        const selectedPlantsArray = Array.from(this.state.selectedPlants);
        
        // Verwende die letzte ausgewählte Pflanze als Hauptauswahl
        const selectedEntityId = selectedPlantsArray[selectedPlantsArray.length - 1];
        
        // Prüfe, ob die Entity auch existiert
        if (!selectedEntityId || !this.hass.states[selectedEntityId]) {
            // Keine Warnung ausgeben - Stille ignorieren
            return;
        }
        
        const entitySelectedEvent = new CustomEvent('flower-card-entity-selected', {
            bubbles: true,
            composed: true,
            detail: {
                sourceIdentifier: this.config.identifier,
                selectedEntityId,
                selectedEntities: selectedPlantsArray
            }
        });
        
        window.dispatchEvent(entitySelectedEvent);
    }

    toggleFilterMode(): void {
        this.state.filterMode = !this.state.filterMode;
        this.requestUpdate();
    }

    toggleFilter(column: string, value: string | { min: number; max: number }): void {
        FilterUtils.toggleFilter(column, value, this.state.filterState);
        this.requestUpdate();
    }

    toggleEntityType(type: string): void {
        FilterUtils.toggleEntityType(type, this.state.filterState);
        this.requestUpdate();
    }

    // Helper-Methoden
    getCursorStyle(columnId: string): string {
        return CellTypeUtils.getCursorStyle(columnId);
    }

    clearSearch(): void {
        this.state.searchQuery = "";
        this.requestUpdate();
    }

    // Galerie-Handler
    async handleGalleryOpen(entityId: string): Promise<void> {
        if (!this.hass) return;
        
        const plantEntity = this.hass.states[entityId];
        if (!plantEntity) return;
        
        // Bilder für die Galerie sammeln
        const images: string[] = [];
        
        // Hauptbild hinzufügen, wenn vorhanden
        if (plantEntity.attributes.entity_picture) {
            images.push(plantEntity.attributes.entity_picture);
        }
        
        // Weitere Bilder aus der API holen
        if (plantEntity.attributes.images && Array.isArray(plantEntity.attributes.images)) {
            const downloadPath = plantEntity.attributes.download_path || '/local/images/plants/';
            plantEntity.attributes.images.forEach((img: string) => {
                images.push(`${downloadPath}${img}`);
            });
        }
        
        // Galerie-Zustand aktualisieren
        this.state.showGallery = true;
        this.state.galleryEntityId = entityId;
        this.state.galleryImages = images;
        
        this.requestUpdate();
    }

    closeGallery(): void {
        this.state.showGallery = false;
        this.state.galleryEntityId = null;
        this.requestUpdate();
    }
} 