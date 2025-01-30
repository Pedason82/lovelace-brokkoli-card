import { CSSResult, HTMLTemplateResult, LitElement, html, css } from 'lit';
import {customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { style } from './styles';
import { DisplayType, FlowerCardConfig, HomeAssistantEntity, PlantInfo } from './types/flower-card-types';
import * as packageJson from '../package.json';
import { renderAttributes, renderBattery } from './utils/attributes';
import { CARD_EDITOR_NAME, CARD_NAME, default_show_bars, missingImage } from './utils/constants';
import { moreInfo } from './utils/utils';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

interface AreaHistoryEntry {
    date: string;
    area: string;
}

interface TreatmentHistoryEntry {
    date: string;
    treatment: string;
}

interface StateHistoryEntry {
    date: string;
    end_date?: string;
    state: string;
}

console.info(
    `%c FLOWER-CARD %c ${packageJson.version}`,
    'color: cyan; background: black; font-weight: bold;',
    'color: darkblue; background: white; font-weight: bold;'
);

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: CARD_NAME,
    name: 'Flower card',
    preview: true,
    description: 'Custom flower card for https://github.com/Olen/homeassistant-plant',
});
/* eslint-disable @typescript-eslint/no-explicit-any */

interface TimelineEvent {
    date: Date;
    type: string;
    label: string;
    description: string;
    style?: string;
}

@customElement(CARD_NAME)
export default class FlowerCard extends LitElement {
    @property() _hass?: any;
    @property() config?: FlowerCardConfig;
    @state() private _expanded = false;
    @state() private _timelineEvents: Array<TimelineEvent> = [];
    @state() private stateHistory: Array<any> = [];
    @state() private _currentImageIndex = 0;
    @state() private _imageUrls: string[] = [];
    @state() private _isFading = false;
    @state() private _showGallery = false;
    @state() private _showUploadDialog = false;
    @state() private _showFlyout = false;
    @state() private _showDeleteFlyout = false;
    @state() private _showMainImageFlyout = false;
    private _imageRotationInterval?: NodeJS.Timeout;

    private stateObj: HomeAssistantEntity | undefined;
    private previousFetchDate: number;

    plantinfo: PlantInfo;

    private async _changeImage(direction: 'next' | 'prev' = 'next') {
        // Starte Fade-Out
        this._isFading = true;
        this.requestUpdate();

        // Warte auf Fade-Out Animation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Wechsle Bild basierend auf Richtung
        if (direction === 'next') {
            this._currentImageIndex = (this._currentImageIndex + 1) % this._imageUrls.length;
        } else {
            this._currentImageIndex = (this._currentImageIndex - 1 + this._imageUrls.length) % this._imageUrls.length;
        }
        
        // Starte Fade-In
        this._isFading = false;
        this.requestUpdate();
    }

