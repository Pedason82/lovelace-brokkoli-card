/*! For license information please see flower-card.js.LICENSE.txt */
(()=>{"use strict";var t={147:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0});const n=i(356),a=i(823),r=i(516),o=i(167);class s extends a.LitElement{constructor(){super(...arguments),this.controlRenderers={[r.FormControlType.Dropdown]:o.renderDropdown,[r.FormControlType.Radio]:o.renderRadio,[r.FormControlType.Checkboxes]:o.renderCheckboxes,[r.FormControlType.EntityDropdown]:o.renderDropdown,[r.FormControlType.Switch]:o.renderSwitch,[r.FormControlType.Textbox]:o.renderTextbox,[r.FormControlType.Filler]:o.renderFiller}}setConfig(t){this._config=t,this.requestUpdate("_config")}set hass(t){this._hass=t}renderForm(t){return a.html`
            <div class="card-config">
                ${t.map((t=>{const e=t.cssClass?`form-row ${t.cssClass}`:"form-row";return t.hidden?"":a.html`
                        <div class="${e}">
                            <label>${t.label}</label>
                            ${t.controls.map((t=>this.renderControl(t)))}
                        </div>
                        `}))}            
            </div>
            `}renderControl(t){const e=this.controlRenderers[t.type];if(!e)throw new Error(`Unsupported control type: ${t.type}`);return e(this,t)}_valueChanged(t){if(!this._config||!this._hass)return;const e=t.target,i=t.detail;if("HA-CHECKBOX"===e.tagName){const t=this._config[e.configValue].indexOf(e.value);let i;i=e.checked&&t<0?[...this._config[e.configValue],e.value]:!e.checked&&t>-1?[...this._config[e.configValue].slice(0,t),...this._config[e.configValue].slice(t+1)]:this._config[e.configValue],this._config={...this._config,[e.configValue]:i}}else if(e.configValue)if(e.configValue.indexOf(".")>-1){const[t,i]=e.configValue.split(".");this._config={...this._config,[t]:{...this._config[t],[i]:e.checked}}}else this._config={...this._config,[e.configValue]:void 0===e.checked&&(null==i?void 0:i.value)?e.checked||i.value:e.value||e.checked};(0,n.fireEvent)(this,"config-changed",{config:this._config},{bubbles:!0,composed:!0}),this.requestUpdate("_config")}static get styles(){return a.css`
            .form-row {
                margin-bottom: 10px;
            }
            .form-control {
                display: flex;
                align-items: center;
            }
            ha-switch {
                padding: 16px 6px;
            }
            .side-by-side {
                display: flex;
                flex-flow: row wrap;
            }            
            .side-by-side > label {
                width: 100%;
            }
            .side-by-side > .form-control {
                width: 49%;
                padding: 2px;
            }
            ha-textfield { 
                width: 100%;
            }
        `}}e.default=s},516:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.FormControlType=void 0,function(t){t.Dropdown="dropdown",t.Checkbox="checkbox",t.Checkboxes="checkboxes",t.Radio="radio",t.Switch="switch",t.Textbox="textbox",t.Filler="filler",t.EntityDropdown="entity-dropdown"}(i||(e.FormControlType=i={}))},167:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.renderCheckboxes=e.renderRadio=e.renderDropdown=e.renderSwitch=e.renderTextbox=e.renderEntityDropdown=e.renderFiller=void 0;const n=i(823),a=i(770);e.renderFiller=()=>n.html`<div class="form-control"></div>`,e.renderEntityDropdown=(t,e)=>{var i;return n.html`
    <div class="form-control">
        <ha-entity-picker
            label="${e.label}"
            .value="${null!==(i=t._config[e.configValue])&&void 0!==i?i:""}"
            .configValue="${e.configValue}"
            .hass="${t._hass}"
            domain-filter="${e.domain}"
            @change="${t._valueChanged}">
        </ha-entity-picker>
    </div>
    `},e.renderTextbox=(t,e)=>{var i;return n.html`
    <div class="form-control">
        <ha-textfield
            label="${e.label}"
            .value="${null!==(i=t._config[e.configValue])&&void 0!==i?i:""}"
            .configValue="${e.configValue}"
            @change="${t._valueChanged}">
        </ha-textfield>
    </div>
    `},e.renderSwitch=(t,e)=>n.html`
    <div class="form-control">
        <ha-switch
            id="${e.configValue}"
            name="${e.configValue}"
            .checked="${t._config[e.configValue]}"
            .configValue="${e.configValue}"
            @change="${t._valueChanged}"
        >
        </ha-switch>
        <label for="${e.configValue}">${e.label}</label>
    </div>
    `,e.renderDropdown=(t,e)=>{var i;const r=null!==(i=e.items)&&void 0!==i?i:(0,a.getEntitiesByDomain)(t._hass,e.domain);return n.html`  
    <div class="form-control">
        <ha-combo-box
            label="${e.label}"
            .value="${t._config[e.configValue]}"
            .configValue="${e.configValue}"
            .items="${r}"
            @value-changed="${t._valueChanged}"
            @change=${t._valueChanged}
        ></ha-combo-box>
    </div>
      `},e.renderRadio=(t,e)=>n.html`
        <div class="form-control">
            <label>${e.label}</label>
            ${e.items.map((i=>n.html`
                    <ha-radio
                        id="${e.configValue}_${i.value}"
                        name="${e.configValue}"
                        .checked="${t._config[e.configValue]===i.value}"
                        .configValue="${e.configValue}"
                        .value="${i.value}"
                        @change="${t._valueChanged}"
                    >
                    </ha-radio>
                    <label for="${e.configValue}_${i.value}">${i.label}</label>
                `))}
        </div>
      `,e.renderCheckboxes=(t,e)=>n.html`
        <label>${e.label}</label>
        ${e.items.map((i=>{var a;return n.html`                
            <div class="form-control">
                <ha-checkbox
                    id="${e.configValue}_${i.value}"
                    name="${e.configValue}[]"
                    .checked="${(null===(a=t._config[e.configValue])||void 0===a?void 0:a.indexOf(i.value))>-1}"
                    .configValue="${e.configValue}"
                    .value="${i.value}"
                    @change="${t._valueChanged}"
                >
                </ha-checkbox>
                <label for="${e.configValue}_${i.value}">${i.label}</label>
            </div>
            `}))}
      `},770:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getDropdownOptionsFromEnum=e.formatList=e.getEntitiesByDeviceClass=e.getEntitiesByDomain=void 0,e.getEntitiesByDomain=(t,i)=>Object.keys(t.states).filter((t=>t.substr(0,t.indexOf("."))===i)).map((i=>(0,e.formatList)(i,t))),e.getEntitiesByDeviceClass=(t,i,n)=>Object.keys(t.states).filter((e=>e.substr(0,e.indexOf("."))===i&&t.states[e].attributes.device_class===n)).map((i=>(0,e.formatList)(i,t))),e.formatList=(t,e)=>({label:e.states[t].attributes.friendly_name,value:t}),e.getDropdownOptionsFromEnum=t=>{const e=[];for(const[i,n]of Object.entries(t))e.push({value:n,label:i});return e}},356:(t,e,i)=>{i.r(e),i.d(e,{DEFAULT_DOMAIN_ICON:()=>Z,DEFAULT_PANEL:()=>K,DEFAULT_VIEW_ENTITY_ID:()=>st,DOMAINS_HIDE_MORE_INFO:()=>et,DOMAINS_MORE_INFO_NO_HISTORY:()=>it,DOMAINS_TOGGLE:()=>at,DOMAINS_WITH_CARD:()=>J,DOMAINS_WITH_MORE_INFO:()=>tt,NumberFormat:()=>n,STATES_OFF:()=>nt,TimeFormat:()=>a,UNIT_C:()=>rt,UNIT_F:()=>ot,applyThemesOnElement:()=>L,computeCardSize:()=>P,computeDomain:()=>F,computeEntity:()=>R,computeRTL:()=>H,computeRTLDirection:()=>V,computeStateDisplay:()=>Q,computeStateDomain:()=>B,createThing:()=>ht,debounce:()=>ut,domainIcon:()=>mt,evaluateFilter:()=>gt,fireEvent:()=>lt,fixedIcons:()=>pt,formatDate:()=>d,formatDateMonth:()=>y,formatDateMonthYear:()=>f,formatDateNumeric:()=>u,formatDateShort:()=>m,formatDateTime:()=>$,formatDateTimeNumeric:()=>E,formatDateTimeWithSeconds:()=>k,formatDateWeekday:()=>l,formatDateYear:()=>_,formatNumber:()=>Y,formatTime:()=>M,formatTimeWeekday:()=>O,formatTimeWithSeconds:()=>C,forwardHaptic:()=>ft,getLovelace:()=>Et,handleAction:()=>xt,handleActionConfig:()=>_t,handleClick:()=>wt,hasAction:()=>$t,hasConfigOrEntityChanged:()=>At,hasDoubleClick:()=>kt,isNumericState:()=>X,navigate:()=>bt,numberFormatToLocale:()=>W,relativeTime:()=>N,round:()=>q,stateIcon:()=>Tt,timerTimeRemaining:()=>U,toggleEntity:()=>vt,turnOnOffEntities:()=>St,turnOnOffEntity:()=>yt});var n,a,r,o=function(){return o=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var a in e=arguments[i])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},o.apply(this,arguments)},s={second:45,minute:45,hour:22,day:5},l=function(t,e){return c(e).format(t)},c=function(t){return new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"})},d=function(t,e){return h(e).format(t)},h=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"})},u=function(t,e){return p(e).format(t)},p=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"})},m=function(t,e){return g(e).format(t)},g=function(t){return new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"})},f=function(t,e){return b(e).format(t)},b=function(t){return new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"})},y=function(t,e){return v(e).format(t)},v=function(t){return new Intl.DateTimeFormat(t.language,{month:"long"})},_=function(t,e){return x(e).format(t)},x=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric"})};(r=n||(n={})).language="language",r.system="system",r.comma_decimal="comma_decimal",r.decimal_comma="decimal_comma",r.space_comma="space_comma",r.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(a||(a={}));var w=function(t){if(t.time_format===a.language||t.time_format===a.system){var e=t.time_format===a.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===a.am_pm},$=function(t,e){return A(e).format(t)},A=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:w(t)?"numeric":"2-digit",minute:"2-digit",hour12:w(t)})},k=function(t,e){return S(e).format(t)},S=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:w(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:w(t)})},E=function(t,e){return D(e).format(t)},D=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:w(t)})},M=function(t,e){return T(e).format(t)},T=function(t){return new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hour12:w(t)})},C=function(t,e){return I(e).format(t)},I=function(t){return new Intl.DateTimeFormat(t.language,{hour:w(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:w(t)})},O=function(t,e){return j(e).format(t)},j=function(t){return new Intl.DateTimeFormat(t.language,{hour:w(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:w(t)})},N=function(t,e,i,n){void 0===n&&(n=!0);var a=function(t,e,i){void 0===e&&(e=Date.now()),void 0===i&&(i={});var n=o(o({},s),i||{}),a=(+t-+e)/1e3;if(Math.abs(a)<n.second)return{value:Math.round(a),unit:"second"};var r=a/60;if(Math.abs(r)<n.minute)return{value:Math.round(r),unit:"minute"};var l=a/3600;if(Math.abs(l)<n.hour)return{value:Math.round(l),unit:"hour"};var c=a/86400;if(Math.abs(c)<n.day)return{value:Math.round(c),unit:"day"};var d=new Date(t),h=new Date(e),u=d.getFullYear()-h.getFullYear();if(Math.round(Math.abs(u))>0)return{value:Math.round(u),unit:"year"};var p=12*u+d.getMonth()-h.getMonth();if(Math.round(Math.abs(p))>0)return{value:Math.round(p),unit:"month"};var m=a/604800;return{value:Math.round(m),unit:"week"}}(t,i);return n?function(t){return new Intl.RelativeTimeFormat(t.language,{numeric:"auto"})}(e).format(a.value,a.unit):Intl.NumberFormat(e.language,{style:"unit",unit:a.unit,unitDisplay:"long"}).format(Math.abs(a.value))};function U(t){var e,i=3600*(e=t.attributes.remaining.split(":").map(Number))[0]+60*e[1]+e[2];if("active"===t.state){var n=(new Date).getTime(),a=new Date(t.last_changed).getTime();i=Math.max(i-(n-a)/1e3,0)}return i}function z(){return(z=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}var L=function(t,e,i,n){void 0===n&&(n=!1),t._themes||(t._themes={});var a=e.default_theme;("default"===i||i&&e.themes[i])&&(a=i);var r=z({},t._themes);if("default"!==a){var o=e.themes[a];Object.keys(o).forEach((function(e){var i="--"+e;t._themes[i]="",r[i]=o[e]}))}if(t.updateStyles?t.updateStyles(r):window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,r),n){var s=document.querySelector("meta[name=theme-color]");if(s){s.hasAttribute("default-content")||s.setAttribute("default-content",s.getAttribute("content"));var l=r["--primary-color"]||s.getAttribute("default-content");s.setAttribute("content",l)}}},P=function(t){return"function"==typeof t.getCardSize?t.getCardSize():4};function F(t){return t.substr(0,t.indexOf("."))}function R(t){return t.substr(t.indexOf(".")+1)}function H(t){var e,i=(null==t||null==(e=t.locale)?void 0:e.language)||"en";return t.translationMetadata.translations[i]&&t.translationMetadata.translations[i].isRTL||!1}function V(t){return H(t)?"rtl":"ltr"}function B(t){return F(t.entity_id)}var X=function(t){return!!t.attributes.unit_of_measurement||!!t.attributes.state_class},W=function(t){switch(t.number_format){case n.comma_decimal:return["en-US","en"];case n.decimal_comma:return["de","es","it"];case n.space_comma:return["fr","sv","cs"];case n.system:return;default:return t.language}},q=function(t,e){return void 0===e&&(e=2),Math.round(t*Math.pow(10,e))/Math.pow(10,e)},Y=function(t,e,i){var a=e?W(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},(null==e?void 0:e.number_format)!==n.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(a,G(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,G(t,i)).format(Number(t))}return"string"==typeof t?t:q(t,null==i?void 0:i.maximumFractionDigits).toString()+("currency"===(null==i?void 0:i.style)?" "+i.currency:"")},G=function(t,e){var i=z({maximumFractionDigits:2},e);if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var n=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=n,i.maximumFractionDigits=n}return i},Q=function(t,e,i,n){var a=void 0!==n?n:e.state;if("unknown"===a||"unavailable"===a)return t("state.default."+a);if(X(e)){if("monetary"===e.attributes.device_class)try{return Y(a,i,{style:"currency",currency:e.attributes.unit_of_measurement})}catch(t){}return Y(a,i)+(e.attributes.unit_of_measurement?" "+e.attributes.unit_of_measurement:"")}var r=B(e);if("input_datetime"===r){var o;if(void 0===n)return e.attributes.has_date&&e.attributes.has_time?(o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),$(o,i)):e.attributes.has_date?(o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),d(o,i)):e.attributes.has_time?((o=new Date).setHours(e.attributes.hour,e.attributes.minute),M(o,i)):e.state;try{var s=n.split(" ");if(2===s.length)return $(new Date(s.join("T")),i);if(1===s.length){if(n.includes("-"))return d(new Date(n+"T00:00"),i);if(n.includes(":")){var l=new Date;return M(new Date(l.toISOString().split("T")[0]+"T"+n),i)}}return n}catch(t){return n}}return"humidifier"===r&&"on"===a&&e.attributes.humidity?e.attributes.humidity+" %":"counter"===r||"number"===r||"input_number"===r?Y(a,i):e.attributes.device_class&&t("component."+r+".state."+e.attributes.device_class+"."+a)||t("component."+r+".state._."+a)||a},Z="mdi:bookmark",K="lovelace",J=["climate","cover","configurator","input_select","input_number","input_text","lock","media_player","scene","script","timer","vacuum","water_heater","weblink"],tt=["alarm_control_panel","automation","camera","climate","configurator","cover","fan","group","history_graph","input_datetime","light","lock","media_player","script","sun","updater","vacuum","water_heater","weather"],et=["input_number","input_select","input_text","scene","weblink"],it=["camera","configurator","history_graph","scene"],nt=["closed","locked","off"],at=new Set(["fan","input_boolean","light","switch","group","automation"]),rt="°C",ot="°F",st="group.default_view",lt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var a=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return a.detail=i,t.dispatchEvent(a),a},ct=new Set(["call-service","divider","section","weblink","cast","select"]),dt={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},ht=function(t,e){void 0===e&&(e=!1);var i=function(t,e){return n("hui-error-card",{type:"error",error:t,config:e})},n=function(t,e){var n=window.document.createElement(t);try{if(!n.setConfig)return;n.setConfig(e)}catch(n){return console.error(t,n),i(n.message,e)}return n};if(!t||"object"!=typeof t||!e&&!t.type)return i("No type defined",t);var a=t.type;if(a&&a.startsWith("custom:"))a=a.substr(7);else if(e)if(ct.has(a))a="hui-"+a+"-row";else{if(!t.entity)return i("Invalid config given.",t);var r=t.entity.split(".",1)[0];a="hui-"+(dt[r]||"text")+"-entity-row"}else a="hui-"+a+"-card";if(customElements.get(a))return n(a,t);var o=i("Custom element doesn't exist: "+t.type+".",t);o.style.display="None";var s=setTimeout((function(){o.style.display=""}),2e3);return customElements.whenDefined(t.type).then((function(){clearTimeout(s),lt(o,"ll-rebuild",{},o)})),o},ut=function(t,e,i){var n;return void 0===i&&(i=!1),function(){var a=[].slice.call(arguments),r=this,o=i&&!n;clearTimeout(n),n=setTimeout((function(){n=null,i||t.apply(r,a)}),e),o&&t.apply(r,a)}},pt={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function mt(t,e){if(t in pt)return pt[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return e&&"off"===e?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===e?"mdi:window-closed":"mdi:window-open";case"lock":return e&&"unlocked"===e?"mdi:lock-open":"mdi:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"mdi:cast-connected":"mdi:cast";case"zwave":switch(e){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"mdi:bookmark"}}var gt=function(t,e){var i=e.value||e,n=e.attribute?t.attributes[e.attribute]:t.state;switch(e.operator||"=="){case"==":return n===i;case"<=":return n<=i;case"<":return n<i;case">=":return n>=i;case">":return n>i;case"!=":return n!==i;case"regex":return n.match(i);default:return!1}},ft=function(t){lt(window,"haptic",t)},bt=function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),lt(window,"location-changed",{replace:i})},yt=function(t,e,i){void 0===i&&(i=!0);var n,a=F(e),r="group"===a?"homeassistant":a;switch(a){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}return t.callService(r,n,{entity_id:e})},vt=function(t,e){var i=nt.includes(t.states[e].state);return yt(t,e,i)},_t=function(t,e,i,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(ft("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(i.entity||i.camera_image)&&lt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":n.navigation_path&&bt(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":i.entity&&(vt(e,i.entity),ft("success"));break;case"call-service":if(!n.service)return void ft("failure");var a=n.service.split(".",2);e.callService(a[0],a[1],n.service_data,n.target),ft("success");break;case"fire-dom-event":lt(t,"ll-custom",n)}},xt=function(t,e,i,n){var a;"double_tap"===n&&i.double_tap_action?a=i.double_tap_action:"hold"===n&&i.hold_action?a=i.hold_action:"tap"===n&&i.tap_action&&(a=i.tap_action),_t(t,e,i,a)},wt=function(t,e,i,n,a){var r;if(a&&i.double_tap_action?r=i.double_tap_action:n&&i.hold_action?r=i.hold_action:!n&&i.tap_action&&(r=i.tap_action),r||(r={action:"more-info"}),!r.confirmation||r.confirmation.exemptions&&r.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||confirm(r.confirmation.text||"Are you sure you want to "+r.action+"?"))switch(r.action){case"more-info":(r.entity||i.entity||i.camera_image)&&(lt(t,"hass-more-info",{entityId:r.entity?r.entity:i.entity?i.entity:i.camera_image}),r.haptic&&ft(r.haptic));break;case"navigate":r.navigation_path&&(bt(0,r.navigation_path),r.haptic&&ft(r.haptic));break;case"url":r.url_path&&window.open(r.url_path),r.haptic&&ft(r.haptic);break;case"toggle":i.entity&&(vt(e,i.entity),r.haptic&&ft(r.haptic));break;case"call-service":if(!r.service)return;var o=r.service.split(".",2),s=o[0],l=o[1],c=z({},r.service_data);"entity"===c.entity_id&&(c.entity_id=i.entity),e.callService(s,l,c,r.target),r.haptic&&ft(r.haptic);break;case"fire-dom-event":lt(t,"ll-custom",r),r.haptic&&ft(r.haptic)}};function $t(t){return void 0!==t&&"none"!==t.action}function At(t,e,i){if(e.has("config")||i)return!0;if(t.config.entity){var n=e.get("hass");return!n||n.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}function kt(t){return void 0!==t&&"none"!==t.action}var St=function(t,e,i){void 0===i&&(i=!0);var n={};e.forEach((function(e){if(nt.includes(t.states[e].state)===i){var a=F(e),r=["cover","lock"].includes(a)?a:"homeassistant";r in n||(n[r]=[]),n[r].push(e)}})),Object.keys(n).forEach((function(e){var a;switch(e){case"lock":a=i?"unlock":"lock";break;case"cover":a=i?"open_cover":"close_cover";break;default:a=i?"turn_on":"turn_off"}t.callService(e,a,{entity_id:n[e]})}))},Et=function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null},Dt={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},Mt={binary_sensor:function(t,e){var i="off"===t;switch(null==e?void 0:e.attributes.device_class){case"battery":return i?"mdi:battery":"mdi:battery-outline";case"battery_charging":return i?"mdi:battery":"mdi:battery-charging";case"cold":return i?"mdi:thermometer":"mdi:snowflake";case"connectivity":return i?"mdi:server-network-off":"mdi:server-network";case"door":return i?"mdi:door-closed":"mdi:door-open";case"garage_door":return i?"mdi:garage":"mdi:garage-open";case"power":case"plug":return i?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return i?"mdi:check-circle":"mdi:alert-circle";case"smoke":return i?"mdi:check-circle":"mdi:smoke";case"heat":return i?"mdi:thermometer":"mdi:fire";case"light":return i?"mdi:brightness-5":"mdi:brightness-7";case"lock":return i?"mdi:lock":"mdi:lock-open";case"moisture":return i?"mdi:water-off":"mdi:water";case"motion":return i?"mdi:walk":"mdi:run";case"occupancy":case"presence":return i?"mdi:home-outline":"mdi:home";case"opening":return i?"mdi:square":"mdi:square-outline";case"running":return i?"mdi:stop":"mdi:play";case"sound":return i?"mdi:music-note-off":"mdi:music-note";case"update":return i?"mdi:package":"mdi:package-up";case"vibration":return i?"mdi:crop-portrait":"mdi:vibrate";case"window":return i?"mdi:window-closed":"mdi:window-open";default:return i?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(t){var e="closed"!==t.state;switch(t.attributes.device_class){case"garage":return e?"mdi:garage-open":"mdi:garage";case"door":return e?"mdi:door-open":"mdi:door-closed";case"shutter":return e?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return e?"mdi:blinds-open":"mdi:blinds";case"window":return e?"mdi:window-open":"mdi:window-closed";default:return mt("cover",t.state)}},sensor:function(t){var e=t.attributes.device_class;if(e&&e in Dt)return Dt[e];if("battery"===e){var i=Number(t.state);if(isNaN(i))return"mdi:battery-unknown";var n=10*Math.round(i/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var a=t.attributes.unit_of_measurement;return"°C"===a||"°F"===a?"mdi:thermometer":mt("sensor")},input_datetime:function(t){return t.attributes.has_date?t.attributes.has_time?mt("input_datetime"):"mdi:calendar":"mdi:clock"}},Tt=function(t){if(!t)return"mdi:bookmark";if(t.attributes.icon)return t.attributes.icon;var e=F(t.entity_id);return e in Mt?Mt[e](t):mt(e,t.state)}},43:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,r=arguments.length,o=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(o=(r<3?a(o):r>3?a(e,i,o):a(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o};Object.defineProperty(e,"__esModule",{value:!0}),e.FlowerCardEditor=void 0;const a=i(437),r=i(924),o=i(854),s=i(139),l=i(147),c=i(516),d=i(770),h=i(770);let u=class extends l.default{render(){if(!this._hass||!this._config)return a.html``;Object.prototype.hasOwnProperty.call(this._config,"show_bars")||(this._config.show_bars=s.default_show_bars);const t=(0,d.getEntitiesByDomain)(this._hass,"plant"),e=(0,h.getEntitiesByDeviceClass)(this._hass,"sensor","battery");return this.renderForm([{controls:[{label:"Display Type",configValue:"display_type",type:c.FormControlType.Radio,items:[{label:"Full",value:o.DisplayType.Full},{label:"Compact",value:o.DisplayType.Compact}]}]},{controls:[{label:"Entity",configValue:"entity",type:c.FormControlType.Dropdown,items:t}]},{controls:[{label:"Battery Sensor",configValue:"battery_sensor",type:c.FormControlType.Dropdown,items:e}]},{controls:[{label:"Show Bars",configValue:"show_bars",type:c.FormControlType.Checkboxes,items:s.plantAttributes}]}])}};e.FlowerCardEditor=u,e.FlowerCardEditor=u=n([(0,r.customElement)("flower-card-editor")],u)},248:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,r=arguments.length,o=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(o=(r<3?a(o):r>3?a(e,i,o):a(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o},a=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,r){function o(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const r=i(437),o=i(924),s=i(800),l=i(854),c=i(330),d=i(429),h=i(139),u=i(135),p=i(534);console.info(`%c FLOWER-CARD %c ${c.version}`,"color: cyan; background: black; font-weight: bold;","color: darkblue; background: white; font-weight: bold;"),window.customCards=window.customCards||[],window.customCards.push({type:h.CARD_NAME,name:"Flower card",preview:!0,description:"Custom flower card for https://github.com/Olen/homeassistant-plant"});let m=class extends r.LitElement{constructor(){super(...arguments),this._expanded=!1,this._timelineEvents=[],this.stateHistory=[],this._currentImageIndex=0,this._imageUrls=[],this._isFading=!1,this._showGallery=!1,this._showUploadDialog=!1,this._showFlyout=!1,this._showDeleteFlyout=!1,this._showMainImageFlyout=!1}_changeImage(){return a(this,arguments,void 0,(function*(t="next"){this._isFading=!0,this.requestUpdate(),yield new Promise((t=>setTimeout(t,500))),this._currentImageIndex="next"===t?(this._currentImageIndex+1)%this._imageUrls.length:(this._currentImageIndex-1+this._imageUrls.length)%this._imageUrls.length,this._isFading=!1,this.requestUpdate()}))}_openGallery(t){t.stopPropagation(),this._imageRotationInterval&&clearInterval(this._imageRotationInterval),this._showGallery=!0}_closeGallery(){this._showGallery=!1,this._imageUrls.length>1&&(this._imageRotationInterval=setInterval((()=>{this._changeImage()}),1e4))}_openUploadDialog(t){t.preventDefault(),t.stopPropagation(),this._showUploadDialog=!0}_closeUploadDialog(){this._showUploadDialog=!1}_toggleFlyout(t){t.preventDefault(),t.stopPropagation(),this._showFlyout=!this._showFlyout}_toggleDeleteFlyout(t){t.preventDefault(),t.stopPropagation(),this._showDeleteFlyout=!this._showDeleteFlyout}_toggleMainImageFlyout(t){t.preventDefault(),t.stopPropagation(),this._showMainImageFlyout=!this._showMainImageFlyout}_getImageDate(t){if(!this.stateObj||!this._hass)return"Start Bild";const e=t.match(/_(\d{8}_\d{6})/);let i="Start Bild",n=null;if(e){const t=e[1],a=t.slice(0,4),r=t.slice(4,6),o=t.slice(6,8),s=t.slice(9,11),l=t.slice(11,13);i=`${o}.${r}.${a} ${s}:${l}`,n=new Date(`${a}-${r}-${o}T${s}:${l}:00`)}const a=this.stateObj.entity_id.split(".")[1],r=this._hass.states[`select.${a}_growth_phase`];if(!r)return i;let o="Unbekannt",s=0,l=0;const c=["samen","keimen","wurzeln","wachstum","blüte","geerntet","entfernt"],d={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wachstum",blüte:"Blüte",geerntet:"Geerntet",entfernt:"Entfernt"};if(n){for(const t of c){const e=r.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){const i=new Date(e);n>=i&&(o=d[t],s=Math.floor((n.getTime()-i.getTime())/864e5))}}const t=r.attributes[`${c[0]}_beginn`];if(t){const e=new Date(t);l=Math.floor((n.getTime()-e.getTime())/864e5)}}else{o=d[r.state]||r.state;const t=r.attributes[`${"entfernt"===r.state||"geerntet"===r.state?r.state:r.state+"_beginn"}`];if(t){const e=new Date(t);s=Math.floor(((new Date).getTime()-e.getTime())/864e5)}const e=r.attributes[`${c[0]}_beginn`];if(e){const t=new Date(e);l=Math.floor(((new Date).getTime()-t.getTime())/864e5)}}let h=i;return h+=`\n<span class="phase">${o}</span> (<span class="day">Tag</span> ${s+1}/<span class="total">${l+1}</span>)`,h}disconnectedCallback(){super.disconnectedCallback(),this._imageRotationInterval&&clearInterval(this._imageRotationInterval)}set hass(t){var e,i,n;if(this._hass=t,this.stateObj=(null===(e=this.config)||void 0===e?void 0:e.entity)?t.states[this.config.entity]:void 0,null===(i=this.stateObj)||void 0===i?void 0:i.attributes.images){const t=this.stateObj.attributes.download_path||"/local/images/plants/",e=[...this.stateObj.attributes.images].sort(((t,e)=>{var i,n;const a=(null===(i=t.match(/_(\d{8}_\d{6})/))||void 0===i?void 0:i[1])||"",r=(null===(n=e.match(/_(\d{8}_\d{6})/))||void 0===n?void 0:n[1])||"";return a.localeCompare(r)}));this._imageUrls=e.map((e=>`${t}${e}`)),this.stateObj.attributes.entity_picture&&this._imageUrls.unshift(this.stateObj.attributes.entity_picture),this._imageUrls.length>1&&!this._imageRotationInterval&&(this._imageRotationInterval=setInterval((()=>{this._changeImage()}),1e4))}else this._imageUrls=[],(null===(n=this.stateObj)||void 0===n?void 0:n.attributes.entity_picture)&&(this._imageUrls=[this.stateObj.attributes.entity_picture]),this._currentImageIndex=0;this.previousFetchDate||(this.previousFetchDate=0),Date.now()>this.previousFetchDate+1e3&&(this.previousFetchDate=Date.now(),this.get_data(t).then((()=>{this.requestUpdate()})))}static getConfigElement(){return a(this,void 0,void 0,(function*(){return yield Promise.resolve().then((()=>i(43))),document.createElement(h.CARD_EDITOR_NAME)}))}static getStubConfig(t){const e=t=>{if("object"==typeof t&&"entity_id"in t&&"string"==typeof t.entity_id&&0===t.entity_id.indexOf("plant."))return!!t};let i=[];try{i=Object.values(t.states).filter(e)}catch(t){console.info(`Unable to get ha-data: ${t}`)}return{entity:i.length>0?i[0].entity_id:"plant.my_plant",battery_sensor:"sensor.myflower_battery",show_bars:h.default_show_bars}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config=t}render(){var t,e,i,n;if(!this.config||!this._hass)return r.html``;if(!this.stateObj)return r.html`
                <hui-warning>
                Entity not available: ${this.config.entity}
                </hui-warning>
              `;const o=this.stateObj.attributes.strain+" - "+this.stateObj.attributes.breeder,s=this.config.display_type===l.DisplayType.Compact?"header-compact":"header",c=this.config.display_type===l.DisplayType.Compact?"":"card-margin-top",m=this.stateObj.entity_id.split(".")[1],g=this._hass.states[`select.${m}_growth_phase`],f=this._hass.states[`number.${m}_pot_size`],b=g?g.state:"Nicht verfügbar",y=f?f.state+"L":"Nicht verfügbar";return r.html`
            <ha-card class="${c}">
                <div class="${s}">
                    <img class="${this._isFading?"fade":""}" 
                        src="${this._imageUrls.length>0?this._imageUrls[this._currentImageIndex]:h.missingImage}" @click="${this._openGallery}">
                    <span id="name" @click="${()=>(0,u.moreInfo)(this,this.stateObj.entity_id)}"> ${this.stateObj.attributes.friendly_name} <ha-icon .icon="mdi:${"problem"==this.stateObj.state.toLowerCase()?"alert-circle-outline":""}"></ha-icon>
                    </span>
                    <span id="battery">${(0,d.renderBattery)(this)}</span>
                    <span id="species">${o}</span>
                    <div id="status-container">
                        <span @click="${()=>(0,u.moreInfo)(this,`select.${m}_growth_phase`)}">
                            <ha-icon icon="mdi:sprout"></ha-icon>${b}
                        </span>
                        <span @click="${()=>(0,u.moreInfo)(this,`number.${m}_pot_size`)}">
                            <ha-icon icon="mdi:cup"></ha-icon>${y}
                        </span>
                    </div>
                </div>
                <div class="divider"></div>
                ${(0,d.renderAttributes)(this)}
                <div class="expander ${this._expanded?"expanded":""}" @click="${this._toggleExpand}">
                    <ha-icon icon="mdi:chevron-down"></ha-icon>
                </div>
                ${this._expanded?r.html`
                    <div class="expanded-content">
                        <div class="timeline-container">
                            ${this.renderTimeline()}
                        </div>
                        <div class="consumption-data">
                            <div class="consumption-item" @click="${()=>(0,u.moreInfo)(this,`sensor.${m}_total_ppfd_mol_integral`)}">
                                <ha-icon icon="mdi:counter"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Gesamt PPFD</span>
                                    <span class="value">${(null===(t=this._hass.states[`sensor.${m}_total_ppfd_mol_integral`])||void 0===t?void 0:t.state)||"N/A"} mol/s⋅m²</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${()=>(0,u.moreInfo)(this,`sensor.${m}_total_fertilizer_consumption`)}">
                                <ha-icon icon="mdi:chart-line-variant"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Düngerverbrauch</span>
                                    <span class="value">${(null===(e=this._hass.states[`sensor.${m}_total_fertilizer_consumption`])||void 0===e?void 0:e.state)||"N/A"} μS/cm</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${()=>(0,u.moreInfo)(this,`sensor.${m}_total_water_consumption`)}">
                                <ha-icon icon="mdi:water-pump"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Wasserverbrauch</span>
                                    <span class="value">${(null===(i=this._hass.states[`sensor.${m}_total_water_consumption`])||void 0===i?void 0:i.state)||"N/A"} L</span>
                                </div>
                            </div>
                            <div class="consumption-item" @click="${()=>(0,u.moreInfo)(this,`sensor.${m}_total_power_consumption`)}">
                                <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                                <div class="consumption-details">
                                    <span class="label">Stromverbrauch</span>
                                    <span class="value">${(null===(n=this._hass.states[`sensor.${m}_total_power_consumption`])||void 0===n?void 0:n.state)||"N/A"} kWh</span>
                                </div>
                            </div>
                        </div>
                        <div class="plant-details">
                            <div class="detail-item">
                                <span class="label">Sorte</span>
                                <span class="value">${this.stateObj.attributes.variety||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Feminized</span>
                                <span class="value">${this.stateObj.attributes.feminized||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Effects</span>
                                <span class="value">${this.stateObj.attributes.effects||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Smell</span>
                                <span class="value">${this.stateObj.attributes.smell||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Taste</span>
                                <span class="value">${this.stateObj.attributes.taste||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Phenotype</span>
                                <span class="value">${this.stateObj.attributes.phenotype||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Hunger</span>
                                <span class="value">${this.stateObj.attributes.hunger||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Growth stretch</span>
                                <span class="value">${this.stateObj.attributes.growth_stretch||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Flower stretch</span>
                                <span class="value">${this.stateObj.attributes.flower_stretch||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Mold resistance</span>
                                <span class="value">${this.stateObj.attributes.mold_resistance||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Difficulty</span>
                                <span class="value">${this.stateObj.attributes.difficulty||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Yield</span>
                                <span class="value">${this.stateObj.attributes.yield||"-"}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Website</span>
                                ${this.stateObj.attributes.website?r.html`
                                    <a href="${this.stateObj.attributes.website}" target="_blank" class="value link">${this.stateObj.attributes.website}</a>
                                `:r.html`<span class="value">-</span>`}
                            </div>
                            <div class="detail-item">
                                <span class="label">Notes</span>
                                <span class="value">${this.stateObj.attributes.notes||"-"}</span>
                            </div>
                            <div class="detail-item full-width">
                                <span class="label">Infotext 1</span>
                                <span class="value">${this.stateObj.attributes.infotext1||"-"}</span>
                            </div>
                            <div class="detail-item full-width">
                                <span class="label">Infotext 2</span>
                                <span class="value">${this.stateObj.attributes.infotext2||"-"}</span>
                            </div>
                            <div class="detail-item full-width">
                                <span class="label">Lineage</span>
                                <span class="value">${this.stateObj.attributes.lineage||"-"}</span>
                            </div>
                        </div>
                    </div>
                `:""}
            </ha-card>
            ${this._showGallery?r.html`
                <div class="gallery-overlay" @click="${this._closeGallery}">
                    <div class="gallery-content" @click="${t=>t.stopPropagation()}">
                        <div class="gallery-header">
                            <span class="gallery-date">
                                ${this._imageUrls.length>0?(0,p.unsafeHTML)(this._getImageDate(this._imageUrls[this._currentImageIndex])):"Keine Bilder vorhanden"}
                            </span>
                            <div class="gallery-header-buttons">
                                <div class="flyout-container ${this._showFlyout?"open":""} ${this._showDeleteFlyout?"delete-open":""} ${this._showMainImageFlyout?"main-open":""}">
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
                                                @change="${t=>{this._handleFileUpload(t),this._showFlyout=!1}}"
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
                                                @change="${t=>{this._handleFileUpload(t),this._showFlyout=!1}}"
                                                style="display: none;"
                                            >
                                            <ha-icon-button>
                                                <ha-icon icon="mdi:camera"></ha-icon>
                                            </ha-icon-button>
                                        </label>
                                    </div>
                                </div>
                                ${this._imageUrls.length>0?r.html`
                                    <div class="flyout-container ${this._showMainImageFlyout?"open":""} ${this._showDeleteFlyout?"delete-open":""}">
                                        <ha-icon-button
                                            @click="${this._toggleMainImageFlyout}"
                                            .label=${"Als Hauptbild setzen"}
                                            class="main-button"
                                        >
                                            <ha-icon icon="mdi:image-check"></ha-icon>
                                        </ha-icon-button>
                                        <div class="flyout-menu">
                                            <ha-icon-button
                                                @click="${()=>a(this,void 0,void 0,(function*(){const t=this._imageUrls[this._currentImageIndex].split("/").pop();if(t)try{yield this.setMainImage(t),this._showMainImageFlyout=!1}catch(t){alert("Fehler beim Setzen des Hauptbildes: "+t.message)}}))}"
                                                class="confirm-main"
                                                style="--mdc-icon-button-size: 32px; color: var(--primary-color, #03a9f4);"
                                            >
                                                <ha-icon icon="mdi:check"></ha-icon>
                                            </ha-icon-button>
                                        </div>
                                    </div>
                                    <div class="flyout-container ${this._showDeleteFlyout?"open":""}">
                                        <ha-icon-button
                                            @click="${this._toggleDeleteFlyout}"
                                            .label=${"Bild löschen"}
                                            class="delete-button"
                                        >
                                            <ha-icon icon="mdi:delete"></ha-icon>
                                        </ha-icon-button>
                                        <div class="flyout-menu">
                                            <ha-icon-button
                                                @click="${()=>a(this,void 0,void 0,(function*(){const t=this._imageUrls[this._currentImageIndex].split("/").pop();if(t)try{yield this.deleteImage(t),this._showDeleteFlyout=!1}catch(t){alert("Fehler beim Löschen: "+t.message)}}))}"
                                                class="confirm-delete"
                                                style="--mdc-icon-button-size: 32px; color: var(--error-color, #db4437);"
                                            >
                                                <ha-icon icon="mdi:check"></ha-icon>
                                            </ha-icon-button>
                                        </div>
                                    </div>
                                `:""}
                            <ha-icon-button
                                @click="${this._closeGallery}"
                                .label=${"Schließen"}
                            >
                                <ha-icon icon="mdi:close"></ha-icon>
                            </ha-icon-button>
                        </div>
                        </div>
                        
                        ${this._imageUrls.length>0?r.html`
                        <div class="gallery-image-container">
                            <ha-icon-button
                                class="gallery-nav prev"
                                @click="${()=>this._changeImage("prev")}"
                                .label=${"Vorheriges Bild"}
                            >
                                <ha-icon icon="mdi:chevron-left"></ha-icon>
                            </ha-icon-button>
                            <a href="${this._imageUrls[this._currentImageIndex]}" target="_blank">
                                <img class="gallery-image ${this._isFading?"fade":""}" 
                                    src="${this._imageUrls[this._currentImageIndex]}"
                                >
                            </a>
                            <ha-icon-button
                                class="gallery-nav next"
                                @click="${()=>this._changeImage("next")}"
                                .label=${"Nächstes Bild"}
                            >
                                <ha-icon icon="mdi:chevron-right"></ha-icon>
                            </ha-icon-button>
                        </div>
                        <div class="gallery-thumbnails">
                            <div class="thumbnails-scroll">
                                ${this._getGroupedImages().map((t=>r.html`
                                    <div class="thumbnail-group">
                                        <div class="thumbnail-group-label">${t.phase}</div>
                                        <div class="thumbnail-group-images">
                                            ${t.images.map((t=>r.html`
                                                <div class="thumbnail-container ${this._imageUrls[this._currentImageIndex]===t.url?"active":""}"
                                                     @click="${()=>this._selectImage(this._imageUrls.indexOf(t.url))}">
                                                    <div class="thumbnail-day">Tag ${t.day}/${t.totalDays}</div>
                                                    <img class="thumbnail" src="${t.url}">
                                                </div>
                                            `))}
                                        </div>
                                    </div>
                                `))}
                            </div>
                        </div>
                        `:r.html`
                            <div class="no-images-message">
                                <ha-icon icon="mdi:image-off"></ha-icon>
                                <span>Keine Bilder vorhanden</span>
                                <span>Klicke auf das Kamera-Symbol oben, um ein Bild hinzuzufügen</span>
                            </div>
                        `}
                    </div>
                </div>
            `:""}
            `}_toggleExpand(t){t.stopPropagation(),this._expanded=!this._expanded}get_data(t){return a(this,void 0,void 0,(function*(){var e,i,n;try{if(this.plantinfo=yield t.callWS({type:"plant/get_info",entity_id:null===(e=this.config)||void 0===e?void 0:e.entity}),null===(i=this.config)||void 0===i?void 0:i.entity){const e=this.config.entity.split(".")[1];this._timelineEvents=yield this.collectTimelineEvents(e);const i=(null===(n=this._timelineEvents[0])||void 0===n?void 0:n.date.toISOString())||(new Date).toISOString(),a=(new Date).toISOString(),r=yield t.callApi("GET",`history/period/${i}?filter_entity_id=${this.config.entity}&end_time=${a}`);r&&Array.isArray(r)&&r.length>0&&(this.stateHistory=r[0])}}catch(t){this.plantinfo={result:{}},this._timelineEvents=[],this.stateHistory=[]}}))}getCardSize(){return 5}renderTimeline(){var t;if(!(null===(t=this.config)||void 0===t?void 0:t.entity)||!this._hass)return r.html``;const e=this.config.entity.split(".")[1],i=this._hass.states[`select.${e}_growth_phase`];if(!i)return r.html``;const n=this._timelineEvents;if(0===n.length)return r.html``;const a=n[0].date,o=i.state,s=new Date;let l;if("entfernt"===o)l=new Date(i.attributes.entfernt);else if("geerntet"===o)l=new Date(i.attributes.geerntet);else{const t=this._hass.states[`number.${e}_flowering_duration`];if("blüte"===o&&(null==t?void 0:t.state)){const e=new Date(i.attributes.blüte_beginn);l=new Date(e),l.setDate(l.getDate()+parseInt(t.state))}else(null==t?void 0:t.state)?(l=new Date(s),l.setDate(l.getDate()+parseInt(t.state))):l=s}const c=(s.getTime()-a.getTime())/.9,d=new Date(a.getTime()+c),h=[...n],u={date:d,displayDate:l,type:"harvest",label:"Harvest",description:"Erwartetes Erntedatum: "+l.toLocaleDateString("de-DE")};h.push(u);const p=h.map(((t,e)=>{const i=Math.min((t.date.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100);e<h.length-1&&h[e+1].date;let n=0;return"pot-size"!==t.type&&(n=4*h.slice(0,e).filter((e=>{const i=e.date.toDateString()===t.date.toDateString(),n=e.type.split("-")[0]===t.type.split("-")[0];return i&&"pot-size"!==e.type&&n})).length),{index:e,position:i,type:"label",offset:n}})),m=h.map(((t,e)=>({index:e,position:Math.min((t.date.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100),type:"marker",offset:0}))),g=(t,e)=>{const i={};let n=0;t.sort(((t,e)=>t.position-e.position));for(let a=0;a<t.length;a++){const r=t[a];let o=!1;for(let i=Math.max(0,a-3);i<a;i++){const a=t[i];if(Math.abs(r.position-a.position)<5.8){o=!0,0===n?n=e?1:-1:1===n?n=2:-1===n?n=-2:2===n?n=-1:-2===n&&(n=1);break}}o?i[r.index]=n:(i[r.index]=0,n=0)}return i},f=g(p,!0),b=g(m,!1);return r.html`
            <div class="timeline">
                <div class="timeline-labels">
                    ${h.map(((t,e)=>{const i=Math.min((t.date.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100),n=f[e]||0;return r.html`
                            <div class="timeline-label ${1===n?"offset-up":2===n?"offset-up-2":-1===n?"offset-down":""}"
                                 style="left: ${i}%">
                                ${t.label}
                            </div>
                        `}))}
                </div>
                <div class="timeline-events">
                    ${n.map(((t,e)=>{const i=Math.min((t.date.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100),o=e<n.length-1?n[e+1].date:d;let s=0;"pot-size"!==t.type&&(s=4*n.slice(0,e).filter((e=>e.date.toDateString()===t.date.toDateString()&&"pot-size"!==e.type)).length);const l=Math.min((o.getTime()-t.date.getTime())/(d.getTime()-a.getTime())*100,100-i);return r.html`
                            <div class="timeline-event ${t.type}"
                                 style="left: calc(${i}% + ${s}px); 
                                        width: calc(${l}% - ${s}px);
                                        ${t.style||""}"
                                 title="${t.description}">
                            </div>
                        `}))}
                    <div class="timeline-status">
                        ${this.stateHistory.map(((t,e)=>{const i=new Date(t.last_changed),n=this.stateHistory[e+1],o=n?new Date(n.last_changed):new Date,s=Math.min((i.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100),l=Math.min((o.getTime()-i.getTime())/(d.getTime()-a.getTime())*100,100-s),c="problem"===t.state?"timeline-status-problem":"unknown"===t.state?"timeline-status-unknown":"";return c?r.html`
                                <div class="timeline-status-indicator ${c}"
                                     style="left: ${s}%; width: ${l}%;">
                                </div>
                            `:""}))}
                    </div>
                </div>
                <div class="timeline-markers">
                    ${h.map(((t,e)=>{const i=Math.min((t.date.getTime()-a.getTime())/(d.getTime()-a.getTime())*100,100),n=b[e]||0;return r.html`
                            <div class="timeline-marker ${1===n?"offset-up":2===n?"offset-up-2":-1===n?"offset-down":-2===n?"offset-down-2":""}"
                                 style="left: ${i}%">
                                ${((t,e)=>"harvest"===(null==e?void 0:e.type)&&e.displayDate?e.displayDate.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}):t.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}))(t.date,t)}
                            </div>
                        `}))}
                </div>
            </div>
        `}collectTimelineEvents(t){return a(this,void 0,void 0,(function*(){var e,i,n,a,r;const o=[],s=null===(e=this._hass)||void 0===e?void 0:e.states[`select.${t}_growth_phase`],l=120,c=60,d=207,h=90,u=280,p=70,m=100,g=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"],f={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wachstum",blüte:"Blüte",entfernt:"Entfernt",geerntet:"Geerntet"},b=[],y=[];for(const t of g){const e=null==s?void 0:s.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){const i={date:new Date(e),type:`phase-${t}`,label:f[t],description:`${f[t]} Phase begonnen am ${new Date(e).toLocaleDateString("de-DE")}`};"entfernt"===t||"geerntet"===t?y.push(i):b.push(i)}}b.forEach(((t,e)=>{const i=1===b.length?55:55-e/Math.max(1,b.length-1)*25;t.style=`background-color: hsl(${l}, ${c}%, ${i}%)`})),y.forEach(((t,e)=>{"phase-entfernt"===t.type?t.style="display: none;":"phase-geerntet"===t.type&&(t.style="\n                    background-color: hsl(120, 70%, 45%);\n                    background-image: repeating-linear-gradient(45deg, \n                        transparent,\n                        transparent 2px,\n                        rgba(255,255,255,0.4) 2px,\n                        rgba(255,255,255,0.4) 4px\n                    );\n                ")})),o.push(...b,...y);try{const e=(null===(i=o[0])||void 0===i?void 0:i.date.toISOString())||(new Date).toISOString(),n=(new Date).toISOString(),a=yield this._hass.callApi("GET",`history/period/${e}?filter_entity_id=number.${t}_pot_size&end_time=${n}`);if(a&&Array.isArray(a)&&a.length>0){let t=null;const e=[];for(const i of[...a[0]].reverse())i.state&&!isNaN(parseFloat(i.state))&&"unavailable"!==i.state&&"unknown"!==i.state&&i.state!==t&&(e.push({date:new Date(i.last_changed),type:"pot-size",label:`${i.state}L`,description:`Topfgröße geändert auf ${i.state}L am ${new Date(i.last_changed).toLocaleDateString("de-DE")}`}),t=i.state);const i=e.map((t=>parseFloat(t.label))),n=Math.min(...i),r=Math.max(...i);e.forEach((t=>{const e=parseFloat(t.label),i=r===n?50:Math.round((e-n)/(r-n)*100),a=Math.max(40,Math.min(85,85-.45*i));t.style=`background-color: hsl(${d}, ${h}%, ${a}%)`})),o.push(...e)}}catch(t){console.warn("Fehler beim Laden der Topfgrößen-Historie:",t)}const v=((null===(n=null==s?void 0:s.attributes)||void 0===n?void 0:n.area_history)||[]).map((t=>({date:new Date(t.date),type:"area-moved",label:t.area,description:`Umzug nach ${t.area} am ${new Date(t.date).toLocaleDateString("de-DE")}`})));v.forEach(((t,e)=>{const i=65-e/Math.max(1,v.length-1)*30;t.style=`background-color: hsl(${u}, ${p}%, ${i}%)`})),o.push(...v);const _=null===(a=this._hass)||void 0===a?void 0:a.states[`select.${t}_treatment`],x=((null===(r=null==_?void 0:_.attributes)||void 0===r?void 0:r.treatment_history)||[]).map((t=>({date:new Date(t.date),type:"treatment",label:t.treatment,description:`Behandlung: ${t.treatment} am ${new Date(t.date).toLocaleDateString("de-DE")}`})));return x.forEach(((t,e)=>{const i=45-e/Math.max(1,x.length-1)*45,n=65-e/Math.max(1,x.length-1)*25;t.style=`background-color: hsl(${i}, ${m}%, ${n}%)`})),o.push(...x),o.sort(((t,e)=>t.date.getTime()-e.date.getTime()))}))}_selectImage(t){return a(this,void 0,void 0,(function*(){t!==this._currentImageIndex&&(this._isFading=!0,this.requestUpdate(),yield new Promise((t=>setTimeout(t,500))),this._currentImageIndex=t,this._isFading=!1,this.requestUpdate())}))}_getGroupedImages(){if(!this.stateObj||!this._hass)return[];const t=this.stateObj.entity_id.split(".")[1],e=this._hass.states[`select.${t}_growth_phase`];if(!e)return[];const i=["samen","keimen","wurzeln","wachstum","blüte","geerntet","entfernt"],n={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wuchs",blüte:"Blüte",geerntet:"Geerntet",entfernt:"Entfernt"},a=[];let r="",o=[],s="",l=null;for(const t of i){const i=e.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(i){s=n[t],l=new Date(i);break}}return this._imageUrls.forEach(((t,c)=>{let d=null,h="",u=0,p=0;if(0===c)l&&s&&(d=l,h=s,u=0,p=0);else{const a=t.match(/_(\d{8}_\d{6})/);if(a){const t=a[1],e=t.slice(0,4),i=t.slice(4,6),n=t.slice(6,8),r=t.slice(9,11),o=t.slice(11,13);d=new Date(`${e}-${i}-${n}T${r}:${o}:00`)}if(d){for(const t of i){const i=e.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(i){const e=new Date(i);d>=e&&(h=n[t],u=Math.floor((d.getTime()-e.getTime())/864e5))}}l&&(p=Math.floor((d.getTime()-l.getTime())/864e5))}}h&&d&&(h!==r&&(o.length>0&&a.push({phase:r,images:o}),r=h,o=[]),o.push({url:t,day:u+1,totalDays:p+1}))})),o.length>0&&a.push({phase:r,images:o}),a}uploadImage(t){return a(this,void 0,void 0,(function*(){var e;if(!(null===(e=this.config)||void 0===e?void 0:e.entity)||!this._hass)return;const i=16384,n=new FileReader;n.onload=e=>a(this,void 0,void 0,(function*(){var n;if(!(null===(n=e.target)||void 0===n?void 0:n.result))return;const a=e.target.result,r=Math.ceil(a.byteLength/i);for(let e=0;e<r;e++){const n=a.slice(e*i,(e+1)*i),o=Array.from(new Uint8Array(n)).map((t=>t.toString(16).padStart(2,"0"))).join("");try{yield this._hass.connection.sendMessagePromise({type:"plant/upload_image",entity_id:this.config.entity,filename:t.name,chunk:o,chunk_index:e,total_chunks:r})}catch(t){throw console.error("Upload error:",t),t}}})),n.readAsArrayBuffer(t)}))}_handleFileUpload(t){const e=t.target.files;if(e&&e.length>0){const t=e[0];if(!t.type.startsWith("image/"))return void alert("Bitte nur Bilder hochladen!");if(t.size>10485760)return void alert("Bild ist zu groß! Maximale Größe ist 10MB.");this.uploadImage(t).then((()=>{var t;this._hass&&this._hass.callService("homeassistant","update_entity",{entity_id:null===(t=this.config)||void 0===t?void 0:t.entity})})).catch((t=>{alert("Fehler beim Upload: "+t.message)}))}}deleteImage(t){return a(this,void 0,void 0,(function*(){var e,i,n;if((null===(e=this.config)||void 0===e?void 0:e.entity)&&this._hass)try{if(yield this._hass.connection.sendMessagePromise({type:"plant/delete_image",entity_id:this.config.entity,filename:t}),yield this._hass.callService("homeassistant","update_entity",{entity_id:this.config.entity}),yield new Promise((t=>setTimeout(t,500))),null===(i=this.stateObj)||void 0===i?void 0:i.attributes.images){const t=this.stateObj.attributes.download_path||"/local/images/plants/",e=[...this.stateObj.attributes.images].sort(((t,e)=>{var i,n;const a=(null===(i=t.match(/_(\d{8}_\d{6})/))||void 0===i?void 0:i[1])||"",r=(null===(n=e.match(/_(\d{8}_\d{6})/))||void 0===n?void 0:n[1])||"";return a.localeCompare(r)}));this._imageUrls=e.map((e=>`${t}${e}`)),this.stateObj.attributes.entity_picture&&this._imageUrls.unshift(this.stateObj.attributes.entity_picture),this._currentImageIndex>=this._imageUrls.length&&(this._currentImageIndex=Math.max(0,this._imageUrls.length-1))}else this._imageUrls=[],(null===(n=this.stateObj)||void 0===n?void 0:n.attributes.entity_picture)&&(this._imageUrls=[this.stateObj.attributes.entity_picture]),this._currentImageIndex=0;this._showDeleteFlyout=!1,this.requestUpdate()}catch(t){throw console.error("Delete error:",t),t}}))}setMainImage(t){return a(this,void 0,void 0,(function*(){var e;if((null===(e=this.config)||void 0===e?void 0:e.entity)&&this._hass)try{yield this._hass.connection.sendMessagePromise({type:"plant/set_main_image",entity_id:this.config.entity,filename:t}),yield this._hass.callService("homeassistant","update_entity",{entity_id:this.config.entity}),yield new Promise((t=>setTimeout(t,500))),this._showMainImageFlyout=!1,this.requestUpdate()}catch(t){throw console.error("Set main image error:",t),t}}))}static get styles(){return[s.style,r.css`
            .timeline-container {
                margin: 8px 16px 0px;
                padding: 16px 16px 0px;
                background: var(--card-background-color, #fff);
                box-shadow: var(--ha-card-box-shadow, none);
            }

            .timeline {
                position: relative;
                width: 100%;
                height: 120px;
                margin-top: 4px;
                margin-bottom: 4px;
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

            .timeline-label.offset-down {
                transform: translateX(-50%) translateY(0);
            }

            .timeline-events {
                position: relative;
                height: 30px;
                background: var(--secondary-background-color);
                overflow: visible;
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

            /* Die Farben werden jetzt dynamisch im Code gesetzt basierend auf:
               Wachstumsphasen: HSL(122, 70%, dynamisch)
               Endphasen: HSL(14, 100%, dynamisch)
               Topfgrößen: HSL(207, 90%, dynamisch)
               Standort: HSL(45, 90%, dynamisch)
               Behandlungen: HSL(340, 82%, dynamisch)
            */

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

            .timeline-label.offset-up-2 {
                transform: translateX(-50%) translateY(-200%);
            }

            .timeline-marker.offset-down-2 {
                transform: translateX(-50%) translateY(200%);
            }

                .delete-flyout ha-icon-button[data-action="confirm"] {
                    --mdc-icon-button-size: 48px;
                    color: var(--error-color, #db4437);
                }

            .flyout-container.main-open {
                transform: translateX(-31px);
            }

            .main-button {
                --mdc-icon-button-size: 48px;
                --mdc-icon-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .main-button:hover {
                opacity: 0.8;
            }

            .confirm-main {
                --mdc-icon-button-size: 32px;
                --mdc-icon-size: 24px;
                color: var(--primary-color, #03a9f4);
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .confirm-main:hover {
                opacity: 0.8;
            }

            .flyout-container.delete-open {
                transform: translateX(-31px);
            }

            .flyout-container.main-open {
                transform: translateX(-31px);
            }

            .flyout-container.delete-open.main-open {
                transform: translateX(-62px);
            }

            .flyout-container:first-child {
                transform: translateX(0);
            }

            .flyout-container:first-child.delete-open {
                transform: translateX(-31px);
            }

            .flyout-container:first-child.main-open {
                transform: translateX(-31px);
            }

            .flyout-container:first-child.delete-open.main-open {
                transform: translateX(-62px);
            }

            .flyout-container:nth-child(2).delete-open {
                transform: translateX(-31px);
            }

            .flyout-container:nth-child(2).main-open {
                transform: translateX(-31px);
            }

            .flyout-container:nth-child(2).delete-open.main-open {
                transform: translateX(-62px);
            }

            .gallery-date {
                font-size: 0.85em;
                white-space: pre-line;
                font-weight: normal;
            }

            .gallery-date .phase {
                font-weight: bold;
            }

            .gallery-date .day {
                font-weight: bold;
            }

            .gallery-date .total {
                font-weight: bold;
            }
            `]}};n([(0,o.property)()],m.prototype,"_hass",void 0),n([(0,o.property)()],m.prototype,"config",void 0),n([(0,o.state)()],m.prototype,"_expanded",void 0),n([(0,o.state)()],m.prototype,"_timelineEvents",void 0),n([(0,o.state)()],m.prototype,"stateHistory",void 0),n([(0,o.state)()],m.prototype,"_currentImageIndex",void 0),n([(0,o.state)()],m.prototype,"_imageUrls",void 0),n([(0,o.state)()],m.prototype,"_isFading",void 0),n([(0,o.state)()],m.prototype,"_showGallery",void 0),n([(0,o.state)()],m.prototype,"_showUploadDialog",void 0),n([(0,o.state)()],m.prototype,"_showFlyout",void 0),n([(0,o.state)()],m.prototype,"_showDeleteFlyout",void 0),n([(0,o.state)()],m.prototype,"_showMainImageFlyout",void 0),m=n([(0,o.customElement)(h.CARD_NAME)],m),e.default=m},800:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const n=i(437);e.style=n.css`
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
`},854:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.DisplayType=void 0,function(t){t.Full="full",t.Compact="compact"}(i||(e.DisplayType=i={}))},429:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.renderAttributeChunks=e.getChunkedDisplayed=e.renderAttribute=e.renderAttributes=e.renderBattery=void 0;const n=i(854),a=i(437),r=i(534),o=i(139),s=i(135);e.renderBattery=t=>{if(!t.config.battery_sensor)return a.html``;const e=t._hass.states[t.config.battery_sensor];if(!e)return a.html``;const i=parseInt(e.state),{icon:n,color:r}=[{threshold:90,icon:"mdi:battery",color:"green"},{threshold:80,icon:"mdi:battery-90",color:"green"},{threshold:70,icon:"mdi:battery-80",color:"green"},{threshold:60,icon:"mdi:battery-70",color:"green"},{threshold:50,icon:"mdi:battery-60",color:"green"},{threshold:40,icon:"mdi:battery-50",color:"green"},{threshold:30,icon:"mdi:battery-40",color:"orange"},{threshold:20,icon:"mdi:battery-30",color:"orange"},{threshold:10,icon:"mdi:battery-20",color:"red"},{threshold:0,icon:"mdi:battery-10",color:"red"},{threshold:-1/0,icon:"mdi:battery-alert-variant-outline",color:"red"}].find((({threshold:t})=>i>t))||{icon:"mdi:battery-alert-variant-outline",color:"red"};return a.html`
        <div class="battery tooltip" @click="${e=>{e.stopPropagation(),(0,s.moreInfo)(t,t.config.battery_sensor)}}">
            <div class="tip" style="text-align:center;">${i}%</div>
            <ha-icon .icon="${n}" style="color: ${r}"></ha-icon>
        </div>
    `},e.renderAttributes=t=>{const i={},n={},a={},r={},s={},l={},c={},d=t.config.show_bars||o.default_show_bars;if(t.plantinfo&&t.plantinfo.result){const e=t.plantinfo.result;for(const o of d)if(e[o]||"health"===o){let d,h,u,p,m,g;if("health"===o){const e=t._hass.states[`number.${t.config.entity.split(".")[1]}_health`];if(!e)continue;d=5,h=0,u=Number(e.state),p="mdi:heart-pulse",m=e.entity_id,g=""}else({max:d,min:h,current:u,icon:p,sensor:m,unit_of_measurement:g}=e[o]);d=Number(d),h=Number(h),p=String(p),m=String(m),u=Number(u),g=String(g);const f="health"===o?u.toString():t._hass.formatEntityState(t._hass.states[m]).replace(/[^\d,.]/g,"");r[`max_${o}`]={max:d,min:h},s[o]=u,i[o]=p,l[o]=m,a[o]=g,n[o]=g,"dli"===o&&(a.dli="mol/d⋅m²",n.dli='<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>'),c[o]={name:o,current:u,limits:r[`max_${o}`],icon:p,sensor:m,unit_of_measurement:g,display_state:f}}}return(0,e.renderAttributeChunks)(t,c)},e.renderAttribute=(t,e)=>{const{max:i,min:o}=e.limits,l=e.unit_of_measurement,c=e.icon||"mdi:help-circle-outline",d=e.current||0,h=!isNaN(d),u=e.display_state;if("health"===e.name){const i="attribute "+(t.config.display_type===n.DisplayType.Compact?"width-100":""),r=Math.floor(2*d);let o;if(r<=5){const t=(r-1)/4;o="rgba(240,163,163,1)",t>=0&&(o=`rgb(${240+15*t}, ${163+51*t}, ${163-163*t})`)}else{const t=(r-5)/5;o=`rgb(${255-212*t}, ${214-20*t}, ${0+83*t})`}const s=Array.from({length:10},((t,e)=>{const i=h&&d>.5*e?o:"var(--primary-background-color)";return a.html`
                <span class="" 
                      style="grid-row: 1; grid-column: ${e+1}; border-radius: 2px; background-color: ${i};">
                </span>
            `})),l=()=>{const i=Math.max(0,d-.5);t._hass.callService("number","set_value",{entity_id:e.sensor,value:i})},p=()=>{const i=Math.min(5,d+.5);t._hass.callService("number","set_value",{entity_id:e.sensor,value:i})};return a.html`
            <div class="${i}">
                <ha-icon .icon="${c}" 
                         style="cursor: pointer;" 
                         @click="${t=>{t.stopPropagation(),l()}}">
                </ha-icon>
                <div class="meter green" style="display: grid; grid-template-columns: repeat(10, 1fr); column-gap: 5px; max-width: calc(50% + 10px); margin-right: 5px; position: relative;">
                    ${s}
                    <input type="range" 
                           min="0" 
                           max="5" 
                           step="0.5"
                           .value="${d}"
                           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.0001; cursor: pointer; margin: 0; padding: 0;"
                           @input="${i=>{i.stopPropagation();const n=i.target,a=parseFloat(n.value);t._hass.callService("number","set_value",{entity_id:e.sensor,value:a})}}"
                    >
                </div>
                ${t.config.display_type===n.DisplayType.Compact?"":a.html`
                    <div class="header" style="cursor: pointer; min-width: 24px;" @click="${t=>{t.stopPropagation(),p()}}">
                        <span class="value">${u}</span>
                    </div>
                `}
            </div>
        `}const p=100*Math.max(0,Math.min(1,(d-o)/(i-o))),m=h?`${e.name}: ${d} ${l}<br>(${o} ~ ${i} ${l})`:t._hass.localize("state.default.unavailable"),g="dli"===e.name?'<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>':l,f="attribute tooltip "+(t.config.display_type===n.DisplayType.Compact?"width-100":"");return a.html`
        <div class="${f}" @click="${()=>(0,s.moreInfo)(t,e.sensor)}">
            <div class="tip" style="text-align:center;">${(0,r.unsafeHTML)(m)}</div>
            <ha-icon .icon="${c}"></ha-icon>
            <div class="meter red">
                <span class="${h?d<o||d>i?"bad":"good":"unavailable"}" style="width: 100%;"></span>
            </div>
            <div class="meter green">
                <span class="${h?d>i?"bad":"good":"unavailable"}" style="width:${h?p:"0"}%;"></span>
            </div>
            <div class="meter red">
                <span class="bad" style="width:${h?d>i?100:0:"0"}%;"></span>
            </div>
            ${t.config.display_type===n.DisplayType.Compact?"":a.html`<div class="header"><span class="value">${u}</span>&nbsp;<span class='unit'>${"health"===e.name?"":(0,r.unsafeHTML)(g)}</span></div>`}
        </div>
    `},e.getChunkedDisplayed=(t,e)=>Object.values(t).reduce(((t,i,n)=>{const a=Math.floor(n/e);return t[a]||(t[a]=[]),t[a].push(i),t}),[]),e.renderAttributeChunks=(t,i)=>{const r=(0,e.getChunkedDisplayed)(i,t.config.display_type===n.DisplayType.Compact?1:2),o="attributes "+(t.config.display_type===n.DisplayType.Compact?"width-100":"");return r.map((i=>a.html`<div class="${o}">${i.map((i=>i?a.html`${(0,e.renderAttribute)(t,i)}`:""))}</div>`)).flat()}},139:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.plantAttributes=e.missingImage=e.default_show_bars=e.CARD_EDITOR_NAME=e.CARD_NAME=void 0,e.CARD_NAME="flower-card",e.CARD_EDITOR_NAME="flower-card-editor",e.default_show_bars=["moisture","conductivity","temperature","illuminance","humidity","dli","water_consumption","fertilizer_consumption","ppfd","power_consumption","health"],e.missingImage="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1oaWRkZW49InRydWUiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICAgIDxnPgogICAgICA8IS0tP2xpdCQ0MTM0MjMxNjkkLS0+PHBhdGggZD0iTTMsMTNBOSw5IDAgMCwwIDEyLDIyQzEyLDE3IDcuOTcsMTMgMywxM00xMiw1LjVBMi41LDIuNSAwIDAsMSAxNC41LDhBMi41LDIuNSAwIDAsMSAxMiwxMC41QTIuNSwyLjUgMCAwLDEgOS41LDhBMi41LDIuNSAwIDAsMSAxMiw1LjVNNS42LDEwLjI1QTIuNSwyLjUgMCAwLDAgOC4xLDEyLjc1QzguNjMsMTIuNzUgOS4xMiwxMi41OCA5LjUsMTIuMzFDOS41LDEyLjM3IDkuNSwxMi40MyA5LjUsMTIuNUEyLjUsMi41IDAgMCwwIDEyLDE1QTIuNSwyLjUgMCAwLDAgMTQuNSwxMi41QzE0LjUsMTIuNDMgMTQuNSwxMi4zNyAxNC41LDEyLjMxQzE0Ljg4LDEyLjU4IDE1LjM3LDEyLjc1IDE1LjksMTIuNzVDMTcuMjgsMTIuNzUgMTguNCwxMS42MyAxOC40LDEwLjI1QzE4LjQsOS4yNSAxNy44MSw4LjQgMTYuOTcsOEMxNy44MSw3LjYgMTguNCw2Ljc0IDE4LjQsNS43NUMxOC40LDQuMzcgMTcuMjgsMy4yNSAxNS45LDMuMjVDMTUuMzcsMy4yNSAxNC44OCwzLjQxIDE0LjUsMy42OUMxNC41LDMuNjMgMTQuNSwzLjU2IDE0LjUsMy41QTIuNSwyLjUgMCAwLDAgMTIsMUEyLjUsMi41IDAgMCwwIDkuNSwzLjVDOS41LDMuNTYgOS41LDMuNjMgOS41LDMuNjlDOS4xMiwzLjQxIDguNjMsMy4yNSA4LjEsMy4yNUEyLjUsMi41IDAgMCwwIDUuNiw1Ljc1QzUuNiw2Ljc0IDYuMTksNy42IDcuMDMsOEM2LjE5LDguNCA1LjYsOS4yNSA1LjYsMTAuMjVNMTIsMjJBOSw5IDAgMCwwIDIxLDEzQzE2LDEzIDEyLDE3IDEyLDIyWiI+PC9wYXRoPgogICAgICA8L2c+Cjwvc3ZnPgo=",e.plantAttributes=[{label:"Moisture",value:"moisture"},{label:"Conductivity",value:"conductivity"},{label:"Temperature",value:"temperature"},{label:"Illuminance",value:"illuminance"},{label:"Humidity",value:"humidity"},{label:"Daily Light Integral",value:"dli"},{label:"Water Consumption",value:"water_consumption"},{label:"Fertilizer Consumption",value:"fertilizer_consumption"},{label:"PPFD",value:"ppfd"},{label:"Power Consumption",value:"power_consumption"},{label:"Health",value:"health"}]},135:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.moreInfo=e.getStubConfig=e.getConfigElement=void 0;const n=i(356),a=i(139);e.getConfigElement=()=>document.createElement("flower-card-editor"),e.getStubConfig=t=>{const e=t=>{if("object"==typeof t&&"entity_id"in t&&"string"==typeof t.entity_id&&0===t.entity_id.indexOf("plant."))return!!t};let i=[];try{i=Object.values(t.states).filter(e)}catch(t){console.info(`Unable to get ha-data: ${t}`)}return{entity:i.length>0?i[0].entity_id:"plant.my_plant",battery_sensor:"sensor.myflower_battery",show_bars:a.default_show_bars}},e.moreInfo=(t,e)=>{(0,n.fireEvent)(t,"hass-more-info",{entityId:e},{bubbles:!1,composed:!0})}},823:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>s,LitElement:()=>gt,ReactiveElement:()=>S,_$LE:()=>bt,_$LH:()=>ut,adoptStyles:()=>d,css:()=>c,defaultConverter:()=>$,getCompatibleStyle:()=>h,html:()=>Y,isServer:()=>yt,mathml:()=>Q,noChange:()=>Z,notEqual:()=>A,nothing:()=>K,render:()=>mt,supportsAdoptingStyleSheets:()=>a,svg:()=>G,unsafeCSS:()=>l});const n=globalThis,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;class s{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new s("string"==typeof t?t:t+"",void 0,r),c=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new s(i,t,r)},d=(t,e)=>{if(a)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of e){const e=document.createElement("style"),a=n.litNonce;void 0!==a&&e.setAttribute("nonce",a),e.textContent=i.cssText,t.appendChild(e)}},h=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t,{is:u,defineProperty:p,getOwnPropertyDescriptor:m,getOwnPropertyNames:g,getOwnPropertySymbols:f,getPrototypeOf:b}=Object,y=globalThis,v=y.trustedTypes,_=v?v.emptyScript:"",x=y.reactiveElementPolyfillSupport,w=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},A=(t,e)=>!u(t,e),k={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:A};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=k){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&p(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:a}=m(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return n?.call(this)},set(e){const r=n?.call(this);a.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??k}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const t=b(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const t=this.properties,e=[...g(t),...f(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=n,this[n]=a.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??A)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[w("elementProperties")]=new Map,S[w("finalized")]=new Map,x?.({ReactiveElement:S}),(y.reactiveElementVersions??=[]).push("2.0.4");const E=globalThis,D=E.trustedTypes,M=D?D.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+C,O=`<${I}>`,j=document,N=()=>j.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,L=t=>z(t)||"function"==typeof t?.[Symbol.iterator],P="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,H=/>/g,V=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,X=/"/g,W=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),Y=q(1),G=q(2),Q=q(3),Z=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),J=new WeakMap,tt=j.createTreeWalker(j,129);function et(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(e):e}const it=(t,e)=>{const i=t.length-1,n=[];let a,r=2===e?"<svg>":3===e?"<math>":"",o=F;for(let e=0;e<i;e++){const i=t[e];let s,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===F?"!--"===l[1]?o=R:void 0!==l[1]?o=H:void 0!==l[2]?(W.test(l[2])&&(a=RegExp("</"+l[2],"g")),o=V):void 0!==l[3]&&(o=V):o===V?">"===l[0]?(o=a??F,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,s=l[1],o=void 0===l[3]?V:'"'===l[3]?X:B):o===X||o===B?o=V:o===R||o===H?o=F:(o=V,a=void 0);const h=o===V&&t[e+1].startsWith("/>")?" ":"";r+=o===F?i+O:c>=0?(n.push(s),i.slice(0,c)+T+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[et(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class nt{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,r=0;const o=t.length-1,s=this.parts,[l,c]=it(t,e);if(this.el=nt.createElement(l,i),tt.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=tt.nextNode())&&s.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(T)){const e=c[r++],i=n.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);s.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?lt:"?"===o[1]?ct:"@"===o[1]?dt:st}),n.removeAttribute(t)}else t.startsWith(C)&&(s.push({type:6,index:a}),n.removeAttribute(t));if(W.test(n.tagName)){const t=n.textContent.split(C),e=t.length-1;if(e>0){n.textContent=D?D.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],N()),tt.nextNode(),s.push({type:2,index:++a});n.append(t[e],N())}}}else if(8===n.nodeType)if(n.data===I)s.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(C,t+1));)s.push({type:7,index:a}),t+=C.length-1}a++}}static createElement(t,e){const i=j.createElement("template");return i.innerHTML=t,i}}function at(t,e,i=t,n){if(e===Z)return e;let a=void 0!==n?i._$Co?.[n]:i._$Cl;const r=U(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=a:i._$Cl=a),void 0!==a&&(e=at(t,a._$AS(t,e.values),a,n)),e}class rt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??j).importNode(e,!0);tt.currentNode=n;let a=tt.nextNode(),r=0,o=0,s=i[0];for(;void 0!==s;){if(r===s.index){let e;2===s.type?e=new ot(a,a.nextSibling,this,t):1===s.type?e=new s.ctor(a,s.name,s.strings,this,t):6===s.type&&(e=new ht(a,this,t)),this._$AV.push(e),s=i[++o]}r!==s?.index&&(a=tt.nextNode(),r++)}return tt.currentNode=j,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class ot{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),U(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==Z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):L(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=nt.createElement(et(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new rt(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new nt(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new ot(this.O(N()),this.O(N()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,a){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,n){const a=this.strings;let r=!1;if(void 0===a)t=at(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==Z,r&&(this._$AH=t);else{const n=t;let o,s;for(t=a[0],o=0;o<a.length-1;o++)s=at(this,n[i+o],e,o),s===Z&&(s=this._$AH[o]),r||=!U(s)||s!==this._$AH[o],s===K?t=K:t!==K&&(t+=(s??"")+a[o+1]),this._$AH[o]=s}r&&!n&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class lt extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class ct extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class dt extends st{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??K)===Z)return;const i=this._$AH,n=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==K&&(i===K||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ht{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}}const ut={M:T,P:C,A:I,C:1,L:it,R:rt,D:L,V:at,I:ot,H:st,N:ct,U:dt,B:lt,F:ht},pt=E.litHtmlPolyfillSupport;pt?.(nt,ot),(E.litHtmlVersions??=[]).push("3.2.1");const mt=(t,e,i)=>{const n=i?.renderBefore??e;let a=n._$litPart$;if(void 0===a){const t=i?.renderBefore??null;n._$litPart$=a=new ot(e.insertBefore(N(),t),t,void 0,i??{})}return a._$AI(t),a};class gt extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}gt._$litElement$=!0,gt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:gt});const ft=globalThis.litElementPolyfillSupport;ft?.({LitElement:gt});const bt={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(globalThis.litElementVersions??=[]).push("4.1.1");const yt=!1},752:(t,e,i)=>{var n;i.d(e,{JW:()=>S,XX:()=>X,c0:()=>E,ge:()=>V,qy:()=>k,s6:()=>D});const a=window,r=a.trustedTypes,o=r?r.createPolicy("lit-html",{createHTML:t=>t}):void 0,s="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,c="?"+l,d=`<${c}>`,h=document,u=()=>h.createComment(""),p=t=>null===t||"object"!=typeof t&&"function"!=typeof t,m=Array.isArray,g=t=>m(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),f="[ \t\n\f\r]",b=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,y=/-->/g,v=/>/g,_=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),x=/'/g,w=/"/g,$=/^(?:script|style|textarea|title)$/i,A=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),k=A(1),S=A(2),E=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),M=new WeakMap,T=h.createTreeWalker(h,129,null,!1);function C(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==o?o.createHTML(e):e}const I=(t,e)=>{const i=t.length-1,n=[];let a,r=2===e?"<svg>":"",o=b;for(let e=0;e<i;e++){const i=t[e];let c,h,u=-1,p=0;for(;p<i.length&&(o.lastIndex=p,h=o.exec(i),null!==h);)p=o.lastIndex,o===b?"!--"===h[1]?o=y:void 0!==h[1]?o=v:void 0!==h[2]?($.test(h[2])&&(a=RegExp("</"+h[2],"g")),o=_):void 0!==h[3]&&(o=_):o===_?">"===h[0]?(o=null!=a?a:b,u=-1):void 0===h[1]?u=-2:(u=o.lastIndex-h[2].length,c=h[1],o=void 0===h[3]?_:'"'===h[3]?w:x):o===w||o===x?o=_:o===y||o===v?o=b:(o=_,a=void 0);const m=o===_&&t[e+1].startsWith("/>")?" ":"";r+=o===b?i+d:u>=0?(n.push(c),i.slice(0,u)+s+i.slice(u)+l+m):i+l+(-2===u?(n.push(void 0),e):m)}return[C(t,r+(t[i]||"<?>")+(2===e?"</svg>":"")),n]};class O{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,o=0;const d=t.length-1,h=this.parts,[p,m]=I(t,e);if(this.el=O.createElement(p,i),T.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=T.nextNode())&&h.length<d;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith(s)||e.startsWith(l)){const i=m[o++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+s).split(l),e=/([.?@])?(.*)/.exec(i);h.push({type:1,index:a,name:e[2],strings:t,ctor:"."===e[1]?L:"?"===e[1]?F:"@"===e[1]?R:z})}else h.push({type:6,index:a})}for(const e of t)n.removeAttribute(e)}if($.test(n.tagName)){const t=n.textContent.split(l),e=t.length-1;if(e>0){n.textContent=r?r.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],u()),T.nextNode(),h.push({type:2,index:++a});n.append(t[e],u())}}}else if(8===n.nodeType)if(n.data===c)h.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(l,t+1));)h.push({type:7,index:a}),t+=l.length-1}a++}}static createElement(t,e){const i=h.createElement("template");return i.innerHTML=t,i}}function j(t,e,i=t,n){var a,r,o,s;if(e===E)return e;let l=void 0!==n?null===(a=i._$Co)||void 0===a?void 0:a[n]:i._$Cl;const c=p(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,n)),void 0!==n?(null!==(o=(s=i)._$Co)&&void 0!==o?o:s._$Co=[])[n]=l:i._$Cl=l),void 0!==l&&(e=j(t,l._$AS(t,e.values),l,n)),e}class N{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:n}=this._$AD,a=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:h).importNode(i,!0);T.currentNode=a;let r=T.nextNode(),o=0,s=0,l=n[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new U(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new H(r,this,t)),this._$AV.push(e),l=n[++s]}o!==(null==l?void 0:l.index)&&(r=T.nextNode(),o++)}return T.currentNode=h,a}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class U{constructor(t,e,i,n){var a;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=null===(a=null==n?void 0:n.isConnected)||void 0===a||a}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),p(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):g(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&p(this._$AH)?this._$AA.nextSibling.data=t:this.$(h.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:n}=t,a="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=O.createElement(C(n.h,n.h[0]),this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===a)this._$AH.v(i);else{const t=new N(a,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=M.get(t.strings);return void 0===e&&M.set(t.strings,e=new O(t)),e}T(t){m(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new U(this.k(u()),this.k(u()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class z{constructor(t,e,i,n,a){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const a=this.strings;let r=!1;if(void 0===a)t=j(this,t,e,0),r=!p(t)||t!==this._$AH&&t!==E,r&&(this._$AH=t);else{const n=t;let o,s;for(t=a[0],o=0;o<a.length-1;o++)s=j(this,n[i+o],e,o),s===E&&(s=this._$AH[o]),r||(r=!p(s)||s!==this._$AH[o]),s===D?t=D:t!==D&&(t+=(null!=s?s:"")+a[o+1]),this._$AH[o]=s}r&&!n&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class L extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}}const P=r?r.emptyScript:"";class F extends z{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,P):this.element.removeAttribute(this.name)}}class R extends z{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=j(this,t,e,0))&&void 0!==i?i:D)===E)return;const n=this._$AH,a=t===D&&n!==D||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==D&&(n===D||a);a&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class H{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const V={O:s,P:l,A:c,C:1,M:I,L:N,R:g,D:j,I:U,V:z,H:F,N:R,U:L,F:H},B=a.litHtmlPolyfillSupport;null==B||B(O,U),(null!==(n=a.litHtmlVersions)&&void 0!==n?n:a.litHtmlVersions=[]).push("2.8.0");const X=(t,e,i)=>{var n,a;const r=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let o=r._$litPart$;if(void 0===o){const t=null!==(a=null==i?void 0:i.renderBefore)&&void 0!==a?a:null;r._$litPart$=o=new U(e.insertBefore(u(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>n,eventOptions:()=>c,property:()=>o,query:()=>d,queryAll:()=>h,queryAssignedElements:()=>g,queryAssignedNodes:()=>f,queryAsync:()=>u,state:()=>s});const n=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){customElements.define(t,e)}}})(t,e),a=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},r=(t,e,i)=>{e.constructor.createProperty(i,t)};function o(t){return(e,i)=>void 0!==i?r(t,e,i):a(t,e)}function s(t){return o({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,n)=>{var a;if(void 0===n){const n=null!==(a=i.originalKey)&&void 0!==a?a:i.key,r=null!=e?{kind:"method",placement:"prototype",key:n,descriptor:e(i.key)}:{...i,key:n};return null!=t&&(r.finisher=function(e){t(e,n)}),r}{const a=i.constructor;void 0!==e&&Object.defineProperty(i,n,e(n)),null==t||t(a,n)}};function c(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function d(t,e){return l({descriptor:i=>{const n={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;n.get=function(){var i,n;return void 0===this[e]&&(this[e]=null!==(n=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==n?n:null),this[e]}}return n}})}function h(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function u(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var p;const m=null!=(null===(p=window.HTMLSlotElement)||void 0===p?void 0:p.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function g(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:n=>({get(){var n;const a="slot"+(e?`[name=${e}]`:":not([name])"),r=null===(n=this.renderRoot)||void 0===n?void 0:n.querySelector(a),o=null!=r?m(r,t):[];return i?o.filter((t=>t.matches(i))):o},enumerable:!0,configurable:!0})})}function f(t,e,i){let n,a=t;return"object"==typeof t?(a=t.slot,n=t):n={flatten:e},i?g({slot:a,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(a?`[name=${a}]`:":not([name])"),r=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==r?void 0:r.assignedNodes(n))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},534:(t,e,i)=>{i.r(e),i.d(e,{UnsafeHTMLDirective:()=>r,unsafeHTML:()=>o});var n=i(752);class a{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class r extends a{constructor(t){if(super(t),this.et=n.s6,2!==t.type)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===n.s6||null==t)return this.ft=void 0,this.et=t;if(t===n.c0)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;const o=(s=r,(...t)=>({_$litDirective$:s,values:t}));var s},437:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>s,LitElement:()=>S,ReactiveElement:()=>x,UpdatingElement:()=>k,_$LE:()=>D,_$LH:()=>A.ge,adoptStyles:()=>d,css:()=>c,defaultConverter:()=>b,getCompatibleStyle:()=>h,html:()=>A.qy,isServer:()=>M,noChange:()=>A.c0,notEqual:()=>y,nothing:()=>A.s6,render:()=>A.XX,supportsAdoptingStyleSheets:()=>a,svg:()=>A.JW,unsafeCSS:()=>l});const n=window,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;class s{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new s("string"==typeof t?t:t+"",void 0,r),c=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new s(i,t,r)},d=(t,e)=>{a?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),a=n.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=e.cssText,t.appendChild(i)}))},h=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var u;const p=window,m=p.trustedTypes,g=m?m.emptyScript:"",f=p.reactiveElementPolyfillSupport,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>e!==t&&(e==e||t==t),v={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},_="finalized";class x extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const n=this._$Ep(i,e);void 0!==n&&(this._$Ev.set(n,i),t.push(n))})),t}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const a=this[t];this[e]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty(_))return!1;this[_]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=v){var n;const a=this.constructor._$Ep(t,i);if(void 0!==a&&!0===i.reflect){const r=(void 0!==(null===(n=i.converter)||void 0===n?void 0:n.toAttribute)?i.converter:b).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(a):this.setAttribute(a,r),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,a=n._$Ev.get(t);if(void 0!==a&&this._$El!==a){const t=n.getPropertyOptions(a),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:b;this._$El=a,this[a]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||y)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}x[_]=!0,x.elementProperties=new Map,x.elementStyles=[],x.shadowRootOptions={mode:"open"},null==f||f({ReactiveElement:x}),(null!==(u=p.reactiveElementVersions)&&void 0!==u?u:p.reactiveElementVersions=[]).push("1.6.3");var w,$,A=i(752);const k=x;class S extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,A.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return A.c0}}S.finalized=!0,S._$litElement$=!0,null===(w=globalThis.litElementHydrateSupport)||void 0===w||w.call(globalThis,{LitElement:S});const E=globalThis.litElementPolyfillSupport;null==E||E({LitElement:S});const D={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==($=globalThis.litElementVersions)&&void 0!==$?$:globalThis.litElementVersions=[]).push("3.3.3");const M=!1},330:t=>{t.exports=JSON.parse('{"name":"flower-card","version":"3.0.0","description":"A Lovelace flower card for Home Assistant","main":"flower-card.js","repository":{"type":"git","url":"git+ssh://git@github.com/Olen/lovelace-flower-card.git"},"author":"Ola Bjorling Erdal <ola@bjorling.se>","license":"MIT","scripts":{"build":"webpack -c webpack.config.js","lint":"eslint src/**/*.ts","watch":"webpack -c webpack.config.js --watch --mode=development"},"dependencies":{"@marcokreeft/ha-editor-formbuilder":"2024.9.1","custom-card-helpers":"^1.9.0","home-assistant-js-websocket":"^9.4.0","lit":"^2.8.0","lit-element":"^2.5.1"},"devDependencies":{"@babel/core":"^7.26.0","@babel/preset-env":"^7.26.0","@babel/preset-typescript":"^7.26.0","@types/node":"^20.11.30","@typescript-eslint/eslint-plugin":"^8.19.1","babel-loader":"^9.1.3","compression-webpack-plugin":"^11.1.0","eslint":"^8.57.0","ts-loader":"^9.5.2","typescript":"^5.7.3","webpack":"^5.97.1","webpack-cli":"^5.1.4"},"keywords":[],"bugs":{"url":"https://github.com/Olen/lovelace-flower-card/issues"},"homepage":"https://github.com/Olen/lovelace-flower-card#readme"}')}},e={};function i(n){var a=e[n];if(void 0!==a)return a.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,i),r.exports}i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(248)})();