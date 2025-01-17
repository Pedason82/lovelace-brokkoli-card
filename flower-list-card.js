/*! For license information please see flower-list-card.js.LICENSE.txt */
(()=>{"use strict";var t={45:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},n=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const o=i(458),r=i(924),a=i(800),l=i(330);console.info(`%c FLOWER-LIST-CARD %c ${l.version}`,"color: cyan; background: black; font-weight: bold;","color: darkblue; background: white; font-weight: bold;"),window.customCards=window.customCards||[],window.customCards.push({type:"flower-list-card",name:"Flower List Card",preview:!0,description:"Eine tabellarische Übersicht aller Pflanzen"});let d=class extends o.LitElement{constructor(){super(...arguments),this._sortColumn="friendly_name",this._sortDirection="asc",this._editingCell=null,this._searchQuery="",this.plantEntities=[],this.EDITABLE_PLANT_ATTRIBUTES=["strain","breeder","flowering_duration","pid","sorte","feminized","effects","smell","taste","phenotype","hunger","growth_stretch","flower_stretch","mold_resistance","difficulty","yield","notes","website"]}static getStubConfig(){return{type:"custom:flower-list-card",show_columns:{name:!0,growing:!0,basic:!0,metrics:!1,genetics:!0,sensors:!0,min_max:!1,diagnostics:!0,characteristics:!0,growth:!0,details:!0,notes:!0}}}set hass(t){this._hass=t,this.updatePlantEntities()}updatePlantEntities(){this._hass&&(this.plantEntities=Object.values(this._hass.states).filter((t=>"object"==typeof t&&null!==t&&"entity_id"in t&&"string"==typeof t.entity_id&&t.entity_id.startsWith("plant."))),this.requestUpdate())}handleSort(t){this._sortColumn===t?this._sortDirection="asc"===this._sortDirection?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc"),this.requestUpdate()}getSortedPlants(){let filteredPlants=[...this.plantEntities];if(this._searchQuery){filteredPlants=filteredPlants.filter(plant=>{const searchableFields=[plant.attributes.friendly_name,plant.state,plant.attributes.strain,plant.attributes.breeder,plant.attributes.notes].filter(Boolean);return searchableFields.some(field=>field.toString().toLowerCase().includes(this._searchQuery))});filteredPlants=filteredPlants.sort(((t,e)=>{var i,s,n,o,r,a,l,d,c,h,u,p,m,_,v,g,f,y,b,$,w,x,A,C;let E,k;switch(this._sortColumn){case"friendly_name":E=t.attributes.friendly_name,k=e.attributes.friendly_name;break;case"state":E=t.state,k=e.state;break;case"area":const S=this.getAreaForEntity(t.entity_id),P=this.getAreaForEntity(e.entity_id);E=S&&(null===(s=null===(i=this._hass)||void 0===i?void 0:i.areas[S])||void 0===s?void 0:s.name)||"",k=P&&(null===(o=null===(n=this._hass)||void 0===n?void 0:n.areas[P])||void 0===o?void 0:o.name)||"";break;case"growth_phase":const U=t.entity_id.split(".")[1],T=e.entity_id.split(".")[1];E=(null===(a=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${U}_growth_phase`])||void 0===a?void 0:a.state)||"",k=(null===(d=null===(l=this._hass)||void 0===l?void 0:l.states[`select.${T}_growth_phase`])||void 0===d?void 0:d.state)||"";break;case"cycle":const O=t.entity_id.split(".")[1],N=e.entity_id.split(".")[1];E=(null===(h=null===(c=this._hass)||void 0===c?void 0:c.states[`select.${O}_cycle`])||void 0===h?void 0:h.state)||"",k=(null===(p=null===(u=this._hass)||void 0===u?void 0:u.states[`select.${N}_cycle`])||void 0===p?void 0:p.state)||"";break;case"pot_size":const z=t.entity_id.split(".")[1],L=e.entity_id.split(".")[1];E=Number((null===(_=null===(m=this._hass)||void 0===m?void 0:m.states[`number.${z}_pot_size`])||void 0===_?void 0:_.state)||0),k=Number((null===(g=null===(v=this._hass)||void 0===v?void 0:v.states[`number.${L}_pot_size`])||void 0===g?void 0:g.state)||0);break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"ppfd":case"total_ppfd":case"water_consumption":case"fertilizer_consumption":const R=t.entity_id.split(".")[1],D=e.entity_id.split(".")[1],M="ppfd"===this._sortColumn?"ppfd_mol":"total_ppfd"===this._sortColumn?"total_ppfd_mol_integral":this._sortColumn;E=Number((null===(y=null===(f=this._hass)||void 0===f?void 0:f.states[`sensor.${R}_${M}`])||void 0===y?void 0:y.state)||0),k=Number((null===($=null===(b=this._hass)||void 0===b?void 0:b.states[`sensor.${D}_${M}`])||void 0===$?void 0:$.state)||0);break;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":const H=t.entity_id.split(".")[1],j=e.entity_id.split(".")[1];E=Number((null===(x=null===(w=this._hass)||void 0===w?void 0:w.states[`number.${H}_${this._sortColumn}`])||void 0===x?void 0:x.state)||0),k=Number((null===(C=null===(A=this._hass)||void 0===A?void 0:A.states[`number.${j}_${this._sortColumn}`])||void 0===C?void 0:C.state)||0);break;default:E=t.attributes[this._sortColumn]||"",k=e.attributes[this._sortColumn]||""}return"number"==typeof E&&"number"==typeof k?"asc"===this._sortDirection?E-k:k-E:(E=String(E).toLowerCase(),k=String(k).toLowerCase(),"asc"===this._sortDirection?E.localeCompare(k):k.localeCompare(E))}))}getAllAvailableColumns(){const t=[];return t.push({id:"friendly_name",name:"Name",group:"name"}),t.push({id:"state",name:"Status",group:"basic"}),t.push({id:"area",name:"Bereich",group:"growing"},{id:"growth_phase",name:"Phase",group:"growing"},{id:"cycle",name:"Durchgang",group:"growing"},{id:"pot_size",name:"Topfgröße",group:"growing"}),t.push({id:"strain",name:"Sorte",group:"genetics"},{id:"breeder",name:"Züchter",group:"genetics"},{id:"feminized",name:"Feminisiert",group:"genetics"}),t.push({id:"soil_moisture",name:"Feuchtigkeit",group:"sensors"},{id:"temperature",name:"Temperatur",group:"sensors"},{id:"conductivity",name:"Leitfähigkeit",group:"sensors"},{id:"illuminance",name:"Beleuchtung",group:"sensors"},{id:"air_humidity",name:"Luftfeuchtigkeit",group:"sensors"},{id:"dli",name:"DLI",group:"sensors"}),t.push({id:"ppfd",name:"PPFD",group:"diagnostics"},{id:"total_ppfd",name:"Total PPFD",group:"diagnostics"},{id:"water_consumption",name:"Wasserverbrauch",group:"diagnostics"},{id:"fertilizer_consumption",name:"Düngerverbrauch",group:"diagnostics"}),t.push({id:"max_air_humidity",name:"Max Luftfeuchte",group:"min_max"},{id:"min_air_humidity",name:"Min Luftfeuchte",group:"min_max"},{id:"max_soil_moisture",name:"Max Bodenfeuchte",group:"min_max"},{id:"min_soil_moisture",name:"Min Bodenfeuchte",group:"min_max"},{id:"max_temperature",name:"Max Temp",group:"min_max"},{id:"min_temperature",name:"Min Temp",group:"min_max"},{id:"max_conductivity",name:"Max Leitfähigkeit",group:"min_max"},{id:"min_conductivity",name:"Min Leitfähigkeit",group:"min_max"},{id:"max_illuminance",name:"Max Beleuchtung",group:"min_max"},{id:"min_illuminance",name:"Min Beleuchtung",group:"min_max"},{id:"max_dli",name:"Max DLI",group:"min_max"},{id:"min_dli",name:"Min DLI",group:"min_max"}),t.push({id:"effects",name:"Effekte",group:"characteristics"},{id:"smell",name:"Geruch",group:"characteristics"},{id:"taste",name:"Geschmack",group:"characteristics"},{id:"phenotype",name:"Phänotyp",group:"characteristics"}),t.push({id:"growth_stretch",name:"Wachstumsdehnung",group:"growth"},{id:"flower_stretch",name:"Blütendehnung",group:"growth"},{id:"flowering_duration",name:"Blütezeit",group:"growth"}),t.push({id:"moisture_status",name:"St. Feuchtigkeit",group:"metrics"},{id:"temperature_status",name:"St. Temperatur",group:"metrics"},{id:"conductivity_status",name:"St. Leitfähigkeit",group:"metrics"},{id:"illuminance_status",name:"St. Beleuchtung",group:"metrics"},{id:"humidity_status",name:"St. Luftfeuchtigkeit",group:"metrics"},{id:"dli_status",name:"St. DLI",group:"metrics"}),t.push({id:"difficulty",name:"Schwierigkeit",group:"details"},{id:"yield",name:"Ertrag",group:"details"},{id:"mold_resistance",name:"Schimmelresistenz",group:"details"},{id:"hunger",name:"Hunger",group:"details"}),t.push({id:"notes",name:"Notizen",group:"notes"},{id:"website",name:"Website",group:"notes"}),t}getDefaultConfig(){return{type:"flower-list-card",show_columns:{name:!0,basic:!0,growing:!0,genetics:!0,characteristics:!1,growth:!1,metrics:!1,sensors:!1,diagnostics:!1,min_max:!1,details:!1,notes:!1}}}setConfig(t){this.config=Object.assign(Object.assign({},this.getDefaultConfig()),t)}getVisibleColumns(){var t;const e=this.getAllAvailableColumns(),i=(null===(t=this.config)||void 0===t?void 0:t.show_columns)||this.getDefaultConfig().show_columns,s=Object.entries(i).filter((([t,e])=>e)).map((([t])=>t));return e.filter((t=>i[t.group])).sort(((t,e)=>s.indexOf(t.group)-s.indexOf(e.group)))}handleCellClick(t,e,i){t.stopPropagation(),("pot_size"===i||"growth_phase"===i||"cycle"===i||"area"===i||i.startsWith("min_")||i.startsWith("max_")||this.EDITABLE_PLANT_ATTRIBUTES.includes(i))&&(this._editingCell={entityId:e.entity_id,column:i},this.requestUpdate())}handlePotSizeUpdate(t,e){return n(this,void 0,void 0,(function*(){var i;if("Enter"===t.key){const s=t.target,n=parseFloat(s.value),o=e.entity_id.split(".")[1];if(!isNaN(n))try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("number","set_value",{entity_id:`number.${o}_pot_size`,value:n}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren der Topfgröße:",t)}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}))}handleGrowthPhaseUpdate(t,e){return n(this,void 0,void 0,(function*(){var i;const s=t.target.value,n=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${n}_growth_phase`,option:s}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren der Wachstumsphase:",t)}}))}getGrowthPhaseOptions(t){var e,i;const s=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_growth_phase`];return(null===(i=null==s?void 0:s.attributes)||void 0===i?void 0:i.options)||[]}handleCycleUpdate(t,e){return n(this,void 0,void 0,(function*(){var i;const s=t.target.value,n=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${n}_cycle`,option:s}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Zyklus:",t)}}))}getCycleOptions(t){var e,i;const s=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_cycle`];return(null===(i=null==s?void 0:s.attributes)||void 0===i?void 0:i.options)||[]}handlePlantAttributeUpdate(t,e,i){return n(this,void 0,void 0,(function*(){var s;if(t instanceof KeyboardEvent&&"Enter"!==t.key)return void("Escape"===t.key&&(this._editingCell=null,this.requestUpdate()));const n=t.target.value;try{const t={entity_id:e.entity_id,[i]:n};yield null===(s=this._hass)||void 0===s?void 0:s.callService("plant","update_plant_attributes",t),this._editingCell=null,this.requestUpdate()}catch(t){console.error(`Fehler beim Aktualisieren von ${i}:`,t)}}))}handleKeyDown(t){"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}formatNumber(t,e=2){const i="string"==typeof t?parseFloat(t):t;return isNaN(i)?"-":i.toFixed(e)}handleHelperUpdate(t,e,i){return n(this,void 0,void 0,(function*(){var s;if("Enter"===t.key){const n=t.target,o=parseFloat(n.value),r=e.entity_id.split(".")[1];if(!isNaN(o))try{yield null===(s=this._hass)||void 0===s?void 0:s.callService("number","set_value",{entity_id:`number.${r}_${i}`,value:o}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Helpers:",t)}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}))}getCellValue(t,e){var i,s,n,r,a,l,d,c,h,u,p,m,_,v,g,f,y,b,$,w,x,A,C,E,k;const S=t.entity_id.split(".")[1];if((null===(i=this._editingCell)||void 0===i?void 0:i.entityId)===t.entity_id&&(null===(s=this._editingCell)||void 0===s?void 0:s.column)===e){if("growth_phase"===e){const e=null===(n=this._hass)||void 0===n?void 0:n.states[`select.${S}_growth_phase`],i=this.getGrowthPhaseOptions(S);return o.html`
                    <select
                        @change=${e=>this.handleGrowthPhaseUpdate(e,t)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        ${i.map((t=>o.html`
                            <option value="${t}" ?selected=${t===(null==e?void 0:e.state)}>
                                ${t}
                            </option>
                        `))}
                    </select>
                `}if("cycle"===e){const e=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${S}_cycle`],i=this.getCycleOptions(S);return o.html`
                    <select
                        @change=${e=>this.handleCycleUpdate(e,t)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        ${i.map((t=>o.html`
                            <option value="${t}" ?selected=${t===(null==e?void 0:e.state)}>
                                ${t}
                            </option>
                        `))}
                    </select>
                `}if(this.EDITABLE_PLANT_ATTRIBUTES.includes(e))return"notes"===e?o.html`
                        <textarea
                            .value="${t.attributes[e]||""}"
                            @keydown=${i=>{"Escape"===i.key?this.handleKeyDown(i):this.handlePlantAttributeUpdate(i,t,e)}}
                            @click=${t=>t.stopPropagation()}
                            style="width: 200px; height: 60px;"
                        ></textarea>
                    `:o.html`
                        <input
                            type="text"
                            .value="${t.attributes[e]||""}"
                            @keydown=${i=>{"Escape"===i.key?this.handleKeyDown(i):this.handlePlantAttributeUpdate(i,t,e)}}
                            @click=${t=>t.stopPropagation()}
                            style="width: ${"website"===e?"200px":"120px"};"
                        >
                    `;if(e.startsWith("min_")||e.startsWith("max_")){const i=null===(a=this._hass)||void 0===a?void 0:a.states[`number.${S}_${e}`],s=(null==i?void 0:i.attributes.unit_of_measurement)||"";return o.html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${(null==i?void 0:i.state)||""}"
                        @keydown=${i=>this.handleHelperUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > ${s}
                `}if("area"===e){const e=this.getAreaForEntity(t.entity_id),i=e?null===(d=null===(l=this._hass)||void 0===l?void 0:l.areas[e])||void 0===d?void 0:d.name:"",s=this.getAreaOptions();return o.html`
                    <select
                        @change=${e=>this.handleAreaUpdate(e,t)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        <option value="">Kein Bereich</option>
                        ${s.map((t=>o.html`
                            <option value="${t}" ?selected=${t===i}>
                                ${t}
                            </option>
                        `))}
                    </select>
                `}}switch(e){case"friendly_name":return o.html`
                    <div class="plant-name">
                        <img src="${t.attributes.entity_picture||""}" alt="${t.attributes.friendly_name}">
                        ${t.attributes.friendly_name}
                    </div>
                `;case"state":return o.html`
                    <ha-icon .icon="mdi:${"problem"===t.state.toLowerCase()?"alert-circle-outline":"check-circle-outline"}">
                    </ha-icon>
                    ${t.state}
                `;case"growth_phase":const i=null===(c=this._hass)||void 0===c?void 0:c.states[`select.${S}_growth_phase`];if((null===(h=this._editingCell)||void 0===h?void 0:h.entityId)===t.entity_id&&"growth_phase"===(null===(u=this._editingCell)||void 0===u?void 0:u.column)){const e=this.getGrowthPhaseOptions(S);return o.html`
                        <select
                            @change=${e=>this.handleGrowthPhaseUpdate(e,t)}
                            @click=${t=>t.stopPropagation()}
                            style="width: 120px;"
                        >
                            ${e.map((t=>o.html`
                                <option value="${t}" ?selected=${t===(null==i?void 0:i.state)}>
                                    ${t}
                                </option>
                            `))}
                        </select>
                    `}return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"growth_phase")}>
                        ${(null==i?void 0:i.state)||"Nicht verfügbar"}
                    </span>
                `;case"pot_size":const s=null===(p=this._hass)||void 0===p?void 0:p.states[`number.${S}_pot_size`];return(null===(m=this._editingCell)||void 0===m?void 0:m.entityId)===t.entity_id&&"pot_size"===(null===(_=this._editingCell)||void 0===_?void 0:_.column)?o.html`
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            .value="${(null==s?void 0:s.state)||""}"
                            @keydown=${e=>this.handlePotSizeUpdate(e,t)}
                            @click=${t=>t.stopPropagation()}
                            style="width: 60px;"
                        >L
                    `:o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"pot_size")}>
                        ${s?`${s.state}L`:"Nicht verfügbar"}
                    </span>
                `;case"website":return o.html`
                    <div style="display: inline-flex; align-items: center; gap: 4px; width: fit-content; white-space: nowrap;">
                        <span @click=${i=>this.handleCellClick(i,t,e)} style="min-width: 0; overflow: hidden; text-overflow: ellipsis;">
                            ${t.attributes.website||"-"}
                        </span>
                        ${t.attributes.website?o.html`
                            <ha-icon-button
                                .label=${"Öffnen"}
                                @click=${e=>{e.stopPropagation(),window.open(t.attributes.website,"_blank")}}
                                style="--mdc-icon-button-size: 24px; margin: -8px; display: flex; align-items: center; justify-content: center; min-width: 24px; padding: 0;"
                            >
                                <ha-icon icon="mdi:open-in-new" style="width: 16px; height: 16px; display: flex;"></ha-icon>
                            </ha-icon-button>
                        `:""}
                    </div>
                `;case"cycle":const n=null===(v=this._hass)||void 0===v?void 0:v.states[`select.${S}_cycle`];if((null===(g=this._editingCell)||void 0===g?void 0:g.entityId)===t.entity_id&&"cycle"===(null===(f=this._editingCell)||void 0===f?void 0:f.column)){const e=this.getCycleOptions(S);return o.html`
                        <select
                            @change=${e=>this.handleCycleUpdate(e,t)}
                            @click=${t=>t.stopPropagation()}
                            style="width: 120px;"
                        >
                            ${e.map((t=>o.html`
                                <option value="${t}" ?selected=${t===(null==n?void 0:n.state)}>
                                    ${t}
                                </option>
                            `))}
                        </select>
                    `}return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"cycle")}>
                        ${(null==n?void 0:n.state)&&"unknown"!==n.state?n.state:"-"}
                    </span>
                `;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":const r=null===(y=this._hass)||void 0===y?void 0:y.states[`sensor.${S}_${e}`];if(!r)return"-";const a=r.attributes.unit_of_measurement||"";return o.html`${r.state} ${a}`;case"ppfd":const l=null===(b=this._hass)||void 0===b?void 0:b.states[`sensor.${S}_ppfd_mol`];if(!l)return"-";const d=l.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(l.state,6)} ${d}`;case"total_ppfd":const P=null===($=this._hass)||void 0===$?void 0:$.states[`sensor.${S}_total_ppfd_mol_integral`];if(!P)return"-";const U=P.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(P.state,6)} ${U}`;case"water_consumption":case"fertilizer_consumption":const T=null===(w=this._hass)||void 0===w?void 0:w.states[`sensor.${S}_${e}`];if(!T)return"-";const O=T.attributes.unit_of_measurement||"";return o.html`${T.state} ${O}`;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":const N=null===(x=this._hass)||void 0===x?void 0:x.states[`number.${S}_${e}`];if(!N)return"-";const z=N.attributes.unit_of_measurement||"";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${N.state} ${z}
                    </span>
                `;case"area":const L=this.getAreaForEntity(t.entity_id),R=L?null===(C=null===(A=this._hass)||void 0===A?void 0:A.areas[L])||void 0===C?void 0:C.name:"-";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${R}
                    </span>
                `;default:return this.EDITABLE_PLANT_ATTRIBUTES.includes(e)?o.html`
                        <span @click=${i=>this.handleCellClick(i,t,e)}>
                            ${(null===(E=t.attributes[e])||void 0===E?void 0:E.toString())||"-"}
                        </span>
                    `:(null===(k=t.attributes[e])||void 0===k?void 0:k.toString())||"-"}}handleRowClick(t,e,i){if(["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(i)){const t=new CustomEvent("hass-more-info",{detail:{entityId:e.entity_id},bubbles:!0,composed:!0});this.dispatchEvent(t)}const s=e.entity_id.split(".")[1];let n="";switch(i){case"ppfd":n=`sensor.${s}_ppfd_mol`;break;case"total_ppfd":n=`sensor.${s}_total_ppfd_mol_integral`;break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"water_consumption":case"fertilizer_consumption":n=`sensor.${s}_${i}`;break;default:return}if(n){const t=new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0});this.dispatchEvent(t)}}handleSearch(t){this._searchQuery=t.target.value.toLowerCase(),this.requestUpdate()}render(){if(!this._hass)return o.html``;const t=this.getSortedPlants(),e=this.getVisibleColumns();return o.html`
            <ha-card>
                <div class="card-header">
                    <div class="name">Pflanzenübersicht</div>
                </div>
                <div class="search-container">
                  <ha-icon-button
                    class="search-icon"
                    .label=${"Suchen"}
                    .path=${"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"}
                  ></ha-icon-button>
                  <input
                    type="text"
                    placeholder="Suchen..."
                    @input=${this.handleSearch}
                    .value=${this._searchQuery}
                  >
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                ${e.map((t=>o.html`
                                    <th @click=${()=>this.handleSort(t.id)} data-column="${t.id}">
                                        ${t.name}
                                        ${this._sortColumn===t.id?o.html`<ha-icon icon="mdi:${"asc"===this._sortDirection?"arrow-up":"arrow-down"}"></ha-icon>`:""}
                                    </th>
                                `))}
                            </tr>
                        </thead>
                        <tbody>
                            ${t.map((t=>o.html`
                                <tr>
                                    ${e.map((e=>o.html`
                                        <td data-column="${e.id}" 
                                            @click=${i=>this.handleRowClick(i,t,e.id)}
                                            style="cursor: ${this.getCursorStyle(e.id)}"
                                        >
                                            ${this.getCellValue(t,e.id)}
                                        </td>
                                    `))}
                                </tr>
                            `))}
                        </tbody>
                    </table>
                </div>
            </ha-card>
        `}getCursorStyle(t){return["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(t)||["soil_moisture","temperature","conductivity","illuminance","air_humidity","dli","ppfd","total_ppfd","water_consumption","fertilizer_consumption"].includes(t)?"pointer":"pot_size"===t||"growth_phase"===t||"cycle"===t||"area"===t||t.startsWith("min_")||t.startsWith("max_")||this.EDITABLE_PLANT_ATTRIBUTES.includes(t)?"text":"default"}getCardSize(){return 1+Math.ceil(this.plantEntities.length/2)}static get styles(){return a.style}getAreaOptions(){return this._hass?Object.values(this._hass.areas||{}).map((t=>t.name)).sort():[]}handleAreaUpdate(t,e){return n(this,void 0,void 0,(function*(){var i,s,n,o,r;const a=t.target.value,l=null===(s=Object.entries((null===(i=this._hass)||void 0===i?void 0:i.areas)||{}).find((([t,e])=>e.name===a)))||void 0===s?void 0:s[0],d=((null===(n=this._hass)||void 0===n?void 0:n.entities)||{})[e.entity_id];if(null==d?void 0:d.device_id)try{l?yield null===(o=this._hass)||void 0===o?void 0:o.callService("homeassistant","add_device_to_area",{area_id:l,device_id:[d.device_id]}):yield null===(r=this._hass)||void 0===r?void 0:r.callService("homeassistant","remove_device_from_area",{device_id:[d.device_id]}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Bereichs:",t)}}))}getAreaForEntity(t){if(!this._hass)return;this._hass.areas;const e=this._hass.devices||{},i=(this._hass.entities||{})[t];if(i){if(i.area_id)return i.area_id;if(i.device_id){const t=e[i.device_id];if(null==t?void 0:t.area_id)return t.area_id}}}};s([(0,r.property)()],d.prototype,"_hass",void 0),s([(0,r.property)()],d.prototype,"config",void 0),s([(0,r.state)()],d.prototype,"_sortColumn",void 0),s([(0,r.state)()],d.prototype,"_sortDirection",void 0),s([(0,r.state)()],d.prototype,"_editingCell",void 0),d=s([(0,r.customElement)("flower-list-card")],d),e.default=d},800:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const s=i(458);e.style=s.css`
.card-margin-top {
  margin-top: 32px;
}
.attributes {
  display: flex;
  white-space: nowrap;
  padding: 8px;
}
.attributes.width-100 {
  padding: 2px;
}
.attribute ha-icon {
  margin-right: 10px;
  margin-left: 5px;
}
.attribute {
  white-space: nowrap;
  display: flex;  
  align-items: center;
  width: 50%;
}
#battery {
  float: right;
  margin-right: 16px;
  margin-top: -15px;
}
.header {
  padding-top: 8px;
  height: 100px;
  position: relative;
}
.header-compact {
  padding-top: 4px;
  height: 55px;
}
.attribute .header, .attribute .header-compact {
  height: auto;
  padding-top: 0px;
}
.header > img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: -16px;
  float: left;
  box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
}
.header-compact > img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 4px;
  margin-top: 0px;
  float: left;
  box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
}
.header > #name {
  font-weight: bold;
  width: 100%;
  margin-top: 16px;
  text-transform: capitalize;
  display: block;
  margin-left: 132px;
}
.header-compact > #name {
  font-weight: bold;
  width: 100%;
  margin-top: 8px;
  text-transform: capitalize;
  display: block;
  white-space: nowrap;
}
#name ha-icon {
    color: rgb(240, 163, 163);
}
.header > #species {
  text-transform: capitalize;
  color: #8c96a5;
  display: block;
  margin-top: 4px;
  margin-left: 132px;
}
.header > #status-container {
  display: flex;
  gap: 16px;
  margin-left: 132px;
  margin-top: 4px;
}
.header > #status-container span {
  color: #8c96a5;
  display: flex;
  align-items: center;
}
.header > #metrics-container {
  position: absolute;
  top: 28px;
  right: 16px;
  text-align: right;
  color: #8c96a5;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.header > #metrics-container ha-icon,
