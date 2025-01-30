// import { HomeAssistant } from "custom-card-helpers";
import { DisplayType, DisplayedAttribute, DisplayedAttributes, Icons, Limits, UOM, UOMT } from "../types/flower-card-types";
import { TemplateResult, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { default_show_bars } from "./constants";
import { moreInfo } from "./utils";
import FlowerCard from "../flower-card";

// export const renderBattery = (config: FlowerCardConfig, hass: HomeAssistant) => {
export const renderBattery = (card: FlowerCard) => {
    if(!card.config.battery_sensor) return html``;

    const battery_sensor = card._hass.states[card.config.battery_sensor];
    if(!battery_sensor) return html``;

    const state = parseInt(battery_sensor.state);

    const levels = [
        { threshold: 90, icon: "mdi:battery", color: "green" },
        { threshold: 80, icon: "mdi:battery-90", color: "green" },
        { threshold: 70, icon: "mdi:battery-80", color: "green" },
        { threshold: 60, icon: "mdi:battery-70", color: "green" },
        { threshold: 50, icon: "mdi:battery-60", color: "green" },
        { threshold: 40, icon: "mdi:battery-50", color: "green" },
        { threshold: 30, icon: "mdi:battery-40", color: "orange" },
        { threshold: 20, icon: "mdi:battery-30", color: "orange" },
        { threshold: 10, icon: "mdi:battery-20", color: "red" },
        { threshold: 0, icon: "mdi:battery-10", color: "red" },
        { threshold: -Infinity, icon: "mdi:battery-alert-variant-outline", color: "red" },
    ];

    const { icon, color } = levels.find(({ threshold }) => state > threshold) ||  { icon: "mdi:battery-alert-variant-outline", color: "red" };

    return html`
        <div class="battery tooltip" @click="${(e: Event) => { e.stopPropagation(); moreInfo(card, card.config.battery_sensor)}}">
            <div class="tip" style="text-align:center;">${state}%</div>
            <ha-icon .icon="${icon}" style="color: ${color}"></ha-icon>
        </div>
    `;
}
export const renderAttributes = (card: FlowerCard): TemplateResult[] => {
    const icons: Icons = {};
    const uom: UOM = {};
    const uomt: UOMT = {};
    const limits: Record<string, Limits> = {};
    const curr: Record<string, number> = {};
    const sensors: Record<string, string> = {};
    const displayed: DisplayedAttributes = {};
    const monitored = card.config.show_bars || default_show_bars;

    if (card.plantinfo && card.plantinfo.result) {
        const result = card.plantinfo.result;
        for (const elem of monitored) {
            if (result[elem] || elem === 'health') {  // Erlaube health auch wenn nicht in result
                let max, min, current, icon, sensor, unit_of_measurement;
                
                if (elem === 'health') {
                    // Spezielle Behandlung für Health-Sensor
                    const healthSensor = card._hass.states[`number.${card.config.entity.split('.')[1]}_health`];
                    if (!healthSensor) continue;
                    
                    max = 5;
                    min = 0;
                    current = Number(healthSensor.state);
                    icon = "mdi:heart-pulse";
                    sensor = healthSensor.entity_id;
                    unit_of_measurement = "";
                } else {
                    // Normale Behandlung für andere Sensoren
                    ({ max, min, current, icon, sensor, unit_of_measurement } = result[elem]);
                }

                max = Number(max);
                min = Number(min);
                icon = String(icon);
                sensor = String(sensor);
                current = Number(current);
                unit_of_measurement = String(unit_of_measurement);
                const display_state = elem === 'health' ? current.toString() : card._hass.formatEntityState(card._hass.states[sensor]).replace(/[^\d,.]/g, "");
                limits[`max_${elem}`] = { max, min };
                curr[elem] = current;
                icons[elem] = icon;
                sensors[elem] = sensor;
                uomt[elem] = unit_of_measurement;
                uom[elem] = unit_of_measurement;
                if (elem === "dli") {
                    uomt["dli"] = "mol/d⋅m²";
                    uom["dli"] = '<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>';
                }
                displayed[elem] = { name: elem, current, limits: limits[`max_${elem}`], icon, sensor, unit_of_measurement, display_state };
            }
        }
    }

    return renderAttributeChunks(card, displayed);
}

export const renderAttribute = (card: FlowerCard, attr: DisplayedAttribute) => {
    const { max, min } = attr.limits;
    const unitTooltip = attr.unit_of_measurement;
    const icon = attr.icon || "mdi:help-circle-outline";
    const val = attr.current || 0;
    const aval = !isNaN(val);
    const display_val = attr.display_state;

    // Spezielle Behandlung für Health-Bar
    if (attr.name === 'health') {
        const attributeCssClass = `attribute ${card.config.display_type === DisplayType.Compact ? 'width-100' : ''}`;

        // Berechne die aktuelle Farbe basierend auf dem Wert (0-5 in 0.5er Schritten)
        const step = Math.floor(val * 2); // 0-10 Schritte
        let activeColor;
        if (step <= 5) { // 0.5-2.5: Rot nach Gelb
            const mix = (step - 1) / 4; // -1/4 bis 1
            activeColor = `rgba(240,163,163,1)`;
            if (mix >= 0) {
                activeColor = `rgb(${240 + (15 * mix)}, ${163 + (51 * mix)}, ${163 - (163 * mix)})`;
            }
        } else { // 2.5-5: Gelb nach Grün
            const mix = (step - 5) / 5;
            activeColor = `rgb(${255 - (212 * mix)}, ${214 - (20 * mix)}, ${0 + (83 * mix)})`;
        }

        // Erstelle 10 Segmente für Werte von 0 bis 5 in 0.5er Schritten
        const segments = Array.from({length: 10}, (_, i) => {
            const segmentValue = i * 0.5;
            const isActive = aval && val > segmentValue;
            const color = isActive ? activeColor : 'var(--primary-background-color)';
            return html`
                <span class="" 
                      style="grid-row: 1; grid-column: ${i + 1}; border-radius: 2px; background-color: ${color};">
                </span>
            `;
        });

        const decreaseValue = () => {
            const newValue = Math.max(0, val - 0.5);
            card._hass.callService('number', 'set_value', {
                entity_id: attr.sensor,
                value: newValue
            });
        };

        const increaseValue = () => {
            const newValue = Math.min(5, val + 0.5);
            card._hass.callService('number', 'set_value', {
                entity_id: attr.sensor,
                value: newValue
            });
        };

        return html`
            <div class="${attributeCssClass}">
                <ha-icon .icon="${icon}" 
                         style="cursor: pointer;" 
                         @click="${(e: Event) => {
                             e.stopPropagation();
                             decreaseValue();
                         }}">
                </ha-icon>
                <div class="meter green" style="display: grid; grid-template-columns: repeat(10, 1fr); column-gap: 5px; max-width: calc(50% + 10px); margin-right: 5px; position: relative;">
                    ${segments}
                    <input type="range" 
                           min="0" 
                           max="5" 
                           step="0.5"
                           .value="${val}"
                           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.0001; cursor: pointer; margin: 0; padding: 0;"
                           @input="${(e: Event) => {
                               e.stopPropagation();
                               const target = e.target as HTMLInputElement;
                               const newValue = parseFloat(target.value);
                               card._hass.callService('number', 'set_value', {
                                   entity_id: attr.sensor,
                                   value: newValue
                               });
                           }}"
                    >
                </div>
                ${card.config.display_type === DisplayType.Compact ? '': html`
                    <div class="header" style="cursor: pointer; min-width: 24px;" @click="${(e: Event) => {
                        e.stopPropagation();
                        increaseValue();
                    }}">
                        <span class="value">${display_val}</span>
                    </div>
                `}
            </div>
        `;
    }

    // Normale Behandlung für andere Attribute
    const pct = 100 * Math.max(0, Math.min(1, (val - min) / (max - min)));
    const toolTipText = aval ? `${attr.name}: ${val} ${unitTooltip}<br>(${min} ~ ${max} ${unitTooltip})` : card._hass.localize('state.default.unavailable');
    const label = attr.name === 'dli' ? '<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>' : unitTooltip;
    const attributeCssClass = `attribute tooltip ${card.config.display_type === DisplayType.Compact ? 'width-100' : ''}`;

    return html`
        <div class="${attributeCssClass}" @click="${() => moreInfo(card, attr.sensor)}">
            <div class="tip" style="text-align:center;">${unsafeHTML(toolTipText)}</div>
            <ha-icon .icon="${icon}"></ha-icon>
            <div class="meter red">
                <span class="${
                    aval ? (val < min || val > max ? "bad" : "good") : "unavailable"
                }" style="width: 100%;"></span>
            </div>
            <div class="meter green">
                <span class="${
                    aval ? (val > max ? "bad" : "good") : "unavailable"
                }" style="width:${aval ? pct : "0"}%;"></span>
            </div>
            <div class="meter red">
                <span class="bad" style="width:${
                    aval ? (val > max ? 100 : 0) : "0"
                }%;"></span>
            </div>
            ${card.config.display_type === DisplayType.Compact ? '': html`<div class="header"><span class="value">${display_val}</span>&nbsp;<span class='unit'>${attr.name === 'health' ? '' : unsafeHTML(label)}</span></div>`}
        </div>
    `;
};

export const getChunkedDisplayed = (displayed: DisplayedAttributes, attributesPerRow: number) => {
    return Object.values(displayed).reduce((acc, curr, i) => {
      const index = Math.floor(i / attributesPerRow);
      if (!acc[index]) {
        acc[index] = [];
      }
      acc[index].push(curr);
      return acc;
    }, []);
}

export const renderAttributeChunks = (card: FlowerCard, displayed: DisplayedAttributes): TemplateResult[] => {
    const chunkedDisplayed = getChunkedDisplayed(displayed, card.config.display_type === DisplayType.Compact ? 1 : 2);
    const attributeCssClass = `attributes ${card.config.display_type === DisplayType.Compact ? 'width-100' : ''}`;

    return chunkedDisplayed.map((chunk) => {
      return html`<div class="${attributeCssClass}">${chunk.map((item: DisplayedAttribute) => {
        return item ? html`${renderAttribute(card, item)}` : '';
      })}</div>`;
    }).flat();
  }

