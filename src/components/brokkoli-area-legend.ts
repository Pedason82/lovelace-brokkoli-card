import {
  LitElement,
  html,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { HomeAssistant } from 'custom-card-helpers';
import { legendStyles } from '../styles/legend-styles';

export interface LegendSettings {
  activeTab: string;
  selectedRings: string[];
  selectedLabels: string[];
  heatmapSensor?: string;
  heatmapColor?: string;
  heatmapSecondaryColor?: string;
  heatmapOpacity?: number;
}

// Liste der verfügbaren Sensoren für die Legende
const AVAILABLE_SENSORS = [
  { id: 'temperature', name: 'Temperatur' },
  { id: 'moisture', name: 'Feuchtigkeit' },
  { id: 'conductivity', name: 'Leitfähigkeit' },
  { id: 'dli', name: 'Licht (DLI)' },
  { id: 'health', name: 'Gesundheit' },
  { id: 'humidity', name: 'Luftfeuchtigkeit' },
  { id: 'illuminance', name: 'Helligkeit' },
  { id: 'water_consumption', name: 'Wasserverbrauch' },
  { id: 'fertilizer_consumption', name: 'Düngerverbrauch' },
  { id: 'power_consumption', name: 'Stromverbrauch' }
];

@customElement('brokkoli-area-legend')
export class BrokkoliAreaLegend extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  
  // Einstellungen aus der YAML-Konfiguration (Initial-Zustand)
  @property({ attribute: false }) initialShowRings: string[] = [];
  @property({ attribute: false }) initialShowLabels: string[] = [];
  @property({ attribute: false }) initialHeatmap?: string;
  @property({ attribute: false }) initialHeatmapColor?: string;
  @property({ attribute: false }) initialHeatmapSecondaryColor?: string;
  @property({ attribute: false }) initialHeatmapOpacity?: number;
  
  // Zugriff auf dynamische PlantInfo-Daten
  @property({ attribute: false }) plantInfo?: Record<string, any>;
  
  // Aktueller Zustand der Legende
  @state() private _activeTab = 'rings'; // 'rings', 'labels', oder 'heatmap'
  @state() private _selectedRings: string[] = [];
  @state() private _selectedLabels: string[] = [];
  @state() private _heatmapSensor?: string;
  @state() private _heatmapColor: string = '#ff6666'; // Standardfarbe Rot
  @state() private _heatmapSecondaryColor: string = '#ffffff'; // Standardfarbe Weiß
  @state() private _heatmapOpacity: number = 0.8; // Standard-Opacity 80%
  @state() private _isDraggingOpacity = false;
  
  firstUpdated() {
    // Initialisiere die Legende mit den Werten aus der YAML-Konfiguration
    this._selectedRings = [...this.initialShowRings];
    this._selectedLabels = [...this.initialShowLabels];
    this._heatmapSensor = this.initialHeatmap;
    this._heatmapColor = this._fixColorValue(this.initialHeatmapColor) || this._heatmapColor;
    this._heatmapSecondaryColor = this._fixColorValue(this.initialHeatmapSecondaryColor) || this._heatmapSecondaryColor;
    this._heatmapOpacity = this.initialHeatmapOpacity !== undefined ? this.initialHeatmapOpacity : this._heatmapOpacity;
  }
  
  updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    
    // Wenn sich die initialen Einstellungen ändern, aktualisiere die Legende
    if (
      changedProps.has('initialShowRings') || 
      changedProps.has('initialShowLabels') || 
      changedProps.has('initialHeatmap') ||
      changedProps.has('initialHeatmapColor') ||
      changedProps.has('initialHeatmapSecondaryColor') ||
      changedProps.has('initialHeatmapOpacity')
    ) {
      // Nur aktualisieren, wenn die Einstellungen von der YAML-Konfiguration kommen
      if (!this._userChangedSettings) {
        this._selectedRings = [...this.initialShowRings];
        this._selectedLabels = [...this.initialShowLabels];
        this._heatmapSensor = this.initialHeatmap;
        this._heatmapColor = this._fixColorValue(this.initialHeatmapColor) || this._heatmapColor;
        this._heatmapSecondaryColor = this._fixColorValue(this.initialHeatmapSecondaryColor) || this._heatmapSecondaryColor;
        this._heatmapOpacity = this.initialHeatmapOpacity !== undefined ? this.initialHeatmapOpacity : this._heatmapOpacity;
      }
    }
  }
  
  // Wandelt einfache Farbnamen in Hex-Werte um (für color-Inputs)
  private _fixColorValue(color?: string): string | undefined {
    if (!color) return undefined;
    if (color.startsWith('#')) return color;
    
    // Map mit Standard-Farbnamen
    const colors: Record<string, string> = {
      'red': '#ff0000',
      'blue': '#0000ff'
    };
    
    return colors[color.toLowerCase()] || color;
  }
  
  // Hilfs-Methode, um das Icon für einen Sensor zu bekommen
  private _getIconForSensor(sensorId: string): string {
    // Fallback-Icons für den Fall, dass keine dynamischen Icons verfügbar sind
    const fallbackIcons: Record<string, string> = {
      'temperature': 'mdi:thermometer',
      'moisture': 'mdi:water-percent',
      'conductivity': 'mdi:flash',
      'dli': 'mdi:white-balance-sunny',
      'health': 'mdi:heart-pulse',
      'humidity': 'mdi:water',
      'illuminance': 'mdi:brightness-5',
      'water_consumption': 'mdi:cup-water',
      'fertilizer_consumption': 'mdi:fertilizer',
      'power_consumption': 'mdi:flash-circle',
      'ph': 'mdi:ph'
    };
    
    // Wenn PlantInfo verfügbar ist, versuche das Icon von dort zu bekommen
    if (this.plantInfo?.result && this.plantInfo.result[sensorId]?.icon) {
      return this.plantInfo.result[sensorId].icon;
    }
    
    // Fallback für health sensor
    if (sensorId === 'health' && this.plantInfo?.result?.helpers?.health) {
      return 'mdi:heart-pulse'; // Üblicher Icon für Health-Sensor
    }
    
    // Wenn kein dynamisches Icon gefunden wurde, verwende Fallback
    return fallbackIcons[sensorId] || 'mdi:help-circle-outline';
  }
  
  // Stoppen alle Klick-Events, damit sie nicht bis zur Area Card durchdringen
  private _stopEvent(e: Event) {
    e.stopPropagation();
  }
  
  // Flag, das angibt, ob der Benutzer manuell Änderungen an den Einstellungen vorgenommen hat
  private _userChangedSettings = false;
  
  // Handler für Tab-Änderung durch zyklisches Schalten
  private _cycleTab(e: Event) {
    e.stopPropagation();
    
    // Zyklisch durch die Tabs schalten
    if (this._activeTab === 'rings') {
      this._activeTab = 'labels';
    } else if (this._activeTab === 'labels') {
      this._activeTab = 'heatmap';
    } else {
      this._activeTab = 'rings';
    }
    
    this.requestUpdate();
  }
  
  // Handler für Änderung an den Ringen
  private _handleRingChange(e: Event, sensorId: string) {
    e.stopPropagation();
    this._userChangedSettings = true;
    
    // Toggle Selektion
    if (this._selectedRings.includes(sensorId)) {
      this._selectedRings = this._selectedRings.filter(id => id !== sensorId);
    } else {
      this._selectedRings.push(sensorId);
    }
    
    // Änderungen an die übergeordnete Komponente senden
    this._dispatchSettingsChanged();
  }
  
  // Handler für Änderung an den Labels
  private _handleLabelChange(e: Event, sensorId: string) {
    e.stopPropagation();
    this._userChangedSettings = true;
    
    // Toggle Selektion
    if (this._selectedLabels.includes(sensorId)) {
      this._selectedLabels = this._selectedLabels.filter(id => id !== sensorId);
    } else {
      this._selectedLabels.push(sensorId);
    }
    
    // Änderungen an die übergeordnete Komponente senden
    this._dispatchSettingsChanged();
  }
  
  // Handler für Änderung des Heatmap-Sensors
  private _handleHeatmapSensorChange(e: Event, sensorId: string) {
    e.stopPropagation();
    this._userChangedSettings = true;
    
    if (this._heatmapSensor === sensorId) {
      // Deaktiviere den Sensor, wenn er bereits ausgewählt ist
      // Setze explizit null statt undefined, damit wir später erkennen können,
      // dass der Benutzer die Heatmap aktiv deaktiviert hat und nicht die YAML-Konfiguration verwenden soll
      this._heatmapSensor = null;
    } else {
      this._heatmapSensor = sensorId;
    }
    
    // Änderungen an die übergeordnete Komponente senden
    this._dispatchSettingsChanged();
  }
  
  // Handler für Änderung der Heatmap-Farben
  private _handleColorChange(event: Event, isPrimary: boolean) {
    event.stopPropagation();
    this._userChangedSettings = true;
    
    const input = event.target as HTMLInputElement;
    if (isPrimary) {
      this._heatmapColor = input.value;
    } else {
      this._heatmapSecondaryColor = input.value;
    }
    
    // Änderungen an die übergeordnete Komponente senden
    this._dispatchSettingsChanged();
  }

  // Handler für Opacity-Änderung über den Farbverlauf
  private _handleOpacityDragStart(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._isDraggingOpacity = true;
    
    // Initiale Opacity-Anpassung basierend auf dem Klick
    this._updateOpacityFromMouseEvent(event);
    
    // Event-Listener für Bewegung und Ende des Drag-Vorgangs
    const moveHandler = (moveEvent: MouseEvent) => this._updateOpacityFromMouseEvent(moveEvent);
    const upHandler = () => {
      this._isDraggingOpacity = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
    
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }
  
  // Aktualisiert die Opacity basierend auf der horizontalen Mausposition
  private _updateOpacityFromMouseEvent(event: MouseEvent) {
    if (!this._isDraggingOpacity) return;
    
    const gradientElement = this.shadowRoot?.querySelector('.gradient-preview') as HTMLElement;
    if (!gradientElement) return;
    
    const rect = gradientElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    // Berechne Opacity zwischen 0 und 1 basierend auf horizontaler Position
    const newOpacity = Math.max(0, Math.min(1, x / width));
    this._heatmapOpacity = newOpacity;
    this._userChangedSettings = true;
    
    // Änderungen an die übergeordnete Komponente senden
    this._dispatchSettingsChanged();
  }
  
  // Sendet ein Event mit den aktuellen Einstellungen an die übergeordnete Komponente
  private _dispatchSettingsChanged() {
    const settings: LegendSettings = {
      activeTab: this._activeTab,
      selectedRings: [...this._selectedRings],
      selectedLabels: [...this._selectedLabels],
      heatmapSensor: this._heatmapSensor,
      heatmapColor: this._heatmapColor || '#ff6666', // Standardfarbe Rot sicherstellen
      heatmapSecondaryColor: this._heatmapSecondaryColor || '#ffffff', // Standardfarbe Weiß sicherstellen
      heatmapOpacity: this._heatmapOpacity !== undefined ? this._heatmapOpacity : 0.8 // Standard-Opacity sicherstellen
    };
    
    this.dispatchEvent(new CustomEvent('settings-changed', {
      detail: settings,
      bubbles: true,
      composed: true
    }));
  }
  
  // Rendert den Button zum Umschalten des Modus
  private _renderModeToggle() {
    let icon;
    let title;
    
    switch (this._activeTab) {
      case 'rings':
        icon = 'mdi:circle-outline';
        title = 'Ringe-Modus aktiv, klicke für Labels';
        break;
      case 'labels':
        icon = 'mdi:label-outline';
        title = 'Labels-Modus aktiv, klicke für Heatmap';
        break;
      case 'heatmap':
        icon = 'mdi:gradient';
        title = 'Heatmap-Modus aktiv, klicke für Ringe';
        break;
    }
    
    return html`
      <button 
        class="mode-toggle" 
        title="${title}"
        @click=${this._cycleTab}
      >
        <ha-icon icon="${icon}"></ha-icon>
      </button>
    `;
  }
  
  // Rendert die Icons für Ringe
  private _renderRingOptions() {
    if (this._activeTab !== 'rings') return html``;
    
    return html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${AVAILABLE_SENSORS.map(sensor => {
          const isSelected = this._selectedRings.includes(sensor.id);
          return html`
            <div 
              class="sensor-icon ${isSelected ? 'selected' : ''}"
              title="${sensor.name}"
              @click=${(e: Event) => this._handleRingChange(e, sensor.id)}
              style=${styleMap({
                backgroundColor: isSelected ? `var(--sensor-ring-${sensor.id}-color, var(--primary-color))` : 'var(--secondary-background-color, #f5f5f5)'
              })}
            >
              <ha-icon 
                icon="${this._getIconForSensor(sensor.id)}"
                style=${styleMap({
                  color: isSelected ? 'white' : `var(--sensor-ring-${sensor.id}-color, var(--primary-color))`
                })}
              ></ha-icon>
            </div>
          `;
        })}
      </div>
    `;
  }
  
  // Rendert die Icons für Labels
  private _renderLabelOptions() {
    if (this._activeTab !== 'labels') return html``;
    
    return html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${AVAILABLE_SENSORS.map(sensor => {
          const isSelected = this._selectedLabels.includes(sensor.id);
          return html`
            <div 
              class="sensor-icon ${isSelected ? 'selected' : ''}"
              title="${sensor.name}"
              @click=${(e: Event) => this._handleLabelChange(e, sensor.id)}
              style=${styleMap({
                backgroundColor: isSelected ? `var(--sensor-ring-${sensor.id}-color, var(--primary-color))` : 'var(--secondary-background-color, #f5f5f5)'
              })}
            >
              <ha-icon 
                icon="${this._getIconForSensor(sensor.id)}"
                style=${styleMap({
                  color: isSelected ? 'white' : `var(--sensor-ring-${sensor.id}-color, var(--primary-color))`
                })}
              ></ha-icon>
            </div>
          `;
        })}
      </div>
    `;
  }
  
  // Rendert die Icons für Heatmap
  private _renderHeatmapOptions() {
    if (this._activeTab !== 'heatmap') return html``;
    
    return html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${AVAILABLE_SENSORS.map(sensor => {
          const isSelected = this._heatmapSensor === sensor.id;
          return html`
            <div 
              class="sensor-icon ${isSelected ? 'selected' : ''}"
              title="${sensor.name}"
              @click=${(e: Event) => this._handleHeatmapSensorChange(e, sensor.id)}
              style=${styleMap({
                backgroundColor: isSelected ? `var(--sensor-ring-${sensor.id}-color, var(--primary-color))` : 'var(--secondary-background-color, #f5f5f5)'
              })}
            >
              <ha-icon 
                icon="${this._getIconForSensor(sensor.id)}"
                style=${styleMap({
                  color: isSelected ? 'white' : `var(--sensor-ring-${sensor.id}-color, var(--primary-color))`
                })}
              ></ha-icon>
            </div>
          `;
        })}
        
        <!-- Farbauswahl immer anzeigen, unabhängig vom Sensor-Status -->
        <div class="color-picker-section" @click=${this._stopEvent}>
          <div class="color-option">
            <input 
              type="color" 
              .value=${this._heatmapColor} 
              @change=${(e: Event) => this._handleColorChange(e, true)}
              title="Primärfarbe"
            />
            <input 
              type="color" 
              .value=${this._heatmapSecondaryColor} 
              @change=${(e: Event) => this._handleColorChange(e, false)}
              title="Sekundärfarbe"
            />
          </div>
          <div class="color-preview">
            <div 
              class="gradient-preview" 
              style=${styleMap({
                background: `linear-gradient(to right, ${this._heatmapColor || '#ff6666'}, ${this._heatmapSecondaryColor || '#ffffff'})`,
                cursor: 'ew-resize'
              })}
              @mousedown=${this._handleOpacityDragStart}
              title="Deckkraft"
            ></div>
          </div>
        </div>
      </div>
    `;
  }
  
  render() {
    return html`
      <div class="legend-container" @click=${this._stopEvent}>
        ${this._renderModeToggle()}
        
        <div class="content-container" @click=${this._stopEvent}>
          ${this._renderRingOptions()}
          ${this._renderLabelOptions()}
          ${this._renderHeatmapOptions()}
        </div>
      </div>
    `;
  }
  
  static get styles() {
    return legendStyles;
  }
}