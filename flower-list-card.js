/*! For license information please see flower-list-card.js.LICENSE.txt */
(()=>{"use strict";var t={45:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},n=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const o=i(437),r=i(924),a=i(800),l=i(330);console.info(`%c FLOWER-LIST-CARD %c ${l.version}`,"color: cyan; background: black; font-weight: bold;","color: darkblue; background: white; font-weight: bold;"),window.customCards=window.customCards||[],window.customCards.push({type:"flower-list-card",name:"Flower List Card",preview:!0,description:"Eine tabellarische Übersicht aller Pflanzen"});let d=class extends o.LitElement{constructor(){super(...arguments),this._sortColumn="friendly_name",this._sortDirection="asc",this._editingCell=null,this._plantInfo=new Map,this._searchQuery="",this._multiSelectMode=!1,this._selectedPlants=new Set,this._filterMode=!1,this._activeFilters={},this.plantEntities=[],this.EDITABLE_PLANT_ATTRIBUTES=["strain","breeder","flowering_duration","pid","sorte","feminized","effects","smell","taste","phenotype","hunger","growth_stretch","flower_stretch","mold_resistance","difficulty","yield","notes","website"]}static getStubConfig(){return{type:"custom:flower-list-card",title:"Pflanzenübersicht",search:{enabled:!0,placeholder:"Suche..."},multiselect:{enabled:!0,showbydefault:!1},filter:{enabled:!0,showbydefault:!1},show_columns:{name:!0,basic:!0,growing:!0,genetics:!0,characteristics:!0,growth:!0,metrics:!1,soil_moisture:!0,temperature:!0,conductivity:!0,illuminance:!0,air_humidity:!0,dli:!0,ppfd:!0,total_ppfd:!0,water_consumption:!0,fertilizer_consumption:!0,min_max:!1,details:!0,notes:!0}}}set hass(t){this._hass=t,this.updatePlantEntities()}updatePlantEntities(){return n(this,void 0,void 0,(function*(){if(this._hass){this.plantEntities=Object.values(this._hass.states).filter((t=>"object"==typeof t&&null!==t&&"entity_id"in t&&"string"==typeof t.entity_id&&t.entity_id.startsWith("plant.")));for(const t of this.plantEntities)if(!this._plantInfo.has(t.entity_id)){const e=yield this.get_plant_info(t.entity_id);this._plantInfo.set(t.entity_id,e)}this.requestUpdate()}}))}handleSort(t){this._sortColumn===t?this._sortDirection="asc"===this._sortDirection?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc"),this.requestUpdate()}getSortedPlants(){return[...this.plantEntities].sort(((t,e)=>{var i,s,n,o,r,a,l,d,c,h,u,p,m,v,_,g,f,y,b,$,x,w,S,k;let A,E;switch(this._sortColumn){case"friendly_name":A=t.attributes.friendly_name,E=e.attributes.friendly_name;break;case"state":A=t.state,E=e.state;break;case"area":const C=this.getAreaForEntity(t.entity_id),P=this.getAreaForEntity(e.entity_id);A=C&&(null===(s=null===(i=this._hass)||void 0===i?void 0:i.areas[C])||void 0===s?void 0:s.name)||"",E=P&&(null===(o=null===(n=this._hass)||void 0===n?void 0:n.areas[P])||void 0===o?void 0:o.name)||"";break;case"growth_phase":const z=t.entity_id.split(".")[1],U=e.entity_id.split(".")[1];A=(null===(a=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${z}_growth_phase`])||void 0===a?void 0:a.state)||"",E=(null===(d=null===(l=this._hass)||void 0===l?void 0:l.states[`select.${U}_growth_phase`])||void 0===d?void 0:d.state)||"";break;case"cycle":const M=t.entity_id.split(".")[1],T=e.entity_id.split(".")[1];A=(null===(h=null===(c=this._hass)||void 0===c?void 0:c.states[`select.${M}_cycle`])||void 0===h?void 0:h.state)||"",E=(null===(p=null===(u=this._hass)||void 0===u?void 0:u.states[`select.${T}_cycle`])||void 0===p?void 0:p.state)||"";break;case"pot_size":const N=t.entity_id.split(".")[1],O=e.entity_id.split(".")[1];A=Number((null===(v=null===(m=this._hass)||void 0===m?void 0:m.states[`number.${N}_pot_size`])||void 0===v?void 0:v.state)||0),E=Number((null===(g=null===(_=this._hass)||void 0===_?void 0:_.states[`number.${O}_pot_size`])||void 0===g?void 0:g.state)||0);break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"ppfd":case"total_ppfd":case"water_consumption":case"fertilizer_consumption":const L=t.entity_id.split(".")[1],R=e.entity_id.split(".")[1],F="ppfd"===this._sortColumn?"ppfd_mol":"total_ppfd"===this._sortColumn?"total_ppfd_mol_integral":this._sortColumn;A=Number((null===(y=null===(f=this._hass)||void 0===f?void 0:f.states[`sensor.${L}_${F}`])||void 0===y?void 0:y.state)||0),E=Number((null===($=null===(b=this._hass)||void 0===b?void 0:b.states[`sensor.${R}_${F}`])||void 0===$?void 0:$.state)||0);break;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":const D=t.entity_id.split(".")[1],j=e.entity_id.split(".")[1];A=Number((null===(w=null===(x=this._hass)||void 0===x?void 0:x.states[`number.${D}_${this._sortColumn}`])||void 0===w?void 0:w.state)||0),E=Number((null===(k=null===(S=this._hass)||void 0===S?void 0:S.states[`number.${j}_${this._sortColumn}`])||void 0===k?void 0:k.state)||0);break;default:A=t.attributes[this._sortColumn]||"",E=e.attributes[this._sortColumn]||""}return"number"==typeof A&&"number"==typeof E?"asc"===this._sortDirection?A-E:E-A:(A=String(A).toLowerCase(),E=String(E).toLowerCase(),"asc"===this._sortDirection?A.localeCompare(E):E.localeCompare(A))}))}getAllAvailableColumns(){const t=[];return t.push({id:"friendly_name",name:"Name",group:"name"}),t.push({id:"state",name:"Status",group:"basic"}),t.push({id:"area",name:"Bereich",group:"growing"},{id:"growth_phase",name:"Phase",group:"growing"},{id:"cycle",name:"Durchgang",group:"growing"},{id:"pot_size",name:"Topfgröße",group:"growing"}),t.push({id:"strain",name:"Sorte",group:"genetics"},{id:"breeder",name:"Züchter",group:"genetics"},{id:"feminized",name:"Feminisiert",group:"genetics"}),t.push({id:"soil_moisture",name:"Feuchtigkeit",group:"sensors"},{id:"temperature",name:"Temperatur",group:"sensors"},{id:"conductivity",name:"Leitfähigkeit",group:"sensors"},{id:"illuminance",name:"Beleuchtung",group:"sensors"},{id:"air_humidity",name:"Luftfeuchtigkeit",group:"sensors"},{id:"dli",name:"DLI",group:"sensors"}),t.push({id:"ppfd",name:"PPFD",group:"diagnostics"},{id:"total_ppfd",name:"Total PPFD",group:"diagnostics"},{id:"water_consumption",name:"Wasserverbrauch",group:"diagnostics"},{id:"fertilizer_consumption",name:"Düngerverbrauch",group:"diagnostics"}),t.push({id:"max_air_humidity",name:"Max Luftfeuchte",group:"min_max"},{id:"min_air_humidity",name:"Min Luftfeuchte",group:"min_max"},{id:"max_soil_moisture",name:"Max Bodenfeuchte",group:"min_max"},{id:"min_soil_moisture",name:"Min Bodenfeuchte",group:"min_max"},{id:"max_temperature",name:"Max Temp",group:"min_max"},{id:"min_temperature",name:"Min Temp",group:"min_max"},{id:"max_conductivity",name:"Max Leitfähigkeit",group:"min_max"},{id:"min_conductivity",name:"Min Leitfähigkeit",group:"min_max"},{id:"max_illuminance",name:"Max Beleuchtung",group:"min_max"},{id:"min_illuminance",name:"Min Beleuchtung",group:"min_max"},{id:"max_dli",name:"Max DLI",group:"min_max"},{id:"min_dli",name:"Min DLI",group:"min_max"}),t.push({id:"effects",name:"Effekte",group:"characteristics"},{id:"smell",name:"Geruch",group:"characteristics"},{id:"taste",name:"Geschmack",group:"characteristics"},{id:"phenotype",name:"Phänotyp",group:"characteristics"}),t.push({id:"growth_stretch",name:"Wachstumsdehnung",group:"growth"},{id:"flower_stretch",name:"Blütendehnung",group:"growth"},{id:"flowering_duration",name:"Blütezeit",group:"growth"}),t.push({id:"moisture_status",name:"St. Feuchtigkeit",group:"metrics"},{id:"temperature_status",name:"St. Temperatur",group:"metrics"},{id:"conductivity_status",name:"St. Leitfähigkeit",group:"metrics"},{id:"illuminance_status",name:"St. Beleuchtung",group:"metrics"},{id:"humidity_status",name:"St. Luftfeuchtigkeit",group:"metrics"},{id:"dli_status",name:"St. DLI",group:"metrics"}),t.push({id:"difficulty",name:"Schwierigkeit",group:"details"},{id:"yield",name:"Ertrag",group:"details"},{id:"mold_resistance",name:"Schimmelresistenz",group:"details"},{id:"hunger",name:"Hunger",group:"details"}),t.push({id:"notes",name:"Notizen",group:"notes"},{id:"website",name:"Website",group:"notes"}),t}getDefaultConfig(){return{type:"flower-list-card",title:"Pflanzenübersicht",search:{enabled:!0,placeholder:"Suche..."},multiselect:{enabled:!0,showbydefault:!1},filter:{enabled:!0,showbydefault:!1},show_columns:{name:!0,basic:!0,growing:!0,genetics:!0,characteristics:!0,growth:!0,metrics:!1,soil_moisture:!0,temperature:!0,conductivity:!0,illuminance:!0,air_humidity:!0,dli:!0,ppfd:!0,total_ppfd:!0,water_consumption:!0,fertilizer_consumption:!0,min_max:!1,details:!0,notes:!0}}}setConfig(t){this.config=Object.assign(Object.assign({},this.getDefaultConfig()),t)}getVisibleColumns(){var t;const e=this.getAllAvailableColumns(),i=(null===(t=this.config)||void 0===t?void 0:t.show_columns)||this.getDefaultConfig().show_columns;return e.filter((t=>t.id in i?i[t.id]:i[t.group]))}handleCellClick(t,e,i){t.stopPropagation(),this._multiSelectMode&&this._selectedPlants.size>0&&(this._selectedPlants.has(e.entity_id)||this._selectedPlants.add(e.entity_id)),("pot_size"===i||"growth_phase"===i||"cycle"===i||"area"===i||i.startsWith("min_")||i.startsWith("max_")||this.EDITABLE_PLANT_ATTRIBUTES.includes(i))&&(this._editingCell={entityId:e.entity_id,column:i},this.requestUpdate())}handlePotSizeUpdate(t,e){var i;if("Enter"===t.key){const s=t.target,n=parseFloat(s.value);if(!isNaN(n))if(this._multiSelectMode&&this._selectedPlants.size>0)this.applyBulkUpdate(n,"pot_size");else{const t=e.entity_id.split(".")[1];null===(i=this._hass)||void 0===i||i.callService("number","set_value",{entity_id:`number.${t}_pot_size`,value:n}),this._editingCell=null,this.requestUpdate()}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}handleGrowthPhaseUpdate(t,e){return n(this,void 0,void 0,(function*(){var i;const s=t.target.value;if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(s,"growth_phase");else{const t=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${t}_growth_phase`,option:s}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren der Wachstumsphase:",t)}}}))}getGrowthPhaseOptions(t){var e,i;const s=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_growth_phase`];return(null===(i=null==s?void 0:s.attributes)||void 0===i?void 0:i.options)||[]}handleCycleUpdate(t,e){return n(this,void 0,void 0,(function*(){var i;const s=t.target.value;if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(s,"cycle");else{const t=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${t}_cycle`,option:s}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Zyklus:",t)}}}))}getCycleOptions(t){var e,i;const s=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_cycle`];return(null===(i=null==s?void 0:s.attributes)||void 0===i?void 0:i.options)||[]}handlePlantAttributeUpdate(t,e,i){return n(this,void 0,void 0,(function*(){var s;if(t instanceof KeyboardEvent&&"Enter"!==t.key)return void("Escape"===t.key&&(this._editingCell=null,this.requestUpdate()));const n=t.target.value;if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(n,i);else try{const t={entity_id:e.entity_id,[i]:n};yield null===(s=this._hass)||void 0===s?void 0:s.callService("plant","update_plant_attributes",t),this._editingCell=null,this.requestUpdate()}catch(t){console.error(`Fehler beim Aktualisieren von ${i}:`,t)}}))}handleKeyDown(t){"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}formatNumber(t,e=2){const i="string"==typeof t?parseFloat(t):t;return isNaN(i)?"-":i.toFixed(e)}handleHelperUpdate(t,e,i){return n(this,void 0,void 0,(function*(){var s;if("Enter"===t.key){const n=t.target,o=parseFloat(n.value);if(!isNaN(o))if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(o,i);else{const t=e.entity_id.split(".")[1];try{yield null===(s=this._hass)||void 0===s?void 0:s.callService("number","set_value",{entity_id:`number.${t}_${i}`,value:o}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Helpers:",t)}}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}))}get_plant_info(t){return n(this,void 0,void 0,(function*(){var e;try{return yield null===(e=this._hass)||void 0===e?void 0:e.callWS({type:"plant/get_info",entity_id:t})}catch(t){return{result:{}}}}))}getCellValue(t,e){var i,s,n,r,a,l,d,c,h,u,p,m,v,_,g,f,y,b,$,x,w,S,k;const A=t.entity_id.split(".")[1];if((null===(i=this._editingCell)||void 0===i?void 0:i.entityId)===t.entity_id&&(null===(s=this._editingCell)||void 0===s?void 0:s.column)===e){if("pot_size"===e){const e=null===(n=this._hass)||void 0===n?void 0:n.states[`number.${A}_pot_size`];return o.html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${(null==e?void 0:e.state)||""}"
                        @keydown=${e=>this.handlePotSizeUpdate(e,t)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > L
                `}if("growth_phase"===e){const e=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${A}_growth_phase`],i=this.getGrowthPhaseOptions(A);return o.html`
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
                `}if("cycle"===e){const e=null===(a=this._hass)||void 0===a?void 0:a.states[`select.${A}_cycle`],i=this.getCycleOptions(A);return o.html`
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
                `;if(e.startsWith("min_")||e.startsWith("max_")){const i=null===(l=this._hass)||void 0===l?void 0:l.states[`number.${A}_${e}`],s=(null==i?void 0:i.attributes.unit_of_measurement)||"";return o.html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${(null==i?void 0:i.state)||""}"
                        @keydown=${i=>this.handleHelperUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > ${s}
                `}if("area"===e){const e=this.getAreaForEntity(t.entity_id),i=e?null===(c=null===(d=this._hass)||void 0===d?void 0:d.areas[e])||void 0===c?void 0:c.name:"",s=this.getAreaOptions();return o.html`
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
                `;case"growth_phase":const i=null===(h=this._hass)||void 0===h?void 0:h.states[`select.${A}_growth_phase`];return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"growth_phase")}>
                        ${(null==i?void 0:i.state)||"Nicht verfügbar"}
                    </span>
                `;case"pot_size":const s=null===(u=this._hass)||void 0===u?void 0:u.states[`number.${A}_pot_size`];return o.html`
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
                `;case"cycle":const n=null===(p=this._hass)||void 0===p?void 0:p.states[`select.${A}_cycle`];return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"cycle")}>
                        ${(null==n?void 0:n.state)&&"unknown"!==n.state?n.state:"-"}
                    </span>
                `;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":const r=null===(m=this._hass)||void 0===m?void 0:m.states[`sensor.${A}_${e}`];if(!r)return"-";let a=null===(v=this._hass)||void 0===v?void 0:v.states[`number.${A}_min_${e}`],l=null===(_=this._hass)||void 0===_?void 0:_.states[`number.${A}_max_${e}`],d=(null==a?void 0:a.state)?Number(a.state):0,c=(null==l?void 0:l.state)?Number(l.state):100;if(!a||!l||"unavailable"===a.state||"unavailable"===l.state){const i=this._plantInfo.get(t.entity_id);(null===(g=null==i?void 0:i.result)||void 0===g?void 0:g[e])&&(d=Number(i.result[e].min),c=Number(i.result[e].max))}const E=Number(r.state),C=r.attributes.unit_of_measurement||"",P=100*Math.max(0,Math.min(1,(E-d)/(c-d))),z=!isNaN(E);return o.html`
                    <div class="sensor-cell" @click=${i=>this.handleRowClick(i,t,e)}>
                        <div class="meter-container">
                            <div class="meter red">
                                <span class="${z?E<d||E>c?"bad":"good":"unavailable"}" 
                                      style="width: 100%;"></span>
                            </div>
                            <div class="meter green">
                                <span class="${z?E>c?"bad":"good":"unavailable"}" 
                                      style="width:${z?P:"0"}%;"></span>
                            </div>
                            <div class="meter red">
                                <span class="bad" style="width:${z?E>c?100:0:"0"}%;"></span>
                            </div>
                        </div>
                        <div class="sensor-value">
                            ${E} ${C}
                        </div>
                    </div>
                `;case"ppfd":const U=null===(f=this._hass)||void 0===f?void 0:f.states[`sensor.${A}_ppfd_mol`];if(!U)return"-";const M=U.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(U.state,6)} ${M}`;case"total_ppfd":const T=null===(y=this._hass)||void 0===y?void 0:y.states[`sensor.${A}_total_ppfd_mol_integral`];if(!T)return"-";const N=T.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(T.state,2)} ${N}`;case"water_consumption":case"fertilizer_consumption":const O=null===(b=this._hass)||void 0===b?void 0:b.states[`sensor.${A}_${e}`];if(!O)return"-";const L=O.attributes.unit_of_measurement||"";return o.html`${O.state} ${L}`;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":const R=null===($=this._hass)||void 0===$?void 0:$.states[`number.${A}_${e}`];if(!R)return"-";const F=R.attributes.unit_of_measurement||"";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${R.state} ${F}
                    </span>
                `;case"area":const D=this.getAreaForEntity(t.entity_id),j=D?null===(w=null===(x=this._hass)||void 0===x?void 0:x.areas[D])||void 0===w?void 0:w.name:"-";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${j}
                    </span>
                `;default:return this.EDITABLE_PLANT_ATTRIBUTES.includes(e)?o.html`
                        <span @click=${i=>this.handleCellClick(i,t,e)}>
                            ${(null===(S=t.attributes[e])||void 0===S?void 0:S.toString())||"-"}
                        </span>
                    `:(null===(k=t.attributes[e])||void 0===k?void 0:k.toString())||"-"}}handleRowClick(t,e,i){if(["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(i)){const t=new CustomEvent("hass-more-info",{detail:{entityId:e.entity_id},bubbles:!0,composed:!0});this.dispatchEvent(t)}const s=e.entity_id.split(".")[1];let n="";switch(i){case"ppfd":n=`sensor.${s}_ppfd_mol`;break;case"total_ppfd":n=`sensor.${s}_total_ppfd_mol_integral`;break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"water_consumption":case"fertilizer_consumption":n=`sensor.${s}_${i}`;break;default:return}if(n){const t=new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0});this.dispatchEvent(t)}}handleSearch(t){const e=t.target;this._searchQuery=e.value.toLowerCase(),this.requestUpdate()}getFilteredPlants(){let t=this.getSortedPlants();return Object.keys(this._activeFilters).length>0&&(t=t.filter((t=>Object.entries(this._activeFilters).every((([e,i])=>{var s,n,o,r,a,l;const d=t.entity_id.split(".")[1];if(this.isSensorColumn(e)){const s=this.getSensorValue(t,e),n=i;return s>=n.min&&s<=n.max}let c;switch(e){case"area":const i=this.getAreaForEntity(t.entity_id);c=i&&(null===(n=null===(s=this._hass)||void 0===s?void 0:s.areas[i])||void 0===n?void 0:n.name)||"-";break;case"state":c=t.state;break;case"growth_phase":const h=null===(o=this._hass)||void 0===o?void 0:o.states[`select.${d}_growth_phase`];c=(null==h?void 0:h.state)||"-";break;case"cycle":const u=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${d}_cycle`];c=(null==u?void 0:u.state)&&"unknown"!==u.state?u.state:"-";break;case"pot_size":const p=null===(a=this._hass)||void 0===a?void 0:a.states[`number.${d}_pot_size`];c=p?`${p.state}L`:"-";break;default:c=(null===(l=t.attributes[e])||void 0===l?void 0:l.toString())||"-"}return i.has(c)}))))),this._searchQuery&&(t=t.filter((t=>this.getVisibleColumns().some((e=>this.getSearchableValue(t,e.id).toLowerCase().includes(this._searchQuery)))))),t}getSearchableValue(t,e){var i,s,n,o,r,a,l,d,c;const h=t.entity_id.split(".")[1];switch(e){case"friendly_name":return t.attributes.friendly_name||"";case"state":return t.state||"";case"area":const u=this.getAreaForEntity(t.entity_id);return u&&(null===(s=null===(i=this._hass)||void 0===i?void 0:i.areas[u])||void 0===s?void 0:s.name)||"";case"growth_phase":return(null===(o=null===(n=this._hass)||void 0===n?void 0:n.states[`select.${h}_growth_phase`])||void 0===o?void 0:o.state)||"";case"cycle":return(null===(a=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${h}_cycle`])||void 0===a?void 0:a.state)||"";case"pot_size":return(null===(d=null===(l=this._hass)||void 0===l?void 0:l.states[`number.${h}_pot_size`])||void 0===d?void 0:d.state)||"";default:return this.EDITABLE_PLANT_ATTRIBUTES.includes(e)&&(null===(c=t.attributes[e])||void 0===c?void 0:c.toString())||""}}render(){var t,e,i,s,n,r,a,l,d,c,h,u,p,m,v,_,g,f,y,b,$,x;if(!this._hass)return o.html``;const w=this.getFilteredPlants(),S=this.getVisibleColumns();return o.html`
            <ha-card>
                ${""!==(null===(t=this.config)||void 0===t?void 0:t.title)?o.html`
                    <div class="card-header">
                        <div class="name">${(null===(e=this.config)||void 0===e?void 0:e.title)||"Pflanzenübersicht"}</div>
                    </div>
                `:""}
                ${(null===(s=null===(i=this.config)||void 0===i?void 0:i.multiselect)||void 0===s?void 0:s.enabled)||(null===(r=null===(n=this.config)||void 0===n?void 0:n.search)||void 0===r?void 0:r.enabled)||(null===(l=null===(a=this.config)||void 0===a?void 0:a.filter)||void 0===l?void 0:l.enabled)?o.html`
                    <div class="toolbar">
                        ${(null===(c=null===(d=this.config)||void 0===d?void 0:d.multiselect)||void 0===c?void 0:c.enabled)||(null===(u=null===(h=this.config)||void 0===h?void 0:h.search)||void 0===u?void 0:u.enabled)||(null===(m=null===(p=this.config)||void 0===p?void 0:p.filter)||void 0===m?void 0:m.enabled)?o.html`
                            ${(null===(_=null===(v=this.config)||void 0===v?void 0:v.filter)||void 0===_?void 0:_.enabled)?o.html`
                                <ha-icon-button
                                    .label=${this._filterMode?"Filter schließen":"Filter"}
                                    @click=${this.toggleFilterMode}
                                >
                                    <ha-icon icon="mdi:${this._filterMode?"filter-off":"filter"}"></ha-icon>
                                </ha-icon-button>
                            `:""}
                            ${(null===(f=null===(g=this.config)||void 0===g?void 0:g.multiselect)||void 0===f?void 0:f.enabled)?o.html`
                                <ha-icon-button
                                    .label=${this._multiSelectMode?"Mehrfachauswahl beenden":"Mehrfachauswahl"}
                                    @click=${this.toggleMultiSelect}
                                >
                                    <ha-icon icon="mdi:${this._multiSelectMode?"close":"checkbox-multiple-outline"}"></ha-icon>
                                </ha-icon-button>
                            `:""}
                            ${(null===(b=null===(y=this.config)||void 0===y?void 0:y.search)||void 0===b?void 0:b.enabled)?o.html`
                                <div class="search-container">
                                    <ha-icon icon="mdi:magnify"></ha-icon>
                                    <input
                                        type="text"
                                        .value=${this._searchQuery}
                                        placeholder="${(null===(x=null===($=this.config)||void 0===$?void 0:$.search)||void 0===x?void 0:x.placeholder)||"Suche..."}"
                                        @input=${this.handleSearch}
                                    >
                                    ${this._searchQuery?o.html`
                                        <ha-icon-button
                                            .label=${"Suche zurücksetzen"}
                                            @click=${()=>{this._searchQuery="",this.requestUpdate()}}
                                        >
                                            <ha-icon icon="mdi:close"></ha-icon>
                                        </ha-icon-button>
                                    `:""}
                                </div>
                            `:""}
                        `:""}
                    </div>
                `:""}
                ${this._filterMode?o.html`
                    <div class="filter-sidebar">
                        ${this.getVisibleColumns().map((t=>o.html`
                            ${this.renderFilterContent(t)}
                        `))}
                    </div>
                `:""}
                <div class="table-container${this._filterMode?" filtered":""}">
                    <table>
                        <thead>
                            <tr>
                                ${this._multiSelectMode?o.html`
                                    <th style="width: 48px"></th>
                                `:""}
                                ${S.map((t=>o.html`
                                    <th @click=${()=>this.handleSort(t.id)} data-column="${t.id}">
                                        ${t.name}
                                        ${this._sortColumn===t.id?o.html`<ha-icon icon="mdi:${"asc"===this._sortDirection?"arrow-up":"arrow-down"}"></ha-icon>`:""}
                                    </th>
                                `))}
                            </tr>
                        </thead>
                        <tbody>
                            ${w.map((t=>o.html`
                                <tr>
                                    ${this._multiSelectMode?o.html`
                                        <td>
                                            <input 
                                                type="checkbox"
                                                .checked=${this._selectedPlants.has(t.entity_id)}
                                                @change=${e=>this.togglePlantSelection(t.entity_id,e)}
                                                style="width: 20px; height: 20px; margin: 0 8px;"
                                            >
                                        </td>
                                    `:""}
                                    ${S.map((e=>o.html`
                                        <td data-column="${e.id}" 
                                            @click=${i=>{this._multiSelectMode&&this._selectedPlants.size>0?this.handleCellClick(i,t,e.id):this._multiSelectMode||this.handleRowClick(i,t,e.id)}}
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
        `}getCursorStyle(t){return["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(t)||["soil_moisture","temperature","conductivity","illuminance","air_humidity","dli","ppfd","total_ppfd","water_consumption","fertilizer_consumption"].includes(t)?"pointer":"pot_size"===t||"growth_phase"===t||"cycle"===t||"area"===t||t.startsWith("min_")||t.startsWith("max_")||this.EDITABLE_PLANT_ATTRIBUTES.includes(t)?"text":"default"}getCardSize(){return 1+Math.ceil(this.plantEntities.length/2)}getAreaOptions(){return this._hass?Object.values(this._hass.areas||{}).map((t=>t.name)).sort():[]}handleAreaUpdate(t,e){return n(this,void 0,void 0,(function*(){var i,s,n,o,r,a,l,d;const c=t.target.value,h=null===(s=Object.entries((null===(i=this._hass)||void 0===i?void 0:i.areas)||{}).find((([t,e])=>e.name===c)))||void 0===s?void 0:s[0];if(this._multiSelectMode&&this._selectedPlants.size>0)for(const t of this._selectedPlants){const e=((null===(n=this._hass)||void 0===n?void 0:n.entities)||{})[t];(null==e?void 0:e.device_id)&&(h?yield null===(o=this._hass)||void 0===o?void 0:o.callService("homeassistant","add_device_to_area",{area_id:h,device_id:[e.device_id]}):yield null===(r=this._hass)||void 0===r?void 0:r.callService("homeassistant","remove_device_from_area",{device_id:[e.device_id]}))}else{const t=((null===(a=this._hass)||void 0===a?void 0:a.entities)||{})[e.entity_id];(null==t?void 0:t.device_id)&&(h?yield null===(l=this._hass)||void 0===l?void 0:l.callService("homeassistant","add_device_to_area",{area_id:h,device_id:[t.device_id]}):yield null===(d=this._hass)||void 0===d?void 0:d.callService("homeassistant","remove_device_from_area",{device_id:[t.device_id]}))}this._editingCell=null,this.requestUpdate()}))}getAreaForEntity(t){if(!this._hass)return;this._hass.areas;const e=this._hass.devices||{},i=(this._hass.entities||{})[t];if(i){if(i.area_id)return i.area_id;if(i.device_id){const t=e[i.device_id];if(null==t?void 0:t.area_id)return t.area_id}}}toggleMultiSelect(){this._multiSelectMode=!this._multiSelectMode,this._multiSelectMode||this._selectedPlants.clear(),this.requestUpdate()}togglePlantSelection(t,e){e.stopPropagation(),this._selectedPlants.has(t)?this._selectedPlants.delete(t):this._selectedPlants.add(t),this.requestUpdate()}applyBulkUpdate(t,e){return n(this,void 0,void 0,(function*(){var i,s,n,o,r;for(const a of this._selectedPlants)if(this.plantEntities.find((t=>t.entity_id===a))){const l=a.split(".")[1];"growth_phase"===e?yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${l}_growth_phase`,option:t}):"cycle"===e?yield null===(s=this._hass)||void 0===s?void 0:s.callService("select","select_option",{entity_id:`select.${l}_cycle`,option:t}):"pot_size"===e?yield null===(n=this._hass)||void 0===n?void 0:n.callService("number","set_value",{entity_id:`number.${l}_pot_size`,value:parseFloat(t)}):e.startsWith("min_")||e.startsWith("max_")?yield null===(o=this._hass)||void 0===o?void 0:o.callService("number","set_value",{entity_id:`number.${l}_${e}`,value:parseFloat(t)}):this.EDITABLE_PLANT_ATTRIBUTES.includes(e)&&(yield null===(r=this._hass)||void 0===r?void 0:r.callService("plant","update_plant_attributes",{entity_id:a,[e]:t}))}this._editingCell=null,this.requestUpdate()}))}connectedCallback(){var t,e,i,s;super.connectedCallback(),(null===(e=null===(t=this.config)||void 0===t?void 0:t.multiselect)||void 0===e?void 0:e.showbydefault)&&(this._multiSelectMode=!0),(null===(s=null===(i=this.config)||void 0===i?void 0:i.filter)||void 0===s?void 0:s.showbydefault)&&(this._filterMode=!0)}toggleFilterMode(){var t,e;(null===(e=null===(t=this.config)||void 0===t?void 0:t.filter)||void 0===e?void 0:e.enabled)&&(this._filterMode=!this._filterMode,this.requestUpdate())}toggleFilter(t,e){if(this.isSensorColumn(t))this._activeFilters[t]=e,this._activeFilters[t]||delete this._activeFilters[t];else{this._activeFilters[t]||(this._activeFilters[t]=new Set);const i=this._activeFilters[t];i.has(e)?(i.delete(e),0===i.size&&delete this._activeFilters[t]):i.add(e)}this.requestUpdate()}getUniqueValues(t){return[...new Set(this.plantEntities.map((e=>{var i,s,n,o,r,a;const l=e.entity_id.split(".")[1];switch(t){case"area":const d=this.getAreaForEntity(e.entity_id);return d&&(null===(s=null===(i=this._hass)||void 0===i?void 0:i.areas[d])||void 0===s?void 0:s.name)||"-";case"state":return e.state;case"growth_phase":const c=null===(n=this._hass)||void 0===n?void 0:n.states[`select.${l}_growth_phase`];return(null==c?void 0:c.state)||"-";case"cycle":const h=null===(o=this._hass)||void 0===o?void 0:o.states[`select.${l}_cycle`];return(null==h?void 0:h.state)&&"unknown"!==h.state?h.state:"-";case"pot_size":const u=null===(r=this._hass)||void 0===r?void 0:r.states[`number.${l}_pot_size`];return u?`${u.state}L`:"-";default:return(null===(a=e.attributes[t])||void 0===a?void 0:a.toString())||"-"}})))].sort()}isSensorColumn(t){return["soil_moisture","temperature","conductivity","illuminance","air_humidity","dli","ppfd","total_ppfd","water_consumption","fertilizer_consumption"].includes(t)}getSensorValue(t,e){var i;const s=t.entity_id.split(".")[1],n="ppfd"===e?"ppfd_mol":"total_ppfd"===e?"total_ppfd_mol_integral":e,o=null===(i=this._hass)||void 0===i?void 0:i.states[`sensor.${s}_${n}`];return o?Number(o.state):0}getSensorRange(t){const e=this.plantEntities.map((e=>this.getSensorValue(e,t))),i=this.getSensorUnit(t);return{min:Math.min(...e),max:Math.max(...e),unit:i}}getSensorUnit(t){var e,i;if(!this.plantEntities.length)return"";const s=this.plantEntities[0].entity_id.split(".")[1],n="ppfd"===t?"ppfd_mol":"total_ppfd"===t?"total_ppfd_mol_integral":t,o=null===(e=this._hass)||void 0===e?void 0:e.states[`sensor.${s}_${n}`];return(null===(i=null==o?void 0:o.attributes)||void 0===i?void 0:i.unit_of_measurement)||""}renderFilterContent(t){if(this.isSensorColumn(t.id)){const e=this.getSensorRange(t.id),i=this._activeFilters[t.id]||e;return o.html`
                <div class="filter-range">
                    <div class="filter-header">${t.name}</div>
                    <div class="filter-range-inputs">
                        <input
                            class="filter-input"
                            type="number"
                            .value=${i.min}
                            @change=${i=>{var s;const n=i.target,o=Number(n.value);this.toggleFilter(t.id,{min:o,max:(null===(s=this._activeFilters[t.id])||void 0===s?void 0:s.max)||e.max})}}
                            step="0.1"
                        >
                        <span>bis</span>
                        <input
                            class="filter-input"
                            type="number"
                            .value=${i.max}
                            @change=${i=>{var s;const n=i.target,o=Number(n.value);this.toggleFilter(t.id,{min:(null===(s=this._activeFilters[t.id])||void 0===s?void 0:s.min)||e.min,max:o})}}
                            step="0.1"
                        >
                        <span>${e.unit}</span>
                    </div>
                </div>
            `}return o.html`
            <div class="filter-group">
                <div class="filter-header">${t.name}</div>
                ${this.getUniqueValues(t.id).map((e=>{var i;return o.html`
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${(null===(i=this._activeFilters[t.id])||void 0===i?void 0:i.has(e))||!1}
                            @change=${()=>this.toggleFilter(t.id,e)}
                        >
                        ${e}
                    </label>
                `}))}
            </div>
        `}static get styles(){return a.style}};s([(0,r.property)()],d.prototype,"_hass",void 0),s([(0,r.property)()],d.prototype,"config",void 0),s([(0,r.state)()],d.prototype,"_sortColumn",void 0),s([(0,r.state)()],d.prototype,"_sortDirection",void 0),s([(0,r.state)()],d.prototype,"_editingCell",void 0),s([(0,r.state)()],d.prototype,"_plantInfo",void 0),s([(0,r.state)()],d.prototype,"_searchQuery",void 0),s([(0,r.state)()],d.prototype,"_multiSelectMode",void 0),s([(0,r.state)()],d.prototype,"_selectedPlants",void 0),s([(0,r.state)()],d.prototype,"_filterMode",void 0),s([(0,r.state)()],d.prototype,"_activeFilters",void 0),d=s([(0,r.customElement)("flower-list-card")],d),e.default=d},800:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const s=i(437);e.style=s.css`
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
  height: 12px;
  background-color: var(--primary-background-color);
  border-radius: 3px;
  display: inline-grid;
  overflow: hidden;
}
.meter.red {
  flex-grow: 1;
  margin-right: 2px;
  max-width: 5%
}
.meter.green {
  flex-grow: 10;
  margin-right: 2px;
  max-width: 90%
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
  padding: 0px 16px;
  margin: 0 16px;
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
.sensor-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}
.meter-container {
    display: flex;
    gap: 2px;
    width: 120px;
    flex-shrink: 0;
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
    margin-right: 2px;
    max-width: 5%
}
.meter.green {
    flex-grow: 10;
    margin-right: 2px;
    max-width: 90%
}
.sensor-value {
    min-width: 45px;
    text-align: right;
    white-space: nowrap;
    flex-shrink: 0;
}
td[data-column="conductivity"] .sensor-value {
    min-width: 70px;
}
.search-container {
    display: flex;
    flex: 1;
    align-items: center;
    padding: 8px 0;
    border-bottom: none;
}
.search-container ha-icon {
    color: var(--secondary-text-color);
    margin-right: 8px;
}
.search-container input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    padding: 8px;
    font-size: 16px;
    color: var(--primary-text-color);
}
.search-container input::placeholder {
    color: var(--secondary-text-color);
}
.search-container ha-icon-button {
    --mdc-icon-button-size: 24px;
    color: var(--secondary-text-color);
}
.toolbar {
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin: 0 16px;
    border-bottom: 1px solid var(--divider-color);
    border-top: none;
    background-color: var(--card-background-color);
    height: 48px;
}
.toolbar ha-icon-button {
    --mdc-icon-button-size: 40px;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -8px;
}
.toolbar ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}
td input[type="checkbox"] {
    width: 14px;
    height: 14px;
    margin: 0;
    vertical-align: middle;
    position: relative;
    top: 0;
}
.search-container {
    display: flex;
    flex: 1;
    align-items: center;
    padding: 8px 0;
    border-bottom: none;
}
ha-checkbox {
    margin: 0 8px;
    --mdc-checkbox-state-layer-size: 40px;
}
.filter-sidebar {
    position: absolute;
    left: 0;
    top: 98px;
    bottom: 0;
    width: 234px;
    background: var(--card-background-color);
    border-right: 1px solid var(--divider-color);
    overflow-y: auto;
    z-index: 1;
    padding: 16px 16px 16px 32px;
}
.filter-group {
    margin-bottom: 16px;
}
.filter-header {
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--primary-text-color);
}
.filter-item {
    display: flex;
    align-items: center;
    padding: 4px 0;
    color: var(--primary-text-color);
    cursor: pointer;
}
.filter-item input[type="checkbox"] {
    margin-right: 8px;
}
.table-container {
    position: relative;
    transition: margin-left 0.3s ease;
}
.table-container.filtered {
    margin-left: 282px;
}
.filter-range-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}
.filter-input {
    all: unset;
    width: 35px;
    text-align: right;
    color: var(--primary-text-color);
}
.filter-input::-webkit-outer-spin-button,
.filter-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.filter-input[type=number] {
    -moz-appearance: textfield;
}
.filter-range-inputs span {
    color: var(--secondary-text-color);
    font-size: 0.9em;
}
td input[type="number"],
td input[type="text"],
td select {
    all: unset;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
}
td input[type="number"] {
    text-align: right;
}
td input[type="text"],
td select {
    text-align: left;
}
td[data-column="website"] input {
    width: 100%;
    min-width: 100%;
}
td input[type="number"]::-webkit-outer-spin-button,
td input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
td input[type="number"] {
    -moz-appearance: textfield;
}
td select {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    width: 100%;
}
td select::-ms-expand {
    display: none;
}
td select option {
    background: var(--card-background-color);
    color: var(--primary-text-color);
}
`},752:(t,e,i)=>{var s;i.d(e,{JW:()=>A,XX:()=>V,c0:()=>E,ge:()=>I,qy:()=>k,s6:()=>C});const n=window,o=n.trustedTypes,r=o?o.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,d="?"+l,c=`<${d}>`,h=document,u=()=>h.createComment(""),p=t=>null===t||"object"!=typeof t&&"function"!=typeof t,m=Array.isArray,v=t=>m(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),_="[ \t\n\f\r]",g=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,f=/-->/g,y=/>/g,b=RegExp(`>|${_}(?:([^\\s"'>=/]+)(${_}*=${_}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),$=/'/g,x=/"/g,w=/^(?:script|style|textarea|title)$/i,S=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),k=S(1),A=S(2),E=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),P=new WeakMap,z=h.createTreeWalker(h,129,null,!1);function U(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==r?r.createHTML(e):e}const M=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=g;for(let e=0;e<i;e++){const i=t[e];let d,h,u=-1,p=0;for(;p<i.length&&(r.lastIndex=p,h=r.exec(i),null!==h);)p=r.lastIndex,r===g?"!--"===h[1]?r=f:void 0!==h[1]?r=y:void 0!==h[2]?(w.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=b):void 0!==h[3]&&(r=b):r===b?">"===h[0]?(r=null!=n?n:g,u=-1):void 0===h[1]?u=-2:(u=r.lastIndex-h[2].length,d=h[1],r=void 0===h[3]?b:'"'===h[3]?x:$):r===x||r===$?r=b:r===f||r===y?r=g:(r=b,n=void 0);const m=r===b&&t[e+1].startsWith("/>")?" ":"";o+=r===g?i+c:u>=0?(s.push(d),i.slice(0,u)+a+i.slice(u)+l+m):i+l+(-2===u?(s.push(void 0),e):m)}return[U(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class T{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const c=t.length-1,h=this.parts,[p,m]=M(t,e);if(this.el=T.createElement(p,i),z.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=z.nextNode())&&h.length<c;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(a)||e.startsWith(l)){const i=m[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+a).split(l),e=/([.?@])?(.*)/.exec(i);h.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?F:"?"===e[1]?j:"@"===e[1]?B:R})}else h.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(w.test(s.tagName)){const t=s.textContent.split(l),e=t.length-1;if(e>0){s.textContent=o?o.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],u()),z.nextNode(),h.push({type:2,index:++n});s.append(t[e],u())}}}else if(8===s.nodeType)if(s.data===d)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(l,t+1));)h.push({type:7,index:n}),t+=l.length-1}n++}}static createElement(t,e){const i=h.createElement("template");return i.innerHTML=t,i}}function N(t,e,i=t,s){var n,o,r,a;if(e===E)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const d=p(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=N(t,l._$AS(t,e.values),l,s)),e}class O{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:h).importNode(i,!0);z.currentNode=n;let o=z.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new L(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new H(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=z.nextNode(),r++)}return z.currentNode=h,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{constructor(t,e,i,s){var n;this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),p(t)?t===C||null==t||""===t?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==C&&p(this._$AH)?this._$AA.nextSibling.data=t:this.$(h.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=T.createElement(U(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new O(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=P.get(t.strings);return void 0===e&&P.set(t.strings,e=new T(t)),e}T(t){m(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new L(this.k(u()),this.k(u()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class R{constructor(t,e,i,s,n){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=N(this,t,e,0),o=!p(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=N(this,s[i+r],e,r),a===E&&(a=this._$AH[r]),o||(o=!p(a)||a!==this._$AH[r]),a===C?t=C:t!==C&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class F extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}}const D=o?o.emptyScript:"";class j extends R{constructor(){super(...arguments),this.type=4}j(t){t&&t!==C?this.element.setAttribute(this.name,D):this.element.removeAttribute(this.name)}}class B extends R{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=N(this,t,e,0))&&void 0!==i?i:C)===E)return;const s=this._$AH,n=t===C&&s!==C||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==C&&(s===C||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class H{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}}const I={O:a,P:l,A:d,C:1,M,L:O,R:v,D:N,I:L,V:R,H:j,N:B,U:F,F:H},q=n.litHtmlPolyfillSupport;null==q||q(T,L),(null!==(s=n.litHtmlVersions)&&void 0!==s?s:n.litHtmlVersions=[]).push("2.8.0");const V=(t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new L(e.insertBefore(u(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>s,eventOptions:()=>d,property:()=>r,query:()=>c,queryAll:()=>h,queryAssignedElements:()=>v,queryAssignedNodes:()=>_,queryAsync:()=>u,state:()=>a});const s=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),n=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},o=(t,e,i)=>{e.constructor.createProperty(i,t)};function r(t){return(e,i)=>void 0!==i?o(t,e,i):n(t,e)}function a(t){return r({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,s)=>{var n;if(void 0===s){const s=null!==(n=i.originalKey)&&void 0!==n?n:i.key,o=null!=e?{kind:"method",placement:"prototype",key:s,descriptor:e(i.key)}:{...i,key:s};return null!=t&&(o.finisher=function(e){t(e,s)}),o}{const n=i.constructor;void 0!==e&&Object.defineProperty(i,s,e(s)),null==t||t(n,s)}};function d(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function c(t,e){return l({descriptor:i=>{const s={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;s.get=function(){var i,s;return void 0===this[e]&&(this[e]=null!==(s=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==s?s:null),this[e]}}return s}})}function h(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function u(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var p;const m=null!=(null===(p=window.HTMLSlotElement)||void 0===p?void 0:p.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function v(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:s=>({get(){var s;const n="slot"+(e?`[name=${e}]`:":not([name])"),o=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(n),r=null!=o?m(o,t):[];return i?r.filter((t=>t.matches(i))):r},enumerable:!0,configurable:!0})})}function _(t,e,i){let s,n=t;return"object"==typeof t?(n=t.slot,s=t):s={flatten:e},i?v({slot:n,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(n?`[name=${n}]`:":not([name])"),o=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==o?void 0:o.assignedNodes(s))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},437:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>a,LitElement:()=>A,ReactiveElement:()=>$,UpdatingElement:()=>k,_$LE:()=>C,_$LH:()=>S.ge,adoptStyles:()=>c,css:()=>d,defaultConverter:()=>g,getCompatibleStyle:()=>h,html:()=>S.qy,isServer:()=>P,noChange:()=>S.c0,notEqual:()=>f,nothing:()=>S.s6,render:()=>S.XX,supportsAdoptingStyleSheets:()=>n,svg:()=>S.JW,unsafeCSS:()=>l});const s=window,n=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new a("string"==typeof t?t:t+"",void 0,o),d=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(i,t,o)},c=(t,e)=>{n?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),n=s.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}))},h=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var u;const p=window,m=p.trustedTypes,v=m?m.emptyScript:"",_=p.reactiveElementPolyfillSupport,g={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:f},b="finalized";class $ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty(b))return!1;this[b]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return c(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=y){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:g).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:g;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||f)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}$[b]=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==_||_({ReactiveElement:$}),(null!==(u=p.reactiveElementVersions)&&void 0!==u?u:p.reactiveElementVersions=[]).push("1.6.3");var x,w,S=i(752);const k=$;class A extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,S.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return S.c0}}A.finalized=!0,A._$litElement$=!0,null===(x=globalThis.litElementHydrateSupport)||void 0===x||x.call(globalThis,{LitElement:A});const E=globalThis.litElementPolyfillSupport;null==E||E({LitElement:A});const C={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==(w=globalThis.litElementVersions)&&void 0!==w?w:globalThis.litElementVersions=[]).push("3.3.3");const P=!1},330:t=>{t.exports=JSON.parse('{"name":"flower-card","version":"3.0.0","description":"A Lovelace flower card for Home Assistant","main":"flower-card.js","repository":{"type":"git","url":"git+ssh://git@github.com/Olen/lovelace-flower-card.git"},"author":"Ola Bjorling Erdal <ola@bjorling.se>","license":"MIT","scripts":{"build":"webpack -c webpack.config.js","lint":"eslint src/**/*.ts","watch":"webpack -c webpack.config.js --watch --mode=development"},"dependencies":{"@marcokreeft/ha-editor-formbuilder":"2024.9.1","custom-card-helpers":"^1.9.0","home-assistant-js-websocket":"^9.4.0","lit":"^2.8.0","lit-element":"^2.5.1"},"devDependencies":{"@babel/core":"^7.26.0","@babel/preset-env":"^7.26.0","@babel/preset-typescript":"^7.26.0","@types/node":"^20.11.30","@typescript-eslint/eslint-plugin":"^8.19.1","babel-loader":"^9.1.3","compression-webpack-plugin":"^11.1.0","eslint":"^8.57.0","ts-loader":"^9.5.2","typescript":"^5.7.3","webpack":"^5.97.1","webpack-cli":"^5.1.4"},"keywords":[],"bugs":{"url":"https://github.com/Olen/lovelace-flower-card/issues"},"homepage":"https://github.com/Olen/lovelace-flower-card#readme"}')}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var o=e[s]={exports:{}};return t[s].call(o.exports,o,o.exports,i),o.exports}i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(45)})();