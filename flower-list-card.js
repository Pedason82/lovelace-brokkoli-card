/*! For license information please see flower-list-card.js.LICENSE.txt */
(()=>{"use strict";var t={45:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var s,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},s=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(s,o){function r(t){try{l(n.next(t))}catch(t){o(t)}}function a(t){try{l(n.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const o=i(437),r=i(924),a=i(800),l=i(330);console.info(`%c FLOWER-LIST-CARD %c ${l.version}`,"color: cyan; background: black; font-weight: bold;","color: darkblue; background: white; font-weight: bold;"),window.customCards=window.customCards||[],window.customCards.push({type:"flower-list-card",name:"Flower List Card",preview:!0,description:"Eine tabellarische Übersicht aller Pflanzen"});let d=class extends o.LitElement{constructor(){super(...arguments),this._sortColumn="friendly_name",this._sortDirection="asc",this._editingCell=null,this._plantInfo=new Map,this._searchQuery="",this._multiSelectMode=!1,this._selectedPlants=new Set,this._filterMode=!1,this._activeFilters={},this._entityTypes=new Set(["plant","cycle"]),this.plantEntities=[],this.EDITABLE_PLANT_ATTRIBUTES=["strain","breeder","original_flowering_duration","pid","sorte","feminized","effects","smell","taste","phenotype","hunger","growth_stretch","flower_stretch","mold_resistance","difficulty","yield","notes","website","samen_beginn","keimen_beginn","wurzeln_beginn","wachstum_beginn","blüte_beginn","entfernt","geerntet","samen_dauer","keimen_dauer","wurzeln_dauer","wachstum_dauer","blüte_dauer","entfernt_dauer","geerntet_dauer"]}static getStubConfig(){return{type:"custom:flower-list-card",title:"Pflanzenübersicht",search:{enabled:!0,placeholder:"Suche..."},multiselect:{enabled:!0,showbydefault:!1},filter:{enabled:!0,showbydefault:!1,filters:{}},show_columns:{name:!0,basic:!0,growing:!0,genetics:!0,phasebegin:!0,phasedauer:!0,metrics:!1,soil_moisture:!0,temperature:!0,conductivity:!0,illuminance:!0,air_humidity:!0,dli:!0,ppfd:!0,total_ppfd:!0,water_consumption:!0,fertilizer_consumption:!0,total_water_consumption:!0,total_fertilizer_consumption:!0,min_max:!1,details:!0,notes:!0}}}set hass(t){this._hass=t,this.updatePlantEntities()}updatePlantEntities(){return s(this,void 0,void 0,(function*(){if(this._hass){this.plantEntities=Object.values(this._hass.states).filter((t=>"object"==typeof t&&null!==t&&"entity_id"in t&&"attributes"in t&&"string"==typeof t.entity_id&&(t.entity_id.startsWith("plant.")||t.entity_id.startsWith("cycle.")&&"member_count"in t.attributes)));for(const t of this.plantEntities)if(!this._plantInfo.has(t.entity_id)){const e=yield this.get_plant_info(t.entity_id);this._plantInfo.set(t.entity_id,e)}this.requestUpdate()}}))}handleSort(t){this._sortColumn===t?this._sortDirection="asc"===this._sortDirection?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc"),this.requestUpdate()}getSortedPlants(){return[...this.plantEntities].sort(((t,e)=>{var i,n,s,o,r,a,l,d,c,h,p,u,m,g,v,_,f,b,y,x,w,$,k,S;let A,E;switch(this._sortColumn){case"friendly_name":A=t.attributes.friendly_name,E=e.attributes.friendly_name;break;case"state":A=t.state,E=e.state;break;case"area":const C=this.getAreaForEntity(t.entity_id),z=this.getAreaForEntity(e.entity_id);A=C&&(null===(n=null===(i=this._hass)||void 0===i?void 0:i.areas[C])||void 0===n?void 0:n.name)||"",E=z&&(null===(o=null===(s=this._hass)||void 0===s?void 0:s.areas[z])||void 0===o?void 0:o.name)||"";break;case"growth_phase":const P=t.entity_id.split(".")[1],T=e.entity_id.split(".")[1];A=(null===(a=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${P}_growth_phase`])||void 0===a?void 0:a.state)||"",E=(null===(d=null===(l=this._hass)||void 0===l?void 0:l.states[`select.${T}_growth_phase`])||void 0===d?void 0:d.state)||"";break;case"cycle":const M=t.entity_id.split(".")[1],U=e.entity_id.split(".")[1];A=(null===(h=null===(c=this._hass)||void 0===c?void 0:c.states[`select.${M}_cycle`])||void 0===h?void 0:h.state)||"",E=(null===(u=null===(p=this._hass)||void 0===p?void 0:p.states[`select.${U}_cycle`])||void 0===u?void 0:u.state)||"";break;case"pot_size":case"flowering_duration":const N=t.entity_id.split(".")[1],j=e.entity_id.split(".")[1];A=Number((null===(g=null===(m=this._hass)||void 0===m?void 0:m.states[`number.${N}_${this._sortColumn}`])||void 0===g?void 0:g.state)||0),E=Number((null===(_=null===(v=this._hass)||void 0===v?void 0:v.states[`number.${j}_${this._sortColumn}`])||void 0===_?void 0:_.state)||0);break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"ppfd":case"total_ppfd":case"water_consumption":case"fertilizer_consumption":const O=t.entity_id.split(".")[1],L=e.entity_id.split(".")[1],D="ppfd"===this._sortColumn?"ppfd_mol":"total_ppfd"===this._sortColumn?"total_ppfd_mol_integral":this._sortColumn;A=Number((null===(b=null===(f=this._hass)||void 0===f?void 0:f.states[`sensor.${O}_${D}`])||void 0===b?void 0:b.state)||0),E=Number((null===(x=null===(y=this._hass)||void 0===y?void 0:y.states[`sensor.${L}_${D}`])||void 0===x?void 0:x.state)||0);break;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":const F=t.entity_id.split(".")[1],R=e.entity_id.split(".")[1];A=Number((null===($=null===(w=this._hass)||void 0===w?void 0:w.states[`number.${F}_${this._sortColumn}`])||void 0===$?void 0:$.state)||0),E=Number((null===(S=null===(k=this._hass)||void 0===k?void 0:k.states[`number.${R}_${this._sortColumn}`])||void 0===S?void 0:S.state)||0);break;default:A=t.attributes[this._sortColumn]||"",E=e.attributes[this._sortColumn]||""}return"number"==typeof A&&"number"==typeof E?"asc"===this._sortDirection?A-E:E-A:(A=String(A).toLowerCase(),E=String(E).toLowerCase(),"asc"===this._sortDirection?A.localeCompare(E):E.localeCompare(A))}))}getAllAvailableColumns(){const t=[];return t.push({id:"friendly_name",name:"Name",group:"name"}),t.push({id:"state",name:"Status",group:"basic"}),t.push({id:"area",name:"Bereich",group:"growing"},{id:"growth_phase",name:"Phase",group:"growing"},{id:"cycle",name:"Durchgang",group:"growing"},{id:"pot_size",name:"Topfgröße",group:"growing"},{id:"flowering_duration",name:"Blütezeit",group:"growing"}),t.push({id:"strain",name:"Sorte",group:"genetics"},{id:"breeder",name:"Züchter",group:"genetics"},{id:"feminized",name:"Feminisiert",group:"genetics"},{id:"original_flowering_duration",name:"Original Blütezeit",group:"genetics"}),t.push({id:"samen_beginn",name:"Samen Start",group:"phasebegin"},{id:"keimen_beginn",name:"Keimen Start",group:"phasebegin"},{id:"wurzeln_beginn",name:"Wurzeln Start",group:"phasebegin"},{id:"wachstum_beginn",name:"Wachstum Start",group:"phasebegin"},{id:"blüte_beginn",name:"Blüte Start",group:"phasebegin"},{id:"entfernt",name:"Entfernt",group:"phasebegin"},{id:"geerntet",name:"Geerntet",group:"phasebegin"}),t.push({id:"samen_dauer",name:"Samen Dauer",group:"phasedauer"},{id:"keimen_dauer",name:"Keimen Dauer",group:"phasedauer"},{id:"wurzeln_dauer",name:"Wurzeln Dauer",group:"phasedauer"},{id:"wachstum_dauer",name:"Wachstum Dauer",group:"phasedauer"},{id:"blüte_dauer",name:"Blüte Dauer",group:"phasedauer"},{id:"entfernt_dauer",name:"Entfernt Dauer",group:"phasedauer"},{id:"geerntet_dauer",name:"Geerntet Dauer",group:"phasedauer"}),t.push({id:"soil_moisture",name:"Feuchtigkeit",group:"sensors"},{id:"temperature",name:"Temperatur",group:"sensors"},{id:"conductivity",name:"Leitfähigkeit",group:"sensors"},{id:"illuminance",name:"Beleuchtung",group:"sensors"},{id:"air_humidity",name:"Luftfeuchtigkeit",group:"sensors"},{id:"dli",name:"DLI",group:"sensors"},{id:"water_consumption",name:"Wasserverbrauch",group:"sensors"},{id:"fertilizer_consumption",name:"Düngerverbrauch",group:"sensors"},{id:"health",name:"Gesundheit",group:"sensors"}),t.push({id:"ppfd",name:"PPFD",group:"diagnostics"},{id:"total_ppfd",name:"Total PPFD",group:"diagnostics"},{id:"total_water_consumption",name:"Gesamt Wasserverbrauch",group:"diagnostics"},{id:"total_fertilizer_consumption",name:"Gesamt Düngerverbrauch",group:"diagnostics"}),t.push({id:"max_air_humidity",name:"Max Luftfeuchte",group:"min_max"},{id:"min_air_humidity",name:"Min Luftfeuchte",group:"min_max"},{id:"max_soil_moisture",name:"Max Bodenfeuchte",group:"min_max"},{id:"min_soil_moisture",name:"Min Bodenfeuchte",group:"min_max"},{id:"max_temperature",name:"Max Temp",group:"min_max"},{id:"min_temperature",name:"Min Temp",group:"min_max"},{id:"max_conductivity",name:"Max Leitfähigkeit",group:"min_max"},{id:"min_conductivity",name:"Min Leitfähigkeit",group:"min_max"},{id:"max_illuminance",name:"Max Beleuchtung",group:"min_max"},{id:"min_illuminance",name:"Min Beleuchtung",group:"min_max"},{id:"max_dli",name:"Max DLI",group:"min_max"},{id:"min_dli",name:"Min DLI",group:"min_max"},{id:"max_water_consumption",name:"Max Wasserverbrauch",group:"min_max"},{id:"min_water_consumption",name:"Min Wasserverbrauch",group:"min_max"},{id:"max_fertilizer_consumption",name:"Max Düngerverbrauch",group:"min_max"},{id:"min_fertilizer_consumption",name:"Min Düngerverbrauch",group:"min_max"}),t.push({id:"timestamp",name:"Zeitstempel",group:"details"},{id:"difficulty",name:"Schwierigkeit",group:"details"},{id:"yield",name:"Ertrag",group:"details"},{id:"mold_resistance",name:"Schimmelresistenz",group:"details"},{id:"hunger",name:"Hunger",group:"details"},{id:"effects",name:"Effekte",group:"details"},{id:"smell",name:"Geruch",group:"details"},{id:"taste",name:"Geschmack",group:"details"},{id:"phenotype",name:"Phänotyp",group:"details"},{id:"growth_stretch",name:"Wachstumsdehnung",group:"details"},{id:"flower_stretch",name:"Blütendehnung",group:"details"}),t.push({id:"moisture_status",name:"St. Feuchtigkeit",group:"metrics"},{id:"temperature_status",name:"St. Temperatur",group:"metrics"},{id:"conductivity_status",name:"St. Leitfähigkeit",group:"metrics"},{id:"illuminance_status",name:"St. Beleuchtung",group:"metrics"},{id:"humidity_status",name:"St. Luftfeuchtigkeit",group:"metrics"},{id:"dli_status",name:"St. DLI",group:"metrics"}),t.push({id:"notes",name:"Notizen",group:"notes"},{id:"website",name:"Website",group:"notes"}),t}getDefaultConfig(){return{type:"flower-list-card",title:"Pflanzenübersicht",search:{enabled:!0,placeholder:"Suche..."},multiselect:{enabled:!0,showbydefault:!1},filter:{enabled:!0,showbydefault:!1,filters:{entity_type:["plant","cycle"],state:["ok","problem"],soil_moisture:{min:20,max:80}}},show_columns:{name:!0,basic:!0,growing:!0,genetics:!0,phasebegin:!0,phasedauer:!0,metrics:!1,soil_moisture:!0,temperature:!0,conductivity:!0,illuminance:!0,air_humidity:!0,dli:!0,ppfd:!0,total_ppfd:!0,water_consumption:!0,fertilizer_consumption:!0,total_water_consumption:!0,total_fertilizer_consumption:!0,min_max:!1,details:!0,notes:!0}}}setConfig(t){this.config=Object.assign(Object.assign({},this.getDefaultConfig()),t)}getVisibleColumns(){var t;const e=this.getAllAvailableColumns(),i=(null===(t=this.config)||void 0===t?void 0:t.show_columns)||this.getDefaultConfig().show_columns,n=new Map(e.map((t=>[t.id,t]))),s=new Map;e.forEach((t=>{s.has(t.group)||s.set(t.group,[]),s.get(t.group).push(t)}));const o=[];for(const[t,e]of Object.entries(i))e&&(s.has(t)?o.push(...s.get(t)):n.has(t)&&o.push(n.get(t)));return o}handleCellClick(t,e,i){t.stopPropagation();const n="pot_size"===i||"growth_phase"===i||"cycle"===i||"area"===i||"flowering_duration"===i||i.startsWith("min_")||i.startsWith("max_")||i.endsWith("_beginn")||"entfernt"===i||"geerntet"===i||i.endsWith("_dauer")||this.EDITABLE_PLANT_ATTRIBUTES.includes(i);this._multiSelectMode&&0===this._selectedPlants.size&&this._selectedPlants.add(e.entity_id),n&&(this._editingCell={entityId:e.entity_id,column:i},this.requestUpdate())}handlePotSizeUpdate(t,e){var i;if("Enter"===t.key){const n=t.target,s=parseFloat(n.value);if(!isNaN(s))if(this._multiSelectMode&&this._selectedPlants.size>0)this.applyBulkUpdate(s,"pot_size");else{const t=e.entity_id.split(".")[1];null===(i=this._hass)||void 0===i||i.callService("number","set_value",{entity_id:`number.${t}_pot_size`,value:s}),this._editingCell=null,this.requestUpdate()}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}handleGrowthPhaseUpdate(t,e){return s(this,void 0,void 0,(function*(){var i;const n=t.target.value;if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(n,"growth_phase");else{const t=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${t}_growth_phase`,option:n}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren der Wachstumsphase:",t)}}}))}getGrowthPhaseOptions(t){var e,i;const n=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_growth_phase`];return(null===(i=null==n?void 0:n.attributes)||void 0===i?void 0:i.options)||[]}handleCycleUpdate(t,e){return s(this,void 0,void 0,(function*(){var i;const n=t.target.value;if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(n,"cycle");else{const t=e.entity_id.split(".")[1];try{yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${t}_cycle`,option:n}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Zyklus:",t)}}}))}getCycleOptions(t){var e,i;const n=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_cycle`];return(null===(i=null==n?void 0:n.attributes)||void 0===i?void 0:i.options)||[]}handlePlantAttributeUpdate(t,e,i){return s(this,void 0,void 0,(function*(){var n;if(t instanceof KeyboardEvent&&"Enter"!==t.key)return void("Escape"===t.key&&(this._editingCell=null,this.requestUpdate()));let s=t.target.value;if(!i.endsWith("_dauer")||(s=Number(s),!isNaN(s)))if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(s,i);else try{const t={entity_id:e.entity_id,[i]:s};yield null===(n=this._hass)||void 0===n?void 0:n.callService("plant","update_plant_attributes",t),this._editingCell=null,this.requestUpdate()}catch(t){console.error(`Fehler beim Aktualisieren von ${i}:`,t)}}))}handleKeyDown(t){"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}formatNumber(t,e=2){const i="string"==typeof t?parseFloat(t):t;return isNaN(i)?"-":i.toFixed(e)}handleHelperUpdate(t,e,i){return s(this,void 0,void 0,(function*(){var n;if("Enter"===t.key){const s=t.target,o=parseFloat(s.value);if(!isNaN(o))if(this._multiSelectMode&&this._selectedPlants.size>0)yield this.applyBulkUpdate(o,i);else{const t=e.entity_id.split(".")[1];try{yield null===(n=this._hass)||void 0===n?void 0:n.callService("number","set_value",{entity_id:`number.${t}_${i}`,value:o}),this._editingCell=null,this.requestUpdate()}catch(t){console.error("Fehler beim Aktualisieren des Helpers:",t)}}}else"Escape"===t.key&&(this._editingCell=null,this.requestUpdate())}))}get_plant_info(t){return s(this,void 0,void 0,(function*(){var e;try{return yield null===(e=this._hass)||void 0===e?void 0:e.callWS({type:"plant/get_info",entity_id:t})}catch(t){return{result:{}}}}))}getCellValue(t,e){var i,n,s,r,a,l,d,c,h,p,u,m,g,v,_,f,b,y,x,w,$,k,S,A,E,C,z,P,T,M,U;const N=t.entity_id.split(".")[1];if((null===(i=this._editingCell)||void 0===i?void 0:i.entityId)===t.entity_id&&(null===(n=this._editingCell)||void 0===n?void 0:n.column)===e){if(e.endsWith("_beginn")||"entfernt"===e||"geerntet"===e){const i=null===(s=this._hass)||void 0===s?void 0:s.states[`select.${N}_growth_phase`],n=null==i?void 0:i.attributes[e];return o.html`
                    <input
                        type="date"
                        .value="${(null==n?void 0:n.split("T")[0])||""}"
                        @change=${i=>this.handlePlantAttributeUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 140px;"
                    >
                `}if(e.endsWith("_dauer")){const i=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${N}_growth_phase`],n=null==i?void 0:i.attributes[e];return o.html`
                    <input
                        type="number"
                        min="0"
                        .value="${n||""}"
                        @change=${i=>this.handlePlantAttributeUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > Tage
                `}if("pot_size"===e||"flowering_duration"===e){const i=null===(a=this._hass)||void 0===a?void 0:a.states[`number.${N}_${e}`],n="flowering_duration"===e?"Tage":"L";return o.html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${(null==i?void 0:i.state)||""}"
                        @keydown=${i=>this.handleHelperUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > ${n}
                `}if("growth_phase"===e){const e=null===(l=this._hass)||void 0===l?void 0:l.states[`select.${N}_growth_phase`],i=this.getGrowthPhaseOptions(N);return o.html`
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
                `}if("cycle"===e){if(t.entity_id.startsWith("cycle."))return o.html`${t.attributes.member_count||0} Mitglieder`;if((null===(d=this._editingCell)||void 0===d?void 0:d.entityId)===t.entity_id&&"cycle"===(null===(c=this._editingCell)||void 0===c?void 0:c.column)){const e=null===(h=this._hass)||void 0===h?void 0:h.states[`select.${N}_cycle`],i=this.getCycleOptions(N);return o.html`
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
                    `}const e=null===(p=this._hass)||void 0===p?void 0:p.states[`select.${N}_cycle`];return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"cycle")}>
                        ${(null==e?void 0:e.state)&&"unknown"!==e.state?e.state:"-"}
                    </span>
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
                `;if(e.startsWith("min_")||e.startsWith("max_")){const i=null===(u=this._hass)||void 0===u?void 0:u.states[`number.${N}_${e}`],n=(null==i?void 0:i.attributes.unit_of_measurement)||"";return o.html`
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        .value="${(null==i?void 0:i.state)||""}"
                        @keydown=${i=>this.handleHelperUpdate(i,t,e)}
                        @click=${t=>t.stopPropagation()}
                        style="width: 80px;"
                    > ${n}
                `}if("area"===e){const e=this.getAreaForEntity(t.entity_id),i=e?null===(g=null===(m=this._hass)||void 0===m?void 0:m.areas[e])||void 0===g?void 0:g.name:"",n=this.getAreaOptions();return o.html`
                    <select
                        @change=${e=>this.handleAreaUpdate(e,t)}
                        @click=${t=>t.stopPropagation()}
                        @keydown=${this.handleKeyDown}
                        style="width: 120px;"
                    >
                        <option value="">Kein Bereich</option>
                        ${n.map((t=>o.html`
                            <option value="${t}" ?selected=${t===i}>
                                ${t}
                            </option>
                        `))}
                    </select>
                `}}if(e.endsWith("_beginn")||"entfernt"===e||"geerntet"===e){const i=null===(v=this._hass)||void 0===v?void 0:v.states[`select.${N}_growth_phase`],n=null==i?void 0:i.attributes[e];if(!n)return o.html`
                <span @click=${i=>this.handleCellClick(i,t,e)}>
                    -
                </span>
            `;const s=new Date(n);return o.html`
                <span @click=${i=>this.handleCellClick(i,t,e)}>
                    ${s.toLocaleDateString("de-DE")}
                </span>
            `}if(e.endsWith("_dauer")){const i=null===(_=this._hass)||void 0===_?void 0:_.states[`select.${N}_growth_phase`],n=null==i?void 0:i.attributes[e];return o.html`
                <span @click=${i=>this.handleCellClick(i,t,e)}>
                    ${n?`${n} Tage`:"-"}
                </span>
            `}switch(e){case"friendly_name":return o.html`
                    <div class="plant-name">
                        ${t.attributes.entity_picture?o.html`
                            <img src="${t.attributes.entity_picture}" alt="${t.attributes.friendly_name}">
                        `:o.html`
                            <div class="plant-icon">
                                <ha-icon icon="mdi:flower"></ha-icon>
                            </div>
                        `}
                        ${t.attributes.friendly_name}
                    </div>
                `;case"state":return o.html`
                    <ha-icon .icon="mdi:${"problem"===t.state.toLowerCase()?"alert-circle-outline":"check-circle-outline"}">
                    </ha-icon>
                    ${t.state}
                `;case"timestamp":const i=t.attributes.timestamp;return i?new Date(i).toLocaleString("de-DE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-";case"growth_phase":const n=null===(f=this._hass)||void 0===f?void 0:f.states[`select.${N}_growth_phase`];return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"growth_phase")}>
                        ${(null==n?void 0:n.state)||"Nicht verfügbar"}
                    </span>
                `;case"pot_size":const s=null===(b=this._hass)||void 0===b?void 0:b.states[`number.${N}_${e}`];return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${s?`${s.state} L`:"Nicht verfügbar"}
                    </span>
                `;case"flowering_duration":const r=null===(y=this._hass)||void 0===y?void 0:y.states[`number.${N}_${e}`];return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${r?`${r.state} Tage`:"Nicht verfügbar"}
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
                `;case"cycle":if(t.entity_id.startsWith("cycle."))return o.html`${t.attributes.member_count||0} Mitglieder`;const a=null===(x=this._hass)||void 0===x?void 0:x.states[`select.${N}_cycle`];return o.html`
                    <span @click=${e=>this.handleCellClick(e,t,"cycle")}>
                        ${(null==a?void 0:a.state)&&"unknown"!==a.state?a.state:"-"}
                    </span>
                `;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"water_consumption":case"fertilizer_consumption":case"health":const l=null===(w=this._hass)||void 0===w?void 0:w.states[`sensor.${N}_${e}`];if(!l)return"-";if("health"===e){const i=Number(l.state),n=0,s=5,r=100*Math.max(0,Math.min(1,i/s)),a=!isNaN(i);return o.html`
                        <div class="sensor-cell" @click=${i=>this.handleRowClick(i,t,e)}>
                            <div class="meter-container">
                                <div class="meter red">
                                    <span class="${a?i<n||i>s?"bad":"good":"unavailable"}" 
                                          style="width: 100%;"></span>
                                </div>
                                <div class="meter green">
                                    <span class="${a?i>s?"bad":"good":"unavailable"}" 
                                          style="width:${a?r:"0"}%;"></span>
                                </div>
                                <div class="meter red">
                                    <span class="bad" style="width:${a?i>s?100:0:"0"}%;"></span>
                                </div>
                            </div>
                            <div class="sensor-value">
                                ${i}
                            </div>
                        </div>
                    `}let d=null===($=this._hass)||void 0===$?void 0:$.states[`number.${N}_min_${e}`],c=null===(k=this._hass)||void 0===k?void 0:k.states[`number.${N}_max_${e}`],h=(null==d?void 0:d.state)?Number(d.state):0,p=(null==c?void 0:c.state)?Number(c.state):100;if(!d||!c||"unavailable"===d.state||"unavailable"===c.state){const i=this._plantInfo.get(t.entity_id);(null===(S=null==i?void 0:i.result)||void 0===S?void 0:S[e])&&(h=Number(i.result[e].min),p=Number(i.result[e].max))}const u=Number(l.state),m=l.attributes.unit_of_measurement||"",g=100*Math.max(0,Math.min(1,(u-h)/(p-h))),v=!isNaN(u);return o.html`
                    <div class="sensor-cell" @click=${i=>this.handleRowClick(i,t,e)}>
                        <div class="meter-container">
                            <div class="meter red">
                                <span class="${v?u<h||u>p?"bad":"good":"unavailable"}" 
                                      style="width: 100%;"></span>
                            </div>
                            <div class="meter green">
                                <span class="${v?u>p?"bad":"good":"unavailable"}" 
                                      style="width:${v?g:"0"}%;"></span>
                            </div>
                            <div class="meter red">
                                <span class="bad" style="width:${v?u>p?100:0:"0"}%;"></span>
                            </div>
                        </div>
                        <div class="sensor-value">
                            ${u} ${m}
                        </div>
                    </div>
                `;case"ppfd":const _=null===(A=this._hass)||void 0===A?void 0:A.states[`sensor.${N}_ppfd_mol`];if(!_)return"-";const j=_.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(_.state,6)} ${j}`;case"total_ppfd":const O=null===(E=this._hass)||void 0===E?void 0:E.states[`sensor.${N}_total_ppfd_mol_integral`];if(!O)return"-";const L=O.attributes.unit_of_measurement||"";return o.html`${this.formatNumber(O.state,2)} ${L}`;case"min_air_humidity":case"max_air_humidity":case"min_soil_moisture":case"max_soil_moisture":case"min_temperature":case"max_temperature":case"min_conductivity":case"max_conductivity":case"min_illuminance":case"max_illuminance":case"min_dli":case"max_dli":case"min_water_consumption":case"max_water_consumption":case"min_fertilizer_consumption":case"max_fertilizer_consumption":const D=null===(C=this._hass)||void 0===C?void 0:C.states[`number.${N}_${e}`];if(!D)return"-";const F=D.attributes.unit_of_measurement||"";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${D.state} ${F}
                    </span>
                `;case"area":const R=this.getAreaForEntity(t.entity_id),B=R?null===(P=null===(z=this._hass)||void 0===z?void 0:z.areas[R])||void 0===P?void 0:P.name:"-";return o.html`
                    <span @click=${i=>this.handleCellClick(i,t,e)}>
                        ${B}
                    </span>
                `;case"total_water_consumption":case"total_fertilizer_consumption":const H=null===(T=this._hass)||void 0===T?void 0:T.states[`sensor.${N}_${e}`];if(!H)return"-";const I=H.attributes.unit_of_measurement||"";return o.html`${H.state} ${I}`;default:return this.EDITABLE_PLANT_ATTRIBUTES.includes(e)?o.html`
                        <span @click=${i=>this.handleCellClick(i,t,e)}>
                            ${(null===(M=t.attributes[e])||void 0===M?void 0:M.toString())||"-"}
                        </span>
                    `:(null===(U=t.attributes[e])||void 0===U?void 0:U.toString())||"-"}}handleRowClick(t,e,i){if(["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(i)){const t=new CustomEvent("hass-more-info",{detail:{entityId:e.entity_id},bubbles:!0,composed:!0});this.dispatchEvent(t)}const n=e.entity_id.split(".")[1];let s="";switch(i){case"ppfd":s=`sensor.${n}_ppfd_mol`;break;case"total_ppfd":s=`sensor.${n}_total_ppfd_mol_integral`;break;case"soil_moisture":case"temperature":case"conductivity":case"illuminance":case"air_humidity":case"dli":case"water_consumption":case"fertilizer_consumption":s=`sensor.${n}_${i}`;break;default:return}if(s){const t=new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0});this.dispatchEvent(t)}}handleSearch(t){const e=t.target;this._searchQuery=e.value.toLowerCase(),this.requestUpdate()}getFilteredPlants(){var t,e,i,n;let s=this.getSortedPlants();s=s.filter((t=>{const e=t.entity_id.split(".")[0];return this._entityTypes.has(e)}));const o=Object.assign({},this._activeFilters);if(!(null===(e=null===(t=this.config)||void 0===t?void 0:t.filter)||void 0===e?void 0:e.enabled)&&(null===(n=null===(i=this.config)||void 0===i?void 0:i.filter)||void 0===n?void 0:n.filters))for(const[t,e]of Object.entries(this.config.filter.filters))"entity_type"!==t&&(Array.isArray(e)?o[t]=new Set(e):o[t]=e);return Object.keys(o).length>0&&(s=s.filter((t=>Object.entries(o).every((([e,i])=>{var n,s,o,r,a,l;if("entity_type"===e)return!0;const d=t.entity_id.split(".")[1];if(this.isSensorColumn(e)){const n=this.getSensorValue(t,e),s=i;return n>=s.min&&n<=s.max}let c;switch(e){case"area":const i=this.getAreaForEntity(t.entity_id);c=i&&(null===(s=null===(n=this._hass)||void 0===n?void 0:n.areas[i])||void 0===s?void 0:s.name)||"-";break;case"state":c=t.state;break;case"growth_phase":const h=null===(o=this._hass)||void 0===o?void 0:o.states[`select.${d}_growth_phase`];c=(null==h?void 0:h.state)||"-";break;case"cycle":const p=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${d}_cycle`];c=(null==p?void 0:p.state)&&"unknown"!==p.state?p.state:"-";break;case"pot_size":const u=null===(a=this._hass)||void 0===a?void 0:a.states[`number.${d}_pot_size`];c=u?`${u.state}L`:"-";break;default:c=(null===(l=t.attributes[e])||void 0===l?void 0:l.toString())||"-"}return i.has(c)}))))),this._searchQuery&&(s=s.filter((t=>{var e,i;return[t.attributes.friendly_name,t.state,this.getAreaForEntity(t.entity_id)?null===(i=null===(e=this._hass)||void 0===e?void 0:e.areas[this.getAreaForEntity(t.entity_id)])||void 0===i?void 0:i.name:"",...this.EDITABLE_PLANT_ATTRIBUTES.map((e=>t.attributes[e]))].filter(Boolean).some((t=>t.toString().toLowerCase().includes(this._searchQuery)))}))),s}getSearchableValue(t,e){var i,n,s,o,r,a,l,d,c;const h=t.entity_id.split(".")[1];switch(e){case"friendly_name":return t.attributes.friendly_name||"";case"state":return t.state||"";case"area":const p=this.getAreaForEntity(t.entity_id);return p&&(null===(n=null===(i=this._hass)||void 0===i?void 0:i.areas[p])||void 0===n?void 0:n.name)||"";case"growth_phase":return(null===(o=null===(s=this._hass)||void 0===s?void 0:s.states[`select.${h}_growth_phase`])||void 0===o?void 0:o.state)||"";case"cycle":return t.entity_id.startsWith("cycle.")?`${t.attributes.member_count||0} Mitglieder`:(null===(a=null===(r=this._hass)||void 0===r?void 0:r.states[`select.${h}_cycle`])||void 0===a?void 0:a.state)||"";case"pot_size":return(null===(d=null===(l=this._hass)||void 0===l?void 0:l.states[`number.${h}_pot_size`])||void 0===d?void 0:d.state)||"";default:return this.EDITABLE_PLANT_ATTRIBUTES.includes(e)&&(null===(c=t.attributes[e])||void 0===c?void 0:c.toString())||""}}render(){var t,e,i,n,s,r,a,l,d,c,h,p,u,m,g,v,_,f,b,y,x,w;if(!this._hass)return o.html``;const $=this.getFilteredPlants(),k=this.getVisibleColumns();return o.html`
            <ha-card>
                ${""!==(null===(t=this.config)||void 0===t?void 0:t.title)?o.html`
                    <div class="card-header">
                        <div class="name">${(null===(e=this.config)||void 0===e?void 0:e.title)||"Pflanzenübersicht"}</div>
                    </div>
                `:""}
                ${(null===(n=null===(i=this.config)||void 0===i?void 0:i.multiselect)||void 0===n?void 0:n.enabled)||(null===(r=null===(s=this.config)||void 0===s?void 0:s.search)||void 0===r?void 0:r.enabled)||(null===(l=null===(a=this.config)||void 0===a?void 0:a.filter)||void 0===l?void 0:l.enabled)?o.html`
                    <div class="toolbar">
                        ${(null===(c=null===(d=this.config)||void 0===d?void 0:d.multiselect)||void 0===c?void 0:c.enabled)||(null===(p=null===(h=this.config)||void 0===h?void 0:h.search)||void 0===p?void 0:p.enabled)||(null===(m=null===(u=this.config)||void 0===u?void 0:u.filter)||void 0===m?void 0:m.enabled)?o.html`
                            ${(null===(v=null===(g=this.config)||void 0===g?void 0:g.filter)||void 0===v?void 0:v.enabled)?o.html`
                                <ha-icon-button
                                    .label=${this._filterMode?"Filter schließen":"Filter"}
                                    @click=${this.toggleFilterMode}
                                >
                                    <ha-icon icon="mdi:${this._filterMode?"filter-off":"filter"}"></ha-icon>
                                </ha-icon-button>
                            `:""}
                            ${(null===(f=null===(_=this.config)||void 0===_?void 0:_.multiselect)||void 0===f?void 0:f.enabled)?o.html`
                                <ha-icon-button
                                    .label=${this._multiSelectMode?"Mehrfachauswahl beenden":"Mehrfachauswahl"}
                                    @click=${this.toggleMultiSelect}
                                >
                                    <ha-icon icon="mdi:${this._multiSelectMode?"close":"checkbox-multiple-outline"}"></ha-icon>
                                </ha-icon-button>
                            `:""}
                            ${(null===(y=null===(b=this.config)||void 0===b?void 0:b.search)||void 0===y?void 0:y.enabled)?o.html`
                                <div class="search-container">
                                    <ha-icon icon="mdi:magnify"></ha-icon>
                                    <input
                                        type="text"
                                        .value=${this._searchQuery}
                                        placeholder="${(null===(w=null===(x=this.config)||void 0===x?void 0:x.search)||void 0===w?void 0:w.placeholder)||"Suche..."}"
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
                                ${k.map((t=>o.html`
                                    <th @click=${()=>this.handleSort(t.id)} data-column="${t.id}">
                                        ${t.name}
                                        ${this._sortColumn===t.id?o.html`<ha-icon icon="mdi:${"asc"===this._sortDirection?"arrow-up":"arrow-down"}"></ha-icon>`:""}
                                    </th>
                                `))}
                            </tr>
                        </thead>
                        <tbody>
                            ${$.map((t=>o.html`
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
                                    ${k.map((e=>o.html`
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
        `}getCursorStyle(t){return["friendly_name","state","moisture_status","temperature_status","conductivity_status","illuminance_status","humidity_status","dli_status"].includes(t)||["soil_moisture","temperature","conductivity","illuminance","air_humidity","dli","ppfd","total_ppfd","water_consumption","fertilizer_consumption","health"].includes(t)?"pointer":["pot_size","growth_phase","cycle","area","flowering_duration"].includes(t)||t.startsWith("min_")||t.startsWith("max_")||this.EDITABLE_PLANT_ATTRIBUTES.includes(t)||t.endsWith("_beginn")||"entfernt"===t||"geerntet"===t||t.endsWith("_dauer")?"text":"default"}getCardSize(){return 1+Math.ceil(this.plantEntities.length/2)}getAreaOptions(){return this._hass?Object.values(this._hass.areas||{}).map((t=>t.name)).sort():[]}handleAreaUpdate(t,e){return s(this,void 0,void 0,(function*(){var i,n,s,o,r,a;const l=t.target.value,d=null===(n=Object.entries((null===(i=this._hass)||void 0===i?void 0:i.areas)||{}).find((([t,e])=>e.name===l)))||void 0===n?void 0:n[0];if(this._multiSelectMode&&this._selectedPlants.size>0)for(const t of this._selectedPlants){const e=((null===(s=this._hass)||void 0===s?void 0:s.entities)||{})[t];(null==e?void 0:e.device_id)&&(yield null===(o=this._hass)||void 0===o?void 0:o.callService("plant","move_to_area",Object.assign({device_id:[e.device_id]},d?{area_id:d}:{})))}else{const t=((null===(r=this._hass)||void 0===r?void 0:r.entities)||{})[e.entity_id];(null==t?void 0:t.device_id)&&(yield null===(a=this._hass)||void 0===a?void 0:a.callService("plant","move_to_area",Object.assign({device_id:[t.device_id]},d?{area_id:d}:{})))}this._editingCell=null,this.requestUpdate()}))}getAreaForEntity(t){if(!this._hass)return;this._hass.areas;const e=this._hass.devices||{},i=(this._hass.entities||{})[t];if(i){if(i.area_id)return i.area_id;if(i.device_id){const t=e[i.device_id];if(null==t?void 0:t.area_id)return t.area_id}}}toggleMultiSelect(){this._multiSelectMode=!this._multiSelectMode,this._multiSelectMode||this._selectedPlants.clear(),this.requestUpdate()}togglePlantSelection(t,e){e.stopPropagation(),this._selectedPlants.has(t)?this._selectedPlants.delete(t):this._selectedPlants.add(t),this.requestUpdate()}applyBulkUpdate(t,e){return s(this,void 0,void 0,(function*(){var i,n,s,o,r;for(const a of this._selectedPlants)if(this.plantEntities.find((t=>t.entity_id===a))){const l=a.split(".")[1];"growth_phase"===e?yield null===(i=this._hass)||void 0===i?void 0:i.callService("select","select_option",{entity_id:`select.${l}_growth_phase`,option:t}):"cycle"===e?yield null===(n=this._hass)||void 0===n?void 0:n.callService("select","select_option",{entity_id:`select.${l}_cycle`,option:t}):"pot_size"===e?yield null===(s=this._hass)||void 0===s?void 0:s.callService("number","set_value",{entity_id:`number.${l}_pot_size`,value:parseFloat(t)}):e.startsWith("min_")||e.startsWith("max_")?yield null===(o=this._hass)||void 0===o?void 0:o.callService("number","set_value",{entity_id:`number.${l}_${e}`,value:parseFloat(t)}):this.EDITABLE_PLANT_ATTRIBUTES.includes(e)&&(yield null===(r=this._hass)||void 0===r?void 0:r.callService("plant","update_plant_attributes",{entity_id:a,[e]:t}))}this._editingCell=null,this.requestUpdate()}))}connectedCallback(){var t,e,i,n,s,o;if(super.connectedCallback(),(null===(e=null===(t=this.config)||void 0===t?void 0:t.multiselect)||void 0===e?void 0:e.showbydefault)&&(this._multiSelectMode=!0),(null===(n=null===(i=this.config)||void 0===i?void 0:i.filter)||void 0===n?void 0:n.showbydefault)&&(this._filterMode=!0),null===(o=null===(s=this.config)||void 0===s?void 0:s.filter)||void 0===o?void 0:o.filters)for(const[t,e]of Object.entries(this.config.filter.filters))"entity_type"===t?this._entityTypes=new Set(e):Array.isArray(e)?this._activeFilters[t]=new Set(e):this._activeFilters[t]=e;else this._entityTypes.add("plant"),this._entityTypes.add("cycle")}toggleFilterMode(){var t,e;(null===(e=null===(t=this.config)||void 0===t?void 0:t.filter)||void 0===e?void 0:e.enabled)&&(this._filterMode=!this._filterMode,this.requestUpdate())}toggleFilter(t,e){if(this.isSensorColumn(t))this._activeFilters[t]=e,this._activeFilters[t]||delete this._activeFilters[t];else{this._activeFilters[t]||(this._activeFilters[t]=new Set);const i=this._activeFilters[t];i.has(e)?(i.delete(e),0===i.size&&delete this._activeFilters[t]):i.add(e)}this.requestUpdate()}getUniqueValues(t){return[...new Set(this.plantEntities.map((e=>{var i,n,s,o,r,a;const l=e.entity_id.split(".")[1];switch(t){case"area":const d=this.getAreaForEntity(e.entity_id);return d&&(null===(n=null===(i=this._hass)||void 0===i?void 0:i.areas[d])||void 0===n?void 0:n.name)||"-";case"state":return e.state;case"growth_phase":const c=null===(s=this._hass)||void 0===s?void 0:s.states[`select.${l}_growth_phase`];return(null==c?void 0:c.state)||"-";case"cycle":const h=null===(o=this._hass)||void 0===o?void 0:o.states[`select.${l}_cycle`];return(null==h?void 0:h.state)&&"unknown"!==h.state?h.state:"-";case"pot_size":const p=null===(r=this._hass)||void 0===r?void 0:r.states[`number.${l}_pot_size`];return p?`${p.state}L`:"-";default:return(null===(a=e.attributes[t])||void 0===a?void 0:a.toString())||"-"}})))].sort()}isSensorColumn(t){return["soil_moisture","temperature","conductivity","illuminance","air_humidity","dli","water_consumption","fertilizer_consumption","health"].includes(t)}getSensorValue(t,e){var i;const n=t.entity_id.split(".")[1],s="ppfd"===e?"ppfd_mol":"total_ppfd"===e?"total_ppfd_mol_integral":e,o=null===(i=this._hass)||void 0===i?void 0:i.states[`sensor.${n}_${s}`];return o?Number(o.state):0}getSensorRange(t){const e=this.plantEntities.map((e=>this.getSensorValue(e,t))),i=this.getSensorUnit(t);return{min:Math.min(...e),max:Math.max(...e),unit:i}}getSensorUnit(t){var e,i;if(!this.plantEntities.length)return"";const n=this.plantEntities[0].entity_id.split(".")[1],s="ppfd"===t?"ppfd_mol":"total_ppfd"===t?"total_ppfd_mol_integral":t,o=null===(e=this._hass)||void 0===e?void 0:e.states[`sensor.${n}_${s}`];return(null===(i=null==o?void 0:o.attributes)||void 0===i?void 0:i.unit_of_measurement)||""}renderFilterContent(t){return t.id===this.getVisibleColumns()[0].id?o.html`
                <div class="filter-group entity-type-filter">
                    <div class="filter-header">Entity Typ</div>
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${this._entityTypes.has("plant")}
                            @change=${()=>this.toggleEntityType("plant")}
                        >
                        Pflanzen
                    </label>
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${this._entityTypes.has("cycle")}
                            @change=${()=>this.toggleEntityType("cycle")}
                        >
                        Cycles
                    </label>
                </div>
                ${this.renderColumnFilter(t)}
            `:this.renderColumnFilter(t)}renderColumnFilter(t){if(this.isSensorColumn(t.id)){const e=this.getSensorRange(t.id),i=this._activeFilters[t.id]||e;return o.html`
                <div class="filter-range">
                    <div class="filter-header">${t.name}</div>
                    <div class="filter-range-inputs">
                        <input
                            class="filter-input"
                            type="number"
                            .value=${i.min}
                            @change=${i=>{var n;const s=i.target,o=Number(s.value);this.toggleFilter(t.id,{min:o,max:(null===(n=this._activeFilters[t.id])||void 0===n?void 0:n.max)||e.max})}}
                            step="0.1"
                        >
                        <span>bis</span>
                        <input
                            class="filter-input"
                            type="number"
                            .value=${i.max}
                            @change=${i=>{var n;const s=i.target,o=Number(s.value);this.toggleFilter(t.id,{min:(null===(n=this._activeFilters[t.id])||void 0===n?void 0:n.min)||e.min,max:o})}}
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
        `}toggleEntityType(t){this._entityTypes.has(t)?this._entityTypes.size>1&&this._entityTypes.delete(t):this._entityTypes.add(t),this.requestUpdate()}static get styles(){return o.css`
            ${a.style}

            .filter-sidebar {
                padding: 16px;
                border-right: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
                max-height: calc(100vh - 200px);
                overflow-y: auto;
                overflow-x: hidden;
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }

            .entity-type-filter {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
            }

            .filter-sidebar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .filter-sidebar::-webkit-scrollbar-track {
                background: transparent;
            }

            .filter-sidebar::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .filter-sidebar::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .table-container {
                overflow-x: auto;
                overflow-y: auto;
                max-height: calc(100vh - 200px);
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }

            .table-container::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .table-container::-webkit-scrollbar-track {
                background: transparent;
            }

            .table-container::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .table-container::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .plant-name {
                display: flex;
                align-items: center;
                gap: 8px;
                max-width: 100%;
                min-height: 32px;
            }

            .plant-name img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
            }

            .plant-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                padding: 0;
                margin: 0;
            }

            .plant-icon ha-icon {
                --mdc-icon-size: 20px;
                color: var(--text-primary-color, white);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                margin: 0;
                padding: 0;
            }
        `}};n([(0,r.property)()],d.prototype,"_hass",void 0),n([(0,r.property)()],d.prototype,"config",void 0),n([(0,r.state)()],d.prototype,"_sortColumn",void 0),n([(0,r.state)()],d.prototype,"_sortDirection",void 0),n([(0,r.state)()],d.prototype,"_editingCell",void 0),n([(0,r.state)()],d.prototype,"_plantInfo",void 0),n([(0,r.state)()],d.prototype,"_searchQuery",void 0),n([(0,r.state)()],d.prototype,"_multiSelectMode",void 0),n([(0,r.state)()],d.prototype,"_selectedPlants",void 0),n([(0,r.state)()],d.prototype,"_filterMode",void 0),n([(0,r.state)()],d.prototype,"_activeFilters",void 0),n([(0,r.state)()],d.prototype,"_entityTypes",void 0),d=n([(0,r.customElement)("flower-list-card")],d),e.default=d},800:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const n=i(437);e.style=n.css`
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
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
.header > img.fade {
  opacity: 0;
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
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
.header-compact > img.fade {
  opacity: 0;
}
.header > #name {
  font-weight: bold;
  width: fit-content;
  max-width: calc(100% - 150px);
  margin-top: 16px;
  text-transform: capitalize;
  display: block;
  margin-left: 132px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header-compact > #name {
  font-weight: bold;
  width: calc(100% - 74px);
  margin-top: 8px;
  text-transform: capitalize;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  display: none;
}
.header > #metrics-container ha-icon,
.header > #status-container ha-icon {
  margin-right: 4px;
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
  overflow-y: auto;
  margin: 0 16px;
  padding: 0;
  flex: 1;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-color, rgba(194, 194, 194, 0.4)) transparent;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-color, rgba(194, 194, 194, 0.4));
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-corner {
  background: transparent;
}

.table-container.filtered {
  margin-left: 282px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  color: var(--primary-text-color);
  table-layout: auto;
}
thead {
  position: sticky;
  top: 0;
  background: var(--card-background-color);
  z-index: 1;
}
th {
  padding: 12px 16px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 1px solid var(--divider-color);
  user-select: none;
  height: 26px;
  line-height: 26px;
}
th:hover {
  background-color: var(--secondary-background-color);
}
td, th {
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
  margin-left: 4px;
}
.card-header {
  padding: 0px 16px;
  margin: 0 16px;
  border-bottom: 1px solid var(--divider-color);
  flex-shrink: 0;
}
.card-header .name {
  font-size: 16px;
  font-weight: bold;
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
    flex-shrink: 0;
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
ha-card {
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  max-height: 100%;
}

// Specific flower-list-card styles
.table-container .meter-container {
    display: flex;
    gap: 2px;
    width: 120px;
    flex-shrink: 0;
}
.table-container .meter {
    height: 8px;
    background-color: var(--primary-background-color);
    border-radius: 2px;
    display: inline-grid;
    overflow: hidden;
}
.table-container .meter.red {
    flex-grow: 1;
    margin-right: 2px;
    max-width: 5%
}
.table-container .meter.green {
    flex-grow: 10;
    margin-right: 2px;
    max-width: 90%
}

.expander {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12px;
  cursor: pointer;
  border-top: 1px solid rgba(114, 114, 114, 0.25);
  line-height: 0;
}

.expander ha-icon {
  color: var(--primary-text-color);
  opacity: 0.5;
  width: 12px;
  height: 12px;
  --mdc-icon-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(0deg);
  transition: transform 0.2s ease-in-out;
}

.expander.expanded ha-icon {
  transform: rotate(180deg);
}

.expanded-content {
  padding: 8px;
}

.consumption-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

.consumption-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 4px;
  background: var(--card-background-color, var(--ha-card-background));
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.consumption-item:first-child {
  grid-column: auto;
}

.consumption-item:hover {
  background: var(--primary-background-color);
}

.consumption-item ha-icon {
  color: var(--primary-text-color);
  opacity: 0.7;
  width: 20px;
  height: 20px;
}

.consumption-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.consumption-details .label {
  font-size: 0.8em;
  color: var(--primary-text-color);
  opacity: 0.7;
}

.consumption-details .value {
  font-size: 0.9em;
  font-weight: bold;
}

.plant-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(114, 114, 114, 0.25);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  padding-left: 8px;
  padding-right: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item .label {
  font-size: 0.8em;
  color: var(--primary-text-color);
  opacity: 0.7;
}

.detail-item .value {
  font-size: 0.9em;
  word-break: break-word;
  white-space: pre-wrap;
}

.detail-item .link {
  color: var(--primary-color);
  text-decoration: none;
}

.detail-item .link:hover {
  text-decoration: underline;
}

.detail-item ha-icon {
  color: var(--primary-text-color);
  opacity: 0.7;
  width: 20px;
  height: 20px;
}

.gallery-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
}

.gallery-content {
    position: relative;
    width: 95%;
    height: 95%;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow: hidden;
    max-height: 95vh;
}

.gallery-header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    color: white;
    z-index: 2;
    position: relative;
}

.gallery-date {
    font-size: 0.85em;
    white-space: pre-line;
    line-height: 1.4;
    text-align: left;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 12px;
    border-radius: 4px;
    max-width: 60%;
    position: absolute;
    left: 16px;
    right: 140px;
    z-index: 1;
    font-weight: normal;
}

.gallery-date .phase,
.gallery-date .day,
.gallery-date .total {
    font-weight: bold;
}

.gallery-header-buttons {
    display: flex;
    gap: 4px;
    align-items: center;
    position: relative;
    z-index: 2;
    margin-left: auto;
}

.upload-button {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.upload-button ha-icon-button {
    --mdc-icon-button-size: 48px;
    --mdc-icon-size: 24px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.upload-button:hover {
    opacity: 0.8;
}

.gallery-image-container {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 0;
    padding: 0 24px;
    min-height: 0;
}

.gallery-image-container a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.gallery-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
    cursor: zoom-in;
}

.gallery-image.fade {
    opacity: 0;
}

.gallery-thumbnails {
    flex: 0 0 140px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
}

.thumbnails-scroll {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding: 4px;
    height: 124px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.thumbnail-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.thumbnail-group-label {
    color: white;
    font-size: 0.9em;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 2px;
}

.thumbnail-group-images {
    display: flex;
    gap: 8px;
    height: 92px;
}

.thumbnail-container {
    position: relative;
    flex: 0 0 auto;
    height: 80px;
    aspect-ratio: 1;
    padding: 2px;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.thumbnail-day {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.8em;
    padding: 1px 6px;
    border-radius: 3px;
    white-space: nowrap;
}

.thumbnail-container:hover {
    border-color: rgba(255, 255, 255, 0.5);
}

.thumbnail-container.active {
    border-color: var(--primary-color, #03a9f4);
}

.thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
}

.gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    --mdc-icon-button-size: 48px;
    --mdc-icon-size: 36px;
    color: white;
    z-index: 2;
}

.gallery-nav:hover {
    background: rgba(0, 0, 0, 0.8);
}

.gallery-nav.prev {
    left: 8px;
}

.gallery-nav.next {
    right: 8px;
}

.gallery-nav ha-icon {
    width: 36px;
    height: 36px;
    color: white;
}

.gallery-header ha-icon-button {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.gallery-header ha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    text-align: center;
    margin: 0 auto;
}

.thumbnails-scroll::-webkit-scrollbar {
    height: 6px;
}

.thumbnails-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.thumbnails-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
}

.upload-dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-dialog {
    background: var(--card-background-color);
    border-radius: 8px;
    width: 300px;
    max-width: 90%;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.upload-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--divider-color);
}

.upload-dialog-header span {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--primary-text-color);
}

.upload-dialog-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.upload-option {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--primary-text-color);
}

.upload-option:hover {
    background: var(--secondary-background-color);
}

.upload-option ha-icon {
    --mdc-icon-size: 24px;
    color: var(--primary-text-color);
}

.upload-option span {
    font-size: 1em;
}

/* Flyout Menu Styles */
.flyout-container {
  position: relative;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

/* Transform states for first container */
.flyout-container:first-child {
  transform: translateX(0);
}

.flyout-container:first-child.delete-open,
.flyout-container:first-child.main-open {
  transform: translateX(-31px);
}

.flyout-container:first-child.delete-open.main-open {
  transform: translateX(-62px);
}

/* Transform states for second container */
.flyout-container:nth-child(2).delete-open,
.flyout-container:nth-child(2).main-open {
  transform: translateX(-31px);
}

.flyout-container:nth-child(2).delete-open.main-open {
  transform: translateX(-62px);
}

/* General transform states */
.flyout-container.delete-open,
.flyout-container.main-open {
  transform: translateX(-31px);
}

.flyout-container.delete-open.main-open {
  transform: translateX(-62px);
}

.flyout-menu {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  background: var(--card-background-color);
  border-radius: 4px;
  padding: 2px;
  display: flex;
  gap: 2px;
  box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
}

.flyout-container.open .flyout-menu {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
  visibility: visible;
}

.flyout-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.flyout-option ha-icon-button {
  --mdc-icon-button-size: 32px;
  --mdc-icon-size: 18px;
  color: var(--primary-text-color);
}

.add-button,
.delete-button,
.main-button,
.confirm-delete,
.confirm-main {
  --mdc-icon-button-size: 32px;
  --mdc-icon-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.add-button {
  transition: transform 0.2s ease-in-out;
}

.flyout-container.open .add-button {
  transform: rotate(45deg);
}

.delete-button:hover,
.main-button:hover,
.confirm-delete:hover,
.confirm-main:hover {
  opacity: 0.8;
}

.confirm-delete {
  color: var(--error-color, #db4437);
}

.confirm-main {
  color: var(--primary-color, #03a9f4);
}

.no-images-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--secondary-text-color);
  gap: 16px;
}

.no-images-message ha-icon {
  --mdc-icon-size: 64px;
  opacity: 0.5;
}

.main-button {
  --mdc-icon-button-size: 32px;
  --mdc-icon-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.main-button:hover {
  opacity: 0.8;
}

.confirm-main:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .gallery-date {
    right: 120px;
  }
}

@media (max-width: 400px) {
  .gallery-date {
    right: 100px;
  }
}

/* Timeline Styles */
.timeline-container {
  margin: 8px 16px 0;
  padding: 16px 16px 0;
  background: var(--card-background-color, #fff);
  box-shadow: var(--ha-card-box-shadow, none);
}

.timeline {
  position: relative;
  width: 100%;
  height: 120px;
  margin: 4px 0;
}

.timeline-labels {
  position: relative;
  height: 20px;
  margin-bottom: 8px;
}

.timeline-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: var(--primary-text-color);
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  line-height: 1.2em;
  bottom: 0;
}

.timeline-label.offset-up {
  transform: translateX(-50%) translateY(-100%);
}

.timeline-label.offset-up-2 {
  transform: translateX(-50%) translateY(-200%);
}

.timeline-label.offset-down {
  transform: translateX(-50%) translateY(0);
}

.timeline-events {
  position: relative;
  height: 30px;
  background: var(--secondary-background-color);
  overflow: visible;
}

.timeline-event {
  position: absolute;
  height: 100%;
  top: 0;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  color: var(--text-primary-color);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.timeline-event:hover {
  filter: brightness(1.1);
}

.timeline-status {
  position: absolute;
  height: 4px;
  background: transparent;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.timeline-status-indicator {
  position: absolute;
  height: 100%;
  bottom: 0;
}

.timeline-status-problem {
  background-color: var(--error-color, #db4437);
}

.timeline-status-unknown {
  background-color: var(--disabled-text-color, #bdbdbd);
}

.timeline-markers {
  position: relative;
  height: 20px;
  margin-top: 8px;
}

.timeline-marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7em;
  color: var(--secondary-text-color);
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  line-height: 1.2em;
  top: 0;
}

.timeline-marker.offset-up {
  transform: translateX(-50%) translateY(0);
}

.timeline-marker.offset-down {
  transform: translateX(-50%) translateY(100%);
}

.timeline-marker.offset-down-2 {
  transform: translateX(-50%) translateY(200%);
}

/* Gallery Styles */
.gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.gallery-content {
  position: relative;
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  max-height: 95vh;
}

.gallery-header {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: white;
  z-index: 2;
  position: relative;
}

.gallery-date {
  font-size: 0.85em;
  white-space: pre-line;
  line-height: 1.4;
  text-align: left;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 60%;
  position: absolute;
  left: 16px;
  right: 140px;
  z-index: 1;
  font-weight: normal;
}

.gallery-date .phase,
.gallery-date .day,
.gallery-date .total {
  font-weight: bold;
}

.gallery-header-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-left: auto;
}

/* Responsive Styles */
@media (max-width: 600px) {
  .header > .unit {
    display: none;
  }
  .gallery-date {
    right: 120px;
  }
}

@media (max-width: 400px) {
  .gallery-date {
    right: 100px;
  }
}
`},752:(t,e,i)=>{var n;i.d(e,{JW:()=>A,XX:()=>q,c0:()=>E,ge:()=>I,qy:()=>S,s6:()=>C});const s=window,o=s.trustedTypes,r=o?o.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,d="?"+l,c=`<${d}>`,h=document,p=()=>h.createComment(""),u=t=>null===t||"object"!=typeof t&&"function"!=typeof t,m=Array.isArray,g=t=>m(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v="[ \t\n\f\r]",_=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,f=/-->/g,b=/>/g,y=RegExp(`>|${v}(?:([^\\s"'>=/]+)(${v}*=${v}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),x=/'/g,w=/"/g,$=/^(?:script|style|textarea|title)$/i,k=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),S=k(1),A=k(2),E=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),z=new WeakMap,P=h.createTreeWalker(h,129,null,!1);function T(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==r?r.createHTML(e):e}const M=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":"",r=_;for(let e=0;e<i;e++){const i=t[e];let d,h,p=-1,u=0;for(;u<i.length&&(r.lastIndex=u,h=r.exec(i),null!==h);)u=r.lastIndex,r===_?"!--"===h[1]?r=f:void 0!==h[1]?r=b:void 0!==h[2]?($.test(h[2])&&(s=RegExp("</"+h[2],"g")),r=y):void 0!==h[3]&&(r=y):r===y?">"===h[0]?(r=null!=s?s:_,p=-1):void 0===h[1]?p=-2:(p=r.lastIndex-h[2].length,d=h[1],r=void 0===h[3]?y:'"'===h[3]?w:x):r===w||r===x?r=y:r===f||r===b?r=_:(r=y,s=void 0);const m=r===y&&t[e+1].startsWith("/>")?" ":"";o+=r===_?i+c:p>=0?(n.push(d),i.slice(0,p)+a+i.slice(p)+l+m):i+l+(-2===p?(n.push(void 0),e):m)}return[T(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),n]};class U{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,r=0;const c=t.length-1,h=this.parts,[u,m]=M(t,e);if(this.el=U.createElement(u,i),P.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=P.nextNode())&&h.length<c;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith(a)||e.startsWith(l)){const i=m[r++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+a).split(l),e=/([.?@])?(.*)/.exec(i);h.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?D:"?"===e[1]?R:"@"===e[1]?B:L})}else h.push({type:6,index:s})}for(const e of t)n.removeAttribute(e)}if($.test(n.tagName)){const t=n.textContent.split(l),e=t.length-1;if(e>0){n.textContent=o?o.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],p()),P.nextNode(),h.push({type:2,index:++s});n.append(t[e],p())}}}else if(8===n.nodeType)if(n.data===d)h.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(l,t+1));)h.push({type:7,index:s}),t+=l.length-1}s++}}static createElement(t,e){const i=h.createElement("template");return i.innerHTML=t,i}}function N(t,e,i=t,n){var s,o,r,a;if(e===E)return e;let l=void 0!==n?null===(s=i._$Co)||void 0===s?void 0:s[n]:i._$Cl;const d=u(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,n)),void 0!==n?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[n]=l:i._$Cl=l),void 0!==l&&(e=N(t,l._$AS(t,e.values),l,n)),e}class j{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:n}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:h).importNode(i,!0);P.currentNode=s;let o=P.nextNode(),r=0,a=0,l=n[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new O(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new H(o,this,t)),this._$AV.push(e),l=n[++a]}r!==(null==l?void 0:l.index)&&(o=P.nextNode(),r++)}return P.currentNode=h,s}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class O{constructor(t,e,i,n){var s;this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=null===(s=null==n?void 0:n.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),u(t)?t===C||null==t||""===t?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):g(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==C&&u(this._$AH)?this._$AA.nextSibling.data=t:this.$(h.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:n}=t,s="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=U.createElement(T(n.h,n.h[0]),this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(i);else{const t=new j(s,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new U(t)),e}T(t){m(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new O(this.k(p()),this.k(p()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class L{constructor(t,e,i,n,s){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=N(this,t,e,0),o=!u(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const n=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=N(this,n[i+r],e,r),a===E&&(a=this._$AH[r]),o||(o=!u(a)||a!==this._$AH[r]),a===C?t=C:t!==C&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}o&&!n&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class D extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}}const F=o?o.emptyScript:"";class R extends L{constructor(){super(...arguments),this.type=4}j(t){t&&t!==C?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class B extends L{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=N(this,t,e,0))&&void 0!==i?i:C)===E)return;const n=this._$AH,s=t===C&&n!==C||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==C&&(n===C||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class H{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}}const I={O:a,P:l,A:d,C:1,M,L:j,R:g,D:N,I:O,V:L,H:R,N:B,U:D,F:H},W=s.litHtmlPolyfillSupport;null==W||W(U,O),(null!==(n=s.litHtmlVersions)&&void 0!==n?n:s.litHtmlVersions=[]).push("2.8.0");const q=(t,e,i)=>{var n,s;const o=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let r=o._$litPart$;if(void 0===r){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;o._$litPart$=r=new O(e.insertBefore(p(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>n,eventOptions:()=>d,property:()=>r,query:()=>c,queryAll:()=>h,queryAssignedElements:()=>g,queryAssignedNodes:()=>v,queryAsync:()=>p,state:()=>a});const n=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){customElements.define(t,e)}}})(t,e),s=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},o=(t,e,i)=>{e.constructor.createProperty(i,t)};function r(t){return(e,i)=>void 0!==i?o(t,e,i):s(t,e)}function a(t){return r({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,n)=>{var s;if(void 0===n){const n=null!==(s=i.originalKey)&&void 0!==s?s:i.key,o=null!=e?{kind:"method",placement:"prototype",key:n,descriptor:e(i.key)}:{...i,key:n};return null!=t&&(o.finisher=function(e){t(e,n)}),o}{const s=i.constructor;void 0!==e&&Object.defineProperty(i,n,e(n)),null==t||t(s,n)}};function d(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function c(t,e){return l({descriptor:i=>{const n={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;n.get=function(){var i,n;return void 0===this[e]&&(this[e]=null!==(n=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==n?n:null),this[e]}}return n}})}function h(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function p(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var u;const m=null!=(null===(u=window.HTMLSlotElement)||void 0===u?void 0:u.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function g(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:n=>({get(){var n;const s="slot"+(e?`[name=${e}]`:":not([name])"),o=null===(n=this.renderRoot)||void 0===n?void 0:n.querySelector(s),r=null!=o?m(o,t):[];return i?r.filter((t=>t.matches(i))):r},enumerable:!0,configurable:!0})})}function v(t,e,i){let n,s=t;return"object"==typeof t?(s=t.slot,n=t):n={flatten:e},i?g({slot:s,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(s?`[name=${s}]`:":not([name])"),o=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==o?void 0:o.assignedNodes(n))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},437:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>a,LitElement:()=>A,ReactiveElement:()=>x,UpdatingElement:()=>S,_$LE:()=>C,_$LH:()=>k.ge,adoptStyles:()=>c,css:()=>d,defaultConverter:()=>_,getCompatibleStyle:()=>h,html:()=>k.qy,isServer:()=>z,noChange:()=>k.c0,notEqual:()=>f,nothing:()=>k.s6,render:()=>k.XX,supportsAdoptingStyleSheets:()=>s,svg:()=>k.JW,unsafeCSS:()=>l});const n=window,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new a("string"==typeof t?t:t+"",void 0,o),d=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new a(i,t,o)},c=(t,e)=>{s?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=n.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))},h=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var p;const u=window,m=u.trustedTypes,g=m?m.emptyScript:"",v=u.reactiveElementPolyfillSupport,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>e!==t&&(e==e||t==t),b={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:f},y="finalized";class x extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const n=this._$Ep(i,e);void 0!==n&&(this._$Ev.set(n,i),t.push(n))})),t}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const s=this[t];this[e]=n,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||b}static finalize(){if(this.hasOwnProperty(y))return!1;this[y]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return c(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=b){var n;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==(null===(n=i.converter)||void 0===n?void 0:n.toAttribute)?i.converter:_).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,s=n._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=n.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:_;this._$El=s,this[s]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||f)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}x[y]=!0,x.elementProperties=new Map,x.elementStyles=[],x.shadowRootOptions={mode:"open"},null==v||v({ReactiveElement:x}),(null!==(p=u.reactiveElementVersions)&&void 0!==p?p:u.reactiveElementVersions=[]).push("1.6.3");var w,$,k=i(752);const S=x;class A extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,k.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return k.c0}}A.finalized=!0,A._$litElement$=!0,null===(w=globalThis.litElementHydrateSupport)||void 0===w||w.call(globalThis,{LitElement:A});const E=globalThis.litElementPolyfillSupport;null==E||E({LitElement:A});const C={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==($=globalThis.litElementVersions)&&void 0!==$?$:globalThis.litElementVersions=[]).push("3.3.3");const z=!1},330:t=>{t.exports=JSON.parse('{"name":"flower-card","version":"3.0.0","description":"A Lovelace flower card for Home Assistant","main":"flower-card.js","repository":{"type":"git","url":"git+ssh://git@github.com/Olen/lovelace-flower-card.git"},"author":"Ola Bjorling Erdal <ola@bjorling.se>","license":"MIT","scripts":{"build":"webpack -c webpack.config.js","lint":"eslint src/**/*.ts","watch":"webpack -c webpack.config.js --watch --mode=development"},"dependencies":{"@marcokreeft/ha-editor-formbuilder":"2024.9.1","custom-card-helpers":"^1.9.0","home-assistant-js-websocket":"^9.4.0","lit":"^2.8.0","lit-element":"^2.5.1"},"devDependencies":{"@babel/core":"^7.26.0","@babel/preset-env":"^7.26.0","@babel/preset-typescript":"^7.26.0","@types/node":"^20.11.30","@typescript-eslint/eslint-plugin":"^8.19.1","babel-loader":"^9.1.3","compression-webpack-plugin":"^11.1.0","eslint":"^8.57.0","ts-loader":"^9.5.2","typescript":"^5.7.3","webpack":"^5.97.1","webpack-cli":"^5.1.4"},"keywords":[],"bugs":{"url":"https://github.com/Olen/lovelace-flower-card/issues"},"homepage":"https://github.com/Olen/lovelace-flower-card#readme"}')}},e={};function i(n){var s=e[n];if(void 0!==s)return s.exports;var o=e[n]={exports:{}};return t[n].call(o.exports,o,o.exports,i),o.exports}i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(45)})();