.header > #status-container ha-icon {
  margin-right: 4px;
  --mdc-icon-size: 16px;
}
.header-compact > #species {
  text-transform: capitalize;
  line-height: 85%;
  color: #8c96a5;
  font-size: 0.8em;
  margin-top: 0px;
  margin-right: 4px;
  opacity: 0.4;
  display: block;
}
.meter {
  height: 8px;
  background-color: var(--primary-background-color);
  border-radius: 2px;
  display: inline-grid;
  overflow: hidden;
}
.meter.red {
  flex-grow: 1;
  margin-right: 5px;
  max-width: 5%
}
.meter.green {
  flex-grow: 10;
  margin-right: 5px;
  max-width: 40%
}
.attribute.tooltip.width-100 .meter.green {
  max-width: 90%;
}
.attribute.tooltip.width-100 .header {
  display: none;
}
.meter > span {
  grid-row: 1;
  grid-column: 1;
  height: 100%;
}
.meter > .good {
  background-color: rgba(43,194,83,1);
}
.meter > .bad {
  background-color: rgba(240,163,163);
}
.meter > .unavailable {
  background-color: rgba(158,158,158,1);
}
.divider {
  height: 1px;
  background-color: #727272;
  opacity: 0.25;
  margin-left: 8px;
  margin-right: 8px;
}
.tooltip {
  position: relative;
}
.tooltip .tip {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  padding: 6px 10px;
  top: 3.3em;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-180%);
          transform: translateX(-50%) translateY(-180%);
  background: grey;
  color: white;
  white-space: nowrap;
  z-index: 2;
  border-radius: 2px;
  transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), -webkit-transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
  transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
  transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), -webkit-transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
}
.battery.tooltip .tip {
  top: 2em;
}
.tooltip:hover .tip, .tooltip:active .tip {
  display: block;
  opacity: 1;
  visibility: visible;
  -webkit-transform: translateX(-50%) translateY(-200%);
          transform: translateX(-50%) translateY(-200%);
}
.width-100 {
  width: 100%;    
  margin-bottom: 3px;
  margin-right: 5px;
}
.width-100 .header {
  display: none;
}
@media (max-width: 600px) {
  .header > .unit {
    display: none;
  }
}
.table-container {
  overflow-x: auto;
  margin: 0 16px;
  padding: 16px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  color: var(--primary-text-color);
  table-layout: auto;
}
th {
  padding: 12px 16px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 1px solid var(--divider-color);
  user-select: none;
}
th:hover {
  background-color: var(--secondary-background-color);
}
td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--divider-color);
  white-space: nowrap;
  width: fit-content;
}
td[data-column="website"] {
  width: 1%;
  white-space: nowrap;
}
tr:hover {
  background-color: var(--secondary-background-color);
  cursor: pointer;
}
.plant-name {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}
.plant-name img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
ha-icon {
  --mdc-icon-size: 18px;
  margin-left: 4px;
}
.card-header {
  padding: 16px;
  border-bottom: 1px solid var(--divider-color);
}
.card-header .name {
  font-size: 16px;
  font-weight: bold;
}
td, th {
  padding: 12px 16px;
  border-bottom: 1px solid var(--divider-color);
  white-space: nowrap;
  width: fit-content;
}
td[data-column="friendly_name"],
th[data-column="friendly_name"] {
  max-width: 200px;
  width: fit-content;
}
td[data-column="strain"],
th[data-column="strain"],
td[data-column="breeder"],
th[data-column="breeder"],
td[data-column="notes"],
th[data-column="notes"] {
  max-width: 150px;
  width: fit-content;
}
td {
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-container {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--divider-color);
  background: var(--secondary-background-color);
}

