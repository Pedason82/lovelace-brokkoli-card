import { html } from 'lit';
import { customElement } from "lit/decorators.js";
import { DisplayType } from "./types/brokkoli-card-types";
import { default_show_bars, default_show_elements, default_option_elements, plantAttributes, elementOptions } from "./utils/constants";
import EditorForm from "@marcokreeft/ha-editor-formbuilder";
import { FormControlType } from "@marcokreeft/ha-editor-formbuilder/dist/interfaces";
import { getEntitiesByDomain } from "@marcokreeft/ha-editor-formbuilder/dist/utils/entities";
import { getEntitiesByDeviceClass } from "@marcokreeft/ha-editor-formbuilder/dist/utils/entities";
import { EVENT_TYPES } from "./components/history";

// Funktion, um sowohl plant als auch cycle Entitäten zu erhalten
const getPlantAndCycleEntities = (hass: any) => {
    const plantEntities = getEntitiesByDomain(hass, 'plant');
    const cycleEntities = getEntitiesByDomain(hass, 'cycle');
    return [...plantEntities, ...cycleEntities];
};

// Definiere die verfügbaren History-Gruppen
const historyGroupOptions = [
    { label: 'Wachstumsphasen', value: EVENT_TYPES.PHASE },
    { label: 'Topfgrößen', value: EVENT_TYPES.POT },
    { label: 'Standorte', value: EVENT_TYPES.AREA },
    { label: 'Behandlungen', value: EVENT_TYPES.TREATMENT },
    { label: 'Bilder', value: EVENT_TYPES.IMAGE },
    { label: 'Journal', value: EVENT_TYPES.JOURNAL }
];

// Definiere die Optionen für die Position der History-Linie
const historyLinePositionOptions = [
    { label: 'Links', value: 'left' },
    { label: 'Rechts', value: 'right' }
];

// Definiere die Optionen für die standardmäßig geöffneten Optionsbereiche
// Wir filtern die elementOptions, um nur die Optionen zu behalten, die im Optionsmenü angezeigt werden können
const defaultExpandedOptions = elementOptions.filter(option => 
    option.value !== 'header' && option.value !== 'options'
);

@customElement('brokkoli-card-editor')
export class BrokkoliCardEditor extends EditorForm {

    render() {
        if (!this._hass || !this._config) {
            return html``;
        }

        // Stelle sicher, dass wir mit einer Kopie des Konfigurationsobjekts arbeiten
        if (!this._config.show_bars) {
            this._config = {
                ...this._config,
                show_bars: [...default_show_bars]
            };
        }

        if (!this._config.show_elements) {
            this._config = {
                ...this._config,
                show_elements: [...default_show_elements]
            };
        }

        if (!this._config.option_elements) {
            this._config = {
                ...this._config,
                option_elements: [...default_option_elements]
            };
        }

        if (!this._config.full_width_bars) {
            this._config = {
                ...this._config,
                full_width_bars: []
            };
        }

        const plantsList = getPlantAndCycleEntities(this._hass);
        const batteryList = getEntitiesByDeviceClass(this._hass, "sensor", "battery");

        return this.renderForm([
            { controls: [{ label: "Display Type", configValue: "display_type", type: FormControlType.Radio, items: [
                { label: 'Full', value: DisplayType.Full },
                { label: 'Compact', value: DisplayType.Compact },
            ] }] },
            { controls: [{ label: "Entity", configValue: "entity", type: FormControlType.Dropdown, items: plantsList }] },
            { controls: [{ label: "Battery Sensor", configValue: "battery_sensor", type: FormControlType.Dropdown, items: batteryList }] },
            { controls: [{ label: "Show Bars", configValue: "show_bars", type: FormControlType.Checkboxes, items: plantAttributes }] },
            { controls: [{ label: "Full Width Bars", configValue: "full_width_bars", type: FormControlType.Checkboxes, items: plantAttributes }] },
            { controls: [{ label: "Show Elements", configValue: "show_elements", type: FormControlType.Checkboxes, items: elementOptions }] },
            { controls: [{ label: "Option Elements", configValue: "option_elements", type: FormControlType.Checkboxes, items: elementOptions }] },
            { controls: [{ label: "Default Expanded Options", configValue: "default_expanded_options", type: FormControlType.Checkboxes, items: defaultExpandedOptions }] },
            { controls: [{ label: "History Groups", configValue: "history_groups", type: FormControlType.Checkboxes, items: historyGroupOptions }] },
            { controls: [{ label: "History Line Position", configValue: "history_line_position", type: FormControlType.Radio, items: historyLinePositionOptions }] }
        ]);
    }    
}
