/*! For license information please see brokkoli-area-card.js.LICENSE.txt */
(()=>{"use strict";var t={434:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},n=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.default_show_labels=e.default_show_rings=e.AREA_CARD_EDITOR_NAME=e.AREA_CARD_NAME=void 0;const o=i(437),r=i(924),a=i(73);i(446);const l=i(63),c=i(442);i(242),e.AREA_CARD_NAME="brokkoli-area-card",e.AREA_CARD_EDITOR_NAME="brokkoli-area-card-editor",e.default_show_rings=["health","moisture","temperature"],e.default_show_labels=[],window.customCards=window.customCards||[],window.customCards.push({type:e.AREA_CARD_NAME,name:"Brokkoli Area Card",preview:!0,description:"Zeigt die Positionen von Pflanzen in einem Bereich an"});let h=class extends o.LitElement{constructor(){super(...arguments),this._handleEntitySelected=t=>{var e;this._selectedEntityId=t.detail.entityId;const i=t.detail.selectedEntities||[];if(null===(e=this.config)||void 0===e?void 0:e.identifier){const e=new CustomEvent("brokkoli-card-entity-selected",{bubbles:!0,composed:!0,detail:{sourceIdentifier:this.config.identifier,selectedEntityId:t.detail.entityId,selectedEntities:i.length?i:t.detail.entityId?[t.detail.entityId]:[]}});window.dispatchEvent(e)}}}setConfig(t){var i;if(!t.area&&!t.entity&&!(null===(i=t.entities)||void 0===i?void 0:i.length))throw new Error("Du musst mindestens eine Area, eine Entität oder eine Liste von Entitäten definieren");this.config=Object.assign(Object.assign({},t),{show_rings:t.show_rings||[...e.default_show_rings],show_labels:t.show_labels||[],legend:void 0===t.legend||t.legend})}set hass(t){this._hass=t}static getConfigElement(){return n(this,void 0,void 0,(function*(){return document.createElement(e.AREA_CARD_EDITOR_NAME)}))}static getStubConfig(t){return{type:"custom:brokkoli-area-card",title:"Pflanzen-Bereich",area:"wohnzimmer"}}_getAllPlantEntities(){return this._hass?l.PlantEntityUtils.getPlantEntities(this._hass,"plant").map((t=>t.entity_id)):[]}_getPlantEntitiesInArea(t){return this._hass?l.PlantEntityUtils.getPlantEntities(this._hass,"plant").filter((e=>{const i=c.FilterUtils.getAreaForEntity(this._hass,e.entity_id);return i&&i.toLowerCase()===t.toLowerCase()})).map((t=>t.entity_id)):[]}render(){if(!this.config||!this._hass)return o.html``;let t=[];if(this.config.area?(t=this._getPlantEntitiesInArea(this.config.area),0===t.length&&(t=this._getAllPlantEntities())):t=this._getAllPlantEntities(),this.config.entity&&t.push(this.config.entity),this.config.entities&&(t=[...t,...this.config.entities]),0===t.length)return o.html`
        <hui-warning>
          Keine Pflanzen-Entitäten gefunden
        </hui-warning>
      `;const e=t.filter((t=>this._hass.states[t]));return 0===e.length?o.html`
        <hui-warning>
          Keine gültigen Pflanzen-Entitäten gefunden
        </hui-warning>
      `:o.html`
      <ha-card>
        ${this.config.title?o.html`<h1 class="card-header">${this.config.title}</h1>`:""}
        <div class="card-content no-padding">
          <brokkoli-area
            .hass=${this._hass}
            .entities=${e}
            .areaId=${this.config.area||""}
            .showRings=${this.config.show_rings}
            .showLabels=${this.config.show_labels}
            .heatmap=${this.config.heatmap}
            .heatmapColor=${this.config.heatmap_color}
            .heatmapSecondaryColor=${this.config.heatmap_secondary_color}
            .heatmapOpacity=${this.config.heatmap_opacity}
            .showLegend=${this.config.legend}
          ></brokkoli-area>
        </div>
      </ha-card>
    `}getCardSize(){return 3}static get styles(){return o.css`
      ${a.positionStyles}
      
      .no-padding {
        padding: 0 !important;
      }
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("request-area-id",(t=>{t.detail&&"function"==typeof t.detail.callback&&t.detail.callback(this.config.area||"")})),this.addEventListener("brokkoli-area-entity-selected",this._handleEntitySelected)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("brokkoli-area-entity-selected",this._handleEntitySelected)}};s([(0,r.property)({attribute:!1})],h.prototype,"_hass",void 0),s([(0,r.property)()],h.prototype,"config",void 0),s([(0,r.state)()],h.prototype,"_error",void 0),s([(0,r.state)()],h.prototype,"_selectedEntityId",void 0),h=s([(0,r.customElement)(e.AREA_CARD_NAME)],h),e.default=h},814:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};Object.defineProperty(e,"__esModule",{value:!0}),e.BrokkoliAreaLegend=void 0;const n=i(437),o=i(924),r=i(278),a=i(621),l=[{id:"temperature",name:"Temperatur"},{id:"moisture",name:"Feuchtigkeit"},{id:"conductivity",name:"Leitfähigkeit"},{id:"dli",name:"Licht (DLI)"},{id:"health",name:"Gesundheit"},{id:"humidity",name:"Luftfeuchtigkeit"},{id:"illuminance",name:"Helligkeit"},{id:"water_consumption",name:"Wasserverbrauch"},{id:"fertilizer_consumption",name:"Düngerverbrauch"},{id:"power_consumption",name:"Stromverbrauch"}];let c=class extends n.LitElement{constructor(){super(...arguments),this.initialShowRings=[],this.initialShowLabels=[],this._activeTab="rings",this._selectedRings=[],this._selectedLabels=[],this._heatmapColor="#ff6666",this._heatmapSecondaryColor="#ffffff",this._heatmapOpacity=.8,this._isDraggingOpacity=!1,this._userChangedSettings=!1}firstUpdated(){this._selectedRings=[...this.initialShowRings],this._selectedLabels=[...this.initialShowLabels],this._heatmapSensor=this.initialHeatmap,this._heatmapColor=this._fixColorValue(this.initialHeatmapColor)||this._heatmapColor,this._heatmapSecondaryColor=this._fixColorValue(this.initialHeatmapSecondaryColor)||this._heatmapSecondaryColor,this._heatmapOpacity=void 0!==this.initialHeatmapOpacity?this.initialHeatmapOpacity:this._heatmapOpacity}updated(t){super.updated(t),(t.has("initialShowRings")||t.has("initialShowLabels")||t.has("initialHeatmap")||t.has("initialHeatmapColor")||t.has("initialHeatmapSecondaryColor")||t.has("initialHeatmapOpacity"))&&(this._userChangedSettings||(this._selectedRings=[...this.initialShowRings],this._selectedLabels=[...this.initialShowLabels],this._heatmapSensor=this.initialHeatmap,this._heatmapColor=this._fixColorValue(this.initialHeatmapColor)||this._heatmapColor,this._heatmapSecondaryColor=this._fixColorValue(this.initialHeatmapSecondaryColor)||this._heatmapSecondaryColor,this._heatmapOpacity=void 0!==this.initialHeatmapOpacity?this.initialHeatmapOpacity:this._heatmapOpacity))}_fixColorValue(t){if(t)return t.startsWith("#")?t:{red:"#ff0000",blue:"#0000ff"}[t.toLowerCase()]||t}_getIconForSensor(t){var e,i,s,n,o;return(null===(e=this.plantInfo)||void 0===e?void 0:e.result)&&(null===(i=this.plantInfo.result[t])||void 0===i?void 0:i.icon)?this.plantInfo.result[t].icon:"health"===t&&(null===(o=null===(n=null===(s=this.plantInfo)||void 0===s?void 0:s.result)||void 0===n?void 0:n.helpers)||void 0===o?void 0:o.health)?"mdi:heart-pulse":{temperature:"mdi:thermometer",moisture:"mdi:water-percent",conductivity:"mdi:flash",dli:"mdi:white-balance-sunny",health:"mdi:heart-pulse",humidity:"mdi:water",illuminance:"mdi:brightness-5",water_consumption:"mdi:cup-water",fertilizer_consumption:"mdi:fertilizer",power_consumption:"mdi:flash-circle",ph:"mdi:ph"}[t]||"mdi:help-circle-outline"}_stopEvent(t){t.stopPropagation()}_cycleTab(t){t.stopPropagation(),"rings"===this._activeTab?this._activeTab="labels":"labels"===this._activeTab?this._activeTab="heatmap":this._activeTab="rings",this.requestUpdate()}_handleRingChange(t,e){t.stopPropagation(),this._userChangedSettings=!0,this._selectedRings.includes(e)?this._selectedRings=this._selectedRings.filter((t=>t!==e)):this._selectedRings.push(e),this._dispatchSettingsChanged()}_handleLabelChange(t,e){t.stopPropagation(),this._userChangedSettings=!0,this._selectedLabels.includes(e)?this._selectedLabels=this._selectedLabels.filter((t=>t!==e)):this._selectedLabels.push(e),this._dispatchSettingsChanged()}_handleHeatmapSensorChange(t,e){t.stopPropagation(),this._userChangedSettings=!0,this._heatmapSensor===e?this._heatmapSensor=null:this._heatmapSensor=e,this._dispatchSettingsChanged()}_handleColorChange(t,e){t.stopPropagation(),this._userChangedSettings=!0;const i=t.target;e?this._heatmapColor=i.value:this._heatmapSecondaryColor=i.value,this._dispatchSettingsChanged()}_handleOpacityDragStart(t){t.stopPropagation(),t.preventDefault(),this._isDraggingOpacity=!0,this._updateOpacityFromMouseEvent(t);const e=t=>this._updateOpacityFromMouseEvent(t),i=()=>{this._isDraggingOpacity=!1,window.removeEventListener("mousemove",e),window.removeEventListener("mouseup",i)};window.addEventListener("mousemove",e),window.addEventListener("mouseup",i)}_updateOpacityFromMouseEvent(t){var e;if(!this._isDraggingOpacity)return;const i=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".gradient-preview");if(!i)return;const s=i.getBoundingClientRect(),n=t.clientX-s.left,o=s.width,r=Math.max(0,Math.min(1,n/o));this._heatmapOpacity=r,this._userChangedSettings=!0,this._dispatchSettingsChanged()}_dispatchSettingsChanged(){const t={activeTab:this._activeTab,selectedRings:[...this._selectedRings],selectedLabels:[...this._selectedLabels],heatmapSensor:this._heatmapSensor,heatmapColor:this._heatmapColor||"#ff6666",heatmapSecondaryColor:this._heatmapSecondaryColor||"#ffffff",heatmapOpacity:void 0!==this._heatmapOpacity?this._heatmapOpacity:.8};this.dispatchEvent(new CustomEvent("settings-changed",{detail:t,bubbles:!0,composed:!0}))}_renderModeToggle(){let t,e;switch(this._activeTab){case"rings":t="mdi:circle-outline",e="Ringe-Modus aktiv, klicke für Labels";break;case"labels":t="mdi:label-outline",e="Labels-Modus aktiv, klicke für Heatmap";break;case"heatmap":t="mdi:gradient",e="Heatmap-Modus aktiv, klicke für Ringe"}return n.html`
      <button 
        class="mode-toggle" 
        title="${e}"
        @click=${this._cycleTab}
      >
        <ha-icon icon="${t}"></ha-icon>
      </button>
    `}_renderRingOptions(){return"rings"!==this._activeTab?n.html``:n.html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${l.map((t=>{const e=this._selectedRings.includes(t.id);return n.html`
            <div 
              class="sensor-icon ${e?"selected":""}"
              title="${t.name}"
              @click=${e=>this._handleRingChange(e,t.id)}
              style=${(0,r.styleMap)({backgroundColor:e?`var(--sensor-ring-${t.id}-color, var(--primary-color))`:"var(--secondary-background-color, #f5f5f5)"})}
            >
              <ha-icon 
                icon="${this._getIconForSensor(t.id)}"
                style=${(0,r.styleMap)({color:e?"white":`var(--sensor-ring-${t.id}-color, var(--primary-color))`})}
              ></ha-icon>
            </div>
          `}))}
      </div>
    `}_renderLabelOptions(){return"labels"!==this._activeTab?n.html``:n.html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${l.map((t=>{const e=this._selectedLabels.includes(t.id);return n.html`
            <div 
              class="sensor-icon ${e?"selected":""}"
              title="${t.name}"
              @click=${e=>this._handleLabelChange(e,t.id)}
              style=${(0,r.styleMap)({backgroundColor:e?`var(--sensor-ring-${t.id}-color, var(--primary-color))`:"var(--secondary-background-color, #f5f5f5)"})}
            >
              <ha-icon 
                icon="${this._getIconForSensor(t.id)}"
                style=${(0,r.styleMap)({color:e?"white":`var(--sensor-ring-${t.id}-color, var(--primary-color))`})}
              ></ha-icon>
            </div>
          `}))}
      </div>
    `}_renderHeatmapOptions(){return"heatmap"!==this._activeTab?n.html``:n.html`
      <div class="sensor-icons vertical" @click=${this._stopEvent}>
        ${l.map((t=>{const e=this._heatmapSensor===t.id;return n.html`
            <div 
              class="sensor-icon ${e?"selected":""}"
              title="${t.name}"
              @click=${e=>this._handleHeatmapSensorChange(e,t.id)}
              style=${(0,r.styleMap)({backgroundColor:e?`var(--sensor-ring-${t.id}-color, var(--primary-color))`:"var(--secondary-background-color, #f5f5f5)"})}
            >
              <ha-icon 
                icon="${this._getIconForSensor(t.id)}"
                style=${(0,r.styleMap)({color:e?"white":`var(--sensor-ring-${t.id}-color, var(--primary-color))`})}
              ></ha-icon>
            </div>
          `}))}
        
        <!-- Farbauswahl immer anzeigen, unabhängig vom Sensor-Status -->
        <div class="color-picker-section" @click=${this._stopEvent}>
          <div class="color-option">
            <input 
              type="color" 
              .value=${this._heatmapColor} 
              @change=${t=>this._handleColorChange(t,!0)}
              title="Primärfarbe"
            />
            <input 
              type="color" 
              .value=${this._heatmapSecondaryColor} 
              @change=${t=>this._handleColorChange(t,!1)}
              title="Sekundärfarbe"
            />
          </div>
          <div class="color-preview">
            <div 
              class="gradient-preview" 
              style=${(0,r.styleMap)({background:`linear-gradient(to right, ${this._heatmapColor||"#ff6666"}, ${this._heatmapSecondaryColor||"#ffffff"})`,cursor:"ew-resize"})}
              @mousedown=${this._handleOpacityDragStart}
              title="Deckkraft"
            ></div>
          </div>
        </div>
      </div>
    `}render(){return n.html`
      <div class="legend-container" @click=${this._stopEvent}>
        ${this._renderModeToggle()}
        
        <div class="content-container" @click=${this._stopEvent}>
          ${this._renderRingOptions()}
          ${this._renderLabelOptions()}
          ${this._renderHeatmapOptions()}
        </div>
      </div>
    `}static get styles(){return a.legendStyles}};e.BrokkoliAreaLegend=c,s([(0,o.property)({attribute:!1})],c.prototype,"hass",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialShowRings",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialShowLabels",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialHeatmap",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialHeatmapColor",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialHeatmapSecondaryColor",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"initialHeatmapOpacity",void 0),s([(0,o.property)({attribute:!1})],c.prototype,"plantInfo",void 0),s([(0,o.state)()],c.prototype,"_activeTab",void 0),s([(0,o.state)()],c.prototype,"_selectedRings",void 0),s([(0,o.state)()],c.prototype,"_selectedLabels",void 0),s([(0,o.state)()],c.prototype,"_heatmapSensor",void 0),s([(0,o.state)()],c.prototype,"_heatmapColor",void 0),s([(0,o.state)()],c.prototype,"_heatmapSecondaryColor",void 0),s([(0,o.state)()],c.prototype,"_heatmapOpacity",void 0),s([(0,o.state)()],c.prototype,"_isDraggingOpacity",void 0),e.BrokkoliAreaLegend=c=s([(0,o.customElement)("brokkoli-area-legend")],c)},446:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},n=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.BrokkoliArea=void 0;const o=i(437),r=i(924),a=i(278),l=i(73);i(242),i(814);const c=i(63);let h=class extends o.LitElement{constructor(){super(...arguments),this.entities=[],this.showRings=[],this.showLabels=[],this.showLegend=!0,this._userSettings={},this._positions={},this._draggingMember=null,this._hoveringMember=null,this._dragOffset={x:0,y:0},this._containerSize={width:0,height:0},this._cellSize=60,this._targetPosition=null,this._isSnapping=!1,this._currentDragPosition=null,this._originalPosition=null,this._wasElementSelected=!1,this._selectedMembers=new Set,this._isMultiDragging=!1,this._originalPositions={},this._targetPositions={},this._isDraggingSelection=!1,this._showSelectionHint=!1,this._justFinishedMultiDrag=!1,this._cycleGroups=[],this._bounds={minX:0,minY:0,maxX:0,maxY:0},this._showAddPlantIndicator=null,this._showAddPlantDialog=!1,this._newPlantPosition={x:0,y:0},this._debugMode=!1,this._highlightCell=null,this._plantInfoCache={},this._plantRetryTimeouts={},this._plantLastLoaded={},this._updateTimeout=0,this._boundHandleDrag=this._handleDrag.bind(this),this._boundEndDrag=this._endDrag.bind(this),this._handleResize=()=>{const t=this.getBoundingClientRect();this._containerSize={width:t.width,height:t.height},this._calculateCellSize(),this.requestUpdate()},this._handleGlobalClick=t=>{!t.composedPath().some((t=>t===this))&&!this._isDraggingSelection&&this._showAddPlantIndicator&&(this._showAddPlantIndicator=null,this.requestUpdate())},this._handlePlantCreated=t=>n(this,void 0,void 0,(function*(){if(!this.hass)return;const{entity_id:e,position:i}=t.detail;this._positions[e]=i,this._calculateBounds(),this._normalizePositions();const s=Object.entries(this._positions).map((([t,e])=>this._savePosition(t,e)));yield Promise.all(s),this._loadPositions()}))}firstUpdated(){const t=this.getBoundingClientRect();this._containerSize={width:t.width,height:t.height},this._loadPositions(),this._calculateCellSize(),window.addEventListener("resize",this._handleResize),setTimeout((()=>{const e=this.getBoundingClientRect();e.width===t.width&&e.height===t.height||(this._containerSize={width:e.width,height:e.height},this._calculateCellSize(),this.requestUpdate())}),100),window.addEventListener("click",this._handleGlobalClick),this.addEventListener("plant-created",this._handlePlantCreated)}updated(t){super.updated(t),(t.has("hass")||t.has("entities"))&&this._loadPositions(),this._updateCycleGroups(),(t.has("entities")||t.has("hass")&&!t.get("hass"))&&this._loadAllPlantData()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._handleResize),window.removeEventListener("click",this._handleGlobalClick),this.removeEventListener("plant-created",this._handlePlantCreated),this._updateTimeout&&(clearTimeout(this._updateTimeout),this._updateTimeout=0)}_loadPositions(){if(!this.hass)return;const t=new Set,e=[];this.entities.forEach((i=>{const s=i.split(".")[1],n=s.match(/(.+?)(_\d+)?$/),o=`text.${n?n[1]:s}_location${n&&n[2]?n[2]:""}`,r=this.hass.states[o];let a=!1;if(r&&r.state&&"unknown"!==r.state)try{const e=JSON.parse(r.state);if(e&&"number"==typeof e.x&&"number"==typeof e.y){const s={x:e.x,y:e.y};return this._positions[i]=s,t.add(`${s.x},${s.y}`),void(a=!0)}}catch(t){}this._positions[i]={x:0,y:0},a||e.push(i)})),e.length>0&&this._distributeUndefinedPositionEntities(e,t),this._identifyCycleGroups(),this._calculateBounds(),this._normalizePositions()}_distributeUndefinedPositionEntities(t,e){if(0===t.length)return;const i=[[1,0],[0,1],[-1,0],[0,-1]];let s=0,n=0,o=0,r=1,a=0,l=0;t.forEach((t=>{let c=!1;for(;!c;){const h=`${s},${n}`;e.has(h)?(s+=i[o][0],n+=i[o][1],a++,a===r&&(o=(o+1)%4,a=0,l++,2===l&&(r++,l=0))):(this._positions[t]={x:s,y:n},e.add(h),c=!0)}}))}_identifyCycleGroups(){if(!this.hass||!this.entities||0===this.entities.length)return void(this._cycleGroups=[]);const t={};this.entities.forEach((e=>{const i={entity_id:e},s=this._getEntityCycleName(i);s&&(t[s]||(t[s]=[]),t[s].push(e))})),this._cycleGroups=Object.entries(t).filter((([t,e])=>e.length>=2)).map((([t,e])=>({name:t,color:this._getColorForCycle(t),members:e,positions:e.map((t=>this._positions[t])).filter(Boolean)})))}_calculateBounds(){if(0===Object.keys(this._positions).length)return this._bounds={minX:0,minY:0,maxX:0,maxY:0},!1;let t=Number.MAX_SAFE_INTEGER,e=Number.MAX_SAFE_INTEGER,i=Number.MIN_SAFE_INTEGER,s=Number.MIN_SAFE_INTEGER;[...Object.values(this._positions),...this._targetPosition?[this._targetPosition]:[],...Object.values(this._isMultiDragging?this._targetPositions:{})].forEach((n=>{t=Math.min(t,n.x),e=Math.min(e,n.y),i=Math.max(i,n.x),s=Math.max(s,n.y)}));const n=Object.assign({},this._bounds);this._bounds={minX:t,minY:e,maxX:i,maxY:s};const o=JSON.stringify(n)!==JSON.stringify(this._bounds);return o&&this._calculateCellSize(),o}_calculateCellSize(){const{minX:t,minY:e,maxX:i,maxY:s}=this._bounds,{width:n,height:o}=this._containerSize,r=i-t+2,a=s-e+2+.5;this._cellSize=Math.min(n/r,o/a)}_gridToPixel(t,e){const{minX:i,minY:s}=this._bounds,{offsetX:n,offsetY:o}=this._getGridOffsets();return{x:n+(t-i)*this._cellSize,y:o+(e-s)*this._cellSize}}_pixelToGrid(t,e){const{minX:i,minY:s}=this._bounds,{offsetX:n,offsetY:o}=this._getGridOffsets();return{x:Math.floor((t-n)/this._cellSize)+i,y:Math.floor((e-o)/this._cellSize)+s}}_getGridOffsets(){const{minX:t,minY:e,maxX:i,maxY:s}=this._bounds,n=s-e+2,o=(i-t+2)*this._cellSize,r=n*this._cellSize;return{offsetX:(this._containerSize.width-o)/2+this._cellSize/2,offsetY:(this._containerSize.height-r)/2+this._cellSize/2}}_renderMembersWithLabels(){if(!this.hass)return[];const t=[...this.entities].sort(((t,e)=>{const i=this._positions[t]||{x:0,y:0},s=this._positions[e]||{x:0,y:0};return i.y!==s.y?i.y-s.y:s.x-i.x})),e=new Map,i=t.length;return t.forEach(((t,s)=>e.set(t,i-1-s+1))),t.map((t=>{var i,s,n;const r=this.hass.states[t];if(!r)return o.html``;const l=this._positions[t]||{x:0,y:0};let h;if(this._isMultiDragging&&this._selectedMembers.has(t)&&this._currentDragPosition)if(t===this._draggingMember)h=Object.assign({},this._currentDragPosition);else{const e=this._originalPositions[this._draggingMember],i=this._originalPositions[t],s=i.x-e.x,n=i.y-e.y;h={x:this._currentDragPosition.x+s*this._cellSize,y:this._currentDragPosition.y+n*this._cellSize}}else this._draggingMember===t&&this._currentDragPosition?h=Object.assign({},this._currentDragPosition):(h=this._gridToPixel(l.x,l.y),h.x+=this._cellSize/2,h.y+=this._cellSize/2);const d=r.attributes.friendly_name||t.split(".")[1],u=r.attributes.entity_picture||"",p=this._draggingMember===t||this._isMultiDragging&&this._selectedMembers.has(t),g=this._isSnapping&&(this._draggingMember===t||this._selectedMembers.has(t)),m=this._hoveringMember===t,_=this._selectedMembers.has(t);let f=e.get(t);p?f+=3:m?f+=2:_&&(f+=1);let y=null;const v=this._getHeatmapSensor();if(v&&t.startsWith("plant.")&&this._plantInfoCache[t]){const e=this._plantInfoCache[t];if(e&&e.result){const t=e.result[v],r=(null===(s=null===(i=e.result.helpers)||void 0===i?void 0:i.health)||void 0===s?void 0:s.entity_id)&&(null===(n=this.hass)||void 0===n?void 0:n.states[e.result.helpers.health.entity_id]);if("health"===v&&r){const t=Number(r.state),e=5,i=Math.min(100,Math.max(0,Math.round(t/e*100))),s=this._getHeatmapColor()||"rgb(148,202,83)",n=this._getHeatmapSecondaryColor()||"white",l=this._getHeatmapOpacity();y=o.html`
              <div class="heatmap-overlay" style=${(0,a.styleMap)({backgroundColor:`color-mix(in srgb, ${s} ${i}%, ${n})`,opacity:l})}></div>
            `}else if(t){const e=Number(t.current||0),i=Number(t.min||0),s=Number(t.max||100),n=Math.min(1,Math.max(0,(e-i)/(s-i))),r=Math.round(100*n),l=this._getHeatmapColor()||`var(--sensor-ring-${v}-color)`,c=this._getHeatmapSecondaryColor()||"white",h=this._getHeatmapOpacity();y=o.html`
              <div class="heatmap-overlay" style=${(0,a.styleMap)({backgroundColor:`color-mix(in srgb, ${l} ${r}%, ${c})`,opacity:h})}></div>
            `}else{const t=this._getHeatmapSecondaryColor()||"white",e=this._getHeatmapOpacity();y=o.html`
              <div class="heatmap-overlay" style=${(0,a.styleMap)({backgroundColor:t,opacity:e})}></div>
            `}}}let b="";t.startsWith("plant.")&&(this._plantInfoCache[t]&&this._plantInfoCache[t].result?b=this._renderPlantSensorRings(t):(b=this._renderDisabledRings(),this.hass&&c.PlantEntityUtils.getPlantInfo(this.hass,t).then((e=>{e&&(this._plantInfoCache[t]={result:e},this.requestUpdate())}))));const x=this._renderSensorLabels(t);return o.html`
        <div 
          class="member-wrapper ${p?"dragging":""} ${m?"hovering":""} ${_?"selected":""}"
          style=${(0,a.styleMap)({left:`${h.x}px`,top:`${h.y}px`,"--cell-size":`${this._cellSize}px`,"--z-index":`${f}`,"z-index":`${f}`})}
          data-entity-id="${t}"
        >
          <div
            class="member ${p?"dragging":""} ${g?"snapping":""} ${_?"selected":""}"
            @mousedown=${e=>this._startDrag(e,t)}
            @touchstart=${e=>this._handleTouchStart(e,t)}
            @click=${e=>this._handleClick(e,t)}
            @mouseover=${()=>{this._hoveringMember=t}}
            @mouseleave=${()=>{this._hoveringMember=null}}
          >
            <div class="member-image" style=${(0,a.styleMap)({backgroundImage:u?`url(${u})`:"none"})}>
              ${y}
              ${b}
              ${u?"":o.html`<ha-icon icon="mdi:flower"></ha-icon>`}
            </div>
          </div>
          <div class="entity-name ${p?"dragging":""} ${m?"hovering":""} ${_?"selected":""}">
            ${d}
          </div>
          ${x}
        </div>
      `}))}_renderPlantSensorRings(t){var e,i;const s=this._plantInfoCache[t],n=this._getActiveRings();if(0===n.length)return o.html``;if(!s||!s.result)return this._renderDisabledRings();const r=s.result;let a=null;if(this.hass&&(null===(i=null===(e=r.helpers)||void 0===e?void 0:e.health)||void 0===i?void 0:i.entity_id)){const t=r.helpers.health.entity_id;this.hass.states[t]&&(a=this.hass.states[t])}const l=n.filter((t=>"health"===t?null!==a:r[t]&&void 0!==r[t].current));return 0===l.length?this._renderDisabledRings():o.html`
      <div class="sensor-rings">
        ${l.map(((t,e)=>{const i=e,s=l.length;if("health"===t&&a){const e={current:Number(a.state),min:0,max:5,icon:"mdi:heart-pulse",sensor:a.entity_id,unit_of_measurement:""};return this._renderSensorRing(e,i,s,t)}return this._renderSensorRing(r[t],i,s,t)}))}
      </div>
    `}_renderSensorRing(t,e,i,s){if(!t||void 0===t.current)return this._renderDisabledRing(e,i);const n=Number(t.current),r=Number(t.min),a=Number(t.max),l=0===n,c=n<r&&!l,h=n>a;let d=0;d=isNaN(n)?0:"health"===s&&l?.05:l||c?.1:n===r?.02:h?1:Math.max(0,Math.min(1,(n-r)/(a-r)));const u=this._cellSize/2-2-4*e,p=2*Math.PI*u,g=`${p*d} ${p*(1-d)}`,m=l||c||h||"health"===s&&n<=1.5?"sensor-pulsating":"";let _=null,f="";if("health"===s)if(n<=0)_="rgba(240,100,100,1)";else if(n<=.5)_="rgba(240,163,163,1)";else if(n<=2.5){const t=(n-.5)/2;_=`rgb(${240+15*t}, ${163+51*t}, ${163-163*t})`}else{const t=(n-2.5)/2.5;_=`rgb(${255-212*t}, ${214-20*t}, ${0+83*t})`}else f=`sensor-ring-${s}`;return o.html`
      <svg class="sensor-ring" viewBox="0 0 ${this._cellSize} ${this._cellSize}">
        <circle 
          cx="${this._cellSize/2}" 
          cy="${this._cellSize/2}" 
          r="${u}" 
          class="sensor-ring-bg"
        />
        <circle 
          class="sensor-ring-fg ${f} ${m}"
          cx="${this._cellSize/2}" 
          cy="${this._cellSize/2}" 
          r="${u}" 
          stroke-dasharray="${g}"
          stroke-dashoffset="0"
          transform="rotate(-90, ${this._cellSize/2}, ${this._cellSize/2})"
          style="${_?`stroke: ${_}`:""}"
        />
      </svg>
    `}_renderDisabledRing(t,e){const i=this._cellSize/2-2-4*t;return o.html`
      <svg class="sensor-ring" viewBox="0 0 ${this._cellSize} ${this._cellSize}">
        <circle 
          cx="${this._cellSize/2}" 
          cy="${this._cellSize/2}" 
          r="${i}" 
          class="sensor-ring-bg"
        />
        <circle 
          cx="${this._cellSize/2}" 
          cy="${this._cellSize/2}" 
          r="${i}" 
          class="sensor-ring-disabled"
          transform="rotate(-90 ${this._cellSize/2} ${this._cellSize/2})"
        />
      </svg>
    `}_renderDisabledRings(){const t=this._getActiveRings();return 0===t.length?o.html``:o.html`
      <div class="sensor-rings">
        ${Array.from({length:t.length},((e,i)=>this._renderDisabledRing(i,t.length)))}
      </div>
    `}_handleClick(t,e){this._draggingMember||this._isMultiDragging||(t.stopPropagation(),t.preventDefault(),this._justFinishedMultiDrag?this._justFinishedMultiDrag=!1:setTimeout((()=>{const t=this._selectedMembers.has(e);t?this._selectedMembers.delete(e):this._selectedMembers.add(e);let i=e;t&&this._selectedMembers.size>0&&(i=Array.from(this._selectedMembers)[this._selectedMembers.size-1]);const s=new CustomEvent("flower-area-entity-selected",{bubbles:!0,composed:!0,detail:{entityId:this._selectedMembers.size>0?i:null,selectedEntities:Array.from(this._selectedMembers)}});this.dispatchEvent(s),this.requestUpdate()}),10))}_startDrag(t,e){if(this._showAddPlantDialog)return;if(this._justFinishedMultiDrag)return;let i,s;t.preventDefault(),this._highlightCell=null,this._showAddPlantIndicator=null,document.body.style.userSelect="none",this._wasElementSelected=this._selectedMembers.has(e),"touches"in t?(i=t.touches[0].clientX,s=t.touches[0].clientY):(i=t.clientX,s=t.clientY);const n=this.getBoundingClientRect();if(this._selectedMembers.has(e)&&this._selectedMembers.size>1){this._isMultiDragging=!0,this._draggingMember=e,this._isDraggingSelection=!0,this._selectedMembers.forEach((t=>{this._originalPositions[t]=Object.assign({},this._positions[t])}));const{x:t,y:o}=this._positions[e],r=this._gridToPixel(t,o);this._dragOffset={x:i-n.left-r.x-this._cellSize/2,y:s-n.top-r.y-this._cellSize/2}}else{this._draggingMember=e,this._originalPosition=Object.assign({},this._positions[e]);const{x:t,y:o}=this._positions[e],r=this._gridToPixel(t,o);this._dragOffset={x:i-n.left-r.x-this._cellSize/2,y:s-n.top-r.y-this._cellSize/2}}window.removeEventListener("mousemove",this._boundHandleDrag),window.removeEventListener("touchmove",this._boundHandleDrag),window.removeEventListener("mouseup",this._boundEndDrag),window.removeEventListener("touchend",this._boundEndDrag),window.addEventListener("mousemove",this._boundHandleDrag),window.addEventListener("touchmove",this._boundHandleDrag,{passive:!1}),window.addEventListener("mouseup",this._boundEndDrag),window.addEventListener("touchend",this._boundEndDrag)}_handleDrag(t){if(!this._draggingMember&&!this._isMultiDragging)return;t.preventDefault();const e="touches"in t?t.touches[0].clientX:t.clientX,i="touches"in t?t.touches[0].clientY:t.clientY,s=this.getBoundingClientRect(),n=e-s.left,o=i-s.top;this._currentDragPosition={x:n-this._dragOffset.x,y:o-this._dragOffset.y};const r=this._pixelToGrid(n,o);if(this._isMultiDragging){const t=Array.from(this._selectedMembers)[0],e=this._originalPositions[t],i=r.x-e.x,s=r.y-e.y,n=Object.assign({},this._targetPositions);this._targetPositions={};let o=!0;this._selectedMembers.forEach((t=>{const e=this._originalPositions[t],n={x:e.x+i,y:e.y+s};Object.entries(this._positions).some((([t,e])=>!this._selectedMembers.has(t)&&e.x===n.x&&e.y===n.y))&&(o=!1),this._targetPositions[t]=n})),o||(this._targetPositions={}),JSON.stringify(n)!==JSON.stringify(this._targetPositions)&&this._calculateBounds()}else if(this._draggingMember){const t=Object.entries(this._positions).some((([t,e])=>t!==this._draggingMember&&e.x===r.x&&e.y===r.y));this._targetPosition=t?null:Object.assign({},r),this._highlightCell=t?null:{x:r.x,y:r.y},t||(this._highlightCell=JSON.parse(JSON.stringify({x:r.x,y:r.y}))),this._calculateBounds(),this.requestUpdate()}}_endDrag(t){if(!this._draggingMember&&!this._isMultiDragging)return;const e=this._isMultiDragging;if(window.removeEventListener("mousemove",this._boundHandleDrag),window.removeEventListener("touchmove",this._boundHandleDrag),window.removeEventListener("mouseup",this._boundEndDrag),window.removeEventListener("touchend",this._boundEndDrag),document.body.style.userSelect="",null!==this._currentDragPosition&&(this._draggingMember&&this._originalPosition?Math.abs(this._currentDragPosition.x-this._gridToPixel(this._originalPosition.x,this._originalPosition.y).x)>5||Math.abs(this._currentDragPosition.y-this._gridToPixel(this._originalPosition.x,this._originalPosition.y).y)>5:this._isMultiDragging))if(this._isMultiDragging&&this._draggingMember){this._justFinishedMultiDrag=!0,this._isSnapping=!0;const e="touches"in t?t.changedTouches[0].clientX:t.clientX,i="touches"in t?t.changedTouches[0].clientY:t.clientY,s=this.getBoundingClientRect(),n=this._pixelToGrid(e-s.left,i-s.top),o=this._originalPositions[this._draggingMember],r=n.x-o.x,a=n.y-o.y;let l=!0;this._selectedMembers.forEach((t=>{const e=this._originalPositions[t],i=e.x+r,s=e.y+a;Object.entries(this._positions).some((([t,e])=>!this._selectedMembers.has(t)&&e.x===i&&e.y===s))&&(l=!1)})),l?(this._selectedMembers.forEach((t=>{const e=this._originalPositions[t];this._positions[t]={x:e.x+r,y:e.y+a}})),this._calculateBounds(),this._normalizePositions(),Object.entries(this._positions).forEach((([t,e])=>{this._savePosition(t,e)})),this._identifyCycleGroups(),this._calculateCellSize()):Object.entries(this._originalPositions).forEach((([t,e])=>{this._positions[t]=Object.assign({},e)})),setTimeout((()=>{this._isSnapping=!1,this.requestUpdate()}),300)}else this._targetPosition&&this._draggingMember?(this._justFinishedMultiDrag=!0,this._isSnapping=!0,this._positions[this._draggingMember]=Object.assign({},this._targetPosition),!this._wasElementSelected&&this._selectedMembers.size>1&&[...this._selectedMembers].filter((t=>t!==this._draggingMember)).forEach((t=>this._selectedMembers.delete(t))),this._calculateBounds(),this._normalizePositions(),Object.entries(this._positions).forEach((([t,e])=>{this._savePosition(t,e)})),this._identifyCycleGroups(),this._calculateCellSize(),setTimeout((()=>{this._isSnapping=!1,this.requestUpdate()}),300)):this._draggingMember&&(this._isSnapping=!0,this._positions[this._draggingMember]=Object.assign({},this._originalPosition),setTimeout((()=>{this._isSnapping=!1,this.requestUpdate()}),300));this._draggingMember=null,this._isMultiDragging=!1,this._originalPositions={},this._targetPositions={},this._isDraggingSelection=!1,this._currentDragPosition=null,this._originalPosition=null,this._targetPosition=null,this._highlightCell=null,this._wasElementSelected=!1,this.requestUpdate(),(e||this._justFinishedMultiDrag)&&setTimeout((()=>{this._justFinishedMultiDrag=!1}),100),setTimeout((()=>{this._calculateBounds();const t=this.getBoundingClientRect();this._containerSize={width:t.width,height:t.height},this._calculateCellSize(),this.requestUpdate()}),50)}_normalizePositions(){if(0===Object.keys(this._positions).length)return;let t=Number.MAX_SAFE_INTEGER,e=Number.MAX_SAFE_INTEGER;Object.values(this._positions).forEach((i=>{t=Math.min(t,i.x),e=Math.min(e,i.y)})),0===t&&0===e||(Object.keys(this._positions).forEach((i=>{this._positions[i]={x:this._positions[i].x-t,y:this._positions[i].y-e}})),this._bounds={minX:0,minY:0,maxX:this._bounds.maxX-t,maxY:this._bounds.maxY-e})}_savePosition(t,e){return n(this,void 0,void 0,(function*(){if(this.hass)try{yield this.hass.callService("plant","change_position",{entity_id:t,position_x:e.x,position_y:e.y})}catch(t){}}))}_renderCycleGroups(){var t;if(!(null===(t=this._cycleGroups)||void 0===t?void 0:t.length))return o.html``;const e=this._cycleGroups.filter((t=>t.positions.length>=2)).map((t=>{const e=`cycle-${t.name.replace(/\s+/g,"-")}`;return o.html`<div id="${e}" data-name="${t.name}" class="cycle-group-frame"></div>`}));return e.length?o.html`<div class="cycle-layer">${e}</div>`:o.html``}render(){if(!this.hass||0===this.entities.length)return o.html``;this._bounds.maxX,this._bounds.minX;const t=this._bounds.maxY-this._bounds.minY+2,e=(this._cellSize,t*this._cellSize+20),i=new Set;Object.entries(this._positions).forEach((([t,e])=>{t!==this._draggingMember&&i.add(`${e.x},${e.y}`)}));const s=[];for(let t=this._bounds.minY-1;t<=this._bounds.maxY+1;t++)for(let e=this._bounds.minX-1;e<=this._bounds.maxX+1;e++){const n=`${e},${t}`;if(!i.has(n)){const i=this._gridToPixel(e,t),n=null!==this._highlightCell&&this._highlightCell.x===e&&this._highlightCell.y===t,r=this._showAddPlantIndicator&&this._showAddPlantIndicator.x===e&&this._showAddPlantIndicator.y===t;s.push(o.html`
            <svg 
              class="cell ${n?"highlight":""} ${r?"add-indicator":""}" 
              style=${(0,a.styleMap)({left:`${i.x}px`,top:`${i.y}px`,width:`${this._cellSize}px`,height:`${this._cellSize}px`,transform:"translate(-50%, -50%)",zIndex:n||r?"5":"1"})}
            >
              <rect 
                x="0" 
                y="0" 
                width="${this._cellSize}" 
                height="${this._cellSize}" 
                fill="transparent" 
                stroke="${n?"var(--primary-color, #3498db)":r?"var(--accent-color, #f3a95e)":"var(--divider-color, #e0e0e0)"}" 
                stroke-width="${n||r?"2.5":"0.8"}" 
                stroke-opacity="${n||r?"1":"0.4"}"
                ${n?'stroke-dasharray="5,3"':""}
                rx="2" 
                ry="2"
              />
            </svg>
            ${r?o.html`
              <div 
                class="add-plant-button"
                style=${(0,a.styleMap)({position:"absolute",left:`${i.x}px`,top:`${i.y}px`,width:`${this._cellSize}px`,height:`${this._cellSize}px`,transform:"translate(-50%, -50%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:1*this._cellSize+"px",color:"var(--accent-color, #f3a95e)",opacity:"0.1",zIndex:"50",cursor:"pointer"})}
                @click=${i=>this._handleCellClick(i,e,t)}
              >+</div>
            `:""}
          `)}}const n=this._cellSize/2,r=(Date.now(),o.html`
      <div class="container" 
           style=${(0,a.styleMap)({height:`${e}px`})} 
           @click=${this._handleContainerClick}>
        <div class="grid-background" style=${(0,a.styleMap)({transform:`translate(${n}px, ${n}px)`})}>
          ${s}
        </div>
        
        <div class="cycle-layer">
          ${this._renderCycleGroups()}
        </div>
        
        <div class="members">
          ${this._renderMembersWithLabels()}
        </div>
        
        <div class="cycle-labels-layer"></div>
        
        ${this._renderSelectionHint()}
        
        <!-- Legende einfügen -->
        ${this.showLegend?o.html`
          <brokkoli-area-legend
            .hass=${this.hass}
            .initialShowRings=${this._getActiveRings()}
            .initialShowLabels=${this._getActiveLabels()}
            .initialHeatmap=${this._getHeatmapSensor()}
            .initialHeatmapColor=${this._getHeatmapColor()}
            .initialHeatmapSecondaryColor=${this._getHeatmapSecondaryColor()}
            .plantInfo=${this._plantInfoCache[Object.keys(this._plantInfoCache)[0]]}
            @settings-changed=${this._handleSettingsChanged}
          ></brokkoli-area-legend>
        `:""}
      </div>
    `);if(this._showAddPlantDialog&&this.hass){const t=document.getElementById("plant-dialog-container");t&&document.body.removeChild(t);const e=document.createElement("div");e.id="plant-dialog-container",e.style.cssText="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; pointer-events: auto;";const i=document.createElement("plant-create-dialog");document.body.appendChild(e),e.appendChild(i);const s=i;s.hass=this.hass,s.position=this._newPlantPosition,s.areaId=this.areaId||"",i.addEventListener("dialog-closed",(()=>{this._closeAddPlantDialog(),document.body.contains(e)&&document.body.removeChild(e)}))}return r}_updateCycleGroups(){setTimeout((()=>{this._cycleGroups.forEach((t=>{var e;if(t.positions.length<1)return;const i=`cycle-${t.name.replace(/\s+/g,"-")}`,s=null===(e=this.shadowRoot)||void 0===e?void 0:e.getElementById(i);if(!s)return;s.innerHTML="";const n=[];t.members.forEach((t=>{var e;const i=`.member-wrapper[data-entity-id="${t}"]`,s=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(i);s&&n.push(s)})),n.length<1||this._identifyIslands(t.members).forEach(((e,i)=>{const o=n.filter((t=>{const i=t.getAttribute("data-entity-id");return i&&e.includes(i)}));if(o.length<1)return;const r=[];let a=Number.MAX_SAFE_INTEGER,l=Number.MAX_SAFE_INTEGER,c=Number.MIN_SAFE_INTEGER,h=Number.MIN_SAFE_INTEGER;o.forEach((t=>{const e=t.getBoundingClientRect(),i=this.getBoundingClientRect(),s=e.left-i.left+e.width/2,n=e.top-i.top+e.height/2,o=Math.max(e.width,e.height)/2;r.push({center:{x:s,y:n},radius:o}),a=Math.min(a,s-o-20),l=Math.min(l,n-o-20),c=Math.max(c,s+o+20),h=Math.max(h,n+o+20)}));const d=document.createElement("div");d.className="cycle-group-frame",d.style.position="absolute",d.style.boxSizing="border-box",d.style.zIndex="2",d.style.pointerEvents="none",d.style.left=`${a}px`,d.style.top=`${l}px`,d.style.width=c-a+"px",d.style.height=h-l+"px",d.dataset.centerX=`${a+(c-a)/2}`,d.dataset.centerY=`${l+(h-l)/2}`,d.dataset.width=""+(c-a),d.dataset.height=""+(h-l),d.dataset.groupName=t.name,d.dataset.groupColor=t.color||"#3388ff";const u=document.createElementNS("http://www.w3.org/2000/svg","svg");let p;if(u.setAttribute("width","100%"),u.setAttribute("height","100%"),u.style.position="absolute",u.style.top="0",u.style.left="0",u.style.overflow="visible",1===o.length){const t=r[0],e=t.radius+15;p=`M ${t.center.x-a-e} ${t.center.y-l} a ${e} ${e} 0 1 0 ${2*e} 0 a ${e} ${e} 0 1 0 ${2*-e} 0`}else p=this._createHullPath(r,a,l);const g=document.createElementNS("http://www.w3.org/2000/svg","path");g.setAttribute("d",p),g.setAttribute("fill","none"),g.setAttribute("stroke",t.color||"#3388ff"),g.setAttribute("stroke-width","2"),g.setAttribute("stroke-linejoin","round"),g.setAttribute("stroke-linecap","round"),u.appendChild(g),d.appendChild(u),s.appendChild(d)}))})),this._createClickableCycleLabels()}),100)}_selectCycleMembers(t){const e=this._cycleGroups.find((e=>e.name===t));e?(e.members.every((t=>this._selectedMembers.has(t)))?e.members.forEach((t=>{this._selectedMembers.delete(t)})):(this._selectedMembers.clear(),e.members.forEach((t=>{this._selectedMembers.add(t)}))),this.requestUpdate()):console.warn(`Keine Cycle-Gruppe mit Namen ${t} gefunden`)}_createHullPath(t,e,i){if(t.length<2)return"";const s=[];t.forEach((t=>{const{center:n,radius:o}=t,r=o+20;for(let t=0;t<16;t++){const o=t/16*2*Math.PI;s.push({x:n.x-e+r*Math.cos(o),y:n.y-i+r*Math.sin(o)})}}));const n=this._computeConvexHull(s);if(n.length<3)return"";let o=`M ${n[0].x} ${n[0].y}`;for(let t=1;t<n.length;t++){const e=n[t-1],i=n[t],s=(e.x+i.x)/2,r=(e.y+i.y)/2;o+=` Q ${e.x} ${e.y}, ${s} ${r}`}const r=n[n.length-1],a=n[0],l=(r.x+a.x)/2,c=(r.y+a.y)/2;return o+=` Q ${r.x} ${r.y}, ${l} ${c}`,o+=` Q ${a.x} ${a.y}, ${n[0].x} ${n[0].y}`,o}_computeConvexHull(t){if(t.length<3)return t;let e=t[0];for(let i=1;i<t.length;i++)(t[i].y<e.y||t[i].y===e.y&&t[i].x<e.x)&&(e=t[i]);const i=t.slice();i.sort(((t,i)=>{if(t===e)return-1;if(i===e)return 1;const s=Math.atan2(t.y-e.y,t.x-e.x),n=Math.atan2(i.y-e.y,i.x-e.x);return s===n?Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))-Math.sqrt(Math.pow(i.x-e.x,2)+Math.pow(i.y-e.y,2)):s-n}));const s=[];for(let t=0;t<i.length;t++)0!==t&&i[t].x===i[t-1].x&&i[t].y===i[t-1].y||s.push(i[t]);const n=[];for(let t=0;t<Math.min(3,s.length);t++)n.push(s[t]);for(let t=3;t<s.length;t++){for(;n.length>1&&this._ccw(n[n.length-2],n[n.length-1],s[t])<=0;)n.pop();n.push(s[t])}return n}_ccw(t,e,i){return(e.x-t.x)*(i.y-t.y)-(e.y-t.y)*(i.x-t.x)}_identifyIslands(t){const e={};t.forEach((t=>{const i=this._positions[t];i&&(e[`${i.x},${i.y}`]=t)}));const i={};t.forEach((t=>{const e=this._positions[t];e&&(i[t]=e)}));const s=new Set,n=[];return t.forEach((t=>{if(s.has(t))return;const o=[],r=[t];for(;r.length>0;){const t=r.pop();if(s.has(t))continue;s.add(t),o.push(t);const n=i[t];n&&[`${n.x},${n.y-1}`,`${n.x},${n.y+1}`,`${n.x-1},${n.y}`,`${n.x+1},${n.y}`,`${n.x-1},${n.y-1}`,`${n.x+1},${n.y-1}`,`${n.x-1},${n.y+1}`,`${n.x+1},${n.y+1}`].forEach((t=>{const i=e[t];i&&!s.has(i)&&r.push(i)}))}o.length>0&&n.push(o)})),n}_renderSelectionHint(){return o.nothing}static get styles(){return o.css`
      ${l.positionStyles}
    `}_getEntityCycleName(t){if(!t||!t.entity_id||!t.entity_id.startsWith("plant."))return null;const e=this._plantInfoCache[t.entity_id];if(e&&e.result){const t=e.result;if(t.helpers&&t.helpers.cycle&&t.helpers.cycle.current)return t.helpers.cycle.current}return null}_getColorForCycle(t){let e=0;for(let i=0;i<t.length;i++)e=t.charCodeAt(i)+((e<<5)-e);return`hsl(${Math.abs(e)%360}, 70%, 45%)`}_createClickableCycleLabels(){var t,e,i,s,n;const o=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll(".clickable-cycle-label");null==o||o.forEach((t=>t.remove()));let r=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".cycle-labels-layer");r||(r=document.createElement("div"),r.className="cycle-labels-layer",null===(s=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector(".container"))||void 0===s||s.appendChild(r));const a=null===(n=this.shadowRoot)||void 0===n?void 0:n.querySelectorAll(".cycle-group-frame");null==a||a.forEach((t=>{const e=parseFloat(t.getAttribute("data-center-x")||"0"),i=parseFloat(t.getAttribute("data-center-y")||"0"),s=parseFloat(t.getAttribute("data-height")||"0"),n=t.getAttribute("data-group-name")||"",o=t.getAttribute("data-group-color")||"#3388ff";if(!n)return;const a=document.createElement("div");a.className="clickable-cycle-label",a.textContent=n,a.style.left=`${e}px`,a.style.top=i+s/2-5+"px",a.style.backgroundColor=o,a.addEventListener("click",(t=>{t.preventDefault(),t.stopPropagation(),window.removeEventListener("click",this._handleGlobalClick),this._cycleGroups.find((t=>t.name===n))&&this._selectCycleMembers(n),setTimeout((()=>{window.addEventListener("click",this._handleGlobalClick)}),10)})),null==r||r.appendChild(a)}))}_convertToGlobalPosition(t){const e=this._bounds.minX,i=this._bounds.minY;return{x:t.x+e,y:t.y+i}}_handleCellClick(t,e,i){if(this._selectedMembers.clear(),this._showAddPlantDialog)return this._showAddPlantDialog=!1,void(this._showAddPlantIndicator=null);Object.values(this._positions).some((t=>t.x===e&&t.y===i))||(this._showAddPlantIndicator&&this._showAddPlantIndicator.x===e&&this._showAddPlantIndicator.y===i?(this._newPlantPosition=this._convertToGlobalPosition({x:e,y:i}),this._showAddPlantDialog=!0,this._showAddPlantIndicator=null):this._showAddPlantIndicator={x:e,y:i},this.requestUpdate())}_closeAddPlantDialog(){this._showAddPlantDialog=!1,this._showAddPlantIndicator=null;const t=document.getElementById("plant-dialog-container");t&&document.body.contains(t)&&document.body.removeChild(t),this.requestUpdate()}_handleContainerClick(t){const e=t.composedPath();if(e.some((t=>t instanceof HTMLElement&&"flower-area-legend"===t.tagName.toLowerCase())))return;if(this._selectedMembers.clear(),e.some((t=>{if(t instanceof HTMLElement){if(t.getAttribute("data-entity-id"))return!0;if("svg"===t.tagName&&t.classList.contains("cell"))return!1;if(t.classList.contains("member")||t.classList.contains("member-wrapper")||t.classList.contains("member-image")||t.classList.contains("cycle-label")||t.classList.contains("clickable-cycle-label")||t.classList.contains("name-label"))return!0}return!1})))return;const i=this.getBoundingClientRect(),s=t.clientX-i.left,n=t.clientY-i.top,o=this._pixelToGrid(s,n);Object.values(this._positions).some((t=>t.x===o.x&&t.y===o.y))||(this._showAddPlantIndicator&&this._showAddPlantIndicator.x===o.x&&this._showAddPlantIndicator.y===o.y?(this._newPlantPosition=this._convertToGlobalPosition(o),this._showAddPlantDialog=!0,this._showAddPlantIndicator=null):this._showAddPlantIndicator=o,this.requestUpdate())}_handleOverlayClick(t){this._selectedMembers.clear();const e=t.composedPath();if(e.some((t=>{var e,i;return t instanceof HTMLElement&&((null===(i=null===(e=t.className)||void 0===e?void 0:e.split)||void 0===i?void 0:i.call(e," "))||[]).some((t=>t.includes("member")||t.includes("name")||t.includes("cycle-label")||t.includes("clickable-cycle-label")))})))return;if(e.some((t=>{if(t instanceof HTMLElement){const e=t.className.split(" ");return e.includes("member")||e.includes("member-wrapper")||e.includes("cycle-label")||e.includes("clickable-cycle-label")}return!1})))return;const i=this.getBoundingClientRect(),s=t.clientX-i.left,n=t.clientY-i.top,o=this._pixelToGrid(s,n);Object.values(this._positions).some((t=>t.x===o.x&&t.y===o.y))||(this._showAddPlantIndicator&&this._showAddPlantIndicator.x===o.x&&this._showAddPlantIndicator.y===o.y?(this._newPlantPosition=this._convertToGlobalPosition(o),this._showAddPlantDialog=!0,this._showAddPlantIndicator=null):this._showAddPlantIndicator=o,this.requestUpdate())}_handleTouchStart(t,e){let i=!1;t.preventDefault();const s=t.touches[0],n=s.clientX,o=s.clientY,r=s=>{if(i)return;const r=s.touches[0],a=r.clientX,l=r.clientY;(Math.abs(a-n)>10||Math.abs(l-o)>10)&&(i=!0,this._startDrag(t,e))},a=()=>{window.removeEventListener("touchmove",r),window.removeEventListener("touchend",a),i||this._handleClick(new MouseEvent("click"),e)};window.addEventListener("touchmove",r,{passive:!1}),window.addEventListener("touchend",a)}_loadPlantInfo(t){return n(this,void 0,void 0,(function*(){yield this._loadAllPlantData()}))}_initPlantDataLoading(){this._loadAllPlantData()}_loadPlantInfosWithDelay(){this._loadAllPlantData()}_renderSensorLabels(t){var e,i;const s=this._plantInfoCache[t],n=this._getActiveLabels();if(0===n.length)return o.html``;if(!s||!s.result)return o.html``;const r=s.result;let a=null;if(this.hass&&(null===(i=null===(e=r.helpers)||void 0===e?void 0:e.health)||void 0===i?void 0:i.entity_id)){const t=r.helpers.health.entity_id;this.hass.states[t]&&(a=this.hass.states[t])}const l=n.filter((t=>"health"===t?null!==a:r[t]&&void 0!==r[t].current&&null!==r[t].current));if(0===l.length)return o.html``;const c=l.map((t=>"health"===t&&a?{type:t,current:Number(a.state),min:0,max:5,icon:"mdi:heart-pulse",sensor:a.entity_id,unit_of_measurement:""}:Object.assign({type:t},r[t])));return o.html`
      <div class="sensor-labels">
        ${c.map((t=>{const e=Number(t.current),i=Number(t.min),s=Number(t.max),n=(isNaN(e),0===e),r=n||e<i&&!n||e>s||"health"===t.type&&e<=1.5?"sensor-pulsating":"";let a="";if("health"===t.type)if(e<=.5)a="rgba(240,163,163,1)";else if(e<=2.5){const t=(e-.5)/2;a=`rgb(${240+15*t}, ${163+51*t}, ${163-163*t})`}else{const t=(e-2.5)/2.5;a=`rgb(${255-212*t}, ${214-20*t}, ${0+83*t})`}else a=`var(--sensor-ring-${t.type}-color, var(--primary-color))`;let l=isNaN(e)?"-":e;return Number.isInteger(e)?l=Math.round(e):isNaN(e)||(l=e.toFixed(1)),o.html`
            <div class="sensor-label ${r}">
              <ha-icon 
                icon="${t.icon||`mdi:${t.type}`}" 
                style="color: ${a};"
              ></ha-icon>
              <span class="sensor-value">${l}</span>
              <span class="sensor-unit">${t.unit_of_measurement||""}</span>
            </div>
          `}))}
      </div>
    `}_handleSettingsChanged(t){const e=t.detail;this._userSettings={showRings:e.selectedRings,showLabels:e.selectedLabels,heatmap:e.heatmapSensor,heatmapColor:e.heatmapColor,heatmapSecondaryColor:e.heatmapSecondaryColor,heatmapOpacity:e.heatmapOpacity},this.requestUpdate()}_getActiveRings(){return void 0!==this._userSettings.showRings?this._userSettings.showRings:this.showRings}_getActiveLabels(){return void 0!==this._userSettings.showLabels?this._userSettings.showLabels:this.showLabels}_getHeatmapSensor(){if(null!==this._userSettings.heatmap)return void 0!==this._userSettings.heatmap?this._userSettings.heatmap:this.heatmap}_getHeatmapColor(){return void 0!==this._userSettings.heatmapColor?this._userSettings.heatmapColor:this.heatmapColor}_getHeatmapSecondaryColor(){return void 0!==this._userSettings.heatmapSecondaryColor?this._userSettings.heatmapSecondaryColor:this.heatmapSecondaryColor}_getHeatmapOpacity(){return void 0!==this._userSettings.heatmapOpacity?this._userSettings.heatmapOpacity:.8}_loadAllPlantData(){return n(this,void 0,void 0,(function*(){if(!this.hass)return;const t=this.entities.filter((t=>t.startsWith("plant.")));if(0===t.length)return;let e=!0;for(const i of t)if(!this._plantInfoCache[i]||!this._plantInfoCache[i].result){e=!1;break}if(e)return this._identifyCycleGroups(),this.requestUpdate(),this._updateTimeout&&clearTimeout(this._updateTimeout),void(this._updateTimeout=window.setTimeout((()=>{this._loadAllPlantData()}),1e4));const i=t.map((t=>n(this,void 0,void 0,(function*(){try{const e=yield this.hass.callWS({type:"plant/get_info",entity_id:t});return e&&"object"==typeof e&&"result"in e&&e.result&&(this._plantInfoCache[t]={result:e.result}),{entityId:t,success:!0}}catch(e){return console.error(`[FLOWER-AREA] Fehler beim Laden der Daten für ${t}:`,e),{entityId:t,success:!1}}}))));yield Promise.all(i),this._identifyCycleGroups(),this.requestUpdate(),this._updateTimeout&&clearTimeout(this._updateTimeout),this._updateTimeout=window.setTimeout((()=>{this._loadAllPlantData()}),1e4)}))}};e.BrokkoliArea=h,s([(0,r.property)({attribute:!1})],h.prototype,"hass",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"entities",void 0),s([(0,r.property)()],h.prototype,"areaId",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"showRings",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"showLabels",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"heatmap",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"heatmapColor",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"heatmapSecondaryColor",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"heatmapOpacity",void 0),s([(0,r.property)({attribute:!1})],h.prototype,"showLegend",void 0),s([(0,r.state)()],h.prototype,"_userSettings",void 0),s([(0,r.state)()],h.prototype,"_positions",void 0),s([(0,r.state)()],h.prototype,"_draggingMember",void 0),s([(0,r.state)()],h.prototype,"_hoveringMember",void 0),s([(0,r.state)()],h.prototype,"_dragOffset",void 0),s([(0,r.state)()],h.prototype,"_containerSize",void 0),s([(0,r.state)()],h.prototype,"_cellSize",void 0),s([(0,r.state)()],h.prototype,"_targetPosition",void 0),s([(0,r.state)()],h.prototype,"_isSnapping",void 0),s([(0,r.state)()],h.prototype,"_currentDragPosition",void 0),s([(0,r.state)()],h.prototype,"_originalPosition",void 0),s([(0,r.state)()],h.prototype,"_wasElementSelected",void 0),s([(0,r.state)()],h.prototype,"_selectedMembers",void 0),s([(0,r.state)()],h.prototype,"_isMultiDragging",void 0),s([(0,r.state)()],h.prototype,"_originalPositions",void 0),s([(0,r.state)()],h.prototype,"_targetPositions",void 0),s([(0,r.state)()],h.prototype,"_isDraggingSelection",void 0),s([(0,r.state)()],h.prototype,"_showSelectionHint",void 0),s([(0,r.state)()],h.prototype,"_justFinishedMultiDrag",void 0),s([(0,r.state)()],h.prototype,"_cycleGroups",void 0),s([(0,r.state)()],h.prototype,"_bounds",void 0),s([(0,r.state)()],h.prototype,"_showAddPlantIndicator",void 0),s([(0,r.state)()],h.prototype,"_showAddPlantDialog",void 0),s([(0,r.state)()],h.prototype,"_newPlantPosition",void 0),s([(0,r.state)()],h.prototype,"_debugMode",void 0),s([(0,r.state)()],h.prototype,"_highlightCell",void 0),s([(0,r.state)()],h.prototype,"_plantInfoCache",void 0),s([(0,r.state)()],h.prototype,"_plantRetryTimeouts",void 0),s([(0,r.state)()],h.prototype,"_plantLastLoaded",void 0),e.BrokkoliArea=h=s([(0,r.customElement)("brokkoli-area")],h)},242:function(t,e,i){var s=this&&this.__decorate||function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},n=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.PlantCreateDialog=void 0;const o=i(437),r=i(924),a=customElements.get("plant-create-dialog");class l extends o.LitElement{constructor(){super(...arguments),this.position={x:0,y:0}}closeDialog(){this.dispatchEvent(new CustomEvent("dialog-closed"))}createPlant(t){return n(this,void 0,void 0,(function*(){if(t.preventDefault(),!this.hass)return;const e=new FormData(t.target),i={};e.forEach(((t,e)=>{""!==t&&(i[e]=t.toString())}));try{const t=yield this.hass.callWS({type:"call_service",domain:"plant",service:"create_plant",service_data:i,return_response:!0});if(t&&t.response){const{entity_id:e,device_id:i}=t.response;e&&i&&(yield this._setPositionAndArea(e,i,this.position,this.areaId))}this.closeDialog()}catch(t){}}))}_setPositionAndArea(t,e,i,s){return n(this,void 0,void 0,(function*(){if(this.hass)try{if(this.dispatchEvent(new CustomEvent("plant-created",{bubbles:!0,composed:!0,detail:{entity_id:t,device_id:e,position:i,area_id:s}})),s){const t=s.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss");yield this.hass.callService("plant","move_to_area",{device_id:[e],area_id:t})}}catch(t){}}))}render(){return this.hass?o.html`
      <div class="dialog-container">
        <div class="dialog-content">
          <div class="dialog-header">
            <h2>Neue Pflanze erstellen</h2>
            <button class="close-button" @click=${this.closeDialog}>×</button>
          </div>
          <form @submit=${this.createPlant}>
            <div class="form-field">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-field">
              <label for="strain">Strain</label>
              <input type="text" id="strain" name="strain" required>
            </div>
            <div class="form-field">
              <label for="breeder">Breeder</label>
              <input type="text" id="breeder" name="breeder" required>
            </div>
            <div class="form-field">
              <label for="plant_emoji">Icon</label>
              <input type="text" id="plant_emoji" name="plant_emoji" value="🥦">
            </div>
            <div class="form-field">
              <label for="growth_phase">Wachstumsphase</label>
              <select id="growth_phase" name="growth_phase" required>
                <option value="Samen">Samen</option>
                <option value="Keimen">Keimen</option>
                <option value="Wurzeln" selected>Wurzeln</option>
                <option value="Wachstum">Wachstum</option>
                <option value="Blüte">Blüte</option>
                <option value="Entfernt">Entfernt</option>
                <option value="Geerntet">Geerntet</option>
              </select>
            </div>
            
            <div class="form-field">
              <label for="temperature_sensor">Temperatursensor</label>
              <select id="temperature_sensor" name="temperature_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"temperature"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="moisture_sensor">Feuchtigkeitssensor</label>
              <select id="moisture_sensor" name="moisture_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"moisture"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="conductivity_sensor">Leitfähigkeitssensor</label>
              <select id="conductivity_sensor" name="conductivity_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"conductivity"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="ph_sensor">pH-Sensor</label>
              <select id="ph_sensor" name="ph_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"ph"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="illuminance_sensor">Helligkeitssensor</label>
              <select id="illuminance_sensor" name="illuminance_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"illuminance"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="humidity_sensor">Luftfeuchtigkeitssensor</label>
              <select id="humidity_sensor" name="humidity_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"humidity"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-field">
              <label for="power_consumption_sensor">Energieverbrauchssensor</label>
              <select id="power_consumption_sensor" name="power_consumption_sensor">
                <option value="">Keiner</option>
                ${Object.entries(this.hass.states).filter((([t,e])=>{const i=e;return t.startsWith("sensor.")&&i.attributes&&"energy"===i.attributes.device_class})).map((([t,e])=>{const i=e;return o.html`<option value="${t}">${i.attributes.friendly_name||t}</option>`}))}
              </select>
            </div>
            
            <div class="form-actions">
              <button type="button" @click=${this.closeDialog}>Abbrechen</button>
              <button type="submit">Erstellen</button>
            </div>
          </form>
        </div>
      </div>
    `:o.html``}static get styles(){return o.css`
      .dialog-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .dialog-content {
        background-color: var(--card-background-color, #fff);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 1.5rem;
      }
      
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .dialog-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 50%;
        line-height: 1;
        width: 2rem;
        height: 2rem;
      }
      
      .form-field {
        margin-bottom: 1rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: 500;
      }
      
      input, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        font-size: 1rem;
      }
      
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1.5rem;
      }
      
      button {
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 1rem;
        border: none;
      }
      
      button[type="submit"] {
        background-color: var(--primary-color);
        color: white;
      }
    `}}s([(0,r.property)({attribute:!1})],l.prototype,"hass",void 0),s([(0,r.property)()],l.prototype,"position",void 0),s([(0,r.property)()],l.prototype,"areaId",void 0),a||customElements.define("plant-create-dialog",l),e.PlantCreateDialog=a?customElements.get("plant-create-dialog"):l},73:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.positionStyles=void 0;const s=i(437);e.positionStyles=s.css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
  }
  
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--card-background-color, #fff);
    padding: 0;
    margin: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 0; /* Erstellt einen Stacking-Kontext, damit Kinder-Elemente innerhalb bleiben */
  }
  
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    color: var(--secondary-text-color);
  }
  
  .grid-background, .cell, .members, .name-layer, .cycle-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .grid-background { z-index: 1; }
  .cycle-layer { z-index: 2; pointer-events: none; }
  .name-layer { z-index: 5; pointer-events: none; }
  .members { z-index: 3; }
  
  .cell {
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05));
  }
  
  .cell.highlight, .cell.add-indicator {
    z-index: 2;
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
    animation: pulse 1.5s infinite alternate;
  }
  
  .cell.add-indicator {
    z-index: 3;
    animation: pulse-accent 1.5s infinite alternate;
  }
  
  .plus-icon {
    cursor: pointer;
    pointer-events: auto;
  }
  
  @keyframes pulse {
    from { opacity: 0.3; border-width: 1.5px; }
    to { opacity: 0.9; border-width: 2.5px; }
  }
  
  @keyframes pulse-accent {
    from { opacity: 0.5; border-width: 1.5px; }
    to { opacity: 1; border-width: 2.5px; }
  }
  
  .member-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 3;
  }
  
  .member {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    width: calc(var(--cell-size) * 1.1);
    height: calc(var(--cell-size) * 1.1);
  }
  
  .member:not(.dragging) { transition: transform 0.2s ease; }
  .member:hover { filter: brightness(1.05); }
  
  .member.dragging {
    filter: drop-shadow(0 0 8px var(--primary-color));
    transition: none;
  }
  
  .member.snapping { animation: snap 0.3s ease-in-out forwards; }
  
  @keyframes snap {
    0% { transform: scale(1.1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  
  @keyframes sensor-pulse {
    0% { 
      stroke-width: 4px; 
      filter: brightness(1);
    }
    100% { 
      stroke-width: 8px; 
      filter: brightness(1.8);
    }
  }
  
  .sensor-pulsating {
    animation: sensor-pulse 1s infinite alternate ease-in-out;
  }
  
  .pulsating {
    animation: sensor-pulse 1s infinite alternate ease-in-out;
  }
  
  .add-plant-button {
    position: absolute;
    z-index: 1000 !important;
    pointer-events: auto;
    user-select: none;
    line-height: 1;
    transition: transform 0.2s ease;
  }
  
  .add-plant-button:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  .sensor-rings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .sensor-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  /* Standardfarben für Sensor-Ringe */
  .sensor-ring-temperature { stroke: var(--sensor-ring-temperature-color); }
  .sensor-ring-conductivity { stroke: var(--sensor-ring-conductivity-color); }
  .sensor-ring-dli { stroke: var(--sensor-ring-dli-color); }
  .sensor-ring-health { stroke: var(--sensor-ring-health-color); }
  .sensor-ring-water_consumption { stroke: var(--sensor-ring-water_consumption-color); }
  .sensor-ring-fertilizer_consumption { stroke: var(--sensor-ring-fertilizer_consumption-color); }
  .sensor-ring-power_consumption { stroke: var(--sensor-ring-power_consumption-color); }
  .sensor-ring-moisture { stroke: var(--sensor-ring-moisture-color); }
  .sensor-ring-illuminance { stroke: var(--sensor-ring-illuminance-color); }
  .sensor-ring-humidity { stroke: var(--sensor-ring-humidity-color); }
  
  /* Hintergrundringe */
  .sensor-ring-bg {
    stroke: rgba(0,0,0,0.1);
    fill: none;
    stroke-width: 4px;
  }
  
  /* Disabled Ringe */
  .sensor-ring-disabled {
    stroke: var(--disabled-text-color, #80808080);
    fill: none;
    stroke-width: 4px;
    stroke-dasharray: 5,10;
  }
  
  /* Sensor-Ringe selbst */
  .sensor-ring-fg {
    fill: none;
    stroke-width: 4px;
  }
  
  /* Spezielle Styling für Health-Ring Segmente */
  .sensor-ring-health-segment {
    fill: none;
    stroke-width: 4px;
    transition: stroke 0.3s ease;
  }
  
  /* Farbverlauf für Health-Ring von Rot zu Gelb zu Grün */
  .sensor-ring-health-segment-0 { stroke: rgba(240,163,163,1); } /* Rot - sehr schlecht */
  .sensor-ring-health-segment-1 { stroke: rgb(244,176,144); }     /* Rötlicher Orange */
  .sensor-ring-health-segment-2 { stroke: rgb(248,189,125); }     /* Orange */
  .sensor-ring-health-segment-3 { stroke: rgb(251,202,106); }     /* Orange-Gelb */
  .sensor-ring-health-segment-4 { stroke: rgb(255,214,82); }      /* Gelb */
  .sensor-ring-health-segment-5 { stroke: rgb(234,212,85); }      /* Gelbgrün */
  .sensor-ring-health-segment-6 { stroke: rgb(212,209,83); }      /* Hellgrün */
  .sensor-ring-health-segment-7 { stroke: rgb(191,207,81); }      /* Grün */ 
  .sensor-ring-health-segment-8 { stroke: rgb(169,204,79); }      /* Sattgrün */
  .sensor-ring-health-segment-9 { stroke: rgb(148,202,83); }      /* Dunkelgrün */
  
  .member-image {
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--primary-color);
    background-color: var(--card-background-color, #fff);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  /* Heatmap-Overlay für die Pflanzenbilder */
  .heatmap-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }
  
  .member:hover .member-image { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
  
  .member.dragging .member-image {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    transform: scale(1.1);
    transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
  }
  
  .member.selected:not(.dragging):hover .member-image {
    transform: scale(1.1);
    cursor: grab;
  }
  
  .member:not(.selected):hover .member-image { cursor: pointer; }
  
  .member-image ha-icon {
    --mdc-icon-size: 70%;
    color: var(--primary-color);
  }
  
  .member.selected .member-image {
    border: 2px solid var(--accent-color, #f3a95e);
    box-shadow: 0 0 0 2px var(--accent-color, #f3a95e);
    transform: scale(1.05);
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .entity-name.selected { 
    color: var(--accent-color, #f3a95e);
    font-weight: bold;
  }
  
  .entity-name {
    position: absolute;
    left: 50%;
    top: calc(95%);
    transform: translateX(-50%);
    font-size: 0.8rem;
    max-width: 120%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: var(--primary-text-color);
    background-color: var(--card-background-color, #fff);
    padding: 1px 5px;
    border-radius: 10px;
    opacity: 0.9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    transition: opacity 0.2s ease, box-shadow 0.2s ease, font-weight 0.2s ease;
    z-index: 4;
  }
  
  .entity-name.dragging,
  .entity-name.hovering {
    opacity: 1;
    font-weight: bold;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }
  
  .cycle-group {
    position: absolute;
    border: 2px solid;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    box-sizing: border-box;
  }
  
  .cycle-label {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 2px 5px;
    font-size: 0.8em;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border-radius: 5px 0 5px 0;
    transform: translate(0, -2px);
    cursor: pointer !important;
    pointer-events: auto !important;
    z-index: 7 !important;
    transition: background-color 0.2s ease;
  }
  
  .cycle-label:hover { background-color: rgba(220, 220, 220, 0.95) !important; }
  
  .grid-point {
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: rgba(127, 127, 127, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  .grid-point.active { background-color: rgba(127, 127, 127, 0.5); }
  
  .debug-indicator {
    position: absolute;
    top: 5px;
    left: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    z-index: 8;
    font-size: 0.8rem;
  }
  
  .member-wrapper.dragging.selected .member-image {
    border-color: var(--accent-color, #f3a95e);
    box-shadow: 0 0 0 3px var(--accent-color, #f3a95e), 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  .clickable-cycle-label {
    position: absolute;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 0 8px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    cursor: pointer;
    pointer-events: auto;
    user-select: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    z-index: 9;
    white-space: nowrap;
    overflow: visible;
    max-width: none;
  }
  
  .clickable-cycle-label:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.4);
    filter: brightness(1.1);
    transform: translateX(-50%) scale(1.05);
  }
  
  .click-overlay {
    cursor: pointer;
    z-index: 3;
    pointer-events: none;
  }
  
  ha-card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 0; /* Erstellt einen Stacking-Kontext für die Karte */
  }
  
  ha-card .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  
  /* Styling für Sensorlabels */
  .sensor-labels {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    max-width: 85%;
    z-index: 5;
    pointer-events: none;
  }
  
  .sensor-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 5px;
    border-radius: 10px;
    background-color: var(--card-background-color, #fff);
    opacity: 0.9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 0.75rem;
    color: var(--primary-text-color);
    width: auto;
    white-space: nowrap;
    transition: opacity 0.2s ease, box-shadow 0.2s ease, font-weight 0.2s ease;
  }
  
  .sensor-label.sensor-pulsating {
    animation: label-pulse 1s infinite alternate ease-in-out;
  }
  
  .sensor-label.sensor-pulsating ha-icon,
  .sensor-label.sensor-pulsating .sensor-value {
    animation: sensor-color-pulse 1s infinite alternate ease-in-out;
  }
  
  @keyframes label-pulse {
    0% { 
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transform: scale(1);
      opacity: 0.9;
    }
    100% { 
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      transform: scale(1.15);
      opacity: 1;
    }
  }
  
  @keyframes sensor-color-pulse {
    0% { 
      filter: brightness(1);
    }
    100% { 
      filter: brightness(1.8);
    }
  }
  
  .sensor-label ha-icon {
    --mdc-icon-size: 12px;
    margin-right: 2px;
  }
  
  .sensor-value {
    font-weight: bold;
    margin-right: 2px;
  }
  
  .sensor-unit {
    opacity: 0.8;
    font-size: 0.7rem;
  }
  
  /* Anpassung der CSS-Variablen für die Sensorring-Farben, die auch für die Icons verwendet werden */
  :host {
    --sensor-ring-temperature-color: #2E93fA;
    --sensor-ring-conductivity-color: #00D2FF;
    --sensor-ring-dli-color: #FFB900;
    --sensor-ring-health-color: #FF4560;
    --sensor-ring-water_consumption-color: #775DD0;
    --sensor-ring-fertilizer_consumption-color: #00D2FF;
    --sensor-ring-power_consumption-color: #FEB019;
    --sensor-ring-moisture-color: #00E396;
    --sensor-ring-illuminance-color: #CED4DC;
    --sensor-ring-humidity-color: #008FFB;
  }
`},621:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.legendStyles=void 0;const s=i(437);e.legendStyles=s.css`
  :host {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    width: 40px;
    background-color: var(--card-background-color, #fff);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    max-height: calc(100% - 20px); /* Begrenzung nur an die Card */
    display: flex;
    flex-direction: column;
  }
  
  .legend-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    overflow: hidden;
  }
  
  .mode-toggle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    margin: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
    padding: 0;
    flex-shrink: 0; /* Verhindert Schrumpfen bei begrenztem Platz */
  }
  
  .mode-toggle ha-icon {
    --mdc-icon-size: 18px;
  }
  
  .mode-toggle:hover {
    transform: scale(1.05);
  }
  
  .content-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2px 0; /* Reduziertes Padding */
    -webkit-overflow-scrolling: touch; /* Verbessertes Scrollen für iOS */
    touch-action: pan-y; /* Erlaubt nur vertikales Scrollen */
  }
  
  .sensor-icons {
    display: flex;
    flex-direction: column;
    gap: 2px; /* Reduzierter Abstand zwischen Icons */
    width: 100%;
    align-items: center;
    padding-bottom: 0; /* Kein Padding am Ende */
  }
  
  .sensor-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: var(--secondary-background-color, #f5f5f5);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0; /* Verhindert Schrumpfen bei begrenztem Platz */
    margin: 1px 0; /* Reduzierter Abstand */
  }
  
  .sensor-icon.selected {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .sensor-icon ha-icon {
    --mdc-icon-size: 16px;
  }
  
  .sensor-icon:hover {
    transform: scale(1.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .sensor-icon.selected:hover {
    transform: scale(1.15);
  }
  
  .color-picker-section {
    margin-top: 2px; /* Reduzierter oberer Rand */
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 2px; /* Reduzierter Abstand */
    flex-shrink: 0;
    margin-bottom: 2px; /* Reduzierter unterer Rand */
  }
  
  .color-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
  }
  
  .color-option input[type="color"] {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .color-preview {
    padding: 1px; /* Reduziertes Padding */
    background-color: var(--secondary-background-color, #f5f5f5);
    border-radius: 4px;
  }
  
  .gradient-preview {
    height: 8px; /* Reduzierte Höhe */
    border-radius: 2px;
    cursor: ew-resize;
  }

  /* Scrollbar ausblenden für alle Browser */
  .content-container::-webkit-scrollbar {
    display: none;
  }
  
  .content-container {
    -ms-overflow-style: none;  /* IE und Edge */
    scrollbar-width: none;  /* Firefox */
  }
`},869:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getFieldOptions=e.getFieldValue=e.isSensorField=e.getFieldService=e.getFieldType=e.isFieldEditable=e.getFieldsByGroup=e.getFieldDefinition=e.FIELD_DEFINITIONS=void 0;const i={domain:"plant",action:"update_plant_attributes"},s={domain:"select",action:"select_option",entityPrefix:"select.",valueKey:"option"},n={domain:"number",action:"set_value",entityPrefix:"number.",valueKey:"value"},o=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"],r=(t,e,i,s)=>{var n;if(e.attributes._sensorMap&&e.attributes._sensorMap[s]){const i=e.attributes._sensorMap[s];return(null===(n=null==t?void 0:t.states[i])||void 0===n?void 0:n.state)||""}return""},a=(t,e,i,s)=>{var n,o;if(e.attributes._sensorMap&&e.attributes._sensorMap[s]){const i=e.attributes._sensorMap[s];return(null===(o=null===(n=null==t?void 0:t.states[i])||void 0===n?void 0:n.attributes)||void 0===o?void 0:o.options)||[]}return[]},l=t=>t.charAt(0).toUpperCase()+t.slice(1);e.FIELD_DEFINITIONS=[{id:"friendly_name",name:"Name",group:"name",type:"plant-name",clickAction:"none",getValue:(t,e)=>e.attributes.friendly_name||""},{id:"state",name:"Status",group:"basic",type:"badge",clickAction:"more-info",getValue:(t,e)=>e.state},{id:"area",name:"Bereich",group:"growing",type:"select",clickAction:"edit",service:{domain:"plant",action:"move_to_area"},options:t=>Object.values(t.areas||{}).map((t=>t.name)).sort(),getValue:(t,e)=>{var i;if(e.attributes._sensorMap&&e.attributes._sensorMap.location){const s=e.attributes._sensorMap.location,n=null===(i=null==t?void 0:t.states[s])||void 0===i?void 0:i.state;if(n)try{return JSON.parse(n).area||""}catch(t){return n}}return""}},{id:"growth_phase",name:"Phase",group:"growing",type:"select",clickAction:"edit",service:s,options:(t,e)=>a(t,e,0,"growth_phase"),getValue:(t,e)=>r(t,e,0,"growth_phase")},{id:"cycle",name:"Durchgang",group:"growing",type:"select",clickAction:"edit",service:s,options:(t,e)=>a(t,e,0,"cycle"),getValue:(t,e)=>r(t,e,0,"cycle")},{id:"pot_size",name:"Topfgröße",group:"growing",type:"number",clickAction:"edit",service:n,unit:"L",validation:{min:0,step:.1,numberType:"float"},getValue:(t,e)=>r(t,e,0,"pot_size")},{id:"flowering_duration",name:"Blütezeit",group:"growing",type:"number",clickAction:"edit",service:n,unit:"Tage",validation:{min:0,step:1,numberType:"integer"},getValue:(t,e)=>r(t,e,0,"flowering_duration")},{id:"strain",name:"Sorte",group:"genetics",type:"text",clickAction:"edit",service:i},{id:"breeder",name:"Züchter",group:"genetics",type:"text",clickAction:"edit",service:i},{id:"feminized",name:"Feminisiert",group:"genetics",type:"text",clickAction:"edit",service:i},{id:"original_flowering_duration",name:"Original Blütezeit",group:"genetics",type:"text",clickAction:"edit",service:i},...o.map((t=>({id:`${t}_beginn`,name:`${l(t)} Start`,group:"phasebegin",type:"date",clickAction:"edit",service:i}))),...o.map((t=>({id:`${t}_dauer`,name:`${l(t)} Dauer`,group:"phasedauer",type:"number",clickAction:"edit",service:i,unit:"Tage",validation:{min:0,step:1}}))),{id:"soil_moisture",name:"Feuchtigkeit",group:"sensors",type:"sensor",clickAction:"more-info",unit:"%",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"soil_moisture")},{id:"temperature",name:"Temperatur",group:"sensors",type:"sensor",clickAction:"more-info",unit:"°C",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"temperature")},{id:"conductivity",name:"Leitfähigkeit",group:"sensors",type:"sensor",clickAction:"more-info",unit:"µS/cm",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"conductivity")},{id:"ph",name:"pH-Wert",group:"sensors",type:"sensor",clickAction:"more-info",unit:"pH",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"ph")},{id:"illuminance",name:"Beleuchtung",group:"sensors",type:"sensor",clickAction:"more-info",unit:"lx",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"illuminance")},{id:"air_humidity",name:"Luftfeuchtigkeit",group:"sensors",type:"sensor",clickAction:"more-info",unit:"%",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"air_humidity")},{id:"dli",name:"DLI",group:"sensors",type:"sensor",clickAction:"more-info",unit:"mol/d⋅m²",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"dli")},{id:"water_consumption",name:"Wasserverbrauch",group:"sensors",type:"sensor",clickAction:"more-info",unit:"ml",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"water_consumption")},{id:"fertilizer_consumption",name:"Düngerverbrauch",group:"sensors",type:"sensor",clickAction:"more-info",unit:"ml",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"fertilizer_consumption")},{id:"health",name:"Gesundheit",group:"sensors",type:"sensor",clickAction:"more-info",unit:"",isSensor:!0,showStatusBar:!0,getValue:(t,e)=>r(t,e,0,"health")},{id:"ppfd_mol",name:"PPFD",group:"diagnostics",type:"sensor",clickAction:"more-info",unit:"µmol/m²/s",isSensor:!0,showStatusBar:!1,getValue:(t,e)=>{const i=r(t,e,0,"ppfd_mol");return i?Number(i).toFixed(6):i}},{id:"total_ppfd_mol_integral",name:"Total PPFD",group:"diagnostics",type:"sensor",clickAction:"more-info",unit:"mol/m²",isSensor:!0,showStatusBar:!1,getValue:(t,e)=>r(t,e,0,"total_ppfd_mol_integral")},{id:"total_water_consumption",name:"Gesamt Wasserverbrauch",group:"diagnostics",type:"sensor",clickAction:"more-info",unit:"L",isSensor:!0,showStatusBar:!1,getValue:(t,e)=>r(t,e,0,"total_water_consumption")},{id:"total_fertilizer_consumption",name:"Gesamt Düngerverbrauch",group:"diagnostics",type:"sensor",clickAction:"more-info",unit:"ml",isSensor:!0,showStatusBar:!1,getValue:(t,e)=>r(t,e,0,"total_fertilizer_consumption")},...["air_humidity","soil_moisture","temperature","conductivity","illuminance","dli","water_consumption","fertilizer_consumption","ph"].flatMap((t=>[{id:`min_${t}`,name:`Min ${t}`,group:"min_max",type:"number",clickAction:"edit",service:n,getValue:(e,i)=>r(e,i,0,`min_${t}`)},{id:`max_${t}`,name:`Max ${t}`,group:"min_max",type:"number",clickAction:"edit",service:n,getValue:(e,i)=>r(e,i,0,`max_${t}`)}])),{id:"timestamp",name:"Zeitstempel",group:"details",type:"text",clickAction:"none",getValue:(t,e)=>e.attributes.timestamp||""},{id:"difficulty",name:"Schwierigkeit",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.difficulty||""},{id:"yield",name:"Ertrag",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.yield||""},{id:"mold_resistance",name:"Schimmelresistenz",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.mold_resistance||""},{id:"hunger",name:"Hunger",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.hunger||""},{id:"effects",name:"Effekte",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.effects||""},{id:"smell",name:"Geruch",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.smell||""},{id:"taste",name:"Geschmack",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.taste||""},{id:"phenotype",name:"Phänotyp",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.phenotype||""},{id:"growth_stretch",name:"Wachstumsdehnung",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.growth_stretch||""},{id:"flower_stretch",name:"Blütendehnung",group:"details",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.flower_stretch||""},{id:"notes",name:"Notizen",group:"notes",type:"textarea",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.notes||""},{id:"website",name:"Website",group:"notes",type:"text",clickAction:"edit",service:i,getValue:(t,e)=>e.attributes.website||"",hasExternalLink:!0}],e.getFieldDefinition=t=>e.FIELD_DEFINITIONS.find((e=>e.id===t)),e.getFieldsByGroup=t=>e.FIELD_DEFINITIONS.filter((e=>e.group===t)),e.isFieldEditable=t=>{var i;return"edit"===(null===(i=(0,e.getFieldDefinition)(t))||void 0===i?void 0:i.clickAction)},e.getFieldType=t=>{var i;return(null===(i=(0,e.getFieldDefinition)(t))||void 0===i?void 0:i.type)||"text"},e.getFieldService=t=>{var i;return null===(i=(0,e.getFieldDefinition)(t))||void 0===i?void 0:i.service},e.isSensorField=t=>{var i;return(null===(i=(0,e.getFieldDefinition)(t))||void 0===i?void 0:i.isSensor)||!1},e.getFieldValue=(t,i,s)=>{var n;const o=(0,e.getFieldDefinition)(t);return o?o.getValue?o.getValue(i,s):(null===(n=s.attributes[t])||void 0===n?void 0:n.toString())||"":""},e.getFieldOptions=(t,i,s)=>{const n=(0,e.getFieldDefinition)(t);return(null==n?void 0:n.options)?n.options(i,s):[]}},442:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FilterUtils=void 0;const s=i(598),n=i(869);class o{static getEntityValue(t,e,i){return(0,n.getFieldValue)(i,t,e).toString()}static getUniqueValues(t,e,i){return[...new Set(e.map((e=>this.getEntityValue(t,e,i))))].sort()}static getAreaForEntity(t,e){if(!t)return;t.areas;const i=t.devices||{},s=(t.entities||{})[e];if(s){if(s.area_id)return s.area_id;if(s.device_id){const t=i[s.device_id];if(null==t?void 0:t.area_id)return t.area_id}}}static applyFilters(t,e,i){let o=e.filter((t=>{const e=t.entity_id.split(".")[0];return i.entityTypes.has(e)}));return Object.keys(i.activeFilters).length>0&&(o=o.filter((e=>Object.entries(i.activeFilters).every((([i,o])=>{if("entity_type"===i)return!0;if((0,n.isSensorField)(i)){const n=s.SensorUtils.getSensorInfo(t,e,i),r=o;return n.value>=r.min&&n.value<=r.max}const r=this.getEntityValue(t,e,i);return o.has(r)}))))),o}static toggleFilter(t,e,i){if((0,n.isSensorField)(t))i.activeFilters[t]=e,i.activeFilters[t]||delete i.activeFilters[t];else{i.activeFilters[t]||(i.activeFilters[t]=new Set);const s=i.activeFilters[t];s.has(e)?(s.delete(e),0===s.size&&delete i.activeFilters[t]):s.add(e)}}static toggleEntityType(t,e){e.entityTypes.has(t)?e.entityTypes.size>1&&e.entityTypes.delete(t):e.entityTypes.add(t)}static getFilteredPlants(t,e,i,s,r){let a=o.applyFilters(t,e,i);return s&&(a=a.filter((e=>[(0,n.getFieldValue)("friendly_name",t,e),(0,n.getFieldValue)("state",t,e),(0,n.getFieldValue)("area",t,e),...r.map((i=>(0,n.getFieldValue)(i,t,e)))].filter(Boolean).some((t=>t.toString().toLowerCase().includes(s.toLowerCase())))))),a}}e.FilterUtils=o},63:function(t,e){var i=this&&this.__awaiter||function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function r(t){try{l(s.next(t))}catch(t){o(t)}}function a(t){try{l(s.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(r,a)}l((s=s.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.PlantEntityUtils=void 0;class s{static getPlantInfo(t,e){return i(this,void 0,void 0,(function*(){return this._plantInfoCache[e]?this._plantInfoCache[e]:this._loadPlantInfoWithRetry(t,e)}))}static _loadPlantInfoWithRetry(t,e){return i(this,void 0,void 0,(function*(){try{this._plantLastLoaded[e]=Date.now();const i=yield t.callWS({type:"plant/get_info",entity_id:e}),s="object"==typeof i&&null!==i&&"result"in i?i.result:null;return s&&(this._plantInfoCache[e]=s),this._scheduleNextUpdate(t,e),s}catch(i){return console.error(`[PLANT-ENTITY] Fehler beim API-Call für ${e}:`,i),this._scheduleNextUpdate(t,e,!0),null}}))}static _scheduleNextUpdate(t,e,i=!1){this._plantRetryTimeouts[e]&&(window.clearTimeout(this._plantRetryTimeouts[e]),delete this._plantRetryTimeouts[e]),this._plantRetryTimeouts[e]=window.setTimeout((()=>{delete this._plantRetryTimeouts[e],this._loadPlantInfoWithRetry(t,e)}),i?1e4:5e3)}static initPlantDataLoading(t,e){t&&0!==e.length&&(this.clearAllTimeouts(),e.forEach(((e,i)=>{if(this._plantInfoCache[e])return void(this._plantRetryTimeouts[e]||this._scheduleNextUpdate(t,e));const s=500+2e3*Math.random();this._plantRetryTimeouts[e]=window.setTimeout((()=>{delete this._plantRetryTimeouts[e],this._loadPlantInfoWithRetry(t,e)}),s)})))}static clearAllTimeouts(){Object.values(this._plantRetryTimeouts).forEach((t=>{window.clearTimeout(t)})),this._plantRetryTimeouts={}}static getPlantEntities(t,e="all"){return Object.values(t.states).filter((t=>{if("object"!=typeof t||null===t||!("entity_id"in t)||!("attributes"in t)||"string"!=typeof t.entity_id)return!1;const i=t.entity_id.startsWith("plant."),s=t.entity_id.startsWith("cycle.")&&"member_count"in t.attributes;return"plant"===e?i:"cycle"===e?s:i||s}))}static updatePlantInfo(t,e,s){return i(this,void 0,void 0,(function*(){const i=new Map(s),n=e.map((t=>t.entity_id));this.initPlantDataLoading(t,n);for(const t of e){const e=this._plantInfoCache[t.entity_id];e?i.set(t.entity_id,e):i.has(t.entity_id)||i.set(t.entity_id,null)}return i}))}static togglePlantSelection(t,e,i){null==i||i.stopPropagation();const s=new Set(e);return s.has(t)?s.delete(t):s.add(t),s}static clearPlantSelection(t){return new Set}}e.PlantEntityUtils=s,s._plantInfoCache={},s._plantRetryTimeouts={},s._plantLastLoaded={}},598:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SensorUtils=void 0;const s=i(869);e.SensorUtils=class{static getSensorInfo(t,e,i){const n=(0,s.getFieldDefinition)(i);if(e.attributes._sensorMap&&e.attributes._sensorMap[i]){const s=e.attributes._sensorMap[i],o=null==t?void 0:t.states[s];if(o)return{value:Number(o.state)||0,state:o.state,unit:(null==n?void 0:n.unit)||o.attributes.unit_of_measurement||"",min:o.attributes.min_value,max:o.attributes.max_value}}if(e.attributes._apiInfo){const t=e.attributes._apiInfo,s={soil_moisture:"moisture",air_humidity:"humidity",total_ppfd_mol_integral:"total_integral",total_water_consumption:"total_water",total_fertilizer_consumption:"total_fertilizer"}[i]||i;if(t[s]&&t[s].current)return{value:Number(t[s].current)||0,state:t[s].current,unit:(null==n?void 0:n.unit)||t[s].unit_of_measurement||"",min:t[s].min?Number(t[s].min):null,max:t[s].max?Number(t[s].max):null};if(t.diagnostic_sensors&&t.diagnostic_sensors[s]&&t.diagnostic_sensors[s].current)return{value:Number(t.diagnostic_sensors[s].current)||0,state:t.diagnostic_sensors[s].current,unit:(null==n?void 0:n.unit)||t.diagnostic_sensors[s].unit_of_measurement||"",min:null,max:null}}return{value:0,state:"N/A",unit:(null==n?void 0:n.unit)||"",min:null,max:null}}static getSensorRange(t,e,i){const n=(0,s.getFieldDefinition)(i);return{min:null,max:null,unit:(null==n?void 0:n.unit)||""}}static getSensorThresholds(t,e,i){var s,n;if(e.attributes._apiInfo){const t=e.attributes._apiInfo,s={soil_moisture:"moisture",air_humidity:"humidity",total_ppfd_mol_integral:"total_integral",total_water_consumption:"total_water",total_fertilizer_consumption:"total_fertilizer"}[i]||i;if(t[s]&&void 0!==t[s].min&&void 0!==t[s].max)return{min:Number(t[s].min)||0,max:Number(t[s].max)||100}}if(e.attributes._sensorMap){const o=e.attributes._sensorMap[`min_${i}`],r=e.attributes._sensorMap[`max_${i}`];if(o&&r&&"unavailable"!==(null===(s=t.states[o])||void 0===s?void 0:s.state)&&"unavailable"!==(null===(n=t.states[r])||void 0===n?void 0:n.state))return{min:Number(t.states[o].state)||0,max:Number(t.states[r].state)||100}}return{min:0,max:100}}static isSensorColumn(t){return(0,s.isSensorField)(t)}static calculateSensorStatus(t,e,i){return isNaN(t)?"unavailable":t>=e&&t<=i?"good":"bad"}}},752:(t,e,i)=>{var s;i.d(e,{JW:()=>E,XX:()=>G,c0:()=>C,ge:()=>B,qy:()=>A,s6:()=>k});const n=window,o=n.trustedTypes,r=o?o.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,c="?"+l,h=`<${c}>`,d=document,u=()=>d.createComment(""),p=t=>null===t||"object"!=typeof t&&"function"!=typeof t,g=Array.isArray,m=t=>g(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),_="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,y=/-->/g,v=/>/g,b=RegExp(`>|${_}(?:([^\\s"'>=/]+)(${_}*=${_}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),x=/'/g,w=/"/g,$=/^(?:script|style|textarea|title)$/i,S=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),A=S(1),E=S(2),C=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),P=new WeakMap,M=d.createTreeWalker(d,129,null,!1);function z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==r?r.createHTML(e):e}const O=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=f;for(let e=0;e<i;e++){const i=t[e];let c,d,u=-1,p=0;for(;p<i.length&&(r.lastIndex=p,d=r.exec(i),null!==d);)p=r.lastIndex,r===f?"!--"===d[1]?r=y:void 0!==d[1]?r=v:void 0!==d[2]?($.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=b):void 0!==d[3]&&(r=b):r===b?">"===d[0]?(r=null!=n?n:f,u=-1):void 0===d[1]?u=-2:(u=r.lastIndex-d[2].length,c=d[1],r=void 0===d[3]?b:'"'===d[3]?w:x):r===w||r===x?r=b:r===y||r===v?r=f:(r=b,n=void 0);const g=r===b&&t[e+1].startsWith("/>")?" ":"";o+=r===f?i+h:u>=0?(s.push(c),i.slice(0,u)+a+i.slice(u)+l+g):i+l+(-2===u?(s.push(void 0),e):g)}return[z(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class R{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const h=t.length-1,d=this.parts,[p,g]=O(t,e);if(this.el=R.createElement(p,i),M.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=M.nextNode())&&d.length<h;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(a)||e.startsWith(l)){const i=g[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+a).split(l),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?N:"?"===e[1]?j:"@"===e[1]?H:I})}else d.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if($.test(s.tagName)){const t=s.textContent.split(l),e=t.length-1;if(e>0){s.textContent=o?o.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],u()),M.nextNode(),d.push({type:2,index:++n});s.append(t[e],u())}}}else if(8===s.nodeType)if(s.data===c)d.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(l,t+1));)d.push({type:7,index:n}),t+=l.length-1}n++}}static createElement(t,e){const i=d.createElement("template");return i.innerHTML=t,i}}function D(t,e,i=t,s){var n,o,r,a;if(e===C)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const c=p(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=D(t,l._$AS(t,e.values),l,s)),e}class T{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:d).importNode(i,!0);M.currentNode=n;let o=M.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new L(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new U(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=M.nextNode(),r++)}return M.currentNode=d,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{constructor(t,e,i,s){var n;this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=D(this,t,e),p(t)?t===k||null==t||""===t?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==C&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):m(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==k&&p(this._$AH)?this._$AA.nextSibling.data=t:this.$(d.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=R.createElement(z(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new T(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=P.get(t.strings);return void 0===e&&P.set(t.strings,e=new R(t)),e}T(t){g(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new L(this.k(u()),this.k(u()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class I{constructor(t,e,i,s,n){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=k}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=D(this,t,e,0),o=!p(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=D(this,s[i+r],e,r),a===C&&(a=this._$AH[r]),o||(o=!p(a)||a!==this._$AH[r]),a===k?t=k:t!==k&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class N extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}}const F=o?o.emptyScript:"";class j extends I{constructor(){super(...arguments),this.type=4}j(t){t&&t!==k?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class H extends I{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=D(this,t,e,0))&&void 0!==i?i:k)===C)return;const s=this._$AH,n=t===k&&s!==k||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==k&&(s===k||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class U{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}}const B={O:a,P:l,A:c,C:1,M:O,L:T,R:m,D,I:L,V:I,H:j,N:H,U:N,F:U},V=n.litHtmlPolyfillSupport;null==V||V(R,L),(null!==(s=n.litHtmlVersions)&&void 0!==s?s:n.litHtmlVersions=[]).push("2.8.0");const G=(t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new L(e.insertBefore(u(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>s,eventOptions:()=>c,property:()=>r,query:()=>h,queryAll:()=>d,queryAssignedElements:()=>m,queryAssignedNodes:()=>_,queryAsync:()=>u,state:()=>a});const s=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),n=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},o=(t,e,i)=>{e.constructor.createProperty(i,t)};function r(t){return(e,i)=>void 0!==i?o(t,e,i):n(t,e)}function a(t){return r({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,s)=>{var n;if(void 0===s){const s=null!==(n=i.originalKey)&&void 0!==n?n:i.key,o=null!=e?{kind:"method",placement:"prototype",key:s,descriptor:e(i.key)}:{...i,key:s};return null!=t&&(o.finisher=function(e){t(e,s)}),o}{const n=i.constructor;void 0!==e&&Object.defineProperty(i,s,e(s)),null==t||t(n,s)}};function c(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function h(t,e){return l({descriptor:i=>{const s={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;s.get=function(){var i,s;return void 0===this[e]&&(this[e]=null!==(s=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==s?s:null),this[e]}}return s}})}function d(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function u(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var p;const g=null!=(null===(p=window.HTMLSlotElement)||void 0===p?void 0:p.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function m(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:s=>({get(){var s;const n="slot"+(e?`[name=${e}]`:":not([name])"),o=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(n),r=null!=o?g(o,t):[];return i?r.filter((t=>t.matches(i))):r},enumerable:!0,configurable:!0})})}function _(t,e,i){let s,n=t;return"object"==typeof t?(n=t.slot,s=t):s={flatten:e},i?m({slot:n,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(n?`[name=${n}]`:":not([name])"),o=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==o?void 0:o.assignedNodes(s))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},278:(t,e,i)=>{i.r(e),i.d(e,{styleMap:()=>a});var s=i(752);class n{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const o="important",r=" !"+o,a=(l=class extends n{constructor(t){var e;if(super(t),1!==t.type||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ht){this.ht=new Set;for(const t in e)this.ht.add(t);return this.render(e)}this.ht.forEach((t=>{null==e[t]&&(this.ht.delete(t),t.includes("-")?i.removeProperty(t):i[t]="")}));for(const t in e){const s=e[t];if(null!=s){this.ht.add(t);const e="string"==typeof s&&s.endsWith(r);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?o:""):i[t]=s}}return s.c0}},(...t)=>({_$litDirective$:l,values:t}));var l},437:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>a,LitElement:()=>E,ReactiveElement:()=>x,UpdatingElement:()=>A,_$LE:()=>k,_$LH:()=>S.ge,adoptStyles:()=>h,css:()=>c,defaultConverter:()=>f,getCompatibleStyle:()=>d,html:()=>S.qy,isServer:()=>P,noChange:()=>S.c0,notEqual:()=>y,nothing:()=>S.s6,render:()=>S.XX,supportsAdoptingStyleSheets:()=>n,svg:()=>S.JW,unsafeCSS:()=>l});const s=window,n=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new a("string"==typeof t?t:t+"",void 0,o),c=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(i,t,o)},h=(t,e)=>{n?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),n=s.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}))},d=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var u;const p=window,g=p.trustedTypes,m=g?g.emptyScript:"",_=p.reactiveElementPolyfillSupport,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>e!==t&&(e==e||t==t),v={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:y},b="finalized";class x extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty(b))return!1;this[b]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(d(t))}else void 0!==t&&e.push(d(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return h(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=v){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:f).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:f;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||y)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}x[b]=!0,x.elementProperties=new Map,x.elementStyles=[],x.shadowRootOptions={mode:"open"},null==_||_({ReactiveElement:x}),(null!==(u=p.reactiveElementVersions)&&void 0!==u?u:p.reactiveElementVersions=[]).push("1.6.3");var w,$,S=i(752);const A=x;class E extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,S.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return S.c0}}E.finalized=!0,E._$litElement$=!0,null===(w=globalThis.litElementHydrateSupport)||void 0===w||w.call(globalThis,{LitElement:E});const C=globalThis.litElementPolyfillSupport;null==C||C({LitElement:E});const k={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==($=globalThis.litElementVersions)&&void 0!==$?$:globalThis.litElementVersions=[]).push("3.3.3");const P=!1}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var o=e[s]={exports:{}};return t[s].call(o.exports,o,o.exports,i),o.exports}i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(434)})();