.search-container input {
  flex: 1;
  border: none;
  padding: 16px;
  background: none;
  font-family: var(--paper-font-body1_-_font-family);
  -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
  font-size: var(--paper-font-body1_-_font-size);
  font-weight: var(--paper-font-body1_-_font-weight);
  line-height: var(--paper-font-body1_-_line-height);
  color: var(--primary-text-color);
}

.search-container input:focus {
  outline: none;
}

.search-container input::placeholder {
  color: var(--secondary-text-color);
}

.search-icon {
  color: var(--secondary-text-color);
  margin-left: -8px;
}
`},793:(t,e,i)=>{i.d(e,{S:()=>s});const s=!1},752:(t,e,i)=>{var s;i.d(e,{JW:()=>E,XX:()=>W,c0:()=>k,ge:()=>q,qy:()=>C,s6:()=>S});const n=window,o=n.trustedTypes,r=o?o.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,d="?"+l,c=`<${d}>`,h=document,u=()=>h.createComment(""),p=t=>null===t||"object"!=typeof t&&"function"!=typeof t,m=Array.isArray,_=t=>m(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v="[ \t\n\f\r]",g=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,f=/-->/g,y=/>/g,b=RegExp(`>|${v}(?:([^\\s"'>=/]+)(${v}*=${v}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),$=/'/g,w=/"/g,x=/^(?:script|style|textarea|title)$/i,A=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),C=A(1),E=A(2),k=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),P=new WeakMap,U=h.createTreeWalker(h,129,null,!1);function T(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==r?r.createHTML(e):e}const O=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=g;for(let e=0;e<i;e++){const i=t[e];let d,h,u=-1,p=0;for(;p<i.length&&(r.lastIndex=p,h=r.exec(i),null!==h);)p=r.lastIndex,r===g?"!--"===h[1]?r=f:void 0!==h[1]?r=y:void 0!==h[2]?(x.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=b):void 0!==h[3]&&(r=b):r===b?">"===h[0]?(r=null!=n?n:g,u=-1):void 0===h[1]?u=-2:(u=r.lastIndex-h[2].length,d=h[1],r=void 0===h[3]?b:'"'===h[3]?w:$):r===w||r===$?r=b:r===f||r===y?r=g:(r=b,n=void 0);const m=r===b&&t[e+1].startsWith("/>")?" ":"";o+=r===g?i+c:u>=0?(s.push(d),i.slice(0,u)+a+i.slice(u)+l+m):i+l+(-2===u?(s.push(void 0),e):m)}return[T(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class N{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const c=t.length-1,h=this.parts,[p,m]=O(t,e);if(this.el=N.createElement(p,i),U.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=U.nextNode())&&h.length<c;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(a)||e.startsWith(l)){const i=m[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+a).split(l),e=/([.?@])?(.*)/.exec(i);h.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?M:"?"===e[1]?j:"@"===e[1]?I:D})}else h.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(x.test(s.tagName)){const t=s.textContent.split(l),e=t.length-1;if(e>0){s.textContent=o?o.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],u()),U.nextNode(),h.push({type:2,index:++n});s.append(t[e],u())}}}else if(8===s.nodeType)if(s.data===d)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(l,t+1));)h.push({type:7,index:n}),t+=l.length-1}n++}}static createElement(t,e){const i=h.createElement("template");return i.innerHTML=t,i}}function z(t,e,i=t,s){var n,o,r,a;if(e===k)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const d=p(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=z(t,l._$AS(t,e.values),l,s)),e}class L{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:h).importNode(i,!0);U.currentNode=n;let o=U.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new R(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new B(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=U.nextNode(),r++)}return U.currentNode=h,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class R{constructor(t,e,i,s){var n;this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=z(this,t,e),p(t)?t===S||null==t||""===t?(this._$AH!==S&&this._$AR(),this._$AH=S):t!==this._$AH&&t!==k&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):_(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==S&&p(this._$AH)?this._$AA.nextSibling.data=t:this.$(h.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(T(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new L(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=P.get(t.strings);return void 0===e&&P.set(t.strings,e=new N(t)),e}T(t){m(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new R(this.k(u()),this.k(u()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class D{constructor(t,e,i,s,n){this.type=1,this._$AH=S,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=S}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=z(this,t,e,0),o=!p(t)||t!==this._$AH&&t!==k,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=z(this,s[i+r],e,r),a===k&&(a=this._$AH[r]),o||(o=!p(a)||a!==this._$AH[r]),a===S?t=S:t!==S&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class M extends D{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===S?void 0:t}}const H=o?o.emptyScript:"";class j extends D{constructor(){super(...arguments),this.type=4}j(t){t&&t!==S?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name)}}class I extends D{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=z(this,t,e,0))&&void 0!==i?i:S)===k)return;const s=this._$AH,n=t===S&&s!==S||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==S&&(s===S||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class B{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t)}}const q={O:a,P:l,A:d,C:1,M:O,L,R:_,D:z,I:R,V:D,H:j,N:I,U:M,F:B},F=n.litHtmlPolyfillSupport;null==F||F(N,R),(null!==(s=n.litHtmlVersions)&&void 0!==s?s:n.litHtmlVersions=[]).push("2.8.0");const W=(t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new R(e.insertBefore(u(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>s,eventOptions:()=>d,property:()=>r,query:()=>c,queryAll:()=>h,queryAssignedElements:()=>_,queryAssignedNodes:()=>v,queryAsync:()=>u,state:()=>a});const s=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),n=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},o=(t,e,i)=>{e.constructor.createProperty(i,t)};function r(t){return(e,i)=>void 0!==i?o(t,e,i):n(t,e)}function a(t){return r({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,s)=>{var n;if(void 0===s){const s=null!==(n=i.originalKey)&&void 0!==n?n:i.key,o=null!=e?{kind:"method",placement:"prototype",key:s,descriptor:e(i.key)}:{...i,key:s};return null!=t&&(o.finisher=function(e){t(e,s)}),o}{const n=i.constructor;void 0!==e&&Object.defineProperty(i,s,e(s)),null==t||t(n,s)}};function d(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function c(t,e){return l({descriptor:i=>{const s={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;s.get=function(){var i,s;return void 0===this[e]&&(this[e]=null!==(s=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==s?s:null),this[e]}}return s}})}function h(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function u(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var p;const m=null!=(null===(p=window.HTMLSlotElement)||void 0===p?void 0:p.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function _(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:s=>({get(){var s;const n="slot"+(e?`[name=${e}]`:":not([name])"),o=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(n),r=null!=o?m(o,t):[];return i?r.filter((t=>t.matches(i))):r},enumerable:!0,configurable:!0})})}function v(t,e,i){let s,n=t;return"object"==typeof t?(n=t.slot,s=t):s={flatten:e},i?_({slot:n,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(n?`[name=${n}]`:":not([name])"),o=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==o?void 0:o.assignedNodes(s))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},458:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>a,LitElement:()=>E,ReactiveElement:()=>$,UpdatingElement:()=>C,_$LE:()=>S,_$LH:()=>A.ge,adoptStyles:()=>c,css:()=>d,defaultConverter:()=>g,getCompatibleStyle:()=>h,html:()=>A.qy,isServer:()=>P.S,noChange:()=>A.c0,notEqual:()=>f,nothing:()=>A.s6,render:()=>A.XX,supportsAdoptingStyleSheets:()=>n,svg:()=>A.JW,unsafeCSS:()=>l});const s=window,n=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new a("string"==typeof t?t:t+"",void 0,o),d=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(i,t,o)},c=(t,e)=>{n?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),n=s.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}))},h=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var u;const p=window,m=p.trustedTypes,_=m?m.emptyScript:"",v=p.reactiveElementPolyfillSupport,g={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:f},b="finalized";class $ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty(b))return!1;this[b]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return c(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=y){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:g).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:g;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||f)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}$[b]=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==v||v({ReactiveElement:$}),(null!==(u=p.reactiveElementVersions)&&void 0!==u?u:p.reactiveElementVersions=[]).push("1.6.3");var w,x,A=i(752);const C=$;class E extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,A.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return A.c0}}E.finalized=!0,E._$litElement$=!0,null===(w=globalThis.litElementHydrateSupport)||void 0===w||w.call(globalThis,{LitElement:E});const k=globalThis.litElementPolyfillSupport;null==k||k({LitElement:E});const S={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==(x=globalThis.litElementVersions)&&void 0!==x?x:globalThis.litElementVersions=[]).push("3.3.3");var P=i(793)},330:t=>{t.exports=JSON.parse('{"name":"flower-card","version":"3.0.0","description":"A Lovelace flower card for Home Assistant","main":"flower-card.js","repository":{"type":"git","url":"git+ssh://git@github.com/Olen/lovelace-flower-card.git"},"author":"Ola Bjorling Erdal <ola@bjorling.se>","license":"MIT","scripts":{"build":"webpack -c webpack.config.js","lint":"eslint src/**/*.ts","watch":"webpack -c webpack.config.js --watch --mode=development"},"dependencies":{"@marcokreeft/ha-editor-formbuilder":"2024.9.1","custom-card-helpers":"^1.9.0","home-assistant-js-websocket":"^9.4.0","lit":"^2.8.0","lit-element":"^2.5.1"},"devDependencies":{"@babel/core":"^7.26.0","@babel/preset-env":"^7.26.0","@babel/preset-typescript":"^7.26.0","@types/node":"^20.11.30","@typescript-eslint/eslint-plugin":"^8.19.1","babel-loader":"^9.1.3","compression-webpack-plugin":"^11.1.0","eslint":"^8.57.0","ts-loader":"^9.5.2","typescript":"^5.7.3","webpack":"^5.97.1","webpack-cli":"^5.1.4"},"keywords":[],"bugs":{"url":"https://github.com/Olen/lovelace-flower-card/issues"},"homepage":"https://github.com/Olen/lovelace-flower-card#readme"}')}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var o=e[s]={exports:{}};return t[s].call(o.exports,o,o.exports,i),o.exports}i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(45)})();