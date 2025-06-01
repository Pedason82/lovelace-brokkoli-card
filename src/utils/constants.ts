import { DropdownOption } from "@marcokreeft/ha-editor-formbuilder/dist/interfaces";

export const CARD_NAME = "brokkoli-card";
export const CARD_EDITOR_NAME = "brokkoli-card-editor";

export const default_show_bars = [
    "moisture",
    "conductivity",
    "temperature",
    "illuminance",
    "humidity",
    "dli",
    "water_consumption",
    "fertilizer_consumption",
    "ppfd",
    "power_consumption",
    "energy_consumption",
    "ph",
    "health"
];

export const default_show_elements = [
    "header",
    "attributes",
    "options"
];

export const default_option_elements = [
    "attributes",
    "consumption",
    "history",
    "details"
];

export const elementOptions = [
    { label: 'Header', value: 'header' },
    { label: 'Attribute Bars', value: 'attributes' },
    { label: 'Options Menu', value: 'options' },
    { label: 'Consumption', value: 'consumption' },
    { label: 'History', value: 'history' },
    { label: 'Details', value: 'details' }
];

export const missingImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1oaWRkZW49InRydWUiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICAgIDxnPgogICAgICA8IS0tP2xpdCQ0MTM0MjMxNjkkLS0+PHBhdGggZD0iTTMsMTNBOSw5IDAgMCwwIDEyLDIyQzEyLDE3IDcuOTcsMTMgMywxM00xMiw1LjVBMi41LDIuNSAwIDAsMSAxNC41LDhBMi41LDIuNSAwIDAsMSAxMiwxMC41QTIuNSwyLjUgMCAwLDEgOS41LDhBMi41LDIuNSAwIDAsMSAxMiw1LjVNNS42LDEwLjI1QTIuNSwyLjUgMCAwLDAgOC4xLDEyLjc1QzguNjMsMTIuNzUgOS4xMiwxMi41OCA5LjUsMTIuMzFDOS41LDEyLjM3IDkuNSwxMi40MyA5LjUsMTIuNUEyLjUsMi41IDAgMCwwIDEyLDE1QTIuNSwyLjUgMCAwLDAgMTQuNSwxMi41QzE0LjUsMTIuNDMgMTQuNSwxMi4zNyAxNC41LDEyLjMxQzE0Ljg4LDEyLjU4IDE1LjM3LDEyLjc1IDE1LjksMTIuNzVDMTcuMjgsMTIuNzUgMTguNCwxMS42MyAxOC40LDEwLjI1QzE4LjQsOS4yNSAxNy44MSw4LjQgMTYuOTcsOEMxNy44MSw3LjYgMTguNCw2Ljc0IDE4LjQsNS43NUMxOC40LDQuMzcgMTcuMjgsMy4yNSAxNS45LDMuMjVDMTUuMzcsMy4yNSAxNC44OCwzLjQxIDE0LjUsMy42OUMxNC41LDMuNjMgMTQuNSwzLjU2IDE0LjUsMy41QTIuNSwyLjUgMCAwLDAgMTIsMUEyLjUsMi41IDAgMCwwIDkuNSwzLjVDOS41LDMuNTYgOS41LDMuNjMgOS41LDMuNjlDOS4xMiwzLjQxIDguNjMsMy4yNSA4LjEsMy4yNUEyLjUsMi41IDAgMCwwIDUuNiw1Ljc1QzUuNiw2Ljc0IDYuMTksNy42IDcuMDMsOEM2LjE5LDguNCA1LjYsOS4yNSA1LjYsMTAuMjVNMTIsMjJBOSw5IDAgMCwwIDIxLDEzQzE2LDEzIDEyLDE3IDEyLDIyWiI+PC9wYXRoPgogICAgICA8L2c+Cjwvc3ZnPgo=";

export const plantAttributes : DropdownOption[] = [
  { label: 'Moisture', value: 'moisture' },
  { label: 'Conductivity', value: 'conductivity' },
  { label: 'Temperature', value: 'temperature' },
  { label: 'Illuminance', value: 'illuminance' },
  { label: 'Humidity', value: 'humidity' },
  { label: 'Daily Light Integral', value: 'dli' },
  { label: 'Water Consumption', value: 'water_consumption' },
  { label: 'Fertilizer Consumption', value: 'fertilizer_consumption' },
  { label: 'PPFD', value: 'ppfd' },
  { label: 'Power Consumption', value: 'power_consumption' },
  { label: 'Energy Consumption', value: 'energy_consumption' },
  { label: 'pH', value: 'ph' },
  { label: 'Health', value: 'health' }
];

// Zentrale Definition der Growth Phase Icons
export const getGrowthPhaseIcon = (phase: string): string => {
  switch(phase.toLowerCase()) {
    case 'samen':
      return 'mdi:seed';
    case 'keimen':
      return 'mdi:seed-outline';
    case 'wurzeln':
      return 'mdi:sprout';
    case 'wachstum':
      return 'mdi:leaf';
    case 'blüte':
      return 'mdi:flower';
    case 'geerntet':
      return 'mdi:content-cut';
    case 'entfernt':
      return 'mdi:delete';
    default:
      return 'mdi:help-circle';
  }
};
