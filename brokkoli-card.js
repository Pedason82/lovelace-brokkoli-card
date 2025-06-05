/*! For license information please see brokkoli-card.js.LICENSE.txt */
(()=>{"use strict";var t={147:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0});const n=i(356),a=i(823),s=i(516),o=i(167);class r extends a.LitElement{constructor(){super(...arguments),this.controlRenderers={[s.FormControlType.Dropdown]:o.renderDropdown,[s.FormControlType.Radio]:o.renderRadio,[s.FormControlType.Checkboxes]:o.renderCheckboxes,[s.FormControlType.EntityDropdown]:o.renderDropdown,[s.FormControlType.Switch]:o.renderSwitch,[s.FormControlType.Textbox]:o.renderTextbox,[s.FormControlType.Filler]:o.renderFiller}}setConfig(t){this._config=t,this.requestUpdate("_config")}set hass(t){this._hass=t}renderForm(t){return a.html`
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
        `}}e.default=r},516:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.FormControlType=void 0,function(t){t.Dropdown="dropdown",t.Checkbox="checkbox",t.Checkboxes="checkboxes",t.Radio="radio",t.Switch="switch",t.Textbox="textbox",t.Filler="filler",t.EntityDropdown="entity-dropdown"}(i||(e.FormControlType=i={}))},167:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.renderCheckboxes=e.renderRadio=e.renderDropdown=e.renderSwitch=e.renderTextbox=e.renderEntityDropdown=e.renderFiller=void 0;const n=i(823),a=i(770);e.renderFiller=()=>n.html`<div class="form-control"></div>`,e.renderEntityDropdown=(t,e)=>{var i;return n.html`
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
    `,e.renderDropdown=(t,e)=>{var i;const s=null!==(i=e.items)&&void 0!==i?i:(0,a.getEntitiesByDomain)(t._hass,e.domain);return n.html`  
    <div class="form-control">
        <ha-combo-box
            label="${e.label}"
            .value="${t._config[e.configValue]}"
            .configValue="${e.configValue}"
            .items="${s}"
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
      `},770:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getDropdownOptionsFromEnum=e.formatList=e.getEntitiesByDeviceClass=e.getEntitiesByDomain=void 0,e.getEntitiesByDomain=(t,i)=>Object.keys(t.states).filter((t=>t.substr(0,t.indexOf("."))===i)).map((i=>(0,e.formatList)(i,t))),e.getEntitiesByDeviceClass=(t,i,n)=>Object.keys(t.states).filter((e=>e.substr(0,e.indexOf("."))===i&&t.states[e].attributes.device_class===n)).map((i=>(0,e.formatList)(i,t))),e.formatList=(t,e)=>({label:e.states[t].attributes.friendly_name,value:t}),e.getDropdownOptionsFromEnum=t=>{const e=[];for(const[i,n]of Object.entries(t))e.push({value:n,label:i});return e}},356:(t,e,i)=>{i.r(e),i.d(e,{DEFAULT_DOMAIN_ICON:()=>Z,DEFAULT_PANEL:()=>J,DEFAULT_VIEW_ENTITY_ID:()=>rt,DOMAINS_HIDE_MORE_INFO:()=>et,DOMAINS_MORE_INFO_NO_HISTORY:()=>it,DOMAINS_TOGGLE:()=>at,DOMAINS_WITH_CARD:()=>Q,DOMAINS_WITH_MORE_INFO:()=>tt,NumberFormat:()=>n,STATES_OFF:()=>nt,TimeFormat:()=>a,UNIT_C:()=>st,UNIT_F:()=>ot,applyThemesOnElement:()=>z,computeCardSize:()=>R,computeDomain:()=>U,computeEntity:()=>F,computeRTL:()=>H,computeRTLDirection:()=>B,computeStateDisplay:()=>K,computeStateDomain:()=>V,createThing:()=>ht,debounce:()=>ut,domainIcon:()=>mt,evaluateFilter:()=>gt,fireEvent:()=>lt,fixedIcons:()=>pt,formatDate:()=>d,formatDateMonth:()=>_,formatDateMonthYear:()=>v,formatDateNumeric:()=>u,formatDateShort:()=>m,formatDateTime:()=>$,formatDateTimeNumeric:()=>T,formatDateTimeWithSeconds:()=>k,formatDateWeekday:()=>l,formatDateYear:()=>b,formatNumber:()=>Y,formatTime:()=>I,formatTimeWeekday:()=>M,formatTimeWithSeconds:()=>C,forwardHaptic:()=>vt,getLovelace:()=>Tt,handleAction:()=>wt,handleActionConfig:()=>bt,handleClick:()=>xt,hasAction:()=>$t,hasConfigOrEntityChanged:()=>Et,hasDoubleClick:()=>kt,isNumericState:()=>W,navigate:()=>ft,numberFormatToLocale:()=>q,relativeTime:()=>j,round:()=>G,stateIcon:()=>Pt,timerTimeRemaining:()=>L,toggleEntity:()=>yt,turnOnOffEntities:()=>At,turnOnOffEntity:()=>_t});var n,a,s,o=function(){return o=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var a in e=arguments[i])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},o.apply(this,arguments)},r={second:45,minute:45,hour:22,day:5},l=function(t,e){return c(e).format(t)},c=function(t){return new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"})},d=function(t,e){return h(e).format(t)},h=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"})},u=function(t,e){return p(e).format(t)},p=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"})},m=function(t,e){return g(e).format(t)},g=function(t){return new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"})},v=function(t,e){return f(e).format(t)},f=function(t){return new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"})},_=function(t,e){return y(e).format(t)},y=function(t){return new Intl.DateTimeFormat(t.language,{month:"long"})},b=function(t,e){return w(e).format(t)},w=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric"})};(s=n||(n={})).language="language",s.system="system",s.comma_decimal="comma_decimal",s.decimal_comma="decimal_comma",s.space_comma="space_comma",s.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(a||(a={}));var x=function(t){if(t.time_format===a.language||t.time_format===a.system){var e=t.time_format===a.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===a.am_pm},$=function(t,e){return E(e).format(t)},E=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:x(t)?"numeric":"2-digit",minute:"2-digit",hour12:x(t)})},k=function(t,e){return A(e).format(t)},A=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:x(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:x(t)})},T=function(t,e){return S(e).format(t)},S=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:x(t)})},I=function(t,e){return P(e).format(t)},P=function(t){return new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hour12:x(t)})},C=function(t,e){return D(e).format(t)},D=function(t){return new Intl.DateTimeFormat(t.language,{hour:x(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:x(t)})},M=function(t,e){return O(e).format(t)},O=function(t){return new Intl.DateTimeFormat(t.language,{hour:x(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:x(t)})},j=function(t,e,i,n){void 0===n&&(n=!0);var a=function(t,e,i){void 0===e&&(e=Date.now()),void 0===i&&(i={});var n=o(o({},r),i||{}),a=(+t-+e)/1e3;if(Math.abs(a)<n.second)return{value:Math.round(a),unit:"second"};var s=a/60;if(Math.abs(s)<n.minute)return{value:Math.round(s),unit:"minute"};var l=a/3600;if(Math.abs(l)<n.hour)return{value:Math.round(l),unit:"hour"};var c=a/86400;if(Math.abs(c)<n.day)return{value:Math.round(c),unit:"day"};var d=new Date(t),h=new Date(e),u=d.getFullYear()-h.getFullYear();if(Math.round(Math.abs(u))>0)return{value:Math.round(u),unit:"year"};var p=12*u+d.getMonth()-h.getMonth();if(Math.round(Math.abs(p))>0)return{value:Math.round(p),unit:"month"};var m=a/604800;return{value:Math.round(m),unit:"week"}}(t,i);return n?function(t){return new Intl.RelativeTimeFormat(t.language,{numeric:"auto"})}(e).format(a.value,a.unit):Intl.NumberFormat(e.language,{style:"unit",unit:a.unit,unitDisplay:"long"}).format(Math.abs(a.value))};function L(t){var e,i=3600*(e=t.attributes.remaining.split(":").map(Number))[0]+60*e[1]+e[2];if("active"===t.state){var n=(new Date).getTime(),a=new Date(t.last_changed).getTime();i=Math.max(i-(n-a)/1e3,0)}return i}function N(){return(N=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}var z=function(t,e,i,n){void 0===n&&(n=!1),t._themes||(t._themes={});var a=e.default_theme;("default"===i||i&&e.themes[i])&&(a=i);var s=N({},t._themes);if("default"!==a){var o=e.themes[a];Object.keys(o).forEach((function(e){var i="--"+e;t._themes[i]="",s[i]=o[e]}))}if(t.updateStyles?t.updateStyles(s):window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,s),n){var r=document.querySelector("meta[name=theme-color]");if(r){r.hasAttribute("default-content")||r.setAttribute("default-content",r.getAttribute("content"));var l=s["--primary-color"]||r.getAttribute("default-content");r.setAttribute("content",l)}}},R=function(t){return"function"==typeof t.getCardSize?t.getCardSize():4};function U(t){return t.substr(0,t.indexOf("."))}function F(t){return t.substr(t.indexOf(".")+1)}function H(t){var e,i=(null==t||null==(e=t.locale)?void 0:e.language)||"en";return t.translationMetadata.translations[i]&&t.translationMetadata.translations[i].isRTL||!1}function B(t){return H(t)?"rtl":"ltr"}function V(t){return U(t.entity_id)}var W=function(t){return!!t.attributes.unit_of_measurement||!!t.attributes.state_class},q=function(t){switch(t.number_format){case n.comma_decimal:return["en-US","en"];case n.decimal_comma:return["de","es","it"];case n.space_comma:return["fr","sv","cs"];case n.system:return;default:return t.language}},G=function(t,e){return void 0===e&&(e=2),Math.round(t*Math.pow(10,e))/Math.pow(10,e)},Y=function(t,e,i){var a=e?q(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},(null==e?void 0:e.number_format)!==n.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(a,X(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,X(t,i)).format(Number(t))}return"string"==typeof t?t:G(t,null==i?void 0:i.maximumFractionDigits).toString()+("currency"===(null==i?void 0:i.style)?" "+i.currency:"")},X=function(t,e){var i=N({maximumFractionDigits:2},e);if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var n=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=n,i.maximumFractionDigits=n}return i},K=function(t,e,i,n){var a=void 0!==n?n:e.state;if("unknown"===a||"unavailable"===a)return t("state.default."+a);if(W(e)){if("monetary"===e.attributes.device_class)try{return Y(a,i,{style:"currency",currency:e.attributes.unit_of_measurement})}catch(t){}return Y(a,i)+(e.attributes.unit_of_measurement?" "+e.attributes.unit_of_measurement:"")}var s=V(e);if("input_datetime"===s){var o;if(void 0===n)return e.attributes.has_date&&e.attributes.has_time?(o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),$(o,i)):e.attributes.has_date?(o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),d(o,i)):e.attributes.has_time?((o=new Date).setHours(e.attributes.hour,e.attributes.minute),I(o,i)):e.state;try{var r=n.split(" ");if(2===r.length)return $(new Date(r.join("T")),i);if(1===r.length){if(n.includes("-"))return d(new Date(n+"T00:00"),i);if(n.includes(":")){var l=new Date;return I(new Date(l.toISOString().split("T")[0]+"T"+n),i)}}return n}catch(t){return n}}return"humidifier"===s&&"on"===a&&e.attributes.humidity?e.attributes.humidity+" %":"counter"===s||"number"===s||"input_number"===s?Y(a,i):e.attributes.device_class&&t("component."+s+".state."+e.attributes.device_class+"."+a)||t("component."+s+".state._."+a)||a},Z="mdi:bookmark",J="lovelace",Q=["climate","cover","configurator","input_select","input_number","input_text","lock","media_player","scene","script","timer","vacuum","water_heater","weblink"],tt=["alarm_control_panel","automation","camera","climate","configurator","cover","fan","group","history_graph","input_datetime","light","lock","media_player","script","sun","updater","vacuum","water_heater","weather"],et=["input_number","input_select","input_text","scene","weblink"],it=["camera","configurator","history_graph","scene"],nt=["closed","locked","off"],at=new Set(["fan","input_boolean","light","switch","group","automation"]),st="°C",ot="°F",rt="group.default_view",lt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var a=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return a.detail=i,t.dispatchEvent(a),a},ct=new Set(["call-service","divider","section","weblink","cast","select"]),dt={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},ht=function(t,e){void 0===e&&(e=!1);var i=function(t,e){return n("hui-error-card",{type:"error",error:t,config:e})},n=function(t,e){var n=window.document.createElement(t);try{if(!n.setConfig)return;n.setConfig(e)}catch(n){return console.error(t,n),i(n.message,e)}return n};if(!t||"object"!=typeof t||!e&&!t.type)return i("No type defined",t);var a=t.type;if(a&&a.startsWith("custom:"))a=a.substr(7);else if(e)if(ct.has(a))a="hui-"+a+"-row";else{if(!t.entity)return i("Invalid config given.",t);var s=t.entity.split(".",1)[0];a="hui-"+(dt[s]||"text")+"-entity-row"}else a="hui-"+a+"-card";if(customElements.get(a))return n(a,t);var o=i("Custom element doesn't exist: "+t.type+".",t);o.style.display="None";var r=setTimeout((function(){o.style.display=""}),2e3);return customElements.whenDefined(t.type).then((function(){clearTimeout(r),lt(o,"ll-rebuild",{},o)})),o},ut=function(t,e,i){var n;return void 0===i&&(i=!1),function(){var a=[].slice.call(arguments),s=this,o=i&&!n;clearTimeout(n),n=setTimeout((function(){n=null,i||t.apply(s,a)}),e),o&&t.apply(s,a)}},pt={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function mt(t,e){if(t in pt)return pt[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return e&&"off"===e?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===e?"mdi:window-closed":"mdi:window-open";case"lock":return e&&"unlocked"===e?"mdi:lock-open":"mdi:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"mdi:cast-connected":"mdi:cast";case"zwave":switch(e){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"mdi:bookmark"}}var gt=function(t,e){var i=e.value||e,n=e.attribute?t.attributes[e.attribute]:t.state;switch(e.operator||"=="){case"==":return n===i;case"<=":return n<=i;case"<":return n<i;case">=":return n>=i;case">":return n>i;case"!=":return n!==i;case"regex":return n.match(i);default:return!1}},vt=function(t){lt(window,"haptic",t)},ft=function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),lt(window,"location-changed",{replace:i})},_t=function(t,e,i){void 0===i&&(i=!0);var n,a=U(e),s="group"===a?"homeassistant":a;switch(a){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}return t.callService(s,n,{entity_id:e})},yt=function(t,e){var i=nt.includes(t.states[e].state);return _t(t,e,i)},bt=function(t,e,i,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(vt("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(i.entity||i.camera_image)&&lt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":n.navigation_path&&ft(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":i.entity&&(yt(e,i.entity),vt("success"));break;case"call-service":if(!n.service)return void vt("failure");var a=n.service.split(".",2);e.callService(a[0],a[1],n.service_data,n.target),vt("success");break;case"fire-dom-event":lt(t,"ll-custom",n)}},wt=function(t,e,i,n){var a;"double_tap"===n&&i.double_tap_action?a=i.double_tap_action:"hold"===n&&i.hold_action?a=i.hold_action:"tap"===n&&i.tap_action&&(a=i.tap_action),bt(t,e,i,a)},xt=function(t,e,i,n,a){var s;if(a&&i.double_tap_action?s=i.double_tap_action:n&&i.hold_action?s=i.hold_action:!n&&i.tap_action&&(s=i.tap_action),s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||confirm(s.confirmation.text||"Are you sure you want to "+s.action+"?"))switch(s.action){case"more-info":(s.entity||i.entity||i.camera_image)&&(lt(t,"hass-more-info",{entityId:s.entity?s.entity:i.entity?i.entity:i.camera_image}),s.haptic&&vt(s.haptic));break;case"navigate":s.navigation_path&&(ft(0,s.navigation_path),s.haptic&&vt(s.haptic));break;case"url":s.url_path&&window.open(s.url_path),s.haptic&&vt(s.haptic);break;case"toggle":i.entity&&(yt(e,i.entity),s.haptic&&vt(s.haptic));break;case"call-service":if(!s.service)return;var o=s.service.split(".",2),r=o[0],l=o[1],c=N({},s.service_data);"entity"===c.entity_id&&(c.entity_id=i.entity),e.callService(r,l,c,s.target),s.haptic&&vt(s.haptic);break;case"fire-dom-event":lt(t,"ll-custom",s),s.haptic&&vt(s.haptic)}};function $t(t){return void 0!==t&&"none"!==t.action}function Et(t,e,i){if(e.has("config")||i)return!0;if(t.config.entity){var n=e.get("hass");return!n||n.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}function kt(t){return void 0!==t&&"none"!==t.action}var At=function(t,e,i){void 0===i&&(i=!0);var n={};e.forEach((function(e){if(nt.includes(t.states[e].state)===i){var a=U(e),s=["cover","lock"].includes(a)?a:"homeassistant";s in n||(n[s]=[]),n[s].push(e)}})),Object.keys(n).forEach((function(e){var a;switch(e){case"lock":a=i?"unlock":"lock";break;case"cover":a=i?"open_cover":"close_cover";break;default:a=i?"turn_on":"turn_off"}t.callService(e,a,{entity_id:n[e]})}))},Tt=function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null},St={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},It={binary_sensor:function(t,e){var i="off"===t;switch(null==e?void 0:e.attributes.device_class){case"battery":return i?"mdi:battery":"mdi:battery-outline";case"battery_charging":return i?"mdi:battery":"mdi:battery-charging";case"cold":return i?"mdi:thermometer":"mdi:snowflake";case"connectivity":return i?"mdi:server-network-off":"mdi:server-network";case"door":return i?"mdi:door-closed":"mdi:door-open";case"garage_door":return i?"mdi:garage":"mdi:garage-open";case"power":case"plug":return i?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return i?"mdi:check-circle":"mdi:alert-circle";case"smoke":return i?"mdi:check-circle":"mdi:smoke";case"heat":return i?"mdi:thermometer":"mdi:fire";case"light":return i?"mdi:brightness-5":"mdi:brightness-7";case"lock":return i?"mdi:lock":"mdi:lock-open";case"moisture":return i?"mdi:water-off":"mdi:water";case"motion":return i?"mdi:walk":"mdi:run";case"occupancy":case"presence":return i?"mdi:home-outline":"mdi:home";case"opening":return i?"mdi:square":"mdi:square-outline";case"running":return i?"mdi:stop":"mdi:play";case"sound":return i?"mdi:music-note-off":"mdi:music-note";case"update":return i?"mdi:package":"mdi:package-up";case"vibration":return i?"mdi:crop-portrait":"mdi:vibrate";case"window":return i?"mdi:window-closed":"mdi:window-open";default:return i?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(t){var e="closed"!==t.state;switch(t.attributes.device_class){case"garage":return e?"mdi:garage-open":"mdi:garage";case"door":return e?"mdi:door-open":"mdi:door-closed";case"shutter":return e?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return e?"mdi:blinds-open":"mdi:blinds";case"window":return e?"mdi:window-open":"mdi:window-closed";default:return mt("cover",t.state)}},sensor:function(t){var e=t.attributes.device_class;if(e&&e in St)return St[e];if("battery"===e){var i=Number(t.state);if(isNaN(i))return"mdi:battery-unknown";var n=10*Math.round(i/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var a=t.attributes.unit_of_measurement;return"°C"===a||"°F"===a?"mdi:thermometer":mt("sensor")},input_datetime:function(t){return t.attributes.has_date?t.attributes.has_time?mt("input_datetime"):"mdi:calendar":"mdi:clock"}},Pt=function(t){if(!t)return"mdi:bookmark";if(t.attributes.icon)return t.attributes.icon;var e=U(t.entity_id);return e in It?It[e](t):mt(e,t.state)}},828:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},a=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const s=i(437),o=i(924),r=i(800),l=i(130),c=i(330),d=i(429),h=i(139),u=i(135);i(507),i(618),i(261),console.info(`%c BROKKOLI-CARD %c ${c.version}`,"color: cyan; background: black; font-weight: bold;","color: darkblue; background: white; font-weight: bold;"),window.customCards=window.customCards||[],window.customCards.push({type:h.CARD_NAME,name:"Brokkoli card",preview:!0,description:"Custom brokkoli card for https://github.com/Olen/homeassistant-plant"});let p=class extends s.LitElement{constructor(){super(...arguments),this._expanded={attributes:!1,timeline:!1,consumption:!1,history:!1,details:!1},this._expandedOrder=[],this._showGallery=!1,this._currentImageIndex=0,this._activePopup=null,this._showFlyoutMenu=!1,this._popupData={},this._showPlantDropdown=!1,this.selectedPlantEntity=null,this._listenToSelector=null,this._selectedEntities=[],this._imageUrls=[],this._handleOutsideDropdownClick=t=>{this._showPlantDropdown=!1,this.requestUpdate()},this._handleOutsideClick=t=>{t.composedPath().some((t=>t instanceof HTMLElement&&t.classList.contains("flyout-menu")))||(this._showFlyoutMenu=!1,document.removeEventListener("click",this._handleOutsideClick))},this._handleCycleMemberSelected=t=>{var e;if((null===(e=this.config)||void 0===e?void 0:e.entity)&&this.stateObj&&t.detail){const{originalEntityId:e,selectedEntityId:i,sourceCardId:n}=t.detail;if(n===this)return;(e===this.config.entity||this._popupData.originalEntity&&this._popupData.originalEntity===e)&&(this.selectedPlantEntity=i,!this._popupData.originalEntity&&this.stateObj&&(this._popupData.originalEntity=this.stateObj.entity_id),this._hass&&(this.stateObj=this._hass.states[i],this.get_data(this._hass).then((()=>{var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll("flower-consumption");e&&e.forEach((t=>{t&&(t.entityId=i)})),this.requestUpdate()}))))}},this._handleCardEntitySelected=t=>{if(this._listenToSelector&&t.detail){const{sourceIdentifier:e,selectedEntityId:i,selectedEntities:n}=t.detail;if(e===this._listenToSelector){if(n&&Array.isArray(n)?this._selectedEntities=[...n]:this._selectedEntities=i?[i]:[],this.selectedPlantEntity=i,!i)return this.stateObj=void 0,void this.requestUpdate();this._hass&&i&&this._hass.states[i]&&(this.stateObj=this._hass.states[i],this.get_data(this._hass).then((()=>{var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll("flower-consumption");e&&e.forEach((t=>{t&&(t.entityId=i)})),this.requestUpdate()})))}}}}getGrowthPhaseIcon(t){return(0,h.getGrowthPhaseIcon)(t)}disconnectedCallback(){super.disconnectedCallback(),this._imageRotationInterval&&clearInterval(this._imageRotationInterval),window.removeEventListener("brokkoli-card-cycle-member-selected",this._handleCycleMemberSelected),window.removeEventListener("brokkoli-card-entity-selected",this._handleCardEntitySelected)}connectedCallback(){super.connectedCallback(),window.addEventListener("brokkoli-card-cycle-member-selected",this._handleCycleMemberSelected),window.addEventListener("brokkoli-card-entity-selected",this._handleCardEntitySelected)}set hass(t){var e;this._hass=t,this.selectedPlantEntity?this.stateObj=t.states[this.selectedPlantEntity]:(null===(e=this.config)||void 0===e?void 0:e.entity)?this.stateObj=t.states[this.config.entity]:this.stateObj=void 0,this.previousFetchDate||(this.previousFetchDate=0),Date.now()>this.previousFetchDate+1e3&&(this.previousFetchDate=Date.now(),this.get_data(t).then((()=>{this.requestUpdate()})))}static getConfigElement(){return a(this,void 0,void 0,(function*(){return yield Promise.resolve().then((()=>i(43))),document.createElement(h.CARD_EDITOR_NAME)}))}static getStubConfig(t){const e=t=>{if("object"==typeof t&&"entity_id"in t&&"string"==typeof t.entity_id&&(0===t.entity_id.indexOf("plant.")||0===t.entity_id.indexOf("cycle.")))return!!t};let i=[];try{i=Object.values(t.states).filter(e)}catch(t){console.info(`Unable to get ha-data: ${t}`)}return{entity:i.length>0?i[0].entity_id:"plant.my_plant",battery_sensor:"sensor.myflower_battery",show_bars:[...h.default_show_bars],show_elements:[...h.default_show_elements],option_elements:[...h.default_option_elements]}}setConfig(t){var e;if(!t.entity&&!t.listen_to)throw new Error("Du musst entweder eine Entity oder listen_to definieren");if(this.config=Object.assign(Object.assign({},t),{show_elements:t.show_elements||[...h.default_show_elements],option_elements:t.option_elements||[...h.default_option_elements]}),t.listen_to&&(this._listenToSelector=t.listen_to),this._expandedOrder=[],null===(e=this.config.default_expanded_options)||void 0===e?void 0:e.length){const t=this.config.default_expanded_options.filter((t=>this.config.option_elements.includes(t)));this._expanded=Object.assign(Object.assign({},this._expanded),Object.fromEntries(t.map((t=>[t,!0])))),this._expandedOrder=[...t]}}_renderElement(t){switch(t){case"header":return this._renderHeader();case"attributes":return this._renderAttributes();case"options":return this._renderOptions();case"consumption":return this._renderConsumption();case"history":return this._renderHistory();case"details":return this._renderDetails();default:return s.html``}}_renderHeader(){const t=this.config.display_type===l.DisplayType.Compact?"header-compact":"header",e=this.stateObj.entity_id.split(".")[1],i=this.stateObj.entity_id.startsWith("cycle."),n=null!==this.selectedPlantEntity;let a="",o=[];if(n&&this._popupData.originalEntity){const t=this._popupData.originalEntity.split(".")[1],e=this._hass.states[`select.${t}_growth_phase`];e&&e.attributes.member_plants&&(o=e.attributes.member_plants)}else if(i){const t=this.stateObj.entity_id.split(".")[1],e=this._hass.states[`select.${t}_growth_phase`];e&&e.attributes.member_plants&&(o=e.attributes.member_plants)}a=i?`${this.stateObj.attributes.member_count||0} Plants`:this._listenToSelector&&this._selectedEntities.length>1?`${this._selectedEntities.length} Plants ausgewählt`:this.stateObj.attributes.strain+" - "+this.stateObj.attributes.breeder;const r=this._hass.states[`select.${e}_growth_phase`],c=this._hass.states[`number.${e}_pot_size`],p=r?r.state:"Nicht verfügbar",m=c?c.state+"L":"Nicht verfügbar",g=this.config.show_elements.length>1;return s.html`
            <div class="${t}">
                <div class="menu-button" @click="${this._toggleFlyoutMenu}">
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </div>
                ${this._showFlyoutMenu?this._renderFlyoutMenu():""}
                <div class="image-container">
                    <img class="plant-image"
                         src="${this._imageUrls[this._currentImageIndex]||h.missingImage}"
                         @click="${()=>this._showGallery=!0}">
                </div>
                <span id="name" @click="${()=>(0,u.moreInfo)(this,this.stateObj.entity_id)}"> ${this.stateObj.attributes.friendly_name} <ha-icon .icon="mdi:${"problem"==this.stateObj.state.toLowerCase()?"alert-circle-outline":""}"></ha-icon>
                </span>
                <span id="battery">${(0,d.renderBattery)(this)}</span>
                ${i||n||null!==this._listenToSelector&&this._selectedEntities.length>0?s.html`
                    <div id="species" class="plant-dropdown-container">
                        <div @click="${this._togglePlantDropdown}" class="clickable-plants">
                            ${a}
                            <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </div>
                        ${this._showPlantDropdown?this._renderPlantDropdown(o):""}
                    </div>
                    `:s.html`<span id="species">${a}</span>`}
                ${this.config.display_type!==l.DisplayType.Compact?s.html`
                <div id="status-container">
                    <span @click="${()=>(0,u.moreInfo)(this,`number.${e}_pot_size`)}">
                        <ha-icon icon="mdi:cup"></ha-icon>${m}
                    </span>
                    <span @click="${()=>(0,u.moreInfo)(this,`select.${e}_growth_phase`)}">
                        <ha-icon icon="${this.getGrowthPhaseIcon(p)}"></ha-icon>${p}
                    </span>
                    </div>
                `:""}
                </div>
                ${g?s.html`<div class="divider"></div>`:""}
            ${this._renderPopups()}
        `}_togglePlantDropdown(t){t.stopPropagation(),this._showPlantDropdown=!this._showPlantDropdown,this.requestUpdate(),this._showPlantDropdown&&document.addEventListener("click",this._handleOutsideDropdownClick,{once:!0})}_renderPlantDropdown(t){if(!t.length&&this._selectedEntities.length>0&&(t=[...this._selectedEntities]),!t.length)return s.html`
                <div class="plant-dropdown">
                    <div class="plant-dropdown-item">Keine Pflanzen gefunden</div>
                </div>
            `;const e=[...null!==this.selectedPlantEntity&&this._popupData.originalEntity?[this._popupData.originalEntity]:[],...t];return s.html`
            <div class="plant-dropdown">
                ${e.map((t=>{const e=this._hass.states[t];if(!e)return s.html`
                        <div class="plant-dropdown-item">
                            <div class="plant-dropdown-name">${t}</div>
                            <div class="plant-dropdown-info">Entity nicht gefunden</div>
                        </div>
                    `;const i=t.startsWith("cycle."),n=e.attributes.friendly_name||t.split(".")[1];if(i)return s.html`
                            <div class="plant-dropdown-item" @click="${()=>this._returnToCycle()}">
                                <div class="plant-dropdown-name">${n}</div>
                                <div class="plant-dropdown-info">Zurück zum Cycle</div>
                            </div>
                        `;const a=e.attributes.strain||"",o=e.attributes.breeder||"";return s.html`
                        <div class="plant-dropdown-item" @click="${()=>this._selectPlant(t)}">
                            <div class="plant-dropdown-name">${n}</div>
                            <div class="plant-dropdown-info">${a} - ${o}</div>
                        </div>
                    `}))}
            </div>
        `}_selectPlant(t){this.selectedPlantEntity=t,this._showPlantDropdown=!1,!this._popupData.originalEntity&&this.stateObj&&(this._popupData.originalEntity=this.stateObj.entity_id),this._hass&&(this.stateObj=this._hass.states[t],this.get_data(this._hass).then((()=>{var e,i;const n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelectorAll("flower-consumption");n&&n.forEach((e=>{e&&(e.entityId=t)}));const a=new CustomEvent("brokkoli-card-cycle-member-selected",{bubbles:!0,composed:!0,detail:{originalEntityId:this._popupData.originalEntity||(null===(i=this.config)||void 0===i?void 0:i.entity),selectedEntityId:t,sourceCardId:this}});window.dispatchEvent(a),this.requestUpdate()})))}_toggleFlyoutMenu(t){t.stopPropagation(),this._showFlyoutMenu=!this._showFlyoutMenu,this._showFlyoutMenu?document.addEventListener("click",this._handleOutsideClick):document.removeEventListener("click",this._handleOutsideClick)}_renderFlyoutMenu(){const t=null!==this.selectedPlantEntity;return s.html`
            <div class="flyout-menu">
                ${t?s.html`
                    <div class="flyout-menu-item" @click="${this._returnToCycle}">
                        <ha-icon icon="mdi:arrow-left"></ha-icon>
                        <span>Zurück zum Cycle</span>
                    </div>
                    <div class="flyout-menu-divider"></div>
                `:""}
                <div class="flyout-menu-item" @click="${()=>{this._activePopup="clone",this._showFlyoutMenu=!1}}">
                    <ha-icon icon="mdi:content-duplicate"></ha-icon>
                    <span>Pflanze klonen</span>
                </div>
                <div class="flyout-menu-item" @click="${()=>{this._activePopup="move",this._showFlyoutMenu=!1}}">
                    <ha-icon icon="mdi:arrow-decision"></ha-icon>
                    <span>Zu Zyklus verschieben</span>
                </div>
                <div class="flyout-menu-item" @click="${()=>{this._activePopup="replace",this._showFlyoutMenu=!1}}">
                    <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                    <span>Sensoren ersetzen</span>
                </div>
                <div class="flyout-menu-item" @click="${()=>{this._activePopup="remove",this._showFlyoutMenu=!1}}">
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                    <span>Pflanze löschen</span>
                </div>
            </div>
        `}_returnToCycle(){this._popupData.originalEntity&&this._hass&&(this.selectedPlantEntity=null,this.stateObj=this._hass.states[this._popupData.originalEntity],this.get_data(this._hass).then((()=>{var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll("flower-consumption");e&&e.forEach((t=>{t&&(t.entityId=this._popupData.originalEntity)}));const i=new CustomEvent("brokkoli-card-cycle-member-selected",{bubbles:!0,composed:!0,detail:{originalEntityId:this._popupData.originalEntity,selectedEntityId:this._popupData.originalEntity,sourceCardId:this}});window.dispatchEvent(i),this._popupData.originalEntity=null,this.requestUpdate()}))),this._showPlantDropdown=!1}_handleClonePlant(){return a(this,void 0,void 0,(function*(){yield this._hass.callService("plant","clone_plant",Object.assign({source_entity_id:this.stateObj.entity_id},this._popupData)),this._closePopup()}))}_handleMoveToCycle(){return a(this,void 0,void 0,(function*(){yield this._hass.callService("plant","move_to_cycle",{plant_entity:this.stateObj.entity_id,cycle_entity:this._popupData.cycle_entity}),this._closePopup()}))}_handleRemovePlant(){return a(this,void 0,void 0,(function*(){yield this._hass.callService("plant","remove_plant",{plant_entity:this.stateObj.entity_id}),this._closePopup()}))}_handleReplaceSensors(){return a(this,void 0,void 0,(function*(){const t=["temperature","moisture","illuminance","humidity","conductivity","power_consumption","energy_consumption"],e=this.stateObj.entity_id.split(".")[1];for(const i of t){const t=this._popupData[`new_${i}_sensor`];if(t){const n=`sensor.${e}_${i}`;yield this._hass.callService("plant","replace_sensor",{meter_entity:n,new_sensor:t})}}this._closePopup()}))}_closePopup(){this._activePopup=null,this._popupData={},this.requestUpdate()}_renderPopups(){if(!this._activePopup)return s.html``;switch(this._activePopup){case"clone":return this._renderClonePopup();case"move":return this._renderMovePopup();case"remove":return this._renderRemovePopup();case"replace":return this._renderReplacePopup();default:return s.html``}}_renderClonePopup(){return s.html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${t=>t.stopPropagation()}">
                    <div class="popup-title">Pflanze klonen</div>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" .value="${this._popupData.name||""}"
                               @input="${t=>this._popupData.name=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Temperatursensor</label>
                        <input type="text" .value="${this._popupData.temperature_sensor||""}"
                               @input="${t=>this._popupData.temperature_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Feuchtigkeitssensor</label>
                        <input type="text" .value="${this._popupData.moisture_sensor||""}"
                               @input="${t=>this._popupData.moisture_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Beleuchtungssensor</label>
                        <input type="text" .value="${this._popupData.illuminance_sensor||""}"
                               @input="${t=>this._popupData.illuminance_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Luftfeuchtigkeitssensor</label>
                        <input type="text" .value="${this._popupData.humidity_sensor||""}"
                               @input="${t=>this._popupData.humidity_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Leitfähigkeitssensor</label>
                        <input type="text" .value="${this._popupData.conductivity_sensor||""}"
                               @input="${t=>this._popupData.conductivity_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Stromverbrauchssensor (W)</label>
                        <input type="text" .value="${this._popupData.power_consumption_sensor||""}"
                               @input="${t=>this._popupData.power_consumption_sensor=t.target.value}">
                    </div>
                    <div class="form-field">
                        <label>Energieverbrauchssensor (kWh)</label>
                        <input type="text" .value="${this._popupData.energy_consumption_sensor||""}"
                               @input="${t=>this._popupData.energy_consumption_sensor=t.target.value}">
                    </div>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleClonePlant}">Klonen</button>
                    </div>
                </div>
            </div>
        `}_renderMovePopup(){const t=Object.entries(this._hass.states).filter((([t])=>t.startsWith("cycle."))).map((([t,e])=>{var i;return{entity_id:t,name:(null===(i=e.attributes)||void 0===i?void 0:i.friendly_name)||t.split(".")[1]}}));return s.html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${t=>t.stopPropagation()}">
                    <div class="popup-title">Zu Zyklus verschieben</div>
                    <div class="form-field">
                        <label>Zyklus auswählen</label>
                        <select @change="${t=>this._popupData.cycle_entity=t.target.value}">
                            <option value="">Bitte wählen...</option>
                            ${t.map((t=>s.html`
                                <option value="${t.entity_id}">${t.name}</option>
                            `))}
                        </select>
                    </div>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleMoveToCycle}" ?disabled="${!this._popupData.cycle_entity}">
                            Verschieben
                        </button>
                    </div>
                </div>
            </div>
        `}_renderRemovePopup(){return s.html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${t=>t.stopPropagation()}">
                    <div class="popup-title">Pflanze löschen</div>
                    <p>Möchten Sie diese Pflanze wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleRemovePlant}" class="danger">
                            Löschen bestätigen
                        </button>
                    </div>
                </div>
            </div>
        `}_renderReplacePopup(){const t=this.stateObj.entity_id.split(".")[1],e=e=>{const i=new RegExp(`^sensor\\..*_(${e}|min_${e}|max_${e}|soil_moisture|air_humidity)$`);return Object.entries(this._hass.states).filter((([e])=>!(!e.startsWith("sensor.")||i.test(e)||e.includes(`${t}_`)||e.includes("plant")))).filter((([t,i])=>{var n,a;const s=null===(n=i.attributes)||void 0===n?void 0:n.device_class,o=null===(a=i.attributes)||void 0===a?void 0:a.unit_of_measurement;switch(e){case"temperature":return"temperature"===s||"°C"===o||"°F"===o;case"moisture":case"humidity":return"humidity"===s||"%"===o;case"illuminance":return"illuminance"===s||"lx"===o||"lm"===o;case"conductivity":return"µS/cm"===o||"mS/cm"===o;case"power_consumption":return"power"===s||"W"===o||"kW"===o;case"energy_consumption":return"energy"===s||"kWh"===o||"Wh"===o;default:return!1}})).map((([t,e])=>{var i;return{entity_id:t,name:(null===(i=e.attributes)||void 0===i?void 0:i.friendly_name)||t}}))};return s.html`
            <div class="popup-dialog" @click="${this._closePopup}">
                <div class="popup-content" @click="${t=>t.stopPropagation()}">
                    <div class="popup-title">Sensoren ersetzen</div>
                    ${[{key:"temperature",label:"Temperatursensor",icon:"mdi:thermometer"},{key:"moisture",label:"Bodenfeuchtigkeit",icon:"mdi:water-percent"},{key:"illuminance",label:"Beleuchtungssensor",icon:"mdi:brightness-5"},{key:"humidity",label:"Luftfeuchtigkeitssensor",icon:"mdi:water"},{key:"conductivity",label:"Leitfähigkeitssensor",icon:"mdi:flash"},{key:"power_consumption",label:"Stromverbrauchssensor (W)",icon:"mdi:flash"},{key:"energy_consumption",label:"Energieverbrauchssensor (kWh)",icon:"mdi:lightning-bolt-outline"}].map((t=>{const i=e(t.key);return s.html`
                            <div class="form-field">
                                <label>
                                    <ha-icon icon="${t.icon}"></ha-icon>
                                    ${t.label}
                                </label>
                                <select @change="${e=>this._popupData[`new_${t.key}_sensor`]=e.target.value}">
                                    <option value="">Bitte wählen...</option>
                                    ${i.length>0?i.map((t=>s.html`
                                            <option value="${t.entity_id}">${t.name}</option>
                                        `)):s.html`<option value="" disabled>Keine passenden Sensoren gefunden</option>`}
                                </select>
                            </div>
                        `}))}
                    <div class="popup-buttons">
                        <button @click="${this._closePopup}">Abbrechen</button>
                        <button @click="${this._handleReplaceSensors}">Sensoren ersetzen</button>
                    </div>
                </div>
            </div>
        `}_renderOptions(){var t,e,i,n;const a=this.config.option_elements;if(0===a.length)return s.html``;const o={attributes:{icon:"mdi:tune",expanded:null===(t=this._expanded)||void 0===t?void 0:t.attributes},consumption:{icon:"mdi:chart-box-outline",expanded:null===(e=this._expanded)||void 0===e?void 0:e.consumption},history:{icon:"mdi:history",expanded:null===(i=this._expanded)||void 0===i?void 0:i.history},details:{icon:"mdi:information-outline",expanded:null===(n=this._expanded)||void 0===n?void 0:n.details}};return s.html`
            <div class="options-container">
                ${a.map((t=>{if(t in o){const e=o[t];return s.html`
                            <div class="options-section ${e.expanded?"expanded":""}" 
                                 @click="${e=>this._toggleExpand(e,t)}">
                                <ha-icon icon="${e.icon}"></ha-icon>
                            </div>
                        `}return""}))}
            </div>
        `}_renderConsumption(){var t;const e=this.selectedPlantEntity||this.config.entity;return this.config.show_elements.includes("consumption")?s.html`
                <div class="component-container">
                    <flower-consumption
                        .hass=${this._hass}
                        .entityId=${e}
                    ></flower-consumption>
                </div>
            `:(null===(t=this._expanded)||void 0===t?void 0:t.consumption)?s.html`
                <div class="expanded-content show" data-section="consumption">
                    <flower-consumption
                        .hass=${this._hass}
                        .entityId=${e}
                    ></flower-consumption>
                </div>
            `:s.html`<div class="expanded-content" data-section="consumption"></div>`}_renderHistory(){var t;const e=this.selectedPlantEntity||this.config.entity;return this.config.show_elements.includes("history")?s.html`
                <div class="component-container">
                    <flower-history
                        .hass=${this._hass}
                        .entityId=${e}
                        .historyGroups=${this.config.history_groups}
                        .linePosition=${this.config.history_line_position}
                    ></flower-history>
                </div>
            `:(null===(t=this._expanded)||void 0===t?void 0:t.history)?s.html`
                <div class="expanded-content show" data-section="history">
                    <flower-history
                        .hass=${this._hass}
                        .entityId=${e}
                        .historyGroups=${this.config.history_groups}
                        .linePosition=${this.config.history_line_position}
                    ></flower-history>
                </div>
            `:s.html`<div class="expanded-content" data-section="history"></div>`}_renderDetails(){var t;return this.config.show_elements.includes("details")?s.html`
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
                        ${this.stateObj.attributes.website?s.html`
                            <a href="${this.stateObj.attributes.website}" target="_blank" class="value link">${this.stateObj.attributes.website}</a>
                        `:s.html`<span class="value">-</span>`}
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
            `:(null===(t=this._expanded)||void 0===t?void 0:t.details)?s.html`
                <div class="expanded-content show" data-section="details">
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
                            ${this.stateObj.attributes.website?s.html`
                                <a href="${this.stateObj.attributes.website}" target="_blank" class="value link">${this.stateObj.attributes.website}</a>
                            `:s.html`<span class="value">-</span>`}
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
            `:s.html`<div class="expanded-content" data-section="details"></div>`}_renderAttributes(){var t;return this.config.show_elements.includes("attributes")?s.html`${(0,d.renderAttributes)(this)}`:(null===(t=this._expanded)||void 0===t?void 0:t.attributes)?s.html`
                <div class="expanded-content show" data-section="attributes">
                    ${(0,d.renderAttributes)(this)}
                </div>
            `:s.html`<div class="expanded-content" data-section="attributes"></div>`}render(){if(!this.config||!this._hass)return s.html``;if(!this.stateObj&&!this._listenToSelector)return s.html`
                <hui-warning>
                Entity nicht verfügbar: ${this.config.entity||"Keine Entity oder listen_to konfiguriert"}
                </hui-warning>
              `;if(!this.stateObj&&this._listenToSelector)return s.html``;const t=this.config.show_elements,e="header"===t[0]&&this.config.display_type!==l.DisplayType.Compact?"card-margin-top":"",i=t.map((t=>this._renderElement(t))),n=this._expandedOrder.filter((e=>!t.includes(e)&&this._expanded[e])).map((t=>{switch(t){case"attributes":return this._renderAttributes();case"consumption":return this._renderConsumption();case"history":return this._renderHistory();case"details":return this._renderDetails();default:return s.html``}})),a=this.config.option_elements.filter((e=>!t.includes(e)&&!this._expandedOrder.includes(e))).map((t=>{switch(t){case"attributes":return this._renderAttributes();case"consumption":return this._renderConsumption();case"history":return this._renderHistory();case"details":return this._renderDetails();default:return s.html``}}));return s.html`
            <ha-card class="${e}">
                ${i}
                ${n}
                ${a}
            </ha-card>
            ${this._showGallery?s.html`
                <flower-gallery
                    .hass=${this._hass}
                    .entityId=${this.stateObj.entity_id}
                    .images=${this._imageUrls}
                    .onClose=${()=>this._showGallery=!1}
                ></flower-gallery>
            `:""}
        `}_toggleExpand(t,e){t.stopPropagation();const i=Object.assign({},this._expanded),n=!i[e];i[e]=n;let a=[...this._expandedOrder];n?a.includes(e)||a.push(e):a=a.filter((t=>t!==e)),this._expanded=i,this._expandedOrder=a,this.requestUpdate()}get_data(t){return a(this,void 0,void 0,(function*(){var e,i;try{const n=this.selectedPlantEntity||(null===(e=this.config)||void 0===e?void 0:e.entity);if(this.plantinfo=yield t.callWS({type:"plant/get_info",entity_id:n}),null===(i=this.stateObj)||void 0===i?void 0:i.attributes.images){const t=this.stateObj.attributes.download_path||"/local/images/plants/",e=[...this.stateObj.attributes.images].sort(((t,e)=>{var i,n;const a=(null===(i=t.match(/_(\d{8}_\d{6})/))||void 0===i?void 0:i[1])||"",s=(null===(n=e.match(/_(\d{8}_\d{6})/))||void 0===n?void 0:n[1])||"";return a.localeCompare(s)}));this._imageUrls=e.map((e=>`${t}${e}`)),this.stateObj.attributes.entity_picture&&this._imageUrls.unshift(this.stateObj.attributes.entity_picture),this._currentImageIndex=0}else this._imageUrls=[],this._currentImageIndex=0}catch(t){this.plantinfo={result:{}},this._imageUrls=[],this._currentImageIndex=0}}))}getCardSize(){return 5}static get styles(){return r.style}};n([(0,o.property)()],p.prototype,"_hass",void 0),n([(0,o.property)()],p.prototype,"config",void 0),n([(0,o.state)()],p.prototype,"_expanded",void 0),n([(0,o.state)()],p.prototype,"_expandedOrder",void 0),n([(0,o.state)()],p.prototype,"_showGallery",void 0),n([(0,o.state)()],p.prototype,"_currentImageIndex",void 0),n([(0,o.state)()],p.prototype,"_activePopup",void 0),n([(0,o.state)()],p.prototype,"_showFlyoutMenu",void 0),n([(0,o.state)()],p.prototype,"_popupData",void 0),n([(0,o.state)()],p.prototype,"_showPlantDropdown",void 0),n([(0,o.state)()],p.prototype,"selectedPlantEntity",void 0),n([(0,o.state)()],p.prototype,"_listenToSelector",void 0),n([(0,o.state)()],p.prototype,"_selectedEntities",void 0),p=n([(0,o.customElement)(h.CARD_NAME)],p),e.default=p},618:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},a=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.FlowerConsumption=void 0;const s=i(437),o=i(924),r=i(356),l=i(75),c=120,d=60;let h=class extends s.LitElement{constructor(){super(...arguments),this._charts=new Map,this._selectedPhase=null,this._phaseData=new Map,this._consumptionData=null,this._lastOptions=new Map,this._lastPhaseData=new Map}firstUpdated(){return a(this,void 0,void 0,(function*(){window.ApexCharts||(yield this._loadApexChartsScript())}))}disconnectedCallback(){super.disconnectedCallback(),this._charts.forEach((t=>{t&&t.destroy()})),this._charts.clear(),this._lastPhaseData.clear()}_showMoreInfo(t){(0,r.fireEvent)(this,"hass-more-info",{entityId:t})}_updateConsumptionForPhase(t,e){return a(this,void 0,void 0,(function*(){if(!this.hass)return;if(!e)return this._selectedPhase=null,this._consumptionData=null,this._triggerValueAnimation(),void this.requestUpdate();const i=this._phaseData.get(e);if(!i)return;const n=i.start.toISOString(),a=(i.end||new Date).toISOString();try{const e=[`sensor.${t}_total_ppfd_mol_integral`,`sensor.${t}_total_fertilizer_consumption`,`sensor.${t}_total_water_consumption`,`sensor.${t}_total_energy_consumption`,`sensor.${t}_energy_cost`].map((t=>this.hass.callApi("GET",`history/period/${n}?filter_entity_id=${t}&end_time=${a}`))),i=yield Promise.all(e),s=t=>{if(!t||!t[0]||t[0].length<2)return 0;const e=t[0].filter((t=>"unavailable"!==t.state&&"unknown"!==t.state)).map((t=>parseFloat(t.state)));return e.length>=2?e[e.length-1]-e[0]:e[0]||0};this._consumptionData={ppfd:s(i[0]),fertilizer:s(i[1]),water:s(i[2]),energy:s(i[3]),cost:s(i[4])},this._triggerValueAnimation(),this.requestUpdate()}catch(t){console.warn("Fehler beim Laden der Verbrauchsdaten:",t)}}))}_triggerValueAnimation(){var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll(".consumption-item");e&&e.forEach((t=>{t.classList.remove("animate"),t.offsetWidth,t.classList.add("animate")}))}render(){var t,e,i,n,a;if(!this.hass||!this.entityId)return s.html``;const o=this.entityId.split(".")[1],r=(t,e=1)=>("string"==typeof t&&(t=parseFloat(t)),isNaN(t)?"N/A":t.toFixed(e));return s.html`
            <div class="consumption-data">
                <div class="consumption-item" @click="${()=>this._showMoreInfo(`sensor.${o}_total_ppfd_mol_integral`)}">
                    <ha-icon icon="mdi:counter"></ha-icon>
                    <div class="consumption-details">
                        <span class="label">Gesamt PPFD</span>
                        <span class="value consumption-value">${r(this._consumptionData?this._consumptionData.ppfd:(null===(t=this.hass.states[`sensor.${o}_total_ppfd_mol_integral`])||void 0===t?void 0:t.state)||"N/A")} mol/s⋅m²</span>
                    </div>
                </div>
                <div class="consumption-item" @click="${()=>this._showMoreInfo(`sensor.${o}_total_fertilizer_consumption`)}">
                    <ha-icon icon="mdi:chart-line-variant"></ha-icon>
                    <div class="consumption-details">
                        <span class="label">Düngerverbrauch</span>
                        <span class="value consumption-value">${r(this._consumptionData?this._consumptionData.fertilizer:(null===(e=this.hass.states[`sensor.${o}_total_fertilizer_consumption`])||void 0===e?void 0:e.state)||"N/A")} μS/cm</span>
                    </div>
                </div>
                <div class="consumption-item" @click="${()=>this._showMoreInfo(`sensor.${o}_total_water_consumption`)}">
                    <ha-icon icon="mdi:water-pump"></ha-icon>
                    <div class="consumption-details">
                        <span class="label">Wasserverbrauch</span>
                        <span class="value consumption-value">${r(this._consumptionData?this._consumptionData.water:(null===(i=this.hass.states[`sensor.${o}_total_water_consumption`])||void 0===i?void 0:i.state)||"N/A")} L</span>
                    </div>
                </div>

                <div class="consumption-item" @click="${()=>this._showMoreInfo(`sensor.${o}_total_energy_consumption`)}">
                    <ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>
                    <div class="consumption-details">
                        <span class="label">Energieverbrauch</span>
                        <span class="value consumption-value">${r(this._consumptionData?this._consumptionData.energy:(null===(n=this.hass.states[`sensor.${o}_total_energy_consumption`])||void 0===n?void 0:n.state)||"N/A")} kWh</span>
                    </div>
                </div>
                <div class="consumption-item large" @click="${()=>this._showMoreInfo(`sensor.${o}_energy_cost`)}">
                    <ha-icon icon="mdi:cash-multiple"></ha-icon>
                    <div class="consumption-details large">
                        <span class="label">Energiekosten</span>
                        <span class="value consumption-value">${r(this._consumptionData?this._consumptionData.cost:(null===(a=this.hass.states[`sensor.${o}_energy_cost`])||void 0===a?void 0:a.state)||"N/A",2)} €</span>
                    </div>
                </div>
            </div>
            
            <div class="consumption-charts-container">
                <div class="pie-chart-container">
                    ${this._renderPieChart(o)}
                </div>
            </div>
        `}_renderPieChart(t){const e=this.hass.states[`select.${t}_growth_phase`];if(!e)return s.html`
                <div style="text-align: center; padding: 20px;">
                    Keine Daten für das Pie Chart verfügbar
                </div>
            `;const i={Samen:this._calculatePhaseDuration(e.attributes.samen_beginn,e.attributes.samen_dauer),Keimen:this._calculatePhaseDuration(e.attributes.keimen_beginn,e.attributes.keimen_dauer),Wurzeln:this._calculatePhaseDuration(e.attributes.wurzeln_beginn,e.attributes.wurzeln_dauer),Wachstum:this._calculatePhaseDuration(e.attributes.wachstum_beginn,e.attributes.wachstum_dauer),"Blüte Past":0,"Blüte To Go":0,Geerntet:this._calculatePhaseDuration(e.attributes.geerntet_beginn,e.attributes.geerntet_dauer)},n=this.hass.states[`number.${t}_flowering_duration`],a=e.attributes.blüte_beginn,o=a&&"null"!==a&&""!==a;if(null==n?void 0:n.state){const t=parseInt(n.state);if(o){const e=new Date(a),n=new Date,s=Math.floor((n.getTime()-e.getTime())/864e5);s>=0?(i["Blüte Past"]=Math.min(s,t),i["Blüte To Go"]=Math.max(0,t-s)):i["Blüte To Go"]=t}else i["Blüte To Go"]=t}return 0===Object.values(i).reduce(((t,e)=>t+e),0)?s.html`
                <div style="text-align: center; padding: 20px;">
                    Noch keine abgeschlossenen Phasen verfügbar
                </div>
            `:s.html`
            <div class="pie-chart">
                <div id="pie-chart-${t}"></div>
            </div>
        `}_calculatePhaseDuration(t,e){if(!t||"null"===t||""===t)return 0;if(e)return e;const i=new Date(t),n=new Date;return Math.max(0,Math.floor((n.getTime()-i.getTime())/864e5))}_getPhaseDataString(t){return t?JSON.stringify({samen:t.attributes.samen_dauer||0,keimen:t.attributes.keimen_dauer||0,wurzeln:t.attributes.wurzeln_dauer||0,wachstum:t.attributes.wachstum_dauer||0,bluete:t.attributes.blüte_dauer||0,geerntet:t.attributes.geerntet_dauer||0}):""}_initPieChart(t){return a(this,void 0,void 0,(function*(){var e,i,n;if(!window.ApexCharts)try{yield this._loadApexChartsScript()}catch(t){return void console.error("Fehler beim Laden von ApexCharts:",t)}const a=this._charts.has("pie"),s=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(`#pie-chart-${t}`);if(!s)return;const o=null===(i=this.hass)||void 0===i?void 0:i.states[`select.${t}_growth_phase`];if(!o)return;const r=this._getPhaseDataString(o);if(r===this._lastPhaseData.get(t)&&a)return;this._lastPhaseData.set(t,r);const l={Samen:this._calculatePhaseDuration(o.attributes.samen_beginn,o.attributes.samen_dauer),Keimen:this._calculatePhaseDuration(o.attributes.keimen_beginn,o.attributes.keimen_dauer),Wurzeln:this._calculatePhaseDuration(o.attributes.wurzeln_beginn,o.attributes.wurzeln_dauer),Wachstum:this._calculatePhaseDuration(o.attributes.wachstum_beginn,o.attributes.wachstum_dauer),"Blüte Past":0,"Blüte To Go":0,Geerntet:this._calculatePhaseDuration(o.attributes.geerntet_beginn,o.attributes.geerntet_dauer)},h=this.hass.states[`number.${t}_flowering_duration`],u=o.attributes.blüte_beginn,p=u&&"null"!==u&&""!==u;if(null==h?void 0:h.state){const t=parseInt(h.state);if(p){const e=new Date(u),i=new Date,n=Math.floor((i.getTime()-e.getTime())/864e5);n>=0?(l["Blüte Past"]=Math.min(n,t),l["Blüte To Go"]=Math.max(0,t-n)):l["Blüte To Go"]=t}else l["Blüte To Go"]=t}const m=Object.values(l).filter((t=>t>0)),g=Object.entries(l).filter((([t,e])=>e>0)).map((([t,e])=>t)),v=this._charts.get("pie");if(v)return void v.updateOptions({labels:g,series:m});const f={chart:{type:"pie",background:"transparent",redrawOnParentResize:!0,animations:{enabled:!0,speed:800,animateGradually:{enabled:!0,delay:150},dynamicAnimation:{enabled:!0,speed:350}},events:{dataPointSelection:(e,i,n)=>{if(0===n.selectedDataPoints[0].length||this._selectedPhase===g[n.dataPointIndex]&&1===n.selectedDataPoints[0].length)this._updateConsumptionForPhase(t,null),n.selectedDataPoints[0]=[],i.w.globals.selectedDataPoints[0]=[];else{const e=g[n.dataPointIndex];this._selectedPhase=e,this._updateConsumptionForPhase(t,e)}}}},series:m,labels:g,colors:[`hsl(${c}, ${d}%, 55%)`,`hsl(${c}, ${d}%, 50%)`,`hsl(${c}, ${d}%, 45%)`,`hsl(${c}, ${d}%, 40%)`,`hsl(${c}, ${d}%, 35%)`,`hsl(${c}, ${d}%, 30%)`,`hsl(${c}, ${d}%, 45%)`],legend:{show:!1},dataLabels:{enabled:!0,style:{fontSize:"clamp(10px, 1.2vw, 14px)",fontFamily:"var(--paper-font-body1_-_font-family)"},textAnchor:"start",distributed:!0,color:"var(--primary-text-color)",formatter:function(t,e){const i=e.w.globals.series[e.seriesIndex],n=e.w.globals.labels[e.seriesIndex];if("Blüte To Go"===n){const t=m[g.indexOf("Blüte Past")]||0;return t>0?["Blüte",`${t}/${i}/${t+i} Tage`]:["Blüte",`${i} Tage`]}return"Blüte Past"===n?[""]:[`${n}`,`${i} Tage`]}},tooltip:{enabled:!0,theme:"light",style:{fontSize:"clamp(10px, 1.2vw, 14px)"},y:{formatter:function(t){return`${t} Tage`}}},plotOptions:{pie:{dataLabels:{minAngleToShowLabel:0,offset:-25},donut:{size:"0%"},expandOnClick:!0,offsetX:0,offsetY:0}},stroke:{show:!0,width:2,colors:["var(--card-background-color)"]},theme:{mode:"light",palette:"palette1"}};if(o){const e=["samen","keimen","wurzeln","wachstum","blüte","geerntet"];if(e.forEach(((t,i)=>{const n=o.attributes[`${t}_beginn`];if(n){const a=new Date(n);let s=null;if(i<e.length-1){const t=e[i+1],n=o.attributes[`${t}_beginn`];n&&(s=new Date(n))}s||o.state!==t||(s=new Date),this._phaseData.set(t.charAt(0).toUpperCase()+t.slice(1),{start:a,end:s,duration:s?Math.floor((s.getTime()-a.getTime())/864e5):0})}})),o.attributes.blüte_beginn){const e=new Date(o.attributes.blüte_beginn),i=new Date;this._phaseData.set("Blüte Past",{start:e,end:i,duration:Math.floor((i.getTime()-e.getTime())/864e5)});const a=null===(n=this.hass)||void 0===n?void 0:n.states[`number.${t}_flowering_duration`];if(null==a?void 0:a.state){const t=parseInt(a.state),n=new Date(e);n.setDate(n.getDate()+t),this._phaseData.set("Blüte To Go",{start:i,end:n,duration:Math.floor((n.getTime()-i.getTime())/864e5)})}}}const _=new window.ApexCharts(s,f);yield _.render(),this._charts.set("pie",_)}))}_loadApexChartsScript(){return a(this,void 0,void 0,(function*(){const t=document.createElement("link");t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/apexcharts@4.4.0/dist/apexcharts.css",document.head.appendChild(t);const e=document.createElement("script");e.src="https://cdn.jsdelivr.net/npm/apexcharts@4.4.0/dist/apexcharts.min.js";const i=new Promise((t=>{e.onload=()=>{setTimeout(t,100)}}));document.head.appendChild(e),yield i}))}updated(t){if(super.updated(t),this.entityId&&this.hass){const e=this.entityId.split(".")[1];(t.has("entityId")||t.has("hass"))&&(t.has("entityId")&&(this._charts.forEach((t=>{t.destroy()})),this._charts.clear(),this._lastPhaseData.clear()),this._initPieChart(e))}}};e.FlowerConsumption=h,h.styles=l.style,n([(0,o.property)()],h.prototype,"hass",void 0),n([(0,o.property)()],h.prototype,"entityId",void 0),n([(0,o.state)()],h.prototype,"_charts",void 0),n([(0,o.state)()],h.prototype,"_selectedPhase",void 0),n([(0,o.state)()],h.prototype,"_phaseData",void 0),n([(0,o.state)()],h.prototype,"_consumptionData",void 0),e.FlowerConsumption=h=n([(0,o.customElement)("flower-consumption")],h)},507:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},a=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.FlowerGallery=void 0;const s=i(437),o=i(924),r=i(534),l=i(364),c=i(63),d=i(100),h=i(858),u=i(16);class p extends s.LitElement{constructor(){super(...arguments),this.images=[],this._currentImageIndex=0,this._isFading=!1,this._showActionsFlyout=!1,this._showTreatmentPanel=!1,this._isPlaying=!1,this._thumbnailUrls=new Map,this._galleryImageUrls=new Map,this._customTreatmentName="",this._customTreatmentColor="orange",this._selectedTreatment="",this._applyTreatment="",this._reparentedToBody=!1,this._plantInfo=null,this._isLoading=!1,this._imagesList=[],this._isImagesLoading=!1,this._treatmentHistory=[],this._imageCache=d.ImageCacheManager.getInstance(),this._preloadingPromises=new Map,this._thumbnailCache=new Map,this._thumbnailPromises=new Map,this._galleryImageCache=new Map,this._galleryImagePromises=new Map,this._isChanging=!1}_changeImage(){return a(this,arguments,void 0,(function*(t="next",e=!1){this._isChanging||(this._isChanging=!0,this._isFading=!0,this.requestUpdate(),yield new Promise((t=>setTimeout(t,500))),this._currentImageIndex="next"===t?(this._currentImageIndex+1)%this.images.length:(this._currentImageIndex-1+this.images.length)%this.images.length,this._isFading=!1,this._isChanging=!1,this.requestUpdate(),e&&this._isPlaying&&(this._isPlaying=!1,this._updateSlideshow()),this._preloadAdjacentImages(),this._preloadGalleryImages(),this._scrollToActiveThumbnail())}))}_preloadAdjacentImages(){return a(this,void 0,void 0,(function*(){if(this.images.length<=1)return;const t=[];for(let e=-2;e<=2;e++){if(0===e)continue;const i=(this._currentImageIndex+e+this.images.length)%this.images.length,n=this.images[i];if(n&&!this._preloadingPromises.has(n)&&!this._imageCache.isCached(n)){const e=this._imageCache.preloadImage(n);this._preloadingPromises.set(n,e),t.push(e)}}t.length>0&&Promise.allSettled(t).then((()=>{t.forEach((t=>{var e;const i=null===(e=[...this._preloadingPromises.entries()].find((([e,i])=>i===t)))||void 0===e?void 0:e[0];i&&this._preloadingPromises.delete(i)}))}))}))}_getThumbnailUrl(t){return a(this,void 0,void 0,(function*(){if(this._thumbnailCache.has(t))return this._thumbnailCache.get(t);if(this._thumbnailPromises.has(t))return this._thumbnailPromises.get(t);const e=(0,h.generateMobileThumbnail)(t);this._thumbnailPromises.set(t,e);try{const i=yield e;return this._thumbnailCache.set(t,i),this._thumbnailUrls.set(t,i),this.requestUpdate(),i}catch(e){return console.warn("Failed to generate thumbnail, using original:",e),t}finally{this._thumbnailPromises.delete(t)}}))}_getGalleryImageUrl(t){return a(this,void 0,void 0,(function*(){if(this._galleryImageCache.has(t))return this._galleryImageCache.get(t);if(this._galleryImagePromises.has(t))return this._galleryImagePromises.get(t);const e=(0,h.generateGalleryImage)(t);this._galleryImagePromises.set(t,e);try{const i=yield e;return this._galleryImageCache.set(t,i),this._galleryImageUrls.set(t,i),this.requestUpdate(),i}catch(e){return console.warn("Failed to generate gallery image, using original:",e),t}finally{this._galleryImagePromises.delete(t)}}))}_preloadThumbnails(){return a(this,void 0,void 0,(function*(){if(0===this.images.length)return;const t=[];for(let e=-3;e<=3;e++){const i=(this._currentImageIndex+e+this.images.length)%this.images.length;t.push(i)}const e=t.map((t=>this._getThumbnailUrl(this.images[t])));Promise.allSettled(e).then((()=>{this._generateRemainingThumbnails()}))}))}_generateRemainingThumbnails(){return a(this,void 0,void 0,(function*(){const t=this.images.filter((t=>!this._thumbnailCache.has(t)));for(let e=0;e<t.length;e+=3){const i=t.slice(e,e+3).map((t=>this._getThumbnailUrl(t)));yield Promise.allSettled(i),e+3<t.length&&(yield new Promise((t=>setTimeout(t,100))))}}))}_preloadGalleryImages(){return a(this,void 0,void 0,(function*(){if(0===this.images.length)return;const t=[];for(let e=-2;e<=2;e++){const i=(this._currentImageIndex+e+this.images.length)%this.images.length;t.push(i)}const e=t.map((t=>this._getGalleryImageUrl(this.images[t])));Promise.allSettled(e).then((()=>{this._generateRemainingGalleryImages()}))}))}_generateRemainingGalleryImages(){return a(this,void 0,void 0,(function*(){const t=this.images.filter((t=>!this._galleryImageCache.has(t)));for(let e=0;e<t.length;e+=2){const i=t.slice(e,e+2).map((t=>this._getGalleryImageUrl(t)));yield Promise.allSettled(i),e+2<t.length&&(yield new Promise((t=>setTimeout(t,200))))}}))}_selectImage(t){return a(this,void 0,void 0,(function*(){t!==this._currentImageIndex&&(this._isFading=!0,this.requestUpdate(),yield new Promise((t=>setTimeout(t,500))),this._currentImageIndex=t,this._isFading=!1,this.requestUpdate(),this._preloadAdjacentImages(),this._preloadGalleryImages(),this._scrollToActiveThumbnail())}))}_scrollToActiveThumbnail(){this.updateComplete.then((()=>{var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".thumbnail-container.active");e&&e.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}))}_toggleActionsFlyout(t){t.preventDefault(),t.stopPropagation(),this._showActionsFlyout=!this._showActionsFlyout}_togglePlayPause(t){t.preventDefault(),t.stopPropagation(),this._isPlaying=!this._isPlaying,this._updateSlideshow(),this.requestUpdate()}_updateSlideshow(){this._imageRotationInterval&&(clearInterval(this._imageRotationInterval),this._imageRotationInterval=void 0),this._isPlaying&&this.images.length>1&&(this._imageRotationInterval=setInterval((()=>{this._changeImage()}),5e3))}_handleFileUpload(t){return a(this,void 0,void 0,(function*(){const e=t.target.files;if(e&&e.length>0){const t=e[0];if(!t.type.startsWith("image/"))return void alert("Bitte nur Bilder hochladen!");if(t.size>10485760)return void alert("Bild ist zu groß! Maximale Größe ist 10MB.");try{yield this._uploadImage(t),this._showActionsFlyout=!1}catch(t){alert("Fehler beim Upload: "+t.message)}}}))}_uploadImage(t){return a(this,void 0,void 0,(function*(){if(!this.entityId||!this.hass)return;const e=16384,i=new FileReader;i.onload=i=>a(this,void 0,void 0,(function*(){var n;if(!(null===(n=i.target)||void 0===n?void 0:n.result))return;const a=i.target.result,s=Math.ceil(a.byteLength/e);for(let i=0;i<s;i++){const n=a.slice(i*e,(i+1)*e),o=Array.from(new Uint8Array(n)).map((t=>t.toString(16).padStart(2,"0"))).join("");try{yield this.hass.connection.sendMessagePromise({type:"plant/upload_image",entity_id:this.entityId,filename:t.name,chunk:o,chunk_index:i,total_chunks:s})}catch(t){throw console.error("Upload error:",t),t}}yield this.hass.callService("homeassistant","update_entity",{entity_id:this.entityId})})),i.readAsArrayBuffer(t)}))}_deleteImage(t){return a(this,void 0,void 0,(function*(){if(this.entityId&&this.hass)try{yield this.hass.connection.sendMessagePromise({type:"plant/delete_image",entity_id:this.entityId,filename:t}),yield this.hass.callService("homeassistant","update_entity",{entity_id:this.entityId})}catch(t){throw new Error(`Fehler beim Löschen des Bildes: ${t.message}`)}}))}_setMainImage(t){return a(this,void 0,void 0,(function*(){if(this.entityId&&this.hass)try{yield this.hass.connection.sendMessagePromise({type:"plant/set_main_image",entity_id:this.entityId,filename:t}),yield this.hass.callService("homeassistant","update_entity",{entity_id:this.entityId})}catch(t){throw new Error(`Fehler beim Setzen des Hauptbildes: ${t.message}`)}}))}_close(t){t.stopPropagation(),this._imageRotationInterval&&clearInterval(this._imageRotationInterval),this.onClose&&this.onClose(),this.remove()}_loadPlantInfo(){return a(this,void 0,void 0,(function*(){if(this.entityId&&this.hass&&!this._isLoading){this._isLoading=!0;try{this._plantInfo=yield c.PlantEntityUtils.getPlantInfo(this.hass,this.entityId),yield this._initGallery()}catch(t){console.warn("Fehler beim Laden der Pflanzen-Info:",t),this._plantInfo=null}finally{this._isLoading=!1}}}))}_initGallery(){return a(this,void 0,void 0,(function*(){if(this.entityId&&this.hass&&this._plantInfo&&!this._isImagesLoading){this._isImagesLoading=!0;try{this._imagesList=yield p.getImagesWithDates(this.hass,this.entityId,this._plantInfo),yield this._loadTreatmentHistory(),0===this.images.length&&(this.images=this._imagesList.map((t=>t.url))),this._updateSlideshow(),this._preloadAdjacentImages(),this._preloadThumbnails(),this._preloadGalleryImages(),this.requestUpdate()}catch(t){console.warn("Fehler beim Laden der Bilder:",t)}finally{this._isImagesLoading=!1}}}))}connectedCallback(){super.connectedCallback(),this.parentElement!==document.body&&(document.body.appendChild(this),this._reparentedToBody=!0),void 0!==this.initialImageIndex&&(this._currentImageIndex=this.initialImageIndex),this._updateSlideshow(),this._loadPlantInfo(),this.images.length>0&&this._preloadAdjacentImages(),this.updateComplete.then((()=>{this._initializeTouchHandler()}))}_initializeTouchHandler(){var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".gallery-image-container");e&&!this._touchHandler&&(this._touchHandler=(0,u.createGalleryTouchHandler)(e,{onNext:()=>this._changeImage("next",!0),onPrevious:()=>this._changeImage("prev",!0),onClose:()=>this._close(new Event("swipe")),onTogglePlayPause:()=>this._togglePlayPause(new Event("tap"))}),this._touchHandler.enable())}disconnectedCallback(){super.disconnectedCallback(),this._imageRotationInterval&&clearInterval(this._imageRotationInterval),this._touchHandler&&(this._touchHandler.destroy(),this._touchHandler=void 0),this._thumbnailCache.clear(),this._thumbnailPromises.clear(),this._galleryImageCache.clear(),this._galleryImagePromises.clear()}static get styles(){return l.galleryStyles}static getImageDateFromUrl(t){const e=t.match(/_(\d{8}_\d{6})/);if(!e)return null;const i=e[1],n=i.slice(0,4),a=i.slice(4,6),s=i.slice(6,8),o=i.slice(9,11),r=i.slice(11,13);return new Date(`${n}-${a}-${s}T${o}:${r}:00`)}static getImagesWithDates(t,e,i){return a(this,void 0,void 0,(function*(){const n=t.states[e];if(!(null==n?void 0:n.attributes.images))return[];const a=n.attributes.download_path||"/local/images/plants/",s=[];if(n.attributes.entity_picture){let a;a=i?yield this.getFirstPhaseDate(t,e,i):yield this.getFirstPhaseDate(t,e),a&&s.push({url:n.attributes.entity_picture,date:a})}return n.attributes.images.forEach((t=>{const e=this.getImageDateFromUrl(t);e&&s.push({url:`${a}${t}`,date:e})})),s.sort(((t,e)=>t.date.getTime()-e.date.getTime()))}))}static getFirstPhaseDate(t,e,i){return a(this,void 0,void 0,(function*(){var n,a,s,o;if(i){if(!(null===(a=null===(n=null==i?void 0:i.helpers)||void 0===n?void 0:n.growth_phase)||void 0===a?void 0:a.entity_id))return null;const e=i.helpers.growth_phase.entity_id,s=t.states[e];if(!s)return null;const o=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"];for(const t of o){const e=s.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e)return new Date(e)}return null}try{const i=yield c.PlantEntityUtils.getPlantInfo(t,e);if(!(null===(o=null===(s=null==i?void 0:i.helpers)||void 0===s?void 0:s.growth_phase)||void 0===o?void 0:o.entity_id))return null;const n=i.helpers.growth_phase.entity_id,a=t.states[n];if(!a)return null;const r=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"];for(const t of r){const e=a.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e)return new Date(e)}return null}catch(t){return console.warn("Fehler beim Laden der Pflanzen-Info für getFirstPhaseDate:",t),null}}))}_loadTreatmentHistory(){return a(this,void 0,void 0,(function*(){var t,e,i;if(!this.entityId||!this.hass||!this._plantInfo)return;if(!(null===(i=null===(e=null===(t=this._plantInfo)||void 0===t?void 0:t.helpers)||void 0===e?void 0:e.treatment)||void 0===i?void 0:i.entity_id))return void(this._treatmentHistory=[]);const n=this._plantInfo.helpers.treatment.entity_id;try{const t=this._imagesList.length>0?this._imagesList[0].date.toISOString():new Date(Date.now()-31536e6).toISOString(),e=(new Date).toISOString(),i=yield this.hass.callApi("GET",`history/period/${t}?filter_entity_id=${n}&end_time=${e}`);if(i&&Array.isArray(i)&&i.length>0){const t=i[0];this._treatmentHistory=[];for(let e=0;e<t.length;e++){const i=t[e];i.state&&"unavailable"!==i.state&&"unknown"!==i.state&&"none"!==i.state&&""!==i.state.trim()&&this._treatmentHistory.push({date:new Date(i.last_changed),treatment:i.state})}this._treatmentHistory.sort(((t,e)=>e.date.getTime()-t.date.getTime()))}else this._treatmentHistory=[]}catch(t){console.warn("Fehler beim Laden der Treatment-Historie:",t),this._treatmentHistory=[]}}))}_getTreatmentForImageDate(t){if(!this._treatmentHistory||0===this._treatmentHistory.length)return"";for(const e of this._treatmentHistory){const i=t.getTime()-e.date.getTime();if(i>=0&&i<=6e5)return e.treatment}return""}_getGroupedImages(){var t,e,i,n;if(!this.entityId||!this.hass||!this._plantInfo)return[];if(!(null===(i=null===(e=null===(t=this._plantInfo)||void 0===t?void 0:t.helpers)||void 0===e?void 0:e.growth_phase)||void 0===i?void 0:i.entity_id))return[];const a=this._plantInfo.helpers.growth_phase.entity_id,s=this.hass.states[a];if(!s)return[];const o=["samen","keimen","wurzeln","wachstum","blüte","geerntet","entfernt"],r={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wuchs",blüte:"Blüte",geerntet:"Geerntet",entfernt:"Entfernt"},l=[];let c="",d=[];const h=o.filter((t=>null!=s.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`]));let u=null;for(const t of o){const e=s.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){u=new Date(e);break}}if(!u)return[];if(this._imagesList.forEach((t=>{var e;const i=t.url,n=t.date;let a="",p=0,m=0;for(const t of o){const e=s.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){const i=new Date(e);n>=i&&(a=r[t],p=Math.floor((n.getTime()-i.getTime())/864e5))}}m=Math.floor((n.getTime()-u.getTime())/864e5);const g=this._getTreatmentForImageDate(n);if(a){if(a!==c){if(d.length>0){const t=(null===(e=Object.entries(r).find((([t,e])=>e===c)))||void 0===e?void 0:e[0])||"",i=h.indexOf(t);let n="var(--primary-color)";n="geerntet"===t?"repeating-linear-gradient(45deg, var(--primary-color), var(--primary-color) 10px, var(--dark-primary-color) 10px, var(--dark-primary-color) 20px)":"entfernt"===t?"repeating-linear-gradient(45deg, var(--error-color), var(--error-color) 10px, var(--dark-error-color) 10px, var(--dark-error-color) 20px)":`hsl(var(--hue, 120), var(--saturation, 60%), ${55-i/Math.max(1,h.length-1)*25}%)`,l.push({phase:c,images:d,color:n})}c=a,d=[]}d.push({url:i,day:p+1,totalDays:m+1,treatment:g})}})),d.length>0){const t=(null===(n=Object.entries(r).find((([t,e])=>e===c)))||void 0===n?void 0:n[0])||"",e=h.indexOf(t);let i="var(--primary-color)";i="geerntet"===t?"repeating-linear-gradient(45deg, var(--primary-color), var(--primary-color) 10px, var(--dark-primary-color) 10px, var(--dark-primary-color) 20px)":"entfernt"===t?"repeating-linear-gradient(45deg, var(--error-color), var(--error-color) 10px, var(--dark-error-color) 10px, var(--dark-error-color) 20px)":`hsl(var(--hue, 120), var(--saturation, 60%), ${55-e/Math.max(1,h.length-1)*25}%)`,l.push({phase:c,images:d,color:i})}return l}_getImageDate(t){var e,i,n,a;const s=this._imagesList.find((e=>e.url===t));if(!s)return"Datum unbekannt";const o=s.date,r=o.toLocaleDateString("de-DE",{weekday:"short",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});if(!(null===(n=null===(i=null===(e=this._plantInfo)||void 0===e?void 0:e.helpers)||void 0===i?void 0:i.growth_phase)||void 0===n?void 0:n.entity_id))return r;const l=this._plantInfo.helpers.growth_phase.entity_id,c=null===(a=this.hass)||void 0===a?void 0:a.states[l];if(!c)return r;const d=["samen","keimen","wurzeln","wachstum","blüte","geerntet","entfernt"],h={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wuchs",blüte:"Blüte",geerntet:"Geerntet",entfernt:"Entfernt"};let u="",p=0,m=0,g=null;for(const t of d){const e=c.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){g=new Date(e);break}}for(const t of d){const e=c.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){const i=new Date(e);o>=i&&(u=h[t],p=Math.floor((o.getTime()-i.getTime())/864e5))}}g&&(m=Math.floor((o.getTime()-g.getTime())/864e5));const v=this._getTreatmentForImageDate(o);if(0===this.images.indexOf(t)){let t=`<div class="date-line">${r}</div>`;return t+=`<div class="info-line">Tag 1 <span class="phase">${u}</span>/1 Total</div>`,v&&(t+=`<div class="info-line"><span class="treatment" data-color="${this._getTreatmentColor(v)}">${v}</span></div>`),t}let f=`<div class="date-line">${r}</div>`;return f+=`<div class="info-line">Tag ${p+1} <span class="phase">${u}</span>/${m+1} Total</div>`,v&&(f+=`<div class="info-line"><span class="treatment" data-color="${this._getTreatmentColor(v)}">${v}</span></div>`),f}_getTreatmentOptions(){if(!this.entityId||!this.hass)return["cut","super cropping","topping","lollipop","fim","rib","spray pest","spray water"];const t=`select.${this.entityId.split(".")[1]}_treatment`,e=this.hass.states[t];return e&&e.attributes&&e.attributes.options?e.attributes.options.filter((t=>""!==t)):["cut","super cropping","topping","lollipop","fim","rib","spray pest","spray water"]}_getTreatmentColor(t){if(!this.entityId||!this.hass||!t)return"orange";const e=`select.${this.entityId.split(".")[1]}_treatment`,i=this.hass.states[e];if(i&&i.attributes&&i.attributes.custom_treatments){const e=i.attributes.custom_treatments;for(const i of e)if("object"==typeof i&&i.name===t)return i.color||"orange"}return"orange"}_toggleTreatmentPanel(t){t.preventDefault(),t.stopPropagation(),this._showTreatmentPanel=!this._showTreatmentPanel,this.requestUpdate()}_handleCustomTreatmentInput(t){const e=t.target;this._customTreatmentName=e.value,this.requestUpdate()}_handleCustomTreatmentColorSelect(t){const e=t.target;this._customTreatmentColor=e.value,this.requestUpdate()}_handleApplyTreatmentSelect(t){const e=t.target;this._applyTreatment=e.value,this.requestUpdate()}_handleRemoveTreatmentSelect(t){const e=t.target;this._selectedTreatment=e.value,this.requestUpdate()}_addCustomTreatment(t){return a(this,void 0,void 0,(function*(){t.preventDefault();const e=this._customTreatmentName.trim();if(this.hass&&this.entityId&&e)try{yield this.hass.callService("plant","add_custom_treatment",{entity_id:this.entityId,treatment_name:e,treatment_color:this._customTreatmentColor}),this._customTreatmentName="",this._customTreatmentColor="orange",this.requestUpdate()}catch(t){console.error("Error adding treatment:",t)}}))}_applyTreatmentToday(t){return a(this,void 0,void 0,(function*(){if(t.preventDefault(),this.hass&&this.entityId&&this._applyTreatment)try{const t=`select.${this.entityId.split(".")[1]}_treatment`;yield this.hass.callService("select","select_option",{entity_id:t,option:this._applyTreatment}),this._applyTreatment="",this.requestUpdate(),yield this._loadTreatmentHistory()}catch(t){console.error("Error applying treatment:",t)}}))}_removeCustomTreatment(t){return a(this,void 0,void 0,(function*(){if(t.preventDefault(),this.hass&&this.entityId&&this._selectedTreatment)try{yield this.hass.callService("plant","remove_custom_treatment",{entity_id:this.entityId,treatment_name:this._selectedTreatment}),this._selectedTreatment="",this.requestUpdate()}catch(t){console.error("Error removing treatment:",t)}}))}render(){return s.html`
            <div class="gallery-overlay" @click="${this._close}">
                <div class="gallery-content" @click="${t=>t.stopPropagation()}">
                    <div class="gallery-header">
                        <span class="gallery-date">
                            ${this.images.length>0?(0,r.unsafeHTML)(this._getImageDate(this.images[this._currentImageIndex])):"Keine Bilder vorhanden"}
                        </span>
                        <div class="gallery-header-buttons">
                            <div class="flyout-container ${this._showActionsFlyout?"open":""}">
                                <ha-icon-button
                                    @click="${this._toggleActionsFlyout}"
                                    .label=${"Aktionen"}
                                    class="actions-button"
                                >
                                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                </ha-icon-button>
                                <div class="flyout-menu">
                                    <!-- Camera Actions -->
                                    <label class="flyout-option">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            @change="${t=>{this._handleFileUpload(t),this._showActionsFlyout=!1}}"
                                            style="display: none;"
                                        >
                                        <ha-icon-button .label=${"Kamera"}>
                                            <ha-icon icon="mdi:camera"></ha-icon>
                                        </ha-icon-button>
                                    </label>
                                    <label class="flyout-option">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            @change="${t=>{this._handleFileUpload(t),this._showActionsFlyout=!1}}"
                                            style="display: none;"
                                        >
                                        <ha-icon-button .label=${"Galerie"}>
                                            <ha-icon icon="mdi:image"></ha-icon>
                                        </ha-icon-button>
                                    </label>

                                    ${this.images.length>0?s.html`
                                        <!-- Set Main Image -->
                                        <ha-icon-button
                                            @click="${()=>a(this,void 0,void 0,(function*(){const t=this.images[this._currentImageIndex].split("/").pop();if(t)try{yield this._setMainImage(t),this._showActionsFlyout=!1}catch(t){alert("Fehler beim Setzen des Hauptbildes: "+t.message)}}))}"
                                            .label=${"Als Hauptbild setzen"}
                                            class="flyout-option"
                                        >
                                            <ha-icon icon="mdi:image-check"></ha-icon>
                                        </ha-icon-button>

                                        <!-- Delete Image -->
                                        <ha-icon-button
                                            @click="${()=>a(this,void 0,void 0,(function*(){if(confirm("Bild wirklich löschen?")){const t=this.images[this._currentImageIndex].split("/").pop();if(t)try{yield this._deleteImage(t),this._showActionsFlyout=!1,this.images=this.images.filter((e=>!e.includes(t))),this._currentImageIndex>=this.images.length&&(this._currentImageIndex=Math.max(0,this.images.length-1))}catch(t){alert("Fehler beim Löschen: "+t.message)}}}))}"
                                            .label=${"Bild löschen"}
                                            class="flyout-option delete-option"
                                        >
                                            <ha-icon icon="mdi:delete"></ha-icon>
                                        </ha-icon-button>
                                    `:""}

                                    ${this.images.length>1?s.html`
                                        <!-- Play/Pause Slideshow -->
                                        <ha-icon-button
                                            @click="${t=>{this._togglePlayPause(t),this._showActionsFlyout=!1}}"
                                            .label="${this._isPlaying?"Slideshow pausieren":"Slideshow starten"}"
                                            class="flyout-option"
                                        >
                                            <ha-icon icon="${this._isPlaying?"mdi:pause":"mdi:play"}"></ha-icon>
                                        </ha-icon-button>
                                    `:""}
                                </div>
                            </div>

                            <!-- Treatment Management Panel -->
                            <div class="treatment-container">
                                <ha-icon-button
                                    @click="${this._toggleTreatmentPanel}"
                                    .label=${"Behandlungen verwalten"}
                                    class="treatment-button"
                                >
                                    <ha-icon icon="mdi:content-cut"></ha-icon>
                                </ha-icon-button>

                                ${this._showTreatmentPanel?s.html`
                                    <div class="treatment-panel">
                                        <!-- Add Custom Treatment -->
                                        <div class="treatment-section">
                                            <label>Neue Behandlung hinzufügen:</label>
                                            <input
                                                type="text"
                                                @input="${this._handleCustomTreatmentInput}"
                                                .value="${this._customTreatmentName}"
                                                placeholder="Behandlungsname eingeben..."
                                                class="treatment-input"
                                            >
                                            <select
                                                @change="${this._handleCustomTreatmentColorSelect}"
                                                .value="${this._customTreatmentColor}"
                                                class="treatment-select color-picker"
                                            >
                                                <option value="orange">🟠 Orange</option>
                                                <option value="green">🟢 Grün</option>
                                                <option value="blue">🔵 Blau</option>
                                                <option value="red">🔴 Rot</option>
                                                <option value="yellow">🟡 Gelb</option>
                                            </select>
                                            <button
                                                @click="${this._addCustomTreatment}"
                                                ?disabled="${!this._customTreatmentName.trim()}"
                                                class="treatment-btn add-btn"
                                            >
                                                + Hinzufügen
                                            </button>
                                        </div>

                                        <!-- Apply Treatment to History -->
                                        <div class="treatment-section">
                                            <label>Behandlung heute anwenden:</label>
                                            <select
                                                @change="${this._handleApplyTreatmentSelect}"
                                                class="treatment-select"
                                            >
                                                <option value="">Wählen...</option>
                                                ${this._getTreatmentOptions().map((t=>s.html`<option value="${t}" ?selected="${this._applyTreatment===t}">${t}</option>`))}
                                            </select>
                                            <button
                                                @click="${this._applyTreatmentToday}"
                                                ?disabled="${!this._applyTreatment}"
                                                class="treatment-btn apply-btn"
                                            >
                                                ✓ Anwenden
                                            </button>
                                        </div>

                                        <!-- Remove Custom Treatment -->
                                        <div class="treatment-section">
                                            <label>Behandlung entfernen:</label>
                                            <select
                                                @change="${this._handleRemoveTreatmentSelect}"
                                                class="treatment-select"
                                            >
                                                <option value="">Wählen...</option>
                                                ${this._getTreatmentOptions().map((t=>s.html`<option value="${t}" ?selected="${this._selectedTreatment===t}">${t}</option>`))}
                                            </select>
                                            <button
                                                @click="${this._removeCustomTreatment}"
                                                ?disabled="${!this._selectedTreatment}"
                                                class="treatment-btn remove-btn"
                                            >
                                                - Entfernen
                                            </button>
                                        </div>
                                    </div>
                                `:""}
                            </div>

                            <ha-icon-button
                                @click="${this._close}"
                                .label=${"Schließen"}
                            >
                                <ha-icon icon="mdi:close"></ha-icon>
                            </ha-icon-button>
                        </div>
                    </div>
                    
                    ${this.images.length>0?s.html`
                        <div class="gallery-image-container">
                            <ha-icon-button
                                class="gallery-nav prev"
                                @click="${()=>this._changeImage("prev",!0)}"
                                .label=${"Vorheriges Bild"}
                            >
                                <ha-icon icon="mdi:chevron-left"></ha-icon>
                            </ha-icon-button>
                            <a href="${this.images[this._currentImageIndex]}" target="_blank">
                                <img class="gallery-image ${this._isFading?"fade":""}"
                                    src="${this._galleryImageUrls.get(this.images[this._currentImageIndex])||this.images[this._currentImageIndex]}"
                                >
                            </a>
                            <ha-icon-button
                                class="gallery-nav next"
                                @click="${()=>this._changeImage("next",!0)}"
                                .label=${"Nächstes Bild"}
                            >
                                <ha-icon icon="mdi:chevron-right"></ha-icon>
                            </ha-icon-button>
                        </div>
                        <div class="gallery-thumbnails">
                            <div class="thumbnails-scroll">
                                ${this._getGroupedImages().map((t=>s.html`
                                    <div class="thumbnail-group">
                                        <div class="thumbnail-group-label" style="--phase-color: ${t.color}">
                                            ${t.phase}
                                        </div>
                                        <div class="thumbnail-group-images">
                                            ${t.images.map((t=>s.html`
                                                <div class="thumbnail-container ${this.images[this._currentImageIndex]===t.url?"active":""}"
                                                     @click="${()=>this._selectImage(this.images.indexOf(t.url))}">
                                                    <div class="thumbnail-day">
                                                        Tag ${t.day}/${t.totalDays}
                                                        ${t.treatment?s.html`<br><span class="thumbnail-treatment" data-color="${this._getTreatmentColor(t.treatment)}">${t.treatment}</span>`:""}
                                                    </div>
                                                    <img class="thumbnail" src="${this._thumbnailUrls.get(t.url)||t.url}">
                                                </div>
                                            `))}
                                        </div>
                                    </div>
                                `))}
                            </div>
                        </div>
                    `:s.html`
                        <div class="no-images-message">
                            <ha-icon icon="mdi:image-off"></ha-icon>
                            <span>Keine Bilder vorhanden</span>
                            <span>Klicke auf das Kamera-Symbol oben, um ein Bild hinzuzufügen</span>
                        </div>
                    `}
                </div>
            </div>
        `}}e.FlowerGallery=p,n([(0,o.property)()],p.prototype,"hass",void 0),n([(0,o.property)()],p.prototype,"entityId",void 0),n([(0,o.property)({type:Array})],p.prototype,"images",void 0),n([(0,o.property)()],p.prototype,"onClose",void 0),n([(0,o.property)()],p.prototype,"getImageDate",void 0),n([(0,o.property)({type:Number})],p.prototype,"initialImageIndex",void 0),n([(0,o.state)()],p.prototype,"_currentImageIndex",void 0),n([(0,o.state)()],p.prototype,"_isFading",void 0),n([(0,o.state)()],p.prototype,"_showActionsFlyout",void 0),n([(0,o.state)()],p.prototype,"_showTreatmentPanel",void 0),n([(0,o.state)()],p.prototype,"_isPlaying",void 0),n([(0,o.state)()],p.prototype,"_thumbnailUrls",void 0),n([(0,o.state)()],p.prototype,"_galleryImageUrls",void 0),n([(0,o.state)()],p.prototype,"_customTreatmentName",void 0),n([(0,o.state)()],p.prototype,"_customTreatmentColor",void 0),n([(0,o.state)()],p.prototype,"_selectedTreatment",void 0),n([(0,o.state)()],p.prototype,"_applyTreatment",void 0),customElements.get("flower-gallery")||customElements.define("flower-gallery",p)},261:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},a=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.FlowerHistory=e.EVENT_TYPES=void 0;const s=i(437),o=i(924),r=i(356),l=i(302),c=i(507),d=i(139),h=i(63),u=120,p=60,m=207,g=90,v=280,f=70,_=45,y=100,b=175,w=70,x=330,$=80,E=207,k=90;e.EVENT_TYPES={PHASE:"phase",AREA:"area",POT:"pot-size",TREATMENT:"treatment",IMAGE:"image",JOURNAL:"journal"};const A="phase",T="area",S="pot-size",I="treatment",P="journal";let C=class extends s.LitElement{constructor(){super(...arguments),this.events=[],this._imageUrls=[],this._showGallery=!1,this._selectedImageIndex=null,this._expandedJournalIds=new Set,this._plantingDate=null,this._addMenuOpen=!1,this._selectedAddAction=null,this._newEntryValue="",this._newEntryDate=(new Date).toISOString().split("T")[0],this._addingEntry=!1,this._newEntryAdded=!1}_showMoreInfo(t){(0,r.fireEvent)(this,"hass-more-info",{entityId:t})}connectedCallback(){super.connectedCallback(),this._updateEvents()}updated(t){(t.has("entityId")||t.has("hass"))&&this._updateEvents()}_updateEvents(){return a(this,void 0,void 0,(function*(){if(!this.entityId||!this.hass)return;const t=this.entityId.split(".")[1];this._plantingDate=yield this._getPlantingDate(),this.events=yield this._collectEvents(t)}))}_getPlantingDate(){return a(this,void 0,void 0,(function*(){var t;if(!this.entityId||!this.hass)return null;let e;try{e=yield h.PlantEntityUtils.getPlantInfo(this.hass,this.entityId)}catch(t){return null}const i=null===(t=((null==e?void 0:e.helpers)||{}).growth_phase)||void 0===t?void 0:t.entity_id;if(!i)return null;const n=this.hass.states[i];if(!(null==n?void 0:n.attributes))return null;const a=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"],s=[];for(const t of a){const e=n.attributes[`${"entfernt"===t||"geerntet"===t?t:t+"_beginn"}`];if(e){const t=new Date(e);isNaN(t.getTime())||s.push(t)}}return s.length>0?new Date(Math.min(...s.map((t=>t.getTime())))):null}))}_collectEvents(t){return a(this,void 0,void 0,(function*(){var i,n,a,s,o,r,l;if(!this.hass)return[];const d=[],E=this.hass.states[`plant.${t}`];if(!E)return[];let k;try{k=yield h.PlantEntityUtils.getPlantInfo(this.hass,`plant.${t}`)}catch(t){return console.warn("Fehler beim Laden der Pflanzen-Info:",t),[]}const A=(null==k?void 0:k.helpers)||{},T=this.historyGroups||Object.values(e.EVENT_TYPES);if(T.includes(e.EVENT_TYPES.PHASE)&&(null===(i=A.growth_phase)||void 0===i?void 0:i.entity_id)){const t=A.growth_phase.entity_id,e=this.hass.states[t];if(e){const t=["samen","keimen","wurzeln","wachstum","blüte","entfernt","geerntet"],i={samen:"Samen",keimen:"Keimen",wurzeln:"Wurzeln",wachstum:"Wachstum",blüte:"Blüte",entfernt:"Entfernt",geerntet:"Geerntet"},n=[];for(const a of t){const s=null==e?void 0:e.attributes[`${"entfernt"===a||"geerntet"===a?a:a+"_beginn"}`];if(s){const e={date:new Date(s),type:`phase-${a}`,label:i[a],description:`${i[a]} Phase begonnen am ${new Date(s).toLocaleDateString("de-DE")}`};if("entfernt"===a)e.style="display: none;";else if("geerntet"===a)e.style=`background-color: hsl(${u}, 70%, 45%);`;else{const i=t.filter((t=>"entfernt"!==t&&"geerntet"!==t)),n=i.indexOf(a),s=1===i.length?55:55-n/Math.max(1,i.length-1)*25;e.style=`background-color: hsl(${u}, ${p}%, ${s}%)`}n.push(e)}}d.push(...n)}}if(T.includes(e.EVENT_TYPES.IMAGE)){const e=yield c.FlowerGallery.getImagesWithDates(this.hass,`plant.${t}`,k);this._imageUrls=e.map((t=>t.url));const i=e.map(((t,e)=>({date:t.date,type:"image",label:"Foto",description:`Foto aufgenommen am ${t.date.toLocaleDateString("de-DE")}`,style:`background-color: hsl(${b}, ${w}%, 45%);`,data:{imageIndex:e,url:t.url}})));d.push(...i)}if(T.includes(e.EVENT_TYPES.POT)&&(null===(n=A.pot_size)||void 0===n?void 0:n.entity_id))try{const t=(null===(a=d[0])||void 0===a?void 0:a.date.toISOString())||(new Date).toISOString(),e=(new Date).toISOString(),i=yield this.hass.callApi("GET",`history/period/${t}?filter_entity_id=${A.pot_size.entity_id}&end_time=${e}`);if(i&&Array.isArray(i)&&i.length>0){let t=null;const e=[],n=i[0];for(let i=0;i<n.length;i++){const a=n[i];a.state&&!isNaN(parseFloat(a.state))&&"unavailable"!==a.state&&"unknown"!==a.state&&(null!==t&&a.state===t||(e.push({date:new Date(a.last_changed),type:"pot-size",label:`${a.state}L`,description:`Topfgröße geändert auf ${a.state}L am ${new Date(a.last_changed).toLocaleDateString("de-DE")}`}),t=a.state))}e.forEach(((t,e)=>{const i=65-10*e;t.style=`background-color: hsl(${m}, ${g}%, ${i}%)`})),d.push(...e)}}catch(t){}if(T.includes(e.EVENT_TYPES.AREA)&&E){const t=((null===(s=null==E?void 0:E.attributes)||void 0===s?void 0:s.area_history)||[]).map((t=>({date:new Date(t.date),type:"area-moved",label:t.area,description:`Umzug nach ${t.area} am ${new Date(t.date).toLocaleDateString("de-DE")}`})));t.forEach(((t,e)=>{const i=65-10*e;t.style=`background-color: hsl(${v}, ${f}%, ${i}%)`})),d.push(...t)}if(T.includes(e.EVENT_TYPES.TREATMENT)&&(null===(o=A.treatment)||void 0===o?void 0:o.entity_id))try{const t=(null===(r=d[0])||void 0===r?void 0:r.date.toISOString())||(new Date).toISOString(),e=(new Date).toISOString(),i=yield this.hass.callApi("GET",`history/period/${t}?filter_entity_id=${A.treatment.entity_id}&end_time=${e}`);if(i&&Array.isArray(i)&&i.length>0){const t=[],e=i[0];for(let i=0;i<e.length;i++){const n=e[i];n.state&&"unavailable"!==n.state&&"unknown"!==n.state&&"none"!==n.state&&t.push({date:new Date(n.last_changed),type:"treatment",label:n.state,description:`Behandlung: ${n.state} am ${new Date(n.last_changed).toLocaleDateString("de-DE")}`})}t.forEach(((t,e)=>{const i=Math.max(80-8*e,0);t.style=`background-color: hsl(${_}, ${y}%, ${i}%);`})),d.push(...t)}}catch(t){}if(T.includes(e.EVENT_TYPES.JOURNAL)){const t=null===(l=A.journal)||void 0===l?void 0:l.entity_id;if(t)try{const e=new Date((new Date).setMonth((new Date).getMonth()-6)).toISOString(),i=(new Date).toISOString(),n=yield this.hass.callApi("GET",`history/period/${e}?filter_entity_id=${t}&end_time=${i}`);if(n&&Array.isArray(n)&&n.length>0){const t=n[0];let e="";for(let i=0;i<t.length;i++){const n=t[i];n.state&&"unavailable"!==n.state&&"unknown"!==n.state&&n.state!==e&&(d.push({date:new Date(n.last_changed),type:"journal",label:"Journal",description:n.state,style:`background-color: hsl(${x}, ${$}%, 45%);`}),e=n.state)}}}catch(t){}}return d.sort(((t,e)=>e.date.getTime()-t.date.getTime()))}))}_handleImageClick(t){this._selectedImageIndex=t,this._showGallery=!0}_animateElement(t,e,i){if(t)if(e){t.classList.remove("closing","expanded"),t.style.height="0",t.offsetHeight;const e=t.scrollHeight;t.style.height=`${e}px`,t.classList.add("expanded"),i&&setTimeout(i,300)}else t.style.height=`${t.scrollHeight}px`,t.offsetHeight,t.classList.remove("expanded"),t.classList.add("closing"),setTimeout((()=>{t.classList.remove("closing"),t.style.height="0",i&&i()}),300)}_toggleJournalExpand(t){var e;const i=new Set(this._expandedJournalIds),n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(`#journal-${t}`);i.has(t)?this._animateElement(n,!1,(()=>{i.delete(t),this._expandedJournalIds=i})):(i.add(t),this._expandedJournalIds=i,setTimeout((()=>{var e;const i=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(`#journal-${t}`);this._animateElement(i,!0)}),10))}_toggleAddMenu(){var t,e,i,n;if(null!==this._selectedAddAction){const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".form-content"),n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".add-header");i&&i.classList.remove("visible"),n&&n.classList.remove("visible"),setTimeout((()=>{this._selectedAddAction=null,this._newEntryValue="",this._addMenuOpen=!1,this.requestUpdate()}),300)}else if(this._addMenuOpen=!this._addMenuOpen,this._newEntryValue="",this._addMenuOpen)this.requestUpdate(),setTimeout((()=>{var t,e;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".add-menu-container"),n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".add-menu-options");if(i&&n){const t=n.scrollHeight;i.style.height=`${t}px`,setTimeout((()=>{n.classList.add("visible")}),50)}}),10);else{const t=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector(".add-menu-container"),e=null===(n=this.shadowRoot)||void 0===n?void 0:n.querySelector(".add-menu-options");e&&e.classList.remove("visible"),t&&(t.style.height="0")}}_selectAddAction(t){var e,i;this._selectedAddAction=t,this._newEntryValue="";const n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelectorAll(".add-option"),a=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector(`.add-option[data-action="${t}"]`);n&&a&&(n.forEach((t=>{t!==a?t.classList.add("fade-out"):t.classList.add("selected")})),setTimeout((()=>{a.classList.add("move-to-header"),setTimeout((()=>{this.requestUpdate(),setTimeout((()=>{var t,e;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".add-header"),n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".form-content");if(i&&i.classList.add("visible"),n){n.classList.add("visible");const t=n.querySelector("input, select, textarea");t&&t.focus()}}),50)}),300)}),300))}_addNewEntry(){return a(this,void 0,void 0,(function*(){var t,e,i,n,a;if(this.hass&&this.entityId&&this._selectedAddAction&&this._newEntryValue){this._addingEntry=!0;try{const s=yield h.PlantEntityUtils.getPlantInfo(this.hass,this.entityId);if(!s)return void(this._addingEntry=!1);const o=s.helpers||{},r=null===(t=o.growth_phase)||void 0===t?void 0:t.entity_id,l=null===(e=o.pot_size)||void 0===e?void 0:e.entity_id,c=null===(i=o.treatment)||void 0===i?void 0:i.entity_id,d=null===(n=o.journal)||void 0===n?void 0:n.entity_id;switch(this._selectedAddAction){case A:if(!r)break;yield this.hass.callService("select","select_option",{entity_id:r,option:this._newEntryValue});const t="entfernt"===this._newEntryValue||"geerntet"===this._newEntryValue?this._newEntryValue:`${this._newEntryValue}_beginn`;yield this.hass.callService("homeassistant","update_entity_attribute",{entity_id:r,attribute:t,value:(new Date).toISOString().split("T")[0]});break;case T:const e=this._newEntryValue,i=(null===(a=Object.entries(this.hass.areas||{}).find((([t,i])=>i.name===e)))||void 0===a?void 0:a[0])||"",n=this.hass.entities[this.entityId];(null==n?void 0:n.device_id)&&(yield this.hass.callService("plant","move_to_area",{device_id:n.device_id,area_id:i}));break;case S:if(!l)break;yield this.hass.callService("number","set_value",{entity_id:l,value:parseFloat(this._newEntryValue)});break;case I:if(!c)break;yield this.hass.callService("select","select_option",{entity_id:c,option:this._newEntryValue});break;case P:if(!d)break;yield this.hass.callService("text","set_value",{entity_id:d,value:this._newEntryValue})}this._newEntryAdded=!0,setTimeout((()=>{var t,e;this._newEntryAdded=!1,this._addingEntry=!1;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".form-content"),n=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector(".add-header");i&&i.classList.remove("visible"),n&&n.classList.remove("visible"),setTimeout((()=>{this._selectedAddAction=null,this._newEntryValue="",this._addMenuOpen=!1,this._updateEvents()}),300)}),1e3)}catch(t){this._addingEntry=!1}}}))}_handleKeyDown(t){t.stopPropagation(),"Enter"!==t.key||t.shiftKey||(t.preventDefault(),this._addNewEntry())}_getIconForAction(t){if(!t)return"";switch(t){case A:return"mdi:sprout";case T:return"mdi:map-marker";case S:return"mdi:cup";case I:return"mdi:medical-bag";case P:return"mdi:notebook";default:return""}}_getColorForAction(t){if(!t)return"";switch(t){case A:return`${u}, ${p}%, 45%`;case T:return`${v}, ${f}%, 45%`;case S:return`${m}, ${g}%, 45%`;case I:return`${_}, ${y}%, 45%`;case P:return`${x}, ${$}%, 45%`;default:return""}}_getLabelForAction(t){if(!t)return"";switch(t){case A:return"Wachstumsphase";case T:return"Area";case S:return"Topfgröße";case I:return"Behandlung";case P:return"Journal";default:return""}}_getTreatmentOptions(){if(!this.entityId||!this.hass)return["cut","super cropping","topping","lollipop","fim","rib","spray pest","spray water"];const t=`select.${this.entityId.split(".")[1]}_treatment`,e=this.hass.states[t];return e&&e.attributes&&e.attributes.options?e.attributes.options.filter((t=>""!==t)):["cut","super cropping","topping","lollipop","fim","rib","spray pest","spray water"]}_renderFormForAction(t){var e;if(!t)return s.html``;const i=t=>t.stopPropagation(),n=t=>{t.stopPropagation();const e=t.target.value;this._newEntryValue=e,e&&this._addNewEntry()},a=t=>{t.stopPropagation(),this._newEntryValue=t.target.value},o=t=>{t.stopPropagation(),"Enter"!==t.key||t.shiftKey||(t.preventDefault(),this._newEntryValue&&this._addNewEntry())},r=t=>{t.stopPropagation(),this._newEntryValue&&this._addNewEntry()};switch(t){case A:return s.html`
                    <div class="form-field">
                        <select id="phase-select" 
                            @click=${i}
                            @change=${n}
                        >
                            <option value="" disabled selected>Bitte wählen...</option>
                            <option value="samen">Samen</option>
                            <option value="keimen">Keimen</option>
                            <option value="wurzeln">Wurzeln</option>
                            <option value="wachstum">Wachstum</option>
                            <option value="blüte">Blüte</option>
                            <option value="entfernt">Entfernt</option>
                            <option value="geerntet">Geerntet</option>
                        </select>
                    </div>
                `;case T:const t=Object.values((null===(e=this.hass)||void 0===e?void 0:e.areas)||{}).map((t=>t.name)).sort(((t,e)=>t.localeCompare(e,"de")));return s.html`
                    <div class="form-field">
                        <select id="area-select" 
                            @click=${i}
                            @change=${n}
                        >
                            <option value="" disabled selected>Bitte wählen...</option>
                            ${t.map((t=>s.html`<option value="${t}">${t}</option>`))}
                        </select>
                    </div>
                `;case S:return s.html`
                    <div class="form-field">
                        <input type="number" 
                            id="pot-input" 
                            min="0.1" 
                            step="0.1" 
                            placeholder="Topfgröße in Liter..." 
                            @click=${i}
                            @input=${a}
                            @keydown=${o}
                            @blur=${r}
                        >
                    </div>
                `;case I:const l=this._getTreatmentOptions();return s.html`
                    <div class="form-field">
                        <select id="treatment-select"
                            @click=${i}
                            @change=${n}
                        >
                            <option value="" disabled selected>Bitte wählen...</option>
                            ${l.map((t=>t?s.html`<option value="${t}">${t}</option>`:""))}
                        </select>
                    </div>
                `;case P:return s.html`
                    <div class="form-field">
                        <textarea id="journal-input" 
                            placeholder="Notizen zur Pflanze..." 
                            @click=${i}
                            @input=${a}
                        ></textarea>
                    </div>
                    <div class="journal-submit">
                        <ha-icon-button 
                            icon="mdi:send" 
                            @click=${t=>{t.stopPropagation(),this._addNewEntry()}}
                            ?disabled=${!this._newEntryValue}
                            title="Bestätigen"
                        ></ha-icon-button>
                    </div>
                `;default:return s.html``}}render(){if(!this.hass||!this.entityId)return s.html``;const t=this.entityId.split(".")[1],i=(this.hass.states[`select.${t}_growth_phase`],this.historyGroups||Object.values(e.EVENT_TYPES)),n="right"===this.linePosition?"timeline-right":"";return s.html`
            <div class="history-container">
                <div class="vertical-timeline ${n}">
                    <div class="timeline-line" style="background-color: hsl(${u}, ${p}%, 45%);"></div>
                    
                    <!-- Hinzufügen-Button am Anfang der Timeline -->
                    <div class="phase-item add-item" @click=${this._toggleAddMenu}>
                        <div class="phase-dot add-dot" style="background-color: hsl(${E}, ${k}%, 45%);">
                            <ha-icon icon="mdi:plus" class="dot-icon"></ha-icon>
                        </div>
                        <div class="phase-content add-content">
                            ${null!==this._selectedAddAction?s.html`
                                <!-- Header mit ausgewählter Aktion -->
                                <div class="add-header">
                                    <div class="add-header-title">
                                        <ha-icon icon="${this._getIconForAction(this._selectedAddAction)}" 
                                                style="color: hsl(${this._getColorForAction(this._selectedAddAction)});">
                                        </ha-icon>
                                        <span>${this._getLabelForAction(this._selectedAddAction)}</span>
                                    </div>
                                    <ha-icon-button 
                                        icon="mdi:close" 
                                        @click=${t=>{t.stopPropagation(),this._toggleAddMenu()}}
                                    ></ha-icon-button>
                                </div>
                                
                                <!-- Formular zum Hinzufügen des ausgewählten Eintrags -->
                                <div class="form-content" @click=${t=>t.stopPropagation()}>
                                    ${this._renderFormForAction(this._selectedAddAction)}
                                    
                                    ${this._selectedAddAction!==P&&this._selectedAddAction!==A&&this._selectedAddAction!==I&&this._selectedAddAction!==T&&this._selectedAddAction!==S?s.html`
                                        <div class="form-actions">
                                            <ha-icon-button 
                                                icon="mdi:check" 
                                                @click=${t=>{t.stopPropagation(),this._addNewEntry()}}
                                                ?disabled=${this._addingEntry||!this._newEntryValue}
                                                class="${this._newEntryAdded?"success":""}"
                                                title="Bestätigen"
                                            ></ha-icon-button>
                                        </div>
                                    `:""}
                                </div>
                            `:s.html`
                                <!-- Überschrift für den Hinzufügen-Button -->
                                <div class="phase-header">
                                    <div class="phase-name">Eintrag hinzufügen</div>
                                </div>
                                
                                <!-- Menü zum Hinzufügen neuer Einträge -->
                                <div class="add-menu-container ${this._addMenuOpen?"expanded":""}">
                                    <div class="add-menu-options">
                                        ${i.includes(e.EVENT_TYPES.PHASE)?s.html`
                                            <div class="add-option" data-action="${A}" @click=${t=>{t.stopPropagation(),this._selectAddAction(A)}}>
                                                <ha-icon icon="mdi:sprout" class="option-icon" style="color: hsl(${u}, ${p}%, 45%);"></ha-icon>
                                                <span>Wachstumsphase</span>
                                            </div>
                                        `:""}
                                        ${i.includes(e.EVENT_TYPES.AREA)?s.html`
                                            <div class="add-option" data-action="${T}" @click=${t=>{t.stopPropagation(),this._selectAddAction(T)}}>
                                                <ha-icon icon="mdi:map-marker" class="option-icon" style="color: hsl(${v}, ${f}%, 45%);"></ha-icon>
                                                <span>Area</span>
                                            </div>
                                        `:""}
                                        ${i.includes(e.EVENT_TYPES.POT)?s.html`
                                            <div class="add-option" data-action="${S}" @click=${t=>{t.stopPropagation(),this._selectAddAction(S)}}>
                                                <ha-icon icon="mdi:cup" class="option-icon" style="color: hsl(${m}, ${g}%, 45%);"></ha-icon>
                                                <span>Topfgröße</span>
                                            </div>
                                        `:""}
                                        ${i.includes(e.EVENT_TYPES.TREATMENT)?s.html`
                                            <div class="add-option" data-action="${I}" @click=${t=>{t.stopPropagation(),this._selectAddAction(I)}}>
                                                <ha-icon icon="mdi:medical-bag" class="option-icon" style="color: hsl(${_}, ${y}%, 45%);"></ha-icon>
                                                <span>Behandlung</span>
                                            </div>
                                        `:""}
                                        ${i.includes(e.EVENT_TYPES.JOURNAL)?s.html`
                                            <div class="add-option" data-action="${P}" @click=${t=>{t.stopPropagation(),this._selectAddAction(P)}}>
                                                <ha-icon icon="mdi:notebook" class="option-icon" style="color: hsl(${x}, ${$}%, 45%);"></ha-icon>
                                                <span>Journal</span>
                                            </div>
                                        `:""}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    ${this._renderEvents()}
                </div>
            </div>
            ${this._showGallery?s.html`
                <flower-gallery
                    .hass=${this.hass}
                    .entityId=${this.entityId}
                    .images=${this._imageUrls}
                    .initialImageIndex=${this._selectedImageIndex}
                    .onClose=${()=>{this._showGallery=!1,this._selectedImageIndex=null}}
                ></flower-gallery>
            `:""}
        `}_renderEvents(){return 0===this.events.length?s.html`
                <div class="phase-item">
                    <div class="phase-dot" style="background-color: hsl(${u}, ${p}%, 45%);"></div>
                    <div class="phase-content">
                        <div class="phase-name">Keine Ereignisse verfügbar</div>
                    </div>
                </div>
            `:s.html`
            ${this.events.map(((t,e)=>{let i="",n="";const a=t.type.startsWith("phase-"),o="journal"===t.type,r=`event-${e}-${t.type}-${t.date.getTime()}`,l=this._expandedJournalIds.has(r);let c="";if(a){i=t.style||`background-color: hsl(${u}, ${p}%, 45%);`;const e=i.match(/background-color:\s*hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);if(e){const[t,i,n,a]=e;c=`--milestone-color: hsla(${i}, ${n}%, ${a}%, 0.15)`}else c=`--milestone-color: hsla(${u}, ${p}%, 45%, 0.15)`;const a=t.type.split("-")[1];n=(0,d.getGrowthPhaseIcon)(a)}else"pot-size"===t.type?(i=t.style||`background-color: hsl(${m}, ${g}%, 45%);`,n="mdi:cup"):"area-moved"===t.type?(i=t.style||`background-color: hsl(${v}, ${f}%, 45%);`,n="mdi:map-marker"):"treatment"===t.type?(i=t.style||`background-color: hsl(${_}, ${y}%, 45%);`,n="mdi:medical-bag"):"image"===t.type?(i=t.style||`background-color: hsl(${b}, ${w}%, 45%);`,n="mdi:camera"):o&&(i=t.style||`background-color: hsl(${x}, ${$}%, 45%);`,n="mdi:notebook");let h=new Date(t.date).toLocaleDateString("de-DE");if(this._plantingDate&&t.date){const e=new Date(this._plantingDate);e.setHours(0,0,0,0);const i=Math.abs(new Date(t.date).getTime()-e.getTime());h=`${Math.ceil(i/864e5)} | ${h}`}return s.html`
                    <div class="phase-item ${a?"milestone":""}" @click=${()=>{var e;"image"===t.type&&void 0!==(null===(e=t.data)||void 0===e?void 0:e.imageIndex)?this._handleImageClick(t.data.imageIndex):o&&this._toggleJournalExpand(r)}}>
                        <div class="phase-dot ${a?"milestone":""}" style="${i}">
                            ${n?s.html`<ha-icon icon="${n}" class="dot-icon"></ha-icon>`:""}
                        </div>
                        <div class="phase-content ${a?"milestone":""}" style="${a?c:""}">
                            <div class="phase-header">
                                <div class="phase-name">${t.label}</div>
                                <div class="phase-date">${h}</div>
                            </div>
                            <div class="journal-container ${o&&l?"expanded":""}" id="journal-${r}" style="height: 0;">
                                <div class="phase-description">${t.description}</div>
                            </div>
                        </div>
                    </div>
                `}))}
        `}};e.FlowerHistory=C,C.styles=l.historyStyles,n([(0,o.property)()],C.prototype,"hass",void 0),n([(0,o.property)()],C.prototype,"entityId",void 0),n([(0,o.property)({type:Array})],C.prototype,"historyGroups",void 0),n([(0,o.property)({type:String})],C.prototype,"linePosition",void 0),n([(0,o.state)()],C.prototype,"events",void 0),n([(0,o.state)()],C.prototype,"_imageUrls",void 0),n([(0,o.state)()],C.prototype,"_showGallery",void 0),n([(0,o.state)()],C.prototype,"_selectedImageIndex",void 0),n([(0,o.state)()],C.prototype,"_expandedJournalIds",void 0),n([(0,o.state)()],C.prototype,"_plantingDate",void 0),n([(0,o.state)()],C.prototype,"_addMenuOpen",void 0),n([(0,o.state)()],C.prototype,"_selectedAddAction",void 0),n([(0,o.state)()],C.prototype,"_newEntryValue",void 0),n([(0,o.state)()],C.prototype,"_newEntryDate",void 0),n([(0,o.state)()],C.prototype,"_addingEntry",void 0),n([(0,o.state)()],C.prototype,"_newEntryAdded",void 0),e.FlowerHistory=C=n([(0,o.customElement)("flower-history")],C)},43:function(t,e,i){var n=this&&this.__decorate||function(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};Object.defineProperty(e,"__esModule",{value:!0}),e.BrokkoliCardEditor=void 0;const a=i(437),s=i(924),o=i(130),r=i(139),l=i(147),c=i(516),d=i(770),h=i(770),u=i(261),p=[{label:"Wachstumsphasen",value:u.EVENT_TYPES.PHASE},{label:"Topfgrößen",value:u.EVENT_TYPES.POT},{label:"Standorte",value:u.EVENT_TYPES.AREA},{label:"Behandlungen",value:u.EVENT_TYPES.TREATMENT},{label:"Bilder",value:u.EVENT_TYPES.IMAGE},{label:"Journal",value:u.EVENT_TYPES.JOURNAL}],m=[{label:"Links",value:"left"},{label:"Rechts",value:"right"}],g=r.elementOptions.filter((t=>"header"!==t.value&&"options"!==t.value));let v=class extends l.default{render(){if(!this._hass||!this._config)return a.html``;this._config.show_bars||(this._config=Object.assign(Object.assign({},this._config),{show_bars:[...r.default_show_bars]})),this._config.show_elements||(this._config=Object.assign(Object.assign({},this._config),{show_elements:[...r.default_show_elements]})),this._config.option_elements||(this._config=Object.assign(Object.assign({},this._config),{option_elements:[...r.default_option_elements]})),this._config.full_width_bars||(this._config=Object.assign(Object.assign({},this._config),{full_width_bars:[]}));const t=(e=this._hass,[...(0,d.getEntitiesByDomain)(e,"plant"),...(0,d.getEntitiesByDomain)(e,"cycle")]);var e;const i=(0,h.getEntitiesByDeviceClass)(this._hass,"sensor","battery");return this.renderForm([{controls:[{label:"Display Type",configValue:"display_type",type:c.FormControlType.Radio,items:[{label:"Full",value:o.DisplayType.Full},{label:"Compact",value:o.DisplayType.Compact}]}]},{controls:[{label:"Entity",configValue:"entity",type:c.FormControlType.Dropdown,items:t}]},{controls:[{label:"Battery Sensor",configValue:"battery_sensor",type:c.FormControlType.Dropdown,items:i}]},{controls:[{label:"Show Bars",configValue:"show_bars",type:c.FormControlType.Checkboxes,items:r.plantAttributes}]},{controls:[{label:"Full Width Bars",configValue:"full_width_bars",type:c.FormControlType.Checkboxes,items:r.plantAttributes}]},{controls:[{label:"Show Elements",configValue:"show_elements",type:c.FormControlType.Checkboxes,items:r.elementOptions}]},{controls:[{label:"Option Elements",configValue:"option_elements",type:c.FormControlType.Checkboxes,items:r.elementOptions}]},{controls:[{label:"Default Expanded Options",configValue:"default_expanded_options",type:c.FormControlType.Checkboxes,items:g}]},{controls:[{label:"History Groups",configValue:"history_groups",type:c.FormControlType.Checkboxes,items:p}]},{controls:[{label:"History Line Position",configValue:"history_line_position",type:c.FormControlType.Radio,items:m}]}])}};e.BrokkoliCardEditor=v,e.BrokkoliCardEditor=v=n([(0,s.customElement)("brokkoli-card-editor")],v)},800:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const n=i(437);e.style=n.css`
  /* ===== Base Card Styles ===== */
  ha-card {
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    max-height: 100%;
    overflow: visible !important;
  }

  .card-margin-top {
    margin-top: 32px;
  }

  /* ===== Header Section ===== */
  .header,
  .header-compact {
    position: relative;
  }

  .header {
    padding-top: 8px;
    height: 100px;
  }

  .header-compact {
    padding-top: 4px;
    height: 55px;
  }

  /* Menu Button */
  .menu-button {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    z-index: 3;
  }

  .menu-button ha-icon {
    color: var(--primary-text-color);
    opacity: 0.7;
  }

  .menu-button:hover ha-icon {
    opacity: 1;
  }

  /* Flyout Menu */
  .flyout-menu {
    position: absolute;
    top: 40px;
    right: 8px;
    background: var(--card-background-color);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
    overflow: hidden;
    min-width: 180px;
  }

  .flyout-menu-item {
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .flyout-menu-item:hover {
    background-color: var(--secondary-background-color);
  }

  .flyout-menu-item ha-icon {
    color: var(--primary-text-color);
    opacity: 0.9;
  }

  .flyout-menu-divider {
    height: 1px;
    background-color: var(--divider-color);
    margin: 4px 0;
  }

  /* Plant Dropdown Styles */
  .plant-dropdown-container {
    position: relative;
    display: block;
    margin: 4px 0 0 132px;
    color: #8c96a5;
    text-transform: capitalize;
  }
  
  .clickable-plants {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .clickable-plants:hover {
    text-decoration: underline;
  }

  .plant-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--card-background-color);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    overflow: hidden;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 5px;
  }

  .plant-dropdown-item {
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--divider-color);
  }

  .plant-dropdown-item:last-child {
    border-bottom: none;
  }

  .plant-dropdown-item:hover {
    background-color: var(--secondary-background-color);
  }

  .plant-dropdown-name {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .plant-dropdown-info {
    font-size: 0.85em;
    opacity: 0.8;
  }

  /* Popup Dialog */
  .popup-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .popup-content {
    background: var(--card-background-color);
    border-radius: 8px;
    padding: 24px;
    min-width: 300px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  .popup-title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 10px;
  }

  .popup-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .popup-buttons button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .popup-buttons button:first-child {
    background-color: var(--secondary-background-color);
    color: var(--primary-text-color);
  }

  .popup-buttons button:last-child {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
  }

  .popup-buttons button:hover {
    opacity: 0.9;
  }

  .popup-buttons button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .popup-buttons button.danger {
    background-color: var(--error-color);
    color: white;
  }

  /* Form Fields */
  .form-field {
    margin-bottom: 16px;
  }

  .form-field label {
    display: block;
    margin-bottom: 6px;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  .form-field .input-group {
    display: flex;
    gap: 8px;
  }

  .form-field .input-group input {
    flex: 1;
  }

  /* Sensor Replacement Styles */
  .form-field select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 14px;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    padding-right: 30px;
  }

  .form-field select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Header Image Container */
  .image-container {
    position: relative;
    width: 100px;
    height: 100px;
    float: left;
    margin: -16px 16px 0;
  }

  .header-compact .image-container {
    width: 50px;
    height: 50px;
    margin: 0 8px;
  }

  /* Header Image */
  .image-container .plant-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
    cursor: pointer;
  }

  /* Legacy support for back-image and front-image classes (for compiled JS) */
  .image-container .back-image,
  .image-container .front-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
  }

  .image-container .back-image {
    z-index: 1;
  }

  .image-container .front-image {
    z-index: 2;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }

  .image-container .front-image.fade {
    opacity: 0;
  }

  .header > img {
    width: 100px;
    height: 100px;
    margin: -16px 16px 0;
  }

  .header-compact > img {
    width: 50px;
    height: 50px;
    margin: 0 8px;
  }

  .header > img.fade,
  .header-compact > img.fade {
    opacity: 0;
  }

  /* Header Text */
  .header > #name,
  .header-compact > #name {
    font-weight: bold;
    text-transform: capitalize;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header > #name {
    width: fit-content;
    max-width: calc(100% - 150px);
    margin: 16px 0 0 132px;
  }

  .header-compact > #name {
    width: calc(100% - 74px);
    margin-top: 8px;
  }

  #name ha-icon {
    color: rgb(240, 163, 163);
  }

  .header > #species {
    text-transform: capitalize;
    color: #8c96a5;
    display: block;
    margin: 4px 0 0 132px;
  }

  .header-compact > #species {
    text-transform: capitalize;
    color: #8c96a5;
    display: block;
    margin: 4px 0 0 0;
  }

  .header-compact .plant-dropdown-container {
    margin: 4px 0 0 0;
  }

  /* Header Status */
  #battery {
    float: right;
    margin: -15px 16px 0 0;
  }

  .header > #status-container {
    display: flex;
    gap: 16px;
    margin: 4px 0 0 132px;
  }

  .header > #status-container span {
    color: #8c96a5;
    display: flex;
    align-items: center;
    font-size: 0.9em;
  }

  .header > #metrics-container {
    display: none;
  }

  .header > #metrics-container ha-icon,
  .header > #status-container ha-icon {
    margin-right: 4px;
  }

  /* ===== Divider ===== */
  .divider {
    height: 1px;
    background-color: #727272;
    opacity: 0.25;
    margin: 0 8px;
  }

  /* ===== Attributes Section ===== */
  .attributes {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
  }

  .attributes:first-child {
    margin-top: 16px;
  }

  .attributes.width-100 {
    padding: 2px;
  }

  /* Container für Full-Width Items */
  .attributes.has-full-width-item {
    display: block;
  }

  /* Basis-Styling für alle Attribute */
  .attribute {
    display: flex;
    align-items: center;
    width: 50%;
    box-sizing: border-box;
    position: relative;
  }

  /* Attribute in voller Breite */
  .attribute.width-100,
  .attribute.full-width {
    width: 100%;
  }

  /* Header in Attributen */
  .attribute .header {
    margin-left: auto;
    min-width: 20px;
    height: auto;
    padding-top: 0;
  }

  /* Header in Width-100 ausblenden, aber in Full-Width anzeigen */
  .attribute.width-100 .header {
    display: none;
  }

  .attribute.width-100.full-width .header {
    display: flex;
  }

  /* Icon-Styling */
  .attribute ha-icon {
    margin-right: 8px;
  }

  /* Cursor für klickbare Health-Bar Icons */
  .attribute[data-attribute="health"] ha-icon {
    cursor: pointer;
  }

  /* ===== Meter Styles ===== */
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
  }

  .meter.green {
    flex-grow: 10;
    margin-right: 8px;
  }

  /* Spezielle Styles für Health-Bar-Meter */
  .attribute[data-attribute="health"] .meter.green {
    display: grid; 
    grid-template-columns: repeat(10, 1fr); 
    column-gap: 5px; 
    position: relative;
    background-color: transparent;
  }

  /* Health-Bar in Full-Width */
  .attribute.full-width[data-attribute="health"] .meter.green {
    flex: 1;
    width: 100%;
  }

  /* Health-Segmente */
  .attribute[data-attribute="health"] .health-segment {
    grid-row: 1;
    border-radius: 2px;
    height: 8px;
  }

  /* Range-Input für Health-Bar */
  .attribute[data-attribute="health"] .meter.green input[type="range"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.0001;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  .meter > span {
    grid-row: 1;
    grid-column: 1;
    height: 100%;
  }

  .meter > .good {
    background-color: rgba(43, 194, 83, 1);
  }

  .meter > .bad {
    background-color: rgba(240, 163, 163);
  }

  .meter > .unavailable {
    background-color: rgba(158, 158, 158, 1);
  }

  /* ===== Tooltip Styles ===== */
  .tooltip {
    position: relative;
    cursor: pointer;
    overflow: visible !important;
    z-index: 2;
  }

  .tooltip .tip {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    padding: 6px 10px;
    bottom: 150%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(97, 97, 97, 0.9);
    color: white;
    white-space: normal;
    z-index: 99999;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    max-width: 300px;
    min-width: 150px;
    text-align: center;
    word-break: normal;
    overflow-wrap: break-word;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    transition-delay: 0s;
  }

  .tooltip .tip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(97, 97, 97, 0.9) transparent transparent transparent;
  }

  .battery.tooltip .tip {
    bottom: 180%;
    min-width: unset;
  }

  .tooltip:hover .tip {
    opacity: 1;
    visibility: visible;
    transition-delay: 0.3s;
  }

  /* Ensure tooltips don't get cut off at the edges */
  .attributes .tooltip:first-child .tip {
    left: 20%;
    transform: translateX(0);
  }

  .attributes .tooltip:first-child .tip::after {
    left: 10%;
  }

  .attributes .tooltip:last-child .tip {
    left: 80%;
    transform: translateX(-100%);
  }

  .attributes .tooltip:last-child .tip::after {
    left: 90%;
  }
  
  /* Special handling for compact mode */
  .attributes.width-100 .tooltip .tip {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .attributes.width-100 .tooltip .tip::after {
    left: 50%;
  }

  /* Special handling for full-width items */
  .attributes.has-full-width-item .tooltip .tip {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .attributes.has-full-width-item .tooltip .tip::after {
    left: 50%;
  }

  /* ===== Options Styles ===== */
  .options-container {
    display: flex;
    justify-content: space-between;
    height: 16px;
    line-height: 0;
  }

  /* Wenn options-container das erste Element ist */
  .options-container:first-child {
    margin-top: 0;
  }

  .options-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 2px 0;
    transition: background-color 0.2s ease-in-out;
  }

  .options-section:hover {
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
  }

  .options-section ha-icon {
    color: var(--primary-text-color);
    opacity: 0.5;
    width: 12px;
    height: 12px;
    --mdc-icon-size: 12px;
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, color 0.3s ease-in-out;
  }

  .options-section.expanded ha-icon {
    opacity: 1;
    transform: rotate(180deg);
    color: var(--primary-color, #03a9f4);
  }

  /* ===== Expanded Content Styles ===== */
  .expanded-content {
    display: none;
    padding: 0 8px;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
  }

  .expanded-content.show {
    display: block;
    animation: fadeIn 0.3s ease-in-out;
    margin: 8px 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Wenn expanded-content das erste Element ist */
  .expanded-content.show:first-child {
    margin-top: 16px;
  }

  .expanded-content.show flower-graph,
  .expanded-content.show flower-timeline,
  .expanded-content.show flower-consumption,
  .expanded-content.show flower-history {
    width: 100%;
    max-width: 100%;
    display: block;
  }

  /* Schmale Scrollbar für Webkit-Browser (Chrome, Safari, etc.) */
  .expanded-content.show::-webkit-scrollbar {
    width: 6px;
  }

  .expanded-content.show::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  .expanded-content.show::-webkit-scrollbar-track {
    background: transparent;
  }

  /* ===== Plant Details Styles ===== */
  .plant-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 8px 0;
    padding: 0 8px;
    box-sizing: border-box;
  }

  /* Wenn plant-details das erste Element ist */
  .plant-details:first-child {
    margin-top: 16px;
    padding-top: 8px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: var(--card-background-color, #fff);
    border-radius: 4px;
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

  @media (max-width: 600px) {
    .header > .unit {
      display: none;
    }
  }

  /* ===== Timeline Container Styles ===== */
  .timeline-container {
    width: 100%;
    overflow-x: hidden;
    padding: 0 8px;
    box-sizing: border-box;
    margin: 8px 0;
  }

  /* Wenn der Container das erste Element ist */
  .timeline-container:first-child {
    margin-top: 16px;
  }

  .timeline-container flower-graph,
  .timeline-container flower-timeline {
    width: 100%;
    max-width: 100%;
    display: block;
  }

  /* ===== Component Container Styles ===== */
  .component-container {
    width: 100%;
    overflow-x: hidden;
    padding: 0 8px;
    box-sizing: border-box;
    margin: 0 0 8px 0;
  }

  /* Wenn der Container das erste Element ist */
  .component-container:first-child {
    margin-top: 0;
  }

  .component-container flower-consumption,
  .component-container flower-history {
    width: 100%;
    max-width: 100%;
    display: block;
  }
`},75:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.style=void 0;const n=i(437);e.style=n.css`
    /* ===================================
     * Consumption Grid Layout
     * =================================== */
    .consumption-data {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        gap: 4px;
        margin: 8px 0;
    }

    /* ===================================
     * Consumption Item Styles
     * =================================== */
    .consumption-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px;
        border-radius: 4px;
        background: var(--card-background-color, var(--ha-card-background));
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .consumption-item:hover {
        background: var(--primary-background-color);
    }

    /* Large Item (Energiekosten) */
    .consumption-item.large {
        grid-column: 3;
        grid-row: 1 / 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 12px;
        height: 100%;
        box-sizing: border-box;
    }

    /* ===================================
     * Icon Styles
     * =================================== */
    .consumption-item ha-icon {
        color: var(--primary-text-color);
        opacity: 0.7;
        width: 20px;
        height: 20px;
    }

    .consumption-item.large ha-icon {
        width: 48px;
        height: 48px;
        --mdc-icon-size: 48px;
    }

    /* ===================================
     * Consumption Details Text Styles
     * =================================== */
    .consumption-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    /* Large Details (Energiekosten) */
    .consumption-details.large {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }

    /* Text Sizes */
    .consumption-details .label {
        font-size: 0.7em;
        color: var(--primary-text-color);
        opacity: 0.7;
    }

    .consumption-details .value {
        font-size: 0.8em;
        font-weight: bold;
    }

    .consumption-value {
        display: inline-block;
    }

    .consumption-item.animate ha-icon,
    .consumption-item.animate .label,
    .consumption-item.animate .value {
        animation: value-change 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes value-change {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }

    .consumption-details.large .label {
        font-size: 0.9em;
    }

    .consumption-details.large .value {
        font-size: 1.6em;
        font-weight: bold;
    }

    /* ===================================
     * Consumption Charts Container
     * =================================== */
    .consumption-charts-container {
        display: flex;
        justify-content: center;
        margin-top: 16px;
    }

    /* ===================================
     * Pie Chart Container
     * =================================== */
    .pie-chart-container {
        width: 100%;
        max-width: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        background: var(--card-background-color, var(--ha-card-background));
        border-radius: 4px;
        padding: 16px;
    }

    .pie-chart {
        width: 100%;
        min-width: 0;
    }
`},364:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.galleryStyles=void 0;const n=i(437);e.galleryStyles=n.css`
    /* Treatment Color Variables */
    :host {
        --treatment-orange-color: #ff9800;
        --treatment-green-color: #4caf50;
        --treatment-blue-color: #2196f3;
        --treatment-red-color: #f44336;
        --treatment-yellow-color: #ffeb3b;
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
        padding: 0px;
    }

    .gallery-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0px;
        overflow: hidden;
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
        text-align: left;
        background: rgba(0, 0, 0, 0.5);
        padding: 6px 12px;
        border-radius: 4px;
        max-width: 60%;
        position: absolute;
        top: 16px;
        left: 16px;
        right: 140px;
        z-index: 1;
        font-weight: normal;
        line-height: 1.4;
    }

    .gallery-date .info-line {
        white-space: nowrap;
    }

    .gallery-date .phase,
    .gallery-date .day,
    .gallery-date .total {
        font-weight: bold;
    }

    .gallery-date .treatment {
        font-weight: bold;
        font-style: italic;
    }

    /* Dynamic treatment colors */
    .gallery-date .treatment[data-color="orange"] { color: var(--treatment-orange-color); }
    .gallery-date .treatment[data-color="green"] { color: var(--treatment-green-color); }
    .gallery-date .treatment[data-color="blue"] { color: var(--treatment-blue-color); }
    .gallery-date .treatment[data-color="red"] { color: var(--treatment-red-color); }
    .gallery-date .treatment[data-color="yellow"] { color: var(--treatment-yellow-color); }

    .gallery-date .bracket {
        font-weight: normal;
    }

    .gallery-header-buttons {
        display: flex;
        gap: 4px;
        align-items: center;
        position: relative;
        z-index: 2;
        margin-left: auto;
        height: 32px;
    }

    .gallery-header ha-icon-button {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gallery-header ha-icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        z-index: 10;
        pointer-events: auto;
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
        position: relative;
    }

    .thumbnail-group-label::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: var(--phase-color);
        border-radius: 0 0 4px 4px;
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
        text-align: center;
        line-height: 1.2;
    }

    .thumbnail-treatment {
        font-size: 0.7em;
        font-style: italic;
        font-weight: bold;
    }

    /* Dynamic thumbnail treatment colors */
    .thumbnail-treatment[data-color="orange"] { color: var(--treatment-orange-color); }
    .thumbnail-treatment[data-color="green"] { color: var(--treatment-green-color); }
    .thumbnail-treatment[data-color="blue"] { color: var(--treatment-blue-color); }
    .thumbnail-treatment[data-color="red"] { color: var(--treatment-red-color); }
    .thumbnail-treatment[data-color="yellow"] { color: var(--treatment-yellow-color); }

    /* Treatment Management Styles */
    .treatment-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .treatment-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
    }

    .treatment-panel {
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 16px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
        z-index: 1000;
        min-width: 250px;
        margin-top: 4px;
    }

    .treatment-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
    }

    .treatment-section:last-child {
        margin-bottom: 0;
    }

    .treatment-section label {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
    }

    .treatment-input, .treatment-select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        font-family: inherit;
    }

    .treatment-input {
        cursor: text;
    }

    .treatment-select {
        cursor: pointer;
    }

    .treatment-input:focus, .treatment-select:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .treatment-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .add-btn {
        background: var(--primary-color);
        color: var(--text-primary-color);
    }

    .add-btn:hover:not(:disabled) {
        background: var(--primary-color);
        opacity: 0.8;
    }

    .apply-btn {
        background: var(--success-color, #4caf50);
        color: white;
    }

    .apply-btn:hover:not(:disabled) {
        background: var(--success-color, #4caf50);
        opacity: 0.8;
    }

    .remove-btn {
        background: var(--error-color);
        color: white;
    }

    .remove-btn:hover:not(:disabled) {
        background: var(--error-color);
        opacity: 0.8;
    }

    .treatment-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .color-picker {
        margin-top: 8px;
        font-family: inherit;
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

    .flyout-container {
        position: relative;
        display: flex;
        align-items: center;
        height: 32px;
        transition: transform 0.2s ease-in-out;
    }

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

    .flyout-container:nth-child(2).delete-open,
    .flyout-container:nth-child(2).main-open {
        transform: translateX(-31px);
    }

    .flyout-container:nth-child(2).delete-open.main-open {
        transform: translateX(-62px);
    }

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
        height: 32px;
        background: var(--card-background-color);
        border-radius: 4px;
        padding: 2px;
        display: flex;
        align-items: center;
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
        justify-content: center;
        height: 100%;
        cursor: pointer;
    }

    .flyout-option ha-icon-button {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .actions-button,
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
        height: 32px;
    }

    .actions-button {
        transition: transform 0.2s ease-in-out;
    }

    .flyout-container.open .actions-button {
        transform: rotate(90deg);
    }

    .delete-option {
        color: var(--error-color, #db4437);
    }

    .flyout-option:hover {
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

    /* Enhanced Mobile Optimization */
    @media (max-width: 768px) {
        .gallery-header-buttons {
            gap: 8px;
        }

        .gallery-header-buttons ha-icon-button {
            --mdc-icon-button-size: 44px;
            --mdc-icon-size: 24px;
            min-width: 44px;
            min-height: 44px;
        }

        .gallery-nav {
            --mdc-icon-button-size: 56px;
            --mdc-icon-size: 32px;
            padding: 12px;
        }

        .gallery-nav.prev {
            left: 16px;
        }

        .gallery-nav.next {
            right: 16px;
        }

        .thumbnails-scroll {
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            padding: 8px 16px;
            -webkit-overflow-scrolling: touch;
        }

        .thumbnail-group {
            scroll-snap-align: start;
            margin-right: 16px;
        }

        .thumbnail-container {
            height: 72px;
            min-width: 72px;
            touch-action: manipulation;
        }

        .gallery-date {
            font-size: 0.9em;
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .play-pause-button {
            --mdc-icon-button-size: 44px;
            --mdc-icon-size: 24px;
        }
    }

    @media (max-width: 600px) {
        .gallery-date {
            right: 120px;
            font-size: 0.85em;
        }
    }

    @media (max-width: 480px) {
        .gallery-header {
            padding: 12px;
        }

        .gallery-header-buttons ha-icon-button {
            --mdc-icon-button-size: 40px;
            --mdc-icon-size: 20px;
        }

        .gallery-nav {
            --mdc-icon-button-size: 48px;
            --mdc-icon-size: 28px;
        }

        .thumbnail-container {
            height: 64px;
            min-width: 64px;
        }

        .thumbnail-day {
            font-size: 0.7em;
            padding: 1px 4px;
        }

        .gallery-date {
            right: 100px;
            font-size: 0.8em;
        }
    }

    @media (max-width: 400px) {
        .gallery-date {
            right: 90px;
            font-size: 0.75em;
        }

        .gallery-header-buttons ha-icon-button {
            --mdc-icon-button-size: 36px;
            --mdc-icon-size: 18px;
        }
    }

    /* Touch-specific improvements */
    .gallery-nav {
        touch-action: manipulation;
        user-select: none;
    }

    .thumbnail-container {
        cursor: pointer;
        user-select: none;
    }

    .gallery-image-container {
        touch-action: pan-x pan-y;
        user-select: none;
    }

    /* Smooth scrolling for thumbnails */
    .thumbnails-scroll {
        scroll-behavior: smooth;
    }

    /* Improve touch feedback */
    .gallery-nav:active,
    .thumbnail-container:active,
    .gallery-header-buttons ha-icon-button:active {
        opacity: 0.7;
        transform: scale(0.95);
        transition: all 0.1s ease;
    }
`},302:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.historyStyles=void 0;const n=i(437);e.historyStyles=n.css`
    /* ===================================
     * History Container
     * =================================== */
    .history-container {
        margin-top: 16px;
        background: var(--card-background-color, var(--ha-card-background));
        border-radius: 4px;
        overflow: hidden;
        padding: 16px;
    }

    /* ===================================
     * Vertical Timeline
     * =================================== */
    .vertical-timeline {
        position: relative;
        padding: 16px 0;
        margin-left: 8px;
        min-width: 0;
    }

    /* Timeline Line */
    .timeline-line {
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: var(--primary-color);
        opacity: 0.5;
    }

    /* Timeline Items */
    .phase-item {
        position: relative;
        margin: 6px 0;
        padding-left: 32px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    /* Growth Phases haben mehr vertikalen Abstand */
    .phase-item.milestone {
        margin: 16px 0;
    }

    .phase-item:hover {
        padding-left: 34px;
    }

    .phase-dot {
        position: absolute;
        left: 1px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
    }

    /* Größere Punkte für Growth Phases */
    .phase-dot.milestone {
        width: 26px;
        height: 26px;
        left: -6px;
        border: 2px solid white;
    }

    .phase-item:hover .phase-dot {
        transform: translateY(-50%) scale(1.1);
    }

    .dot-icon {
        color: white;
        --mdc-icon-size: 14px;
        opacity: 0.9;
    }

    /* Größere Icons für Growth Phases */
    .milestone .dot-icon {
        --mdc-icon-size: 20px;
    }

    .phase-content {
        background: var(--card-background-color, var(--ha-card-background));
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        transition: box-shadow 0.2s ease;
    }

    /* Kompaktere Inhalte für normale Events */
    .phase-item:not(.milestone) .phase-content {
        padding: 6px 10px;
    }

    /* Hervorgehobene Inhalte für Growth Phases */
    .phase-content.milestone {
        padding: 10px 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        background: linear-gradient(to right, 
            var(--milestone-color, rgba(0,0,0,0.05)) 0%, 
            color-mix(in srgb, var(--milestone-color, rgba(0,0,0,0.05)) 50%, var(--card-background-color, var(--ha-card-background))) 10%, 
            var(--card-background-color, var(--ha-card-background)) 25%);
        background-blend-mode: overlay;
    }

    .phase-item:hover .phase-content {
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }

    .phase-name {
        font-weight: bold;
        font-size: 0.9em;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
    }

    /* Größere Schrift für Growth Phases */
    .milestone .phase-name {
        font-size: 1.05em;
    }

    .phase-date {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 0px;
    }

    /* Journal Container mit Animation */
    .journal-container {
        position: relative;
        height: 0;
        overflow: hidden;
        transition: height 0.3s ease-out, opacity 0.3s ease-out, margin-top 0.3s ease-out;
        opacity: 0;
        margin-top: 0;
        will-change: height, opacity, margin-top;
    }

    .journal-container.expanded {
        height: auto;
        opacity: 1;
        margin-top: 8px;
    }

    .journal-container.closing {
        height: 0 !important;
        opacity: 0;
        margin-top: 0;
        pointer-events: none;
    }

    .phase-description {
        font-size: 0.85em;
        color: var(--primary-text-color);
        opacity: 0.8;
        white-space: pre-wrap;
        word-break: break-word;
    }

    /* ===================================
     * Rechte Timeline Styles
     * =================================== */
    .vertical-timeline.timeline-right {
        margin-left: 0;
        margin-right: 8px;
    }

    .vertical-timeline.timeline-right .timeline-line {
        left: auto;
        right: 8px;
    }

    .vertical-timeline.timeline-right .phase-item {
        padding-left: 0;
        padding-right: 32px;
    }

    .vertical-timeline.timeline-right .phase-item:hover {
        padding-left: 0;
        padding-right: 34px;
    }

    .vertical-timeline.timeline-right .phase-dot {
        left: auto;
        right: 1px;
    }

    .vertical-timeline.timeline-right .phase-dot.milestone {
        left: auto;
        right: -6px;
    }

    .vertical-timeline.timeline-right .phase-content.milestone {
        background: linear-gradient(to left, 
            var(--milestone-color, rgba(0,0,0,0.05)) 0%, 
            color-mix(in srgb, var(--milestone-color, rgba(0,0,0,0.05)) 50%, var(--card-background-color, var(--ha-card-background))) 10%, 
            var(--card-background-color, var(--ha-card-background)) 25%);
    }

    /* ===================================
     * Add Entry Styles
     * =================================== */
    .phase-item.add-item {
        margin-bottom: 4px;
        margin-top: 2px;
    }

    .phase-dot.add-dot {
        width: 18px;
        height: 18px;
        left: -2px;
        border: 2px solid var(--card-background-color, var(--ha-card-background));
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .vertical-timeline.timeline-right .phase-dot.add-dot {
        left: auto;
        right: -2px;
    }

    .add-dot .dot-icon {
        --mdc-icon-size: 12px;
    }

    .phase-content.add-content {
        background: var(--card-background-color, var(--ha-card-background));
        transition: box-shadow 0.3s ease;
        padding: 2px 8px;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }

    .phase-item.add-item:hover .phase-content.add-content {
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }

    /* ===================================
     * Neue Animationen für Add Menu
     * =================================== */
    .add-menu-container {
        position: relative;
        overflow: hidden;
        transition: height 0.4s ease-out;
        height: 0;
    }

    .add-menu-container.expanded {
        height: auto;
    }

    /* Add Menu Options */
    .add-menu-options {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px 0;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }

    .add-menu-options.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .add-option {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 6px;
        border-radius: 4px;
        background-color: var(--card-background-color, var(--ha-card-background));
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s, margin-top 0.3s;
        opacity: 1;
    }

    .add-option:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .add-option.fade-out {
        opacity: 0;
        margin-top: -30px;
        pointer-events: none;
    }

    .add-option.selected {
        opacity: 1;
        transform: translateY(0);
        margin-top: 0;
        position: relative;
        z-index: 2;
        transition: transform 0.4s ease-out, margin-top 0.4s ease-out;
    }

    .add-option.move-to-header {
        transform: translateY(-100%);
        margin-top: -8px;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
    }

    .option-icon {
        --mdc-icon-size: 14px;
        margin-right: 8px;
    }

    .add-option span {
        font-size: 0.8em;
        font-weight: 500;
    }

    /* Add Form Styles */
    .form-content {
        padding: 4px;
        background-color: var(--card-background-color, var(--ha-card-background));
        border-radius: 3px;
        width: 100%;
        box-sizing: border-box;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }

    .form-content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .form-field {
        margin-bottom: 0;
        width: 100%;
        box-sizing: border-box;
    }

    .form-field input,
    .form-field select,
    .form-field textarea {
        width: 100%;
        padding: 3px 5px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 3px;
        background-color: var(--card-background-color, var(--ha-card-background));
        font-size: 0.8em;
        box-sizing: border-box;
    }

    .form-field textarea {
        min-height: 30px;
        max-height: 80px;
        resize: vertical;
        box-sizing: border-box;
    }

    .form-field select {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='rgba(0,0,0,0.5)' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 5px center;
        padding-right: 25px;
        height: auto;
        min-height: 30px;
        cursor: pointer;
        z-index: 10;
        position: relative;
    }

    .form-field select option {
        padding: 5px;
        background-color: var(--card-background-color, var(--ha-card-background));
        color: var(--primary-text-color);
    }

    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 3px;
    }

    .success {
        color: var(--success-color, #4caf50);
    }

    .add-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }

    .add-header.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .add-header-title {
        font-weight: bold;
        font-size: 0.9em;
        display: flex;
        align-items: center;
    }

    .add-header-title ha-icon {
        margin-right: 6px;
        --mdc-icon-size: 16px;
    }

    .journal-submit {
        display: flex;
        justify-content: flex-end;
        margin-top: 4px;
        margin-bottom: 2px;
        margin-right: 2px;
    }

    .journal-submit ha-icon-button {
        --mdc-icon-button-size: 24px;
        --mdc-icon-size: 14px;
        color: white;
        background-color: var(--success-color, #4CAF50);
        border-radius: 50%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        min-width: 24px;
        min-height: 24px;
        padding: 0;
    }

    .journal-submit ha-icon-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 3px rgba(0,0,0,0.2);
    }

    .journal-submit ha-icon-button[disabled] {
        color: rgba(255, 255, 255, 0.5);
        background-color: rgba(76, 175, 80, 0.5);
        box-shadow: none;
    }

    .phase-item.add-item .phase-header {
        margin-bottom: 0;
        padding: 2px 0;
    }

    .phase-item.add-item .phase-name {
        font-size: 0.85em;
    }

    ha-icon-button {
        --mdc-icon-button-size: 24px;
        --mdc-icon-size: 14px;
        color: var(--primary-color);
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        transition: all 0.2s ease;
    }

    ha-icon-button:hover {
        transform: translateY(-1px);
    }

    ha-icon-button[disabled] {
        color: var(--disabled-text-color);
        cursor: not-allowed;
    }

    ha-icon-button.success {
        color: var(--success-color, #4CAF50);
        animation: pulse 0.5s;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`},130:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.DisplayType=void 0,function(t){t.Full="full",t.Compact="compact"}(i||(e.DisplayType=i={}))},429:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.renderAttributeChunks=e.getChunkedDisplayed=e.renderAttribute=e.renderAttributes=e.renderBattery=void 0;const n=i(130),a=i(437),s=i(534),o=i(139),r=i(135);e.renderBattery=t=>{if(!t.config.battery_sensor)return a.html``;const e=t._hass.states[t.config.battery_sensor];if(!e)return a.html``;const i=parseInt(e.state),{icon:n,color:s}=[{threshold:90,icon:"mdi:battery",color:"green"},{threshold:80,icon:"mdi:battery-90",color:"green"},{threshold:70,icon:"mdi:battery-80",color:"green"},{threshold:60,icon:"mdi:battery-70",color:"green"},{threshold:50,icon:"mdi:battery-60",color:"green"},{threshold:40,icon:"mdi:battery-50",color:"green"},{threshold:30,icon:"mdi:battery-40",color:"orange"},{threshold:20,icon:"mdi:battery-30",color:"orange"},{threshold:10,icon:"mdi:battery-20",color:"red"},{threshold:0,icon:"mdi:battery-10",color:"red"},{threshold:-1/0,icon:"mdi:battery-alert-variant-outline",color:"red"}].find((({threshold:t})=>i>t))||{icon:"mdi:battery-alert-variant-outline",color:"red"};return a.html`
        <div class="battery tooltip" @click="${e=>{e.stopPropagation(),(0,r.moreInfo)(t,t.config.battery_sensor)}}">
            <div class="tip">${i}%</div>
            <ha-icon .icon="${n}" style="color: ${s}"></ha-icon>
        </div>
    `},e.renderAttributes=t=>{var i,n,a,s;const r={},l={},c={},d={},h={},u={},p={},m=t.config.show_bars||o.default_show_bars,g=t.selectedPlantEntity||(null===(i=t.config)||void 0===i?void 0:i.entity);if(!g||!t._hass.states[g])return[];if(g.split(".")[1],t.plantinfo&&t.plantinfo.result){const e=t.plantinfo.result;for(const i of m)if(e[i]||"health"===i&&(null===(n=e.helpers)||void 0===n?void 0:n.health)){let n,o,m,g,v,f;if("health"===i){if(!(null===(s=null===(a=e.helpers)||void 0===a?void 0:a.health)||void 0===s?void 0:s.entity_id))continue;const i=t._hass.states[e.helpers.health.entity_id];if(!i)continue;n=5,o=0,m=Number(i.state),g="mdi:heart-pulse",v=i.entity_id,f=""}else({max:n,min:o,current:m,icon:g,sensor:v,unit_of_measurement:f}=e[i]);n=Number(n),o=Number(o),g=String(g),v=String(v),m=Number(m),f=String(f);const _="health"===i?m.toString():t._hass.formatEntityState(t._hass.states[v]).replace(/[^\d,.]/g,"");d[`max_${i}`]={max:n,min:o},h[i]=m,r[i]=g,u[i]=v,c[i]=f,l[i]=f,"dli"===i&&(c.dli="mol/d⋅m²",l.dli='<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>'),p[i]={name:i,current:m,limits:d[`max_${i}`],icon:g,sensor:v,unit_of_measurement:f,display_state:_}}}return(0,e.renderAttributeChunks)(t,p,m)},e.renderAttribute=(t,e)=>{var i;const{max:o,min:l}=e.limits,c=e.unit_of_measurement&&"null"!==e.unit_of_measurement?e.unit_of_measurement:"",d=e.icon||"mdi:help-circle-outline",h=e.current||0,u=!isNaN(h),p=e.display_state,m=(null===(i=t.config.full_width_bars)||void 0===i?void 0:i.includes(e.name))||!1,g=t.config.display_type===n.DisplayType.Compact;if("health"===e.name){const i=Math.floor(2*h);let n;if(i<=5){const t=(i-1)/4;n="rgba(240,163,163,1)",t>=0&&(n=`rgb(${240+15*t}, ${163+51*t}, ${163-163*t})`)}else{const t=(i-5)/5;n=`rgb(${255-212*t}, ${214-20*t}, ${0+83*t})`}const s=Array.from({length:10},((t,e)=>{const i=u&&h>.5*e,s=i?n:"var(--primary-background-color)";return a.html`
                <span class="health-segment ${i?"active":""}" 
                      style="grid-column: ${e+1}; background-color: ${s};">
                </span>
            `})),o=()=>{const i=Math.max(0,h-.5);t._hass.callService("number","set_value",{entity_id:e.sensor,value:i})},r=()=>{const i=Math.min(5,h+.5);t._hass.callService("number","set_value",{entity_id:e.sensor,value:i})};return a.html`
            <div class="attribute ${g||m?"width-100":""} ${m?"full-width":""}" data-attribute="health">
                <ha-icon .icon="${d}" 
                         @click="${t=>{t.stopPropagation(),o()}}">
                </ha-icon>
                <div class="meter green">
                    ${s}
                    <input type="range" 
                           min="0" 
                           max="5" 
                           step="0.5"
                           .value="${h}"
                           @input="${i=>{i.stopPropagation();const n=i.target,a=parseFloat(n.value);t._hass.callService("number","set_value",{entity_id:e.sensor,value:a})}}"
                    >
                </div>
                ${g&&!m?"":a.html`
                    <div class="header" @click="${t=>{t.stopPropagation(),r()}}">
                        <span class="value">${p}</span>
                    </div>
                `}
            </div>
        `}const v=100*Math.max(0,Math.min(1,(h-l)/(o-l))),f=u?c?`${e.name}: ${h} ${c}<br>(${l} ~ ${o} ${c})`:`${e.name}: ${h}<br>(${l} ~ ${o})`:t._hass.localize("state.default.unavailable");let _="";return"dli"===e.name?_='<math style="display: inline-grid;" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mn>mol</mn></mrow><mrow><mn>d</mn><mn>⋅</mn><msup><mn>m</mn><mn>2</mn></msup></mrow></mfrac></mrow></math>':c&&(_=c),a.html`
        <div class="attribute tooltip ${g||m?"width-100":""} ${m?"full-width":""}" data-attribute="${e.name}" @click="${()=>(0,r.moreInfo)(t,e.sensor)}">
            <div class="tip">${(0,s.unsafeHTML)(f)}</div>
            <ha-icon .icon="${d}"></ha-icon>
            <div class="meter red">
                <span class="${u?h<l||h>o?"bad":"good":"unavailable"}" style="width: 100%;"></span>
            </div>
            <div class="meter green">
                <span class="${u?h>o?"bad":"good":"unavailable"}" style="width:${u?v:"0"}%;"></span>
            </div>
            <div class="meter red">
                <span class="bad" style="width:${u?h>o?100:0:"0"}%;"></span>
            </div>
            ${g&&!m?"":a.html`<div class="header"><span class="value">${p}</span>&nbsp;${_?a.html`<span class='unit'>${(0,s.unsafeHTML)(_)}</span>`:""}</div>`}
        </div>
    `},e.getChunkedDisplayed=(t,e,i=[],n=[])=>{const a=[];for(const s of n){const n=t[s];if(n)if(i.includes(s))a.push([n]);else{let t=a.length>0?a[a.length-1]:null;t&&t.length<e&&!i.includes(t[0].name)?t.push(n):a.push([n])}}const s=Object.assign({},t);for(const t of n)delete s[t];const o=Object.values(s);for(let t=0;t<o.length;t++){const n=o[t];if(i.includes(n.name))a.push([n]);else{let t=null;for(let n=a.length-1;n>=0;n--){const s=a[n];if(s.length<e&&!i.includes(s[0].name)){t=s;break}}t&&t.length<e?t.push(n):a.push([n])}}return a},e.renderAttributeChunks=(t,i,s=[])=>{const o=t.config.display_type===n.DisplayType.Compact?1:2,r=t.config.full_width_bars||[],l=(0,e.getChunkedDisplayed)(i,o,r,s),c="attributes "+(t.config.display_type===n.DisplayType.Compact?"width-100":"");return l.map((i=>{const n=1===i.length&&r.includes(i[0].name),s=`${c}${n?" has-full-width-item":""}`;return a.html`<div class="${s}">${i.map((i=>i?a.html`${(0,e.renderAttribute)(t,i)}`:""))}</div>`})).flat()}},139:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getGrowthPhaseIcon=e.plantAttributes=e.missingImage=e.elementOptions=e.default_option_elements=e.default_show_elements=e.default_show_bars=e.CARD_EDITOR_NAME=e.CARD_NAME=void 0,e.CARD_NAME="brokkoli-card",e.CARD_EDITOR_NAME="brokkoli-card-editor",e.default_show_bars=["moisture","conductivity","temperature","illuminance","humidity","dli","water_consumption","fertilizer_consumption","ppfd","power_consumption","energy_consumption","ph","health"],e.default_show_elements=["header","attributes","options"],e.default_option_elements=["attributes","consumption","history","details"],e.elementOptions=[{label:"Header",value:"header"},{label:"Attribute Bars",value:"attributes"},{label:"Options Menu",value:"options"},{label:"Consumption",value:"consumption"},{label:"History",value:"history"},{label:"Details",value:"details"}],e.missingImage="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgYXJpYS1oaWRkZW49InRydWUiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICAgIDxnPgogICAgICA8IS0tP2xpdCQ0MTM0MjMxNjkkLS0+PHBhdGggZD0iTTMsMTNBOSw5IDAgMCwwIDEyLDIyQzEyLDE3IDcuOTcsMTMgMywxM00xMiw1LjVBMi41LDIuNSAwIDAsMSAxNC41LDhBMi41LDIuNSAwIDAsMSAxMiwxMC41QTIuNSwyLjUgMCAwLDEgOS41LDhBMi41LDIuNSAwIDAsMSAxMiw1LjVNNS42LDEwLjI1QTIuNSwyLjUgMCAwLDAgOC4xLDEyLjc1QzguNjMsMTIuNzUgOS4xMiwxMi41OCA5LjUsMTIuMzFDOS41LDEyLjM3IDkuNSwxMi40MyA5LjUsMTIuNUEyLjUsMi41IDAgMCwwIDEyLDE1QTIuNSwyLjUgMCAwLDAgMTQuNSwxMi41QzE0LjUsMTIuNDMgMTQuNSwxMi4zNyAxNC41LDEyLjMxQzE0Ljg4LDEyLjU4IDE1LjM3LDEyLjc1IDE1LjksMTIuNzVDMTcuMjgsMTIuNzUgMTguNCwxMS42MyAxOC40LDEwLjI1QzE4LjQsOS4yNSAxNy44MSw4LjQgMTYuOTcsOEMxNy44MSw3LjYgMTguNCw2Ljc0IDE4LjQsNS43NUMxOC40LDQuMzcgMTcuMjgsMy4yNSAxNS45LDMuMjVDMTUuMzcsMy4yNSAxNC44OCwzLjQxIDE0LjUsMy42OUMxNC41LDMuNjMgMTQuNSwzLjU2IDE0LjUsMy41QTIuNSwyLjUgMCAwLDAgMTIsMUEyLjUsMi41IDAgMCwwIDkuNSwzLjVDOS41LDMuNTYgOS41LDMuNjMgOS41LDMuNjlDOS4xMiwzLjQxIDguNjMsMy4yNSA4LjEsMy4yNUEyLjUsMi41IDAgMCwwIDUuNiw1Ljc1QzUuNiw2Ljc0IDYuMTksNy42IDcuMDMsOEM2LjE5LDguNCA1LjYsOS4yNSA1LjYsMTAuMjVNMTIsMjJBOSw5IDAgMCwwIDIxLDEzQzE2LDEzIDEyLDE3IDEyLDIyWiI+PC9wYXRoPgogICAgICA8L2c+Cjwvc3ZnPgo=",e.plantAttributes=[{label:"Moisture",value:"moisture"},{label:"Conductivity",value:"conductivity"},{label:"Temperature",value:"temperature"},{label:"Illuminance",value:"illuminance"},{label:"Humidity",value:"humidity"},{label:"Daily Light Integral",value:"dli"},{label:"Water Consumption",value:"water_consumption"},{label:"Fertilizer Consumption",value:"fertilizer_consumption"},{label:"PPFD",value:"ppfd"},{label:"Power Consumption",value:"power_consumption"},{label:"Energy Consumption",value:"energy_consumption"},{label:"pH",value:"ph"},{label:"Health",value:"health"}],e.getGrowthPhaseIcon=t=>{switch(t.toLowerCase()){case"samen":return"mdi:seed";case"keimen":return"mdi:seed-outline";case"wurzeln":return"mdi:sprout";case"wachstum":return"mdi:leaf";case"blüte":return"mdi:flower";case"geerntet":return"mdi:content-cut";case"entfernt":return"mdi:delete";default:return"mdi:help-circle"}}},100:function(t,e){var i=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.ImageCacheManager=void 0,e.preloadImages=function(t){return i(this,void 0,void 0,(function*(){const e=n.getInstance(),i=(yield e.preloadBatch(t)).filter((t=>"rejected"===t.status));i.length>0&&console.warn(`Failed to preload ${i.length} out of ${t.length} images`)}))};class n{constructor(){this.cache=new Map,this.loadingPromises=new Map,this.MAX_CACHE_SIZE=20,this.stats={totalRequests:0,cacheHits:0}}static getInstance(){return n.instance||(n.instance=new n),n.instance}preloadImage(t){return i(this,void 0,void 0,(function*(){if(this.stats.totalRequests++,this.cache.has(t))return this.stats.cacheHits++,this.cache.get(t);if(this.loadingPromises.has(t))return this.loadingPromises.get(t);const e=this._loadImage(t);this.loadingPromises.set(t,e);try{const i=yield e;return this._addToCache(t,i),i}catch(e){throw console.warn(`Failed to preload image: ${t}`,e),e}finally{this.loadingPromises.delete(t)}}))}isCached(t){return this.cache.has(t)}getCachedImage(t){return this.cache.get(t)||null}clearCache(){this.cache.clear(),this.loadingPromises.clear(),this.stats={totalRequests:0,cacheHits:0}}getStats(){return{size:this.cache.size,maxSize:this.MAX_CACHE_SIZE,hitRate:this.stats.totalRequests>0?this.stats.cacheHits/this.stats.totalRequests:0,totalRequests:this.stats.totalRequests,cacheHits:this.stats.cacheHits}}preloadBatch(t){return i(this,void 0,void 0,(function*(){const e=t.map((t=>this.preloadImage(t)));return Promise.allSettled(e)}))}_loadImage(t){return i(this,void 0,void 0,(function*(){return new Promise(((e,i)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>i(new Error(`Failed to load image: ${t}`)),n.crossOrigin="anonymous",n.src=t}))}))}_addToCache(t,e){if(this.cache.size>=this.MAX_CACHE_SIZE){const t=this.cache.keys().next().value;t&&this.cache.delete(t)}this.cache.set(t,e)}}e.ImageCacheManager=n},63:function(t,e){var i=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.PlantEntityUtils=void 0;class n{static getPlantInfo(t,e){return i(this,void 0,void 0,(function*(){return this._plantInfoCache[e]?this._plantInfoCache[e]:this._loadPlantInfoWithRetry(t,e)}))}static _loadPlantInfoWithRetry(t,e){return i(this,void 0,void 0,(function*(){try{this._plantLastLoaded[e]=Date.now();const i=yield t.callWS({type:"plant/get_info",entity_id:e}),n="object"==typeof i&&null!==i&&"result"in i?i.result:null;return n&&(this._plantInfoCache[e]=n),this._scheduleNextUpdate(t,e),n}catch(i){return console.error(`[PLANT-ENTITY] Fehler beim API-Call für ${e}:`,i),this._scheduleNextUpdate(t,e,!0),null}}))}static _scheduleNextUpdate(t,e,i=!1){this._plantRetryTimeouts[e]&&(window.clearTimeout(this._plantRetryTimeouts[e]),delete this._plantRetryTimeouts[e]),this._plantRetryTimeouts[e]=window.setTimeout((()=>{delete this._plantRetryTimeouts[e],this._loadPlantInfoWithRetry(t,e)}),i?1e4:5e3)}static initPlantDataLoading(t,e){t&&0!==e.length&&(this.clearAllTimeouts(),e.forEach(((e,i)=>{if(this._plantInfoCache[e])return void(this._plantRetryTimeouts[e]||this._scheduleNextUpdate(t,e));const n=500+2e3*Math.random();this._plantRetryTimeouts[e]=window.setTimeout((()=>{delete this._plantRetryTimeouts[e],this._loadPlantInfoWithRetry(t,e)}),n)})))}static clearAllTimeouts(){Object.values(this._plantRetryTimeouts).forEach((t=>{window.clearTimeout(t)})),this._plantRetryTimeouts={}}static getPlantEntities(t,e="all"){return Object.values(t.states).filter((t=>{if("object"!=typeof t||null===t||!("entity_id"in t)||!("attributes"in t)||"string"!=typeof t.entity_id)return!1;const i=t.entity_id.startsWith("plant."),n=t.entity_id.startsWith("cycle.")&&"member_count"in t.attributes;return"plant"===e?i:"cycle"===e?n:i||n}))}static updatePlantInfo(t,e,n){return i(this,void 0,void 0,(function*(){const i=new Map(n),a=e.map((t=>t.entity_id));this.initPlantDataLoading(t,a);for(const t of e){const e=this._plantInfoCache[t.entity_id];e?i.set(t.entity_id,e):i.has(t.entity_id)||i.set(t.entity_id,null)}return i}))}static togglePlantSelection(t,e,i){null==i||i.stopPropagation();const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}static clearPlantSelection(t){return new Set}}e.PlantEntityUtils=n,n._plantInfoCache={},n._plantRetryTimeouts={},n._plantLastLoaded={}},858:function(t,e){var i,n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(a,s){function o(t){try{l(n.next(t))}catch(t){s(t)}}function r(t){try{l(n.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?a(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.ThumbnailGenerator=void 0,e.generateMobileThumbnail=function(t){const e=window.innerWidth<=768;let i;return i=window.innerWidth<=480?64:e?72:80,a.generateThumbnail(t,{width:i,height:i,quality:e?.7:.8,format:"jpeg"})},e.generateGalleryImage=function(t){const e=window.innerWidth,i=window.innerHeight,n=e<=768;let s,o,r;return e<=480?(s=Math.min(2*e,1200),o=Math.min(1.5*i,900),r=.8):n?(s=Math.min(2*e,1600),o=Math.min(1.5*i,1200),r=.85):(s=Math.min(1.5*e,2400),o=Math.min(1.2*i,1800),r=.9),a.generateThumbnail(t,{width:s,height:o,quality:r,format:"jpeg"})},e.preloadThumbnails=function(t){return n(this,void 0,void 0,(function*(){for(let e=0;e<t.length;e+=5){const i=t.slice(e,e+5);yield a.generateBatch(i),e+5<t.length&&(yield new Promise((t=>setTimeout(t,50))))}}))};class a{static generateThumbnail(t){return n(this,arguments,void 0,(function*(t,e={}){const{width:i=80,height:n=80,quality:a=.8,format:s="jpeg"}=e,o=`${t}_${i}x${n}_${a}_${s}`;if(this.thumbnailCache.has(o))return this.thumbnailCache.get(o);try{const e=yield this._createThumbnail(t,i,n,a,s);return this._addToCache(o,e),e}catch(e){return console.warn(`Failed to generate thumbnail for ${t}:`,e),t}}))}static generateBatch(t){return n(this,arguments,void 0,(function*(t,e={}){const i=t.map((t=>n(this,void 0,void 0,(function*(){return{original:t,thumbnail:yield this.generateThumbnail(t,e)}}))));return(yield Promise.allSettled(i)).filter((t=>"fulfilled"===t.status)).map((t=>t.value))}))}static clearCache(){this.thumbnailCache.forEach((t=>{t.startsWith("blob:")&&URL.revokeObjectURL(t)})),this.thumbnailCache.clear()}static getCacheStats(){return{size:this.thumbnailCache.size,maxSize:this.MAX_CACHE_SIZE}}static _createThumbnail(t,e,i,a,s){return n(this,void 0,void 0,(function*(){return new Promise(((n,o)=>{const r=new Image;r.crossOrigin="anonymous",r.onload=()=>{try{this.canvas.width=e,this.canvas.height=i,e===i?this._drawSquareThumbnail(r,e):this._drawStandardThumbnail(r,e,i);const t="jpeg"===s?"image/jpeg":"webp"===s?"image/webp":"image/png";this.canvas.toBlob((t=>{t?n(URL.createObjectURL(t)):o(new Error("Failed to generate thumbnail blob"))}),t,a)}catch(t){o(t)}},r.onerror=()=>o(new Error(`Failed to load image: ${t}`)),r.src=t}))}))}static _drawSquareThumbnail(t,e){this.ctx.clearRect(0,0,e,e);const i=Math.min(t.width,t.height),n=(t.width-i)/2,a=(t.height-i)/2;this.ctx.drawImage(t,n,a,i,i,0,0,e,e)}static _drawStandardThumbnail(t,e,i){const n=t.width/t.height;let a,s,o=0,r=0;n>e/i?(a=e,s=e/n,r=(i-s)/2):(s=i,a=i*n,o=(e-a)/2),this.ctx.clearRect(0,0,e,i),this.ctx.drawImage(t,o,r,a,s)}static _addToCache(t,e){if(this.thumbnailCache.size>=this.MAX_CACHE_SIZE){const t=this.thumbnailCache.keys().next().value;if(t){const e=this.thumbnailCache.get(t);e&&e.startsWith("blob:")&&URL.revokeObjectURL(e),this.thumbnailCache.delete(t)}}this.thumbnailCache.set(t,e)}}e.ThumbnailGenerator=a,i=a,a.thumbnailCache=new Map,a.MAX_CACHE_SIZE=50,i.canvas=document.createElement("canvas"),i.ctx=i.canvas.getContext("2d")},16:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TouchHandler=void 0,e.createGalleryTouchHandler=function(t,e){return new i(t,{onSwipeLeft:e.onNext,onSwipeRight:e.onPrevious,onSwipeUp:e.onClose,onTap:e.onTogglePlayPause,onDoubleTap:e.onTogglePlayPause})};class i{constructor(t,e){this.startPoints=[],this.lastTapTime=0,this.initialDistance=0,this.isActive=!1,this.SWIPE_THRESHOLD=50,this.SWIPE_MAX_TIME=300,this.TAP_MAX_DISTANCE=10,this.TAP_MAX_TIME=300,this.DOUBLE_TAP_DELAY=300,this.element=t,this.callbacks=e,this.attachListeners()}enable(){this.isActive=!0}disable(){this.isActive=!1}destroy(){this.detachListeners(),this.isActive=!1}attachListeners(){this.element.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.element.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.element.addEventListener("touchend",this.handleTouchEnd.bind(this),{passive:!1}),this.element.addEventListener("touchcancel",this.handleTouchCancel.bind(this),{passive:!1})}detachListeners(){this.element.removeEventListener("touchstart",this.handleTouchStart.bind(this)),this.element.removeEventListener("touchmove",this.handleTouchMove.bind(this)),this.element.removeEventListener("touchend",this.handleTouchEnd.bind(this)),this.element.removeEventListener("touchcancel",this.handleTouchCancel.bind(this))}handleTouchStart(t){this.isActive&&(this.startPoints=Array.from(t.touches).map((t=>({x:t.clientX,y:t.clientY,time:Date.now()}))),2===t.touches.length&&(this.initialDistance=this.getDistance(t.touches[0],t.touches[1])))}handleTouchMove(t){if(this.isActive&&0!==this.startPoints.length)if(2===t.touches.length&&this.callbacks.onPinchZoom){t.preventDefault();const e=this.getDistance(t.touches[0],t.touches[1])/this.initialDistance;this.callbacks.onPinchZoom(e)}else if(1===t.touches.length&&1===this.startPoints.length){const e=Math.abs(t.touches[0].clientX-this.startPoints[0].x),i=Math.abs(t.touches[0].clientY-this.startPoints[0].y);(e>20||i>20)&&t.preventDefault()}}handleTouchEnd(t){if(this.isActive&&0!==this.startPoints.length){if(1===t.changedTouches.length&&1===this.startPoints.length){const e=t.changedTouches[0],i=this.startPoints[0],n=Date.now(),a=e.clientX-i.x,s=e.clientY-i.y,o=n-i.time,r=Math.sqrt(a*a+s*s);r<=this.TAP_MAX_DISTANCE&&o<=this.TAP_MAX_TIME?this.handleTap():o<=this.SWIPE_MAX_TIME&&this.handleSwipe(a,s,r)}this.startPoints=[]}}handleTouchCancel(t){this.startPoints=[]}handleTap(){const t=Date.now();t-this.lastTapTime<=this.DOUBLE_TAP_DELAY&&this.callbacks.onDoubleTap?(this.callbacks.onDoubleTap(),this.lastTapTime=0):(setTimeout((()=>{var t,e;Date.now()-this.lastTapTime>=this.DOUBLE_TAP_DELAY&&(null===(e=(t=this.callbacks).onTap)||void 0===e||e.call(t))}),this.DOUBLE_TAP_DELAY),this.lastTapTime=t)}handleSwipe(t,e,i){i<this.SWIPE_THRESHOLD||(Math.abs(t)>Math.abs(e)?t>0&&this.callbacks.onSwipeRight?this.callbacks.onSwipeRight():t<0&&this.callbacks.onSwipeLeft&&this.callbacks.onSwipeLeft():e>0&&this.callbacks.onSwipeDown?this.callbacks.onSwipeDown():e<0&&this.callbacks.onSwipeUp&&this.callbacks.onSwipeUp())}getDistance(t,e){const i=t.clientX-e.clientX,n=t.clientY-e.clientY;return Math.sqrt(i*i+n*n)}}e.TouchHandler=i},135:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.moreInfo=e.getStubConfig=e.getConfigElement=void 0;const n=i(356),a=i(139);e.getConfigElement=()=>document.createElement("brokkoli-card-editor"),e.getStubConfig=t=>{const e=t=>"object"==typeof t&&"entity_id"in t&&"string"==typeof t.entity_id&&0===t.entity_id.indexOf("plant.")&&!!t;let i=[];try{i=Object.values(t.states).filter(e)}catch(t){console.info(`Unable to get ha-data: ${t}`)}return{entity:i.length>0?i[0].entity_id:"plant.my_plant",battery_sensor:"sensor.myflower_battery",show_bars:a.default_show_bars}},e.moreInfo=(t,e)=>{(0,n.fireEvent)(t,"hass-more-info",{entityId:e},{bubbles:!1,composed:!0})}},823:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>r,LitElement:()=>gt,ReactiveElement:()=>A,_$LE:()=>ft,_$LH:()=>ut,adoptStyles:()=>d,css:()=>c,defaultConverter:()=>$,getCompatibleStyle:()=>h,html:()=>Y,isServer:()=>_t,mathml:()=>K,noChange:()=>Z,notEqual:()=>E,nothing:()=>J,render:()=>mt,supportsAdoptingStyleSheets:()=>a,svg:()=>X,unsafeCSS:()=>l});const n=globalThis,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new r("string"==typeof t?t:t+"",void 0,s),c=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new r(i,t,s)},d=(t,e)=>{if(a)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of e){const e=document.createElement("style"),a=n.litNonce;void 0!==a&&e.setAttribute("nonce",a),e.textContent=i.cssText,t.appendChild(e)}},h=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t,{is:u,defineProperty:p,getOwnPropertyDescriptor:m,getOwnPropertyNames:g,getOwnPropertySymbols:v,getPrototypeOf:f}=Object,_=globalThis,y=_.trustedTypes,b=y?y.emptyScript:"",w=_.reactiveElementPolyfillSupport,x=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},E=(t,e)=>!u(t,e),k={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:E};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=k){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&p(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:a}=m(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return n?.call(this)},set(e){const s=n?.call(this);a.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??k}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...g(t),...v(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=n,this[n]=a.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??E)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[x("elementProperties")]=new Map,A[x("finalized")]=new Map,w?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.0.4");const T=globalThis,S=T.trustedTypes,I=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+C,M=`<${D}>`,O=document,j=()=>O.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,z=t=>N(t)||"function"==typeof t?.[Symbol.iterator],R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,H=/>/g,B=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,W=/"/g,q=/^(?:script|style|textarea|title)$/i,G=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),Y=G(1),X=G(2),K=G(3),Z=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Q=new WeakMap,tt=O.createTreeWalker(O,129);function et(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==I?I.createHTML(e):e}const it=(t,e)=>{const i=t.length-1,n=[];let a,s=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===U?"!--"===l[1]?o=F:void 0!==l[1]?o=H:void 0!==l[2]?(q.test(l[2])&&(a=RegExp("</"+l[2],"g")),o=B):void 0!==l[3]&&(o=B):o===B?">"===l[0]?(o=a??U,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,r=l[1],o=void 0===l[3]?B:'"'===l[3]?W:V):o===W||o===V?o=B:o===F||o===H?o=U:(o=B,a=void 0);const h=o===B&&t[e+1].startsWith("/>")?" ":"";s+=o===U?i+M:c>=0?(n.push(r),i.slice(0,c)+P+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[et(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class nt{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,s=0;const o=t.length-1,r=this.parts,[l,c]=it(t,e);if(this.el=nt.createElement(l,i),tt.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=tt.nextNode())&&r.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(P)){const e=c[s++],i=n.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);r.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?lt:"?"===o[1]?ct:"@"===o[1]?dt:rt}),n.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:a}),n.removeAttribute(t));if(q.test(n.tagName)){const t=n.textContent.split(C),e=t.length-1;if(e>0){n.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],j()),tt.nextNode(),r.push({type:2,index:++a});n.append(t[e],j())}}}else if(8===n.nodeType)if(n.data===D)r.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(C,t+1));)r.push({type:7,index:a}),t+=C.length-1}a++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function at(t,e,i=t,n){if(e===Z)return e;let a=void 0!==n?i._$Co?.[n]:i._$Cl;const s=L(e)?void 0:e._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),void 0===s?a=void 0:(a=new s(t),a._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=a:i._$Cl=a),void 0!==a&&(e=at(t,a._$AS(t,e.values),a,n)),e}class st{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??O).importNode(e,!0);tt.currentNode=n;let a=tt.nextNode(),s=0,o=0,r=i[0];for(;void 0!==r;){if(s===r.index){let e;2===r.type?e=new ot(a,a.nextSibling,this,t):1===r.type?e=new r.ctor(a,r.name,r.strings,this,t):6===r.type&&(e=new ht(a,this,t)),this._$AV.push(e),r=i[++o]}s!==r?.index&&(a=tt.nextNode(),s++)}return tt.currentNode=O,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class ot{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),L(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==Z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):z(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=nt.createElement(et(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new st(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Q.get(t.strings);return void 0===e&&Q.set(t.strings,e=new nt(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new ot(this.O(j()),this.O(j()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class rt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,a){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(t,e=this,i,n){const a=this.strings;let s=!1;if(void 0===a)t=at(this,t,e,0),s=!L(t)||t!==this._$AH&&t!==Z,s&&(this._$AH=t);else{const n=t;let o,r;for(t=a[0],o=0;o<a.length-1;o++)r=at(this,n[i+o],e,o),r===Z&&(r=this._$AH[o]),s||=!L(r)||r!==this._$AH[o],r===J?t=J:t!==J&&(t+=(r??"")+a[o+1]),this._$AH[o]=r}s&&!n&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class lt extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class ct extends rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class dt extends rt{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??J)===Z)return;const i=this._$AH,n=t===J&&i!==J||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==J&&(i===J||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ht{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}}const ut={M:P,P:C,A:D,C:1,L:it,R:st,D:z,V:at,I:ot,H:rt,N:ct,U:dt,B:lt,F:ht},pt=T.litHtmlPolyfillSupport;pt?.(nt,ot),(T.litHtmlVersions??=[]).push("3.2.1");const mt=(t,e,i)=>{const n=i?.renderBefore??e;let a=n._$litPart$;if(void 0===a){const t=i?.renderBefore??null;n._$litPart$=a=new ot(e.insertBefore(j(),t),t,void 0,i??{})}return a._$AI(t),a};class gt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}gt._$litElement$=!0,gt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:gt});const vt=globalThis.litElementPolyfillSupport;vt?.({LitElement:gt});const ft={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(globalThis.litElementVersions??=[]).push("4.1.1");const _t=!1},752:(t,e,i)=>{var n;i.d(e,{JW:()=>A,XX:()=>W,c0:()=>T,ge:()=>B,qy:()=>k,s6:()=>S});const a=window,s=a.trustedTypes,o=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,r="$lit$",l=`lit$${(Math.random()+"").slice(9)}$`,c="?"+l,d=`<${c}>`,h=document,u=()=>h.createComment(""),p=t=>null===t||"object"!=typeof t&&"function"!=typeof t,m=Array.isArray,g=t=>m(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,y=/>/g,b=RegExp(`>|${v}(?:([^\\s"'>=/]+)(${v}*=${v}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),w=/'/g,x=/"/g,$=/^(?:script|style|textarea|title)$/i,E=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),k=E(1),A=E(2),T=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),I=new WeakMap,P=h.createTreeWalker(h,129,null,!1);function C(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==o?o.createHTML(e):e}const D=(t,e)=>{const i=t.length-1,n=[];let a,s=2===e?"<svg>":"",o=f;for(let e=0;e<i;e++){const i=t[e];let c,h,u=-1,p=0;for(;p<i.length&&(o.lastIndex=p,h=o.exec(i),null!==h);)p=o.lastIndex,o===f?"!--"===h[1]?o=_:void 0!==h[1]?o=y:void 0!==h[2]?($.test(h[2])&&(a=RegExp("</"+h[2],"g")),o=b):void 0!==h[3]&&(o=b):o===b?">"===h[0]?(o=null!=a?a:f,u=-1):void 0===h[1]?u=-2:(u=o.lastIndex-h[2].length,c=h[1],o=void 0===h[3]?b:'"'===h[3]?x:w):o===x||o===w?o=b:o===_||o===y?o=f:(o=b,a=void 0);const m=o===b&&t[e+1].startsWith("/>")?" ":"";s+=o===f?i+d:u>=0?(n.push(c),i.slice(0,u)+r+i.slice(u)+l+m):i+l+(-2===u?(n.push(void 0),e):m)}return[C(t,s+(t[i]||"<?>")+(2===e?"</svg>":"")),n]};class M{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,o=0;const d=t.length-1,h=this.parts,[p,m]=D(t,e);if(this.el=M.createElement(p,i),P.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=P.nextNode())&&h.length<d;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith(r)||e.startsWith(l)){const i=m[o++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+r).split(l),e=/([.?@])?(.*)/.exec(i);h.push({type:1,index:a,name:e[2],strings:t,ctor:"."===e[1]?z:"?"===e[1]?U:"@"===e[1]?F:N})}else h.push({type:6,index:a})}for(const e of t)n.removeAttribute(e)}if($.test(n.tagName)){const t=n.textContent.split(l),e=t.length-1;if(e>0){n.textContent=s?s.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],u()),P.nextNode(),h.push({type:2,index:++a});n.append(t[e],u())}}}else if(8===n.nodeType)if(n.data===c)h.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(l,t+1));)h.push({type:7,index:a}),t+=l.length-1}a++}}static createElement(t,e){const i=h.createElement("template");return i.innerHTML=t,i}}function O(t,e,i=t,n){var a,s,o,r;if(e===T)return e;let l=void 0!==n?null===(a=i._$Co)||void 0===a?void 0:a[n]:i._$Cl;const c=p(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,n)),void 0!==n?(null!==(o=(r=i)._$Co)&&void 0!==o?o:r._$Co=[])[n]=l:i._$Cl=l),void 0!==l&&(e=O(t,l._$AS(t,e.values),l,n)),e}class j{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:n}=this._$AD,a=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:h).importNode(i,!0);P.currentNode=a;let s=P.nextNode(),o=0,r=0,l=n[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new L(s,s.nextSibling,this,t):1===l.type?e=new l.ctor(s,l.name,l.strings,this,t):6===l.type&&(e=new H(s,this,t)),this._$AV.push(e),l=n[++r]}o!==(null==l?void 0:l.index)&&(s=P.nextNode(),o++)}return P.currentNode=h,a}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{constructor(t,e,i,n){var a;this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=null===(a=null==n?void 0:n.isConnected)||void 0===a||a}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=O(this,t,e),p(t)?t===S||null==t||""===t?(this._$AH!==S&&this._$AR(),this._$AH=S):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):g(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==S&&p(this._$AH)?this._$AA.nextSibling.data=t:this.$(h.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:n}=t,a="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=M.createElement(C(n.h,n.h[0]),this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===a)this._$AH.v(i);else{const t=new j(a,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new M(t)),e}T(t){m(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new L(this.k(u()),this.k(u()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class N{constructor(t,e,i,n,a){this.type=1,this._$AH=S,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=S}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const a=this.strings;let s=!1;if(void 0===a)t=O(this,t,e,0),s=!p(t)||t!==this._$AH&&t!==T,s&&(this._$AH=t);else{const n=t;let o,r;for(t=a[0],o=0;o<a.length-1;o++)r=O(this,n[i+o],e,o),r===T&&(r=this._$AH[o]),s||(s=!p(r)||r!==this._$AH[o]),r===S?t=S:t!==S&&(t+=(null!=r?r:"")+a[o+1]),this._$AH[o]=r}s&&!n&&this.j(t)}j(t){t===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class z extends N{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===S?void 0:t}}const R=s?s.emptyScript:"";class U extends N{constructor(){super(...arguments),this.type=4}j(t){t&&t!==S?this.element.setAttribute(this.name,R):this.element.removeAttribute(this.name)}}class F extends N{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=O(this,t,e,0))&&void 0!==i?i:S)===T)return;const n=this._$AH,a=t===S&&n!==S||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==S&&(n===S||a);a&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class H{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){O(this,t)}}const B={O:r,P:l,A:c,C:1,M:D,L:j,R:g,D:O,I:L,V:N,H:U,N:F,U:z,F:H},V=a.litHtmlPolyfillSupport;null==V||V(M,L),(null!==(n=a.litHtmlVersions)&&void 0!==n?n:a.litHtmlVersions=[]).push("2.8.0");const W=(t,e,i)=>{var n,a;const s=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let o=s._$litPart$;if(void 0===o){const t=null!==(a=null==i?void 0:i.renderBefore)&&void 0!==a?a:null;s._$litPart$=o=new L(e.insertBefore(u(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o}},924:(t,e,i)=>{i.r(e),i.d(e,{customElement:()=>n,eventOptions:()=>c,property:()=>o,query:()=>d,queryAll:()=>h,queryAssignedElements:()=>g,queryAssignedNodes:()=>v,queryAsync:()=>u,state:()=>r});const n=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){customElements.define(t,e)}}})(t,e),a=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}},s=(t,e,i)=>{e.constructor.createProperty(i,t)};function o(t){return(e,i)=>void 0!==i?s(t,e,i):a(t,e)}function r(t){return o({...t,state:!0})}const l=({finisher:t,descriptor:e})=>(i,n)=>{var a;if(void 0===n){const n=null!==(a=i.originalKey)&&void 0!==a?a:i.key,s=null!=e?{kind:"method",placement:"prototype",key:n,descriptor:e(i.key)}:{...i,key:n};return null!=t&&(s.finisher=function(e){t(e,n)}),s}{const a=i.constructor;void 0!==e&&Object.defineProperty(i,n,e(n)),null==t||t(a,n)}};function c(t){return l({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}function d(t,e){return l({descriptor:i=>{const n={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;n.get=function(){var i,n;return void 0===this[e]&&(this[e]=null!==(n=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==n?n:null),this[e]}}return n}})}function h(t){return l({descriptor:e=>({get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelectorAll(t))&&void 0!==i?i:[]},enumerable:!0,configurable:!0})})}function u(t){return l({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}var p;const m=null!=(null===(p=window.HTMLSlotElement)||void 0===p?void 0:p.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function g(t){const{slot:e,selector:i}=null!=t?t:{};return l({descriptor:n=>({get(){var n;const a="slot"+(e?`[name=${e}]`:":not([name])"),s=null===(n=this.renderRoot)||void 0===n?void 0:n.querySelector(a),o=null!=s?m(s,t):[];return i?o.filter((t=>t.matches(i))):o},enumerable:!0,configurable:!0})})}function v(t,e,i){let n,a=t;return"object"==typeof t?(a=t.slot,n=t):n={flatten:e},i?g({slot:a,flatten:e,selector:i}):l({descriptor:t=>({get(){var t,e;const i="slot"+(a?`[name=${a}]`:":not([name])"),s=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==s?void 0:s.assignedNodes(n))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}},534:(t,e,i)=>{i.r(e),i.d(e,{UnsafeHTMLDirective:()=>s,unsafeHTML:()=>o});var n=i(752);class a{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class s extends a{constructor(t){if(super(t),this.et=n.s6,2!==t.type)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===n.s6||null==t)return this.ft=void 0,this.et=t;if(t===n.c0)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}s.directiveName="unsafeHTML",s.resultType=1;const o=(r=s,(...t)=>({_$litDirective$:r,values:t}));var r},437:(t,e,i)=>{i.r(e),i.d(e,{CSSResult:()=>r,LitElement:()=>A,ReactiveElement:()=>w,UpdatingElement:()=>k,_$LE:()=>S,_$LH:()=>E.ge,adoptStyles:()=>d,css:()=>c,defaultConverter:()=>f,getCompatibleStyle:()=>h,html:()=>E.qy,isServer:()=>I,noChange:()=>E.c0,notEqual:()=>_,nothing:()=>E.s6,render:()=>E.XX,supportsAdoptingStyleSheets:()=>a,svg:()=>E.JW,unsafeCSS:()=>l});const n=window,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const l=t=>new r("string"==typeof t?t:t+"",void 0,s),c=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new r(i,t,s)},d=(t,e)=>{a?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),a=n.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=e.cssText,t.appendChild(i)}))},h=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return l(e)})(t):t;var u;const p=window,m=p.trustedTypes,g=m?m.emptyScript:"",v=p.reactiveElementPolyfillSupport,f={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:_},b="finalized";class w extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const n=this._$Ep(i,e);void 0!==n&&(this._$Ev.set(n,i),t.push(n))})),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const a=this[t];this[e]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty(b))return!1;this[b]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=y){var n;const a=this.constructor._$Ep(t,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==(null===(n=i.converter)||void 0===n?void 0:n.toAttribute)?i.converter:f).toAttribute(e,i.type);this._$El=t,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,a=n._$Ev.get(t);if(void 0!==a&&this._$El!==a){const t=n.getPropertyOptions(a),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:f;this._$El=a,this[a]=s.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||_)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}w[b]=!0,w.elementProperties=new Map,w.elementStyles=[],w.shadowRootOptions={mode:"open"},null==v||v({ReactiveElement:w}),(null!==(u=p.reactiveElementVersions)&&void 0!==u?u:p.reactiveElementVersions=[]).push("1.6.3");var x,$,E=i(752);const k=w;class A extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,E.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return E.c0}}A.finalized=!0,A._$litElement$=!0,null===(x=globalThis.litElementHydrateSupport)||void 0===x||x.call(globalThis,{LitElement:A});const T=globalThis.litElementPolyfillSupport;null==T||T({LitElement:A});const S={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==($=globalThis.litElementVersions)&&void 0!==$?$:globalThis.litElementVersions=[]).push("3.3.3");const I=!1},330:t=>{t.exports=JSON.parse('{"name":"brokkoli-card","version":"3.0.0","description":"A Lovelace brokkoli card for Home Assistant","main":"brokkoli-card.js","repository":{"type":"git","url":"git+ssh://git@github.com/Olen/lovelace-brokkoli-card.git"},"author":"Ola Bjorling Erdal <ola@bjorling.se>","license":"MIT","scripts":{"build":"webpack -c webpack.config.js","lint":"eslint src/**/*.ts","watch":"webpack -c webpack.config.js --watch --mode=development"},"dependencies":{"@marcokreeft/ha-editor-formbuilder":"2024.9.1","@mdi/js":"^7.4.47","custom-card-helpers":"^1.9.0","flatpickr":"^4.6.13","home-assistant-js-websocket":"^9.4.0","lit":"^2.8.0","lit-element":"^2.5.1"},"devDependencies":{"@babel/core":"^7.26.0","@babel/preset-env":"^7.26.0","@babel/preset-typescript":"^7.26.0","@types/node":"^20.11.30","@typescript-eslint/eslint-plugin":"^8.19.1","apexcharts":"^4.4.0","babel-loader":"^9.1.3","compression-webpack-plugin":"^11.1.0","css-loader":"^7.1.2","eslint":"^8.57.0","style-loader":"^4.0.0","ts-loader":"^9.5.2","typescript":"^5.7.3","webpack":"^5.97.1","webpack-cli":"^5.1.4"},"keywords":[],"bugs":{"url":"https://github.com/Olen/lovelace-brokkoli-card/issues"},"homepage":"https://github.com/Olen/lovelace-brokkoli-card#readme"}')}},e={};function i(n){var a=e[n];if(void 0!==a)return a.exports;var s=e[n]={exports:{}};return t[n].call(s.exports,s,s.exports,i),s.exports}i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(828)})();