    private _openGallery(e: Event) {
        e.stopPropagation();
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }
        this._showGallery = true;
    }

    private _closeGallery() {
        this._showGallery = false;
        // Starte die Bildrotation wieder
        if (this._imageUrls.length > 1) {
            this._imageRotationInterval = setInterval(() => {
                this._changeImage();
            }, 10000);
        }
    }

    private _openUploadDialog(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._showUploadDialog = true;
    }

    private _closeUploadDialog() {
        this._showUploadDialog = false;
    }

    private _toggleFlyout(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._showFlyout = !this._showFlyout;
    }

    private _toggleDeleteFlyout(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._showDeleteFlyout = !this._showDeleteFlyout;
    }

    private _toggleMainImageFlyout(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._showMainImageFlyout = !this._showMainImageFlyout;
    }

    private _getImageDate(url: string): string {
        if (!this.stateObj || !this._hass) return 'Start Bild';

        const match = url.match(/_(\d{8}_\d{6})/);
        let dateStr = 'Start Bild';
        let imageDate: Date | null = null;

        if (match) {
            const datePart = match[1];
            const year = datePart.slice(0, 4);
            const month = datePart.slice(4, 6);
            const day = datePart.slice(6, 8);
            const hour = datePart.slice(9, 11);
            const minute = datePart.slice(11, 13);
            dateStr = `${day}.${month}.${year} ${hour}:${minute}`;
            imageDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        }

        // Hole den Pflanzennamen und die Growth Phase Entity
        const plantName = this.stateObj.entity_id.split('.')[1];
        const phaseEntity = this._hass.states[`select.${plantName}_growth_phase`];
        
        if (!phaseEntity) return dateStr;

        // Bestimme die Phase zum Zeitpunkt des Bildes
        let phaseAtImage = 'Unbekannt';
        let daysInPhase = 0;
        let totalAge = 0;

        const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'geerntet', 'entfernt'];
        const phaseLabels: Record<string, string> = {
            'samen': 'Samen',
            'keimen': 'Keimen',
            'wurzeln': 'Wurzeln',
            'wachstum': 'Wachstum',
            'blüte': 'Blüte',
            'geerntet': 'Geerntet',
            'entfernt': 'Entfernt'
        };

        if (imageDate) {
            // Finde die Phase zum Zeitpunkt des Bildes
            for (const phase of phases) {
                const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
                if (startDate) {
                    const phaseStartDate = new Date(startDate);
                    if (imageDate >= phaseStartDate) {
                        phaseAtImage = phaseLabels[phase];
                        daysInPhase = Math.floor((imageDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
                    }
                }
            }

            // Berechne Gesamtalter
            const firstPhaseDate = phaseEntity.attributes[`${phases[0]}_beginn`];
            if (firstPhaseDate) {
                const startDate = new Date(firstPhaseDate);
                totalAge = Math.floor((imageDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            }
        } else {
            // Für das aktuelle Bild
            phaseAtImage = phaseLabels[phaseEntity.state] || phaseEntity.state;
            const currentPhaseStart = phaseEntity.attributes[`${phaseEntity.state === 'entfernt' || phaseEntity.state === 'geerntet' ? 
                phaseEntity.state : phaseEntity.state + '_beginn'}`];
            
            if (currentPhaseStart) {
                const startDate = new Date(currentPhaseStart);
                daysInPhase = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            }

            // Berechne Gesamtalter für aktuelles Bild
            const firstPhaseDate = phaseEntity.attributes[`${phases[0]}_beginn`];
            if (firstPhaseDate) {
                const startDate = new Date(firstPhaseDate);
                totalAge = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            }
        }

        // Formatiere die Ausgabe
        let info = dateStr;
        info += `\n<span class="phase">${phaseAtImage}</span> (<span class="day">Tag</span> ${daysInPhase + 1}/<span class="total">${totalAge + 1}</span>)`;

        return info;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        this.stateObj = this.config?.entity ? hass.states[this.config.entity] : undefined;

        // Aktualisiere die Bilderliste wenn sich die Entity ändert
        if (this.stateObj?.attributes.images) {
            // Hole den Basispfad aus der Entity
            const downloadPath = this.stateObj.attributes.download_path || '/local/images/plants/';
            
            // Sortiere alle Bilder nach Datum (Format: _YYYYMMDD_HHMMSS.jpg)
            const allImages = [...this.stateObj.attributes.images];
            
            // Sortiere die Bilder nach Datum
            const sortedImages = allImages.sort((a, b) => {
                        const dateA = a.match(/_(\d{8}_\d{6})/)?.[1] || '';
                        const dateB = b.match(/_(\d{8}_\d{6})/)?.[1] || '';
                        return dateA.localeCompare(dateB);
                    });

            // Erstelle die URLs für alle Bilder
            this._imageUrls = sortedImages.map(img => `${downloadPath}${img}`);

            // Wenn ein entity_picture vorhanden ist, füge es am Anfang ein
            if (this.stateObj.attributes.entity_picture) {
                this._imageUrls.unshift(this.stateObj.attributes.entity_picture);
            }
                
                // Starte die Bildrotation nur wenn es mehr als ein Bild gibt
                if (this._imageUrls.length > 1 && !this._imageRotationInterval) {
                    this._imageRotationInterval = setInterval(() => {
                        this._changeImage();
                    }, 10000); // 10 Sekunden Intervall
                }
        } else {
            this._imageUrls = [];
            if (this.stateObj?.attributes.entity_picture) {
                this._imageUrls = [this.stateObj.attributes.entity_picture];
            }
            this._currentImageIndex = 0;
        }

        if (!this.previousFetchDate) {
            this.previousFetchDate = 0;
        }
        // Only fetch once every second at max.  HA is flooeded with websocket requests
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
        // There must be an easier way to do this
        const isPlant = (entity: HomeAssistantEntity | unknown): entity is HomeAssistantEntity => {
            if (typeof entity == 'object' && 'entity_id' in entity && typeof entity.entity_id == 'string' && entity.entity_id.indexOf('plant.') === 0) {
                return !!entity;
            }
        }
        let supportedEntities: Array<any> = [];
        try {
            supportedEntities = Object.values(ha.states).filter(isPlant);
                // (entity) => entity.entity_id.indexOf('plant.') === 0
            // );
        }
        catch(e) {
            console.info(`Unable to get ha-data: ${e}`);
        }
        const entity = supportedEntities.length > 0 ? supportedEntities[0].entity_id : 'plant.my_plant';

        return {
            entity: entity,
            battery_sensor: "sensor.myflower_battery",
            show_bars: default_show_bars
        }
    }

    setConfig(config: FlowerCardConfig): void {
        if (!config.entity) {
            throw new Error("You need to define an entity");
        }

        this.config = config;
    }

    render(): HTMLTemplateResult {
        if (!this.config || !this._hass) return html``;

        if (!this.stateObj) {
            return html`
                <hui-warning>
                Entity not available: ${this.config.entity}
                </hui-warning>
              `;
        }

        const plantInfo = this.stateObj.attributes.strain + " - " + this.stateObj.attributes.breeder;
        const headerCssClass = this.config.display_type === DisplayType.Compact ? "header-compact" : "header";
        const haCardCssClass = this.config.display_type === DisplayType.Compact ? "" : "card-margin-top";

        // Get entity name from plant entity
        const plantName = this.stateObj.entity_id.split('.')[1];
        
        // Get growth phase and pot size from respective entities
        const growthPhaseEntity = this._hass.states[`select.${plantName}_growth_phase`];
        const potSizeEntity = this._hass.states[`number.${plantName}_pot_size`];

        const growthPhase = growthPhaseEntity ? growthPhaseEntity.state : 'Nicht verfügbar';
        const potSize = potSizeEntity ? potSizeEntity.state + 'L' : 'Nicht verfügbar';

        return html`
            <ha-card class="${haCardCssClass}">
                <div class="${headerCssClass}">
                    <img class="${this._isFading ? 'fade' : ''}" 
                        src="${this._imageUrls.length > 0 
                            ? this._imageUrls[this._currentImageIndex]
                            : missingImage
                        }" @click="${this._openGallery}">
                    <span id="name" @click="${() => moreInfo(this, this.stateObj.entity_id)}"> ${this.stateObj.attributes.friendly_name
                    } <ha-icon .icon="mdi:${this.stateObj.state.toLowerCase() == "problem"
                        ? "alert-circle-outline"
                        : ""
                    }"></ha-icon>
                    </span>
                    <span id="battery">${renderBattery(this)}</span>
                    <span id="species">${plantInfo}</span>
                    <div id="status-container">
                        <span @click="${() => moreInfo(this, `select.${plantName}_growth_phase`)}">
                            <ha-icon icon="mdi:sprout"></ha-icon>${growthPhase}
                        </span>
                        <span @click="${() => moreInfo(this, `number.${plantName}_pot_size`)}">
                            <ha-icon icon="mdi:cup"></ha-icon>${potSize}
                        </span>
                    </div>
                </div>
                <div class="divider"></div>
                ${renderAttributes(this)}
                <div class="expander ${this._expanded ? 'expanded' : ''}" @click="${this._toggleExpand}">
                    <ha-icon icon="mdi:chevron-down"></ha-icon>
                </div>
                ${this._expanded ? html`
                    <div class="expanded-content">
                        <div class="timeline-container">
                            ${this.renderTimeline()}
                        </div>
                        <div class="consumption-data">
                            <div class="consumption-item" @click="${() => moreInfo(this, `sensor.${plantName}_total_ppfd_mol_integral`)}">
                                <ha-icon icon="mdi:counter"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Gesamt PPFD</span>
                                    <span class="value">${this._hass.states[`sensor.${plantName}_total_ppfd_mol_integral`]?.state || 'N/A'} mol/s⋅m²</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${() => moreInfo(this, `sensor.${plantName}_total_fertilizer_consumption`)}">
                                <ha-icon icon="mdi:chart-line-variant"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Düngerverbrauch</span>
                                    <span class="value">${this._hass.states[`sensor.${plantName}_total_fertilizer_consumption`]?.state || 'N/A'} μS/cm</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${() => moreInfo(this, `sensor.${plantName}_total_water_consumption`)}">
                                <ha-icon icon="mdi:water-pump"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Wasserverbrauch</span>
                                    <span class="value">${this._hass.states[`sensor.${plantName}_total_water_consumption`]?.state || 'N/A'} L</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${() => moreInfo(this, `sensor.${plantName}_total_power_consumption`)}">
                                <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Stromverbrauch</span>
                                    <span class="value">${this._hass.states[`sensor.${plantName}_total_power_consumption`]?.state || 'N/A'} kWh</span>
                                </div>
                            </div>
                        </div>
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
                ` : ''}
            </ha-card>
            ${this._showGallery ? html`
                <div class="gallery-overlay" @click="${this._closeGallery}">
                    <div class="gallery-content" @click="${(e: Event) => e.stopPropagation()}">
                        <div class="gallery-header">
                            <span class="gallery-date">
                                ${this._imageUrls.length > 0 
                                    ? unsafeHTML(this._getImageDate(this._imageUrls[this._currentImageIndex])) 
                                    : 'Keine Bilder vorhanden'}
                            </span>
                            <div class="gallery-header-buttons">
                                <div class="flyout-container ${this._showFlyout ? 'open' : ''} ${this._showDeleteFlyout ? 'delete-open' : ''} ${this._showMainImageFlyout ? 'main-open' : ''}">
                                    <ha-icon-button
                                        @click="${this._toggleFlyout}"
                                        .label=${"Bild hinzufügen"}
                                        class="add-button"
                                    >
                                        <ha-icon icon="mdi:camera-plus"></ha-icon>
                                    </ha-icon-button>
                                    <div class="flyout-menu">
                                        <label class="flyout-option">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                @change="${(e: Event) => {
                                                    this._handleFileUpload(e);
                                                    this._showFlyout = false;
                                                }}"
                                                style="display: none;"
                                            >
                                            <ha-icon-button>
                                                <ha-icon icon="mdi:image"></ha-icon>
                                            </ha-icon-button>
                                        </label>
                                        <label class="flyout-option">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                capture="environment"
                                                @change="${(e: Event) => {
                                                    this._handleFileUpload(e);
                                                    this._showFlyout = false;
                                                }}"
                                                style="display: none;"
                                            >
                                            <ha-icon-button>
                                                <ha-icon icon="mdi:camera"></ha-icon>
                                            </ha-icon-button>
                                        </label>
                                    </div>
                                </div>
                                ${this._imageUrls.length > 0 ? html`
                                    <div class="flyout-container ${this._showMainImageFlyout ? 'open' : ''} ${this._showDeleteFlyout ? 'delete-open' : ''}">
                                        <ha-icon-button
                                            @click="${this._toggleMainImageFlyout}"
                                            .label=${"Als Hauptbild setzen"}
                                            class="main-button"
                                        >
                                            <ha-icon icon="mdi:image-check"></ha-icon>
                                        </ha-icon-button>
                                        <div class="flyout-menu">
                                            <ha-icon-button
                                                @click="${async () => {
                                                    const url = this._imageUrls[this._currentImageIndex];
                                                    const filename = url.split('/').pop();
                                                    if (filename) {
                                                        try {
                                                            await this.setMainImage(filename);
                                                            this._showMainImageFlyout = false;
                                                        } catch (error) {
                                                            alert('Fehler beim Setzen des Hauptbildes: ' + error.message);
                                                        }
                                                    }
                                                }}"
                                                class="confirm-main"
                                                style="--mdc-icon-button-size: 32px; color: var(--primary-color, #03a9f4);"
                                            >
                                                <ha-icon icon="mdi:check"></ha-icon>
                                            </ha-icon-button>
                                        </div>
                                    </div>
                                    <div class="flyout-container ${this._showDeleteFlyout ? 'open' : ''}">
                                        <ha-icon-button
                                            @click="${this._toggleDeleteFlyout}"
                                            .label=${"Bild löschen"}
                                            class="delete-button"
                                        >
                                            <ha-icon icon="mdi:delete"></ha-icon>
                                        </ha-icon-button>
                                        <div class="flyout-menu">
                                            <ha-icon-button
                                                @click="${async () => {
                                                    const url = this._imageUrls[this._currentImageIndex];
                                                    const filename = url.split('/').pop();
                                                    if (filename) {
                                                        try {
                                                            await this.deleteImage(filename);
                                                            this._showDeleteFlyout = false;
                                                        } catch (error) {
                                                            alert('Fehler beim Löschen: ' + error.message);
                                                        }
                                                    }
                                                }}"
                                                class="confirm-delete"
                                                style="--mdc-icon-button-size: 32px; color: var(--error-color, #db4437);"
                                            >
                                                <ha-icon icon="mdi:check"></ha-icon>
                                            </ha-icon-button>
                                        </div>
                                    </div>
                                ` : ''}
                            <ha-icon-button
                                @click="${this._closeGallery}"
                                .label=${"Schließen"}
                            >
                                <ha-icon icon="mdi:close"></ha-icon>
                            </ha-icon-button>
                        </div>
                        </div>
                        
                        ${this._imageUrls.length > 0 ? html`
                        <div class="gallery-image-container">
                            <ha-icon-button
                                class="gallery-nav prev"
                                @click="${() => this._changeImage('prev')}"
                                .label=${"Vorheriges Bild"}
                            >
                                <ha-icon icon="mdi:chevron-left"></ha-icon>
                            </ha-icon-button>
                            <a href="${this._imageUrls[this._currentImageIndex]}" target="_blank">
                                <img class="gallery-image ${this._isFading ? 'fade' : ''}" 
                                    src="${this._imageUrls[this._currentImageIndex]}"
                                >
                            </a>
                            <ha-icon-button
                                class="gallery-nav next"
                                @click="${() => this._changeImage('next')}"
                                .label=${"Nächstes Bild"}
                            >
                                <ha-icon icon="mdi:chevron-right"></ha-icon>
                            </ha-icon-button>
                        </div>
                        <div class="gallery-thumbnails">
                            <div class="thumbnails-scroll">
                                ${this._getGroupedImages().map(group => html`
                                    <div class="thumbnail-group">
                                        <div class="thumbnail-group-label">${group.phase}</div>
                                        <div class="thumbnail-group-images">
                                            ${group.images.map(image => html`
                                                <div class="thumbnail-container ${this._imageUrls[this._currentImageIndex] === image.url ? 'active' : ''}"
                                                     @click="${() => this._selectImage(this._imageUrls.indexOf(image.url))}">
                                                    <div class="thumbnail-day">Tag ${image.day}/${image.totalDays}</div>
                                                    <img class="thumbnail" src="${image.url}">
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                        ` : html`
                            <div class="no-images-message">
                                <ha-icon icon="mdi:image-off"></ha-icon>
                                <span>Keine Bilder vorhanden</span>
                                <span>Klicke auf das Kamera-Symbol oben, um ein Bild hinzuzufügen</span>
                            </div>
                        `}
                    </div>
                </div>
            ` : ''}
            `;
    }

    private _toggleExpand(e: Event) {
        e.stopPropagation();
        this._expanded = !this._expanded;
    }

    private async get_data(hass: HomeAssistant): Promise<void> {
        try {
            this.plantinfo = await hass.callWS({
                type: "plant/get_info",
                entity_id: this.config?.entity,
            });

            // Lade Timeline-Events
            if (this.config?.entity) {
                const plantName = this.config.entity.split('.')[1];
                this._timelineEvents = await this.collectTimelineEvents(plantName);

                // Lade Status-Historie
                const startTime = this._timelineEvents[0]?.date.toISOString() || new Date().toISOString();
                const endTime = new Date().toISOString();
                const response = await hass.callApi('GET', 
                    `history/period/${startTime}?filter_entity_id=${this.config.entity}&end_time=${endTime}`
                );
                if (response && Array.isArray(response) && response.length > 0) {
                    this.stateHistory = response[0];
                }
            }
        } catch (err) {
            this.plantinfo = { result: {} };
            this._timelineEvents = [];
            this.stateHistory = [];
        }
    }

    getCardSize(): number {
        return 5;
    }

    private renderTimeline(): HTMLTemplateResult {
        if (!this.config?.entity || !this._hass) return html``;
        
        const plantName = this.config.entity.split('.')[1];
        const phaseEntity = this._hass.states[`select.${plantName}_growth_phase`];
        
        if (!phaseEntity) return html``;

        const events = this._timelineEvents;
        if (events.length === 0) return html``;

        // Bestimme Start- und Enddatum
        const startDate = events[0].date;
        const currentPhase = phaseEntity.state;
        const today = new Date();
        
        // Berechne das erwartete Erntedatum
        let endDate: Date;
        if (currentPhase === 'entfernt') {
            endDate = new Date(phaseEntity.attributes.entfernt);
        } else if (currentPhase === 'geerntet') {
            endDate = new Date(phaseEntity.attributes.geerntet);
        } else {
            const floweringDurationEntity = this._hass.states[`number.${plantName}_flowering_duration`];
            if (currentPhase === 'blüte' && floweringDurationEntity?.state) {
                const floweringStart = new Date(phaseEntity.attributes.blüte_beginn);
                // Stelle sicher, dass wir mit einer neuen Date-Instanz arbeiten
                endDate = new Date(floweringStart);
                // Addiere die Tage
                endDate.setDate(endDate.getDate() + parseInt(floweringDurationEntity.state));
            } else if (floweringDurationEntity?.state) {
                // Stelle sicher, dass wir mit einer neuen Date-Instanz arbeiten
                endDate = new Date(today);
                // Addiere die Tage
                endDate.setDate(endDate.getDate() + parseInt(floweringDurationEntity.state));
            } else {
                endDate = today;
            }
        }

        // Berechne die Timeline-Breite (immer 90% Vergangenheit, 10% Zukunft)
        const timeFromStartToNow = today.getTime() - startDate.getTime();
        const totalTime = timeFromStartToNow / 0.9; // Gesamtzeit wenn Vergangenheit 90% sein soll
        const visualEndDate = new Date(startDate.getTime() + totalTime);

        // Erstelle eine vollständige Liste aller Events einschließlich Harvest
        const allEvents = [...events];
        // Füge das Harvest-Event am Ende der Timeline hinzu
        const harvestEvent = {
            // Position am Ende der Timeline
            date: visualEndDate,
            // Aber zeige das tatsächliche Erntedatum an
            displayDate: endDate,
            type: 'harvest',
            label: 'Harvest',
            description: 'Erwartetes Erntedatum: ' + endDate.toLocaleDateString('de-DE')
        };
        allEvents.push(harvestEvent);

        // Berechne Versatz für gleichzeitige Events
        const labelPositions = allEvents.map((event, index) => {
            // Begrenze die Position auf maximal 100%
            const position = Math.min(((event.date.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
            const nextDate = index < allEvents.length - 1 ? allEvents[index + 1].date : visualEndDate;
            
            // Berechne Versatz für gleichzeitige Events
            let offset = 0;
            if (event.type !== 'pot-size') {
                // Zähle alle vorherigen Events am gleichen Tag der gleichen Gruppe
                const sameTimeEvents = allEvents
                    .slice(0, index)
                    .filter(e => {
                        const sameDay = e.date.toDateString() === event.date.toDateString();
                        const sameGroup = e.type.split('-')[0] === event.type.split('-')[0];
                        return sameDay && e.type !== 'pot-size' && sameGroup;
                    })
                    .length;
                offset = sameTimeEvents * 4;
            }
            
            return { index, position, type: 'label', offset };
        });

        // Füge die Datumsmarker hinzu
        const markerPositions = allEvents.map((event, index) => {
            // Begrenze die Position auf maximal 100%
            const position = Math.min(((event.date.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
            return { index, position, type: 'marker', offset: 0 };
        });

        // Funktion zur Überprüfung von Überlappungen
        const checkOverlap = (positions: Array<{ index: number; position: number; type: string; offset: number }>, isLabel: boolean) => {
            const offsets: Record<number, number> = {};
            const minDistance = 5.8; // Minimaler Abstand in Prozent
            let lastOffset = 0; // Letzter verwendeter Offset

            // Sortiere nach Position
            positions.sort((a, b) => a.position - b.position);

            for (let i = 0; i < positions.length; i++) {
                const current = positions[i];
                
                // Prüfe Überlappung mit vorherigen Elementen
                let overlaps = false;
                for (let j = Math.max(0, i - 3); j < i; j++) {
                    const previous = positions[j];
                    if (Math.abs(current.position - previous.position) < minDistance) {
                        overlaps = true;
                        // Wechsle zwischen oben, mitte und unten
                        if (lastOffset === 0) lastOffset = isLabel ? 1 : -1;
                        else if (lastOffset === 1) lastOffset = 2;
                        else if (lastOffset === -1) lastOffset = -2;
                        else if (lastOffset === 2) lastOffset = -1;
                        else if (lastOffset === -2) lastOffset = 1;
                        break;
                    }
                }

                if (overlaps) {
                    offsets[current.index] = lastOffset;
                } else {
                    offsets[current.index] = 0;
                    lastOffset = 0;
                }
            }

            return offsets;
        };

        // Berechne Offsets für Labels und Marker separat
        const labelOffsets = checkOverlap(labelPositions, true);
        const markerOffsets = checkOverlap(markerPositions, false);

        const formatDate = (date: Date, event?: any) => {
            // Für das Harvest-Event verwenden wir das displayDate
            if (event?.type === 'harvest' && event.displayDate) {
                return event.displayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            }
            return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        };

        return html`
            <div class="timeline">
                <div class="timeline-labels">
                    ${allEvents.map((event, index) => {
                        // Begrenze die Position auf maximal 100%
                        const position = Math.min(((event.date.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
                        const offset = labelOffsets[index] || 0;
                        return html`
                            <div class="timeline-label ${offset === 1 ? 'offset-up' : offset === 2 ? 'offset-up-2' : offset === -1 ? 'offset-down' : ''}"
                                 style="left: ${position}%">
                                ${event.label}
                            </div>
                        `;
                    })}
                </div>
                <div class="timeline-events">
                    ${events.map((event, index) => {
                        // Begrenze die Position auf maximal 100%
                        const position = Math.min(((event.date.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
                        const nextDate = index < events.length - 1 ? events[index + 1].date : visualEndDate;
                        
                        // Berechne Versatz für Events am gleichen Tag
                        let offset = 0;
                        if (event.type !== 'pot-size') {
                            // Zähle ALLE vorherigen Events am gleichen Tag
                            const sameTimeEvents = events
                                .slice(0, index)
                                .filter(e => {
                                    return e.date.toDateString() === event.date.toDateString() && e.type !== 'pot-size';
                                })
                                .length;
                            offset = sameTimeEvents * 4;
                        }
                        
                        // Begrenze auch die Breite des Events
                        const width = Math.min(((nextDate.getTime() - event.date.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100 - position);
                        
                        return html`
                            <div class="timeline-event ${event.type}"
                                 style="left: calc(${position}% + ${offset}px); 
                                        width: calc(${width}% - ${offset}px);
                                        ${event.style || ''}"
                                 title="${event.description}">
                            </div>
                        `;
                    })}
                    <div class="timeline-status">
                        ${this.stateHistory.map((state, index) => {
                            const stateDate = new Date(state.last_changed);
                            const nextState = this.stateHistory[index + 1];
                            const endDate = nextState ? new Date(nextState.last_changed) : new Date();
                            
                            // Berechne Position und Breite
                            const position = Math.min(((stateDate.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
                            const width = Math.min(((endDate.getTime() - stateDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100 - position);
                            
                            const statusClass = state.state === 'problem' ? 'timeline-status-problem' : 
                                              state.state === 'unknown' ? 'timeline-status-unknown' : '';
                            
                            return statusClass ? html`
                                <div class="timeline-status-indicator ${statusClass}"
                                     style="left: ${position}%; width: ${width}%;">
                                </div>
                            ` : '';
                        })}
                    </div>
                </div>
                <div class="timeline-markers">
                    ${allEvents.map((event, index) => {
                        const position = Math.min(((event.date.getTime() - startDate.getTime()) / (visualEndDate.getTime() - startDate.getTime())) * 100, 100);
                        const offset = markerOffsets[index] || 0;
                        return html`
                            <div class="timeline-marker ${offset === 1 ? 'offset-up' : offset === 2 ? 'offset-up-2' : offset === -1 ? 'offset-down' : offset === -2 ? 'offset-down-2' : ''}"
                                 style="left: ${position}%">
                                ${formatDate(event.date, event)}
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }

    private async collectTimelineEvents(plantName: string): Promise<Array<TimelineEvent>> {
        const events: Array<TimelineEvent> = [];
        const phaseEntity = this._hass?.states[`select.${plantName}_growth_phase`];
        
        // Basis HSL-Werte für verschiedene Event-Typen
        const colorConfig = {
            'growth': { hue: 120, saturation: 60 },  // Saftiges Grün für Wachstumsphasen
            'end': { hue: 0, saturation: 0 },        // Wird nicht genutzt (unsichtbar/schraffiert)
            'pot': { hue: 207, saturation: 90 },     // Bleibt wie bisher (Blau)
            'area': { hue: 280, saturation: 70 },    // Violett - deutlich anders als die anderen Farben
            'treatment': { hue: 45, saturation: 100 } // Gelb bis Rot für Treatments
        };
        
        // Sammle Wachstumsphasen
        const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'entfernt', 'geerntet'] as const;
        const phaseLabels: Record<typeof phases[number], string> = {
            'samen': 'Samen',
            'keimen': 'Keimen',
            'wurzeln': 'Wurzeln',
            'wachstum': 'Wachstum',
            'blüte': 'Blüte',
            'entfernt': 'Entfernt',
            'geerntet': 'Geerntet'
        };
        
        // Sammle alle Phasen-Events
        const growthPhases: TimelineEvent[] = [];
        const endPhases: TimelineEvent[] = [];
        
        for (const phase of phases) {
            const startDate = phaseEntity?.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            if (startDate) {
                const event: TimelineEvent = {
                    date: new Date(startDate),
                    type: `phase-${phase}`,
                    label: phaseLabels[phase],
                    description: `${phaseLabels[phase]} Phase begonnen am ${new Date(startDate).toLocaleDateString('de-DE')}`
                };
                
                if (phase === 'entfernt' || phase === 'geerntet') {
                    endPhases.push(event);
                } else {
                    growthPhases.push(event);
                }
            }
        }
        
        // Setze Farben für Wachstumsphasen
        growthPhases.forEach((event, index) => {
            // Bei nur einer Phase oder als erste Phase: hellstes Grün (55%)
            // Ansonsten: Farbverlauf von hell nach dunkel
            const lightness = growthPhases.length === 1 ? 55 : 
                55 - ((index / Math.max(1, growthPhases.length - 1)) * 25); // Hell nach dunkel (55% bis 30%)
            event.style = `background-color: hsl(${colorConfig.growth.hue}, ${colorConfig.growth.saturation}%, ${lightness}%)`;
        });
        
        // Setze Styles für Endphasen
        endPhases.forEach((event, index) => {
            if (event.type === 'phase-entfernt') {
                event.style = 'display: none;'; // Unsichtbar
            } else if (event.type === 'phase-geerntet') {
                // Schraffur mit kleinen Häkchen
                event.style = `
                    background-color: hsl(120, 70%, 45%);
                    background-image: repeating-linear-gradient(45deg, 
                        transparent,
                        transparent 2px,
                        rgba(255,255,255,0.4) 2px,
                        rgba(255,255,255,0.4) 4px
                    );
                `;
            }
        });
        
        events.push(...growthPhases, ...endPhases);

        // Lade Topfgrößen-Historie
        try {
            const startTime = events[0]?.date.toISOString() || new Date().toISOString();
            const endTime = new Date().toISOString();
            const response = await this._hass.callApi('GET', 
                `history/period/${startTime}?filter_entity_id=number.${plantName}_pot_size&end_time=${endTime}`
            );
            
            if (response && Array.isArray(response) && response.length > 0) {
                let lastSize: string | null = null;
                const potSizeEvents: TimelineEvent[] = [];
                
                // Verarbeite die Historie für Events
                for (const state of [...response[0]].reverse()) {
                    if (state.state && !isNaN(parseFloat(state.state)) && 
                        state.state !== 'unavailable' && state.state !== 'unknown' && 
                        state.state !== lastSize) {
                        potSizeEvents.push({
                            date: new Date(state.last_changed),
                            type: 'pot-size',
                            label: `${state.state}L`,
                            description: `Topfgröße geändert auf ${state.state}L am ${new Date(state.last_changed).toLocaleDateString('de-DE')}`
                        } as TimelineEvent);
                        lastSize = state.state;
                    }
                }
                
                // Sammle zuerst alle Größen für Min/Max-Berechnung
                const sizes = potSizeEvents.map(event => parseFloat(event.label));
                const minSize = Math.min(...sizes);
                const maxSize = Math.max(...sizes);

                // Setze Farben für Topfgrößen-Events basierend auf der tatsächlichen Größe
                potSizeEvents.forEach((event) => {
                    const size = parseFloat(event.label);
                    // Berechne Position zwischen 0 und 100 für die Farbintensität
                    const intensity = maxSize === minSize ? 50 : 
                        Math.round(((size - minSize) / (maxSize - minSize)) * 100);
                    
                    // Helligkeit: 85% (klein) bis 40% (groß)
                    const lightness = Math.max(40, Math.min(85, 85 - (intensity * 0.45)));
                    event.style = `background-color: hsl(${colorConfig.pot.hue}, ${colorConfig.pot.saturation}%, ${lightness}%)`;
                });
                
                events.push(...potSizeEvents);
            }
        } catch (err) {
            console.warn('Fehler beim Laden der Topfgrößen-Historie:', err);
        }

        // Lade Area-Changes
        const areaHistory = (phaseEntity?.attributes?.area_history || []) as AreaHistoryEntry[];
        const areaEvents: TimelineEvent[] = areaHistory.map(entry => ({
            date: new Date(entry.date),
            type: 'area-moved',
            label: entry.area,
            description: `Umzug nach ${entry.area} am ${new Date(entry.date).toLocaleDateString('de-DE')}`
        } as TimelineEvent));
        
        // Setze Farben für Area-Events
        areaEvents.forEach((event, index) => {
            const lightness = 65 - ((index / Math.max(1, areaEvents.length - 1)) * 30); // Hell nach dunkel (65% bis 35%)
            event.style = `background-color: hsl(${colorConfig.area.hue}, ${colorConfig.area.saturation}%, ${lightness}%)`;
        });
        
        events.push(...areaEvents);

        // Lade Treatment-Historie
        const treatmentEntity = this._hass?.states[`select.${plantName}_treatment`];
        const treatmentHistory = (treatmentEntity?.attributes?.treatment_history || []) as TreatmentHistoryEntry[];
        const treatmentEvents: TimelineEvent[] = treatmentHistory.map(entry => ({
            date: new Date(entry.date),
            type: 'treatment',
            label: entry.treatment,
            description: `Behandlung: ${entry.treatment} am ${new Date(entry.date).toLocaleDateString('de-DE')}`
        } as TimelineEvent));
        
        // Setze Farben für Treatment-Events (Gelb bis Rot Verlauf)
        treatmentEvents.forEach((event, index) => {
            // Farbverlauf von Gelb (45) nach Rot (0)
            const hue = 45 - (index / Math.max(1, treatmentEvents.length - 1)) * 45;
            const lightness = 65 - ((index / Math.max(1, treatmentEvents.length - 1)) * 25); // Hell nach dunkel (65% bis 40%)
            event.style = `background-color: hsl(${hue}, ${colorConfig.treatment.saturation}%, ${lightness}%)`;
        });
        
        events.push(...treatmentEvents);

        // Sortiere Events nach Datum
        return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    private async _selectImage(index: number) {
        if (index === this._currentImageIndex) return;
        
        // Starte Fade-Out
        this._isFading = true;
        this.requestUpdate();

        // Warte auf Fade-Out Animation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Setze neuen Index
        this._currentImageIndex = index;
        
        // Starte Fade-In
        this._isFading = false;
        this.requestUpdate();
    }

    private _getGroupedImages(): Array<{phase: string, images: Array<{url: string, day: number, totalDays: number}>}> {
        if (!this.stateObj || !this._hass) return [];

        const plantName = this.stateObj.entity_id.split('.')[1];
        const phaseEntity = this._hass.states[`select.${plantName}_growth_phase`];
        
        if (!phaseEntity) return [];

        const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'geerntet', 'entfernt'];
        const phaseLabels: Record<string, string> = {
            'samen': 'Samen',
            'keimen': 'Keimen',
            'wurzeln': 'Wurzeln',
            'wachstum': 'Wuchs',
            'blüte': 'Blüte',
            'geerntet': 'Geerntet',
            'entfernt': 'Entfernt'
        };

        const groupedImages: Array<{phase: string, images: Array<{url: string, day: number, totalDays: number}>}> = [];
        let currentPhase = '';
        let currentImages: Array<{url: string, day: number, totalDays: number}> = [];

        // Finde die erste Phase
        let firstPhase = '';
        let firstPhaseDate: Date | null = null;
        for (const phase of phases) {
            const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            if (startDate) {
                firstPhase = phaseLabels[phase];
                firstPhaseDate = new Date(startDate);
                break;
            }
        }

        // Gehe durch alle Bilder
        this._imageUrls.forEach((url, index) => {
            let imageDate: Date | null = null;
            let imagePhase = '';
            let daysInPhase = 0;
            let totalDays = 0;

            // Behandle das erste Bild (entity_picture) speziell
            if (index === 0) {
                if (firstPhaseDate && firstPhase) {
                    imageDate = firstPhaseDate;
                    imagePhase = firstPhase;
                    daysInPhase = 0;
                    totalDays = 0;
                }
            } else {
                const match = url.match(/_(\d{8}_\d{6})/);
                if (match) {
                    const datePart = match[1];
                    const year = datePart.slice(0, 4);
                    const month = datePart.slice(4, 6);
                    const day = datePart.slice(6, 8);
                    const hour = datePart.slice(9, 11);
                    const minute = datePart.slice(11, 13);
                    imageDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
                }

                if (imageDate) {
                    // Finde die Phase zum Zeitpunkt des Bildes
                    for (const phase of phases) {
                        const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
                        if (startDate) {
                            const phaseStartDate = new Date(startDate);
                            if (imageDate >= phaseStartDate) {
                                imagePhase = phaseLabels[phase];
                                daysInPhase = Math.floor((imageDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
                            }
                        }
                    }

                    // Berechne Gesamtalter
                    if (firstPhaseDate) {
                        totalDays = Math.floor((imageDate.getTime() - firstPhaseDate.getTime()) / (1000 * 60 * 60 * 24));
                    }
                }
            }

            if (imagePhase && imageDate) {
                // Wenn sich die Phase ändert, erstelle eine neue Gruppe
                if (imagePhase !== currentPhase) {
                    if (currentImages.length > 0) {
                        groupedImages.push({
                            phase: currentPhase,
                            images: currentImages
                        });
                    }
                    currentPhase = imagePhase;
                    currentImages = [];
                }

                currentImages.push({
                    url,
                    day: daysInPhase + 1,
                    totalDays: totalDays + 1
                });
            }
        });

        // Füge die letzte Gruppe hinzu
        if (currentImages.length > 0) {
            groupedImages.push({
                phase: currentPhase,
                images: currentImages
            });
        }

        return groupedImages;
    }

    private async uploadImage(file: File) {
        if (!this.config?.entity || !this._hass) return;

        const chunkSize = 16384; // 16KB Chunks
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            if (!e.target?.result) return;
            
            const data = e.target.result as ArrayBuffer;
            const totalChunks = Math.ceil(data.byteLength / chunkSize);
            
            for (let i = 0; i < totalChunks; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                const hexChunk = Array.from(new Uint8Array(chunk))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                
                try {
                    await this._hass.connection.sendMessagePromise({
                        type: 'plant/upload_image',
                        entity_id: this.config.entity,
                        filename: file.name,
                        chunk: hexChunk,
                        chunk_index: i,
                        total_chunks: totalChunks
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    throw error;
                }
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    private _handleFileUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const files = input.files;
        
        if (files && files.length > 0) {
            const file = files[0];
            // Prüfe ob es ein Bild ist
            if (!file.type.startsWith('image/')) {
                alert('Bitte nur Bilder hochladen!');
                return;
            }
            
            // Prüfe die Dateigröße (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Bild ist zu groß! Maximale Größe ist 10MB.');
                return;
            }
            
            this.uploadImage(file).then(() => {
                // Aktualisiere die Bilderliste nach erfolgreichem Upload
                if (this._hass) {
                    this._hass.callService('homeassistant', 'update_entity', {
                        entity_id: this.config?.entity
                    });
                }
            }).catch(error => {
                alert('Fehler beim Upload: ' + error.message);
            });
        }
    }

    private async deleteImage(filename: string) {
        if (!this.config?.entity || !this._hass) return;
        
        try {
            await this._hass.connection.sendMessagePromise({
                type: 'plant/delete_image',
                entity_id: this.config.entity,
                filename: filename
            });
            
            // Aktualisiere die Entity nach dem Löschen
            await this._hass.callService('homeassistant', 'update_entity', {
                entity_id: this.config.entity
            });

            // Warte kurz, damit die Entity aktualisiert werden kann
            await new Promise(resolve => setTimeout(resolve, 500));

            // Hole die aktualisierten Bilder
            if (this.stateObj?.attributes.images) {
                const downloadPath = this.stateObj.attributes.download_path || '/local/images/plants/';
                const allImages = [...this.stateObj.attributes.images];
                
                // Sortiere die Bilder nach Datum
                const sortedImages = allImages.sort((a, b) => {
                    const dateA = a.match(/_(\d{8}_\d{6})/)?.[1] || '';
                    const dateB = b.match(/_(\d{8}_\d{6})/)?.[1] || '';
                    return dateA.localeCompare(dateB);
                });

                // Erstelle die URLs für alle Bilder
                this._imageUrls = sortedImages.map(img => `${downloadPath}${img}`);

                // Wenn ein entity_picture vorhanden ist, füge es am Anfang ein
                if (this.stateObj.attributes.entity_picture) {
                    this._imageUrls.unshift(this.stateObj.attributes.entity_picture);
                }

                // Passe den Index an, wenn das aktuelle Bild gelöscht wurde
                if (this._currentImageIndex >= this._imageUrls.length) {
                    this._currentImageIndex = Math.max(0, this._imageUrls.length - 1);
                }
            } else {
                // Wenn keine Bilder mehr in der Liste sind, prüfe auf entity_picture
                this._imageUrls = [];
                if (this.stateObj?.attributes.entity_picture) {
                    this._imageUrls = [this.stateObj.attributes.entity_picture];
                }
                this._currentImageIndex = 0;
            }

            // Schließe das Lösch-Flyout
            this._showDeleteFlyout = false;
            
            // Erzwinge ein Re-Rendering
            this.requestUpdate();

        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    private async setMainImage(filename: string) {
        if (!this.config?.entity || !this._hass) return;
        
        try {
            await this._hass.connection.sendMessagePromise({
                type: 'plant/set_main_image',
                entity_id: this.config.entity,
                filename: filename
            });
            
            // Aktualisiere die Entity nach dem Setzen
            await this._hass.callService('homeassistant', 'update_entity', {
                entity_id: this.config.entity
            });

            // Warte kurz, damit die Entity aktualisiert werden kann
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Schließe das Flyout
            this._showMainImageFlyout = false;
            
            // Erzwinge ein Re-Rendering
            this.requestUpdate();

        } catch (error) {
            console.error('Set main image error:', error);
            throw error;
        }
    }

    static get styles(): CSSResult[] {
        return [style];
    }
}