import { html, HTMLTemplateResult } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity, BrokkoliListCardConfig } from '../types/brokkoli-list-card-types';
import { FilterState } from './filter-utils';
import { SensorUtils } from './sensor-utils';
import { FilterUtils } from './filter-utils';

export class BrokkoliListComponents {
    static renderHeader(title: string | undefined): HTMLTemplateResult {
        if (title === '') return html``;
        
        return html`
            <div class="card-header">
                <div class="name">${title || 'Pflanzenübersicht'}</div>
            </div>
        `;
    }

    static renderToolbar(
        config: BrokkoliListCardConfig,
        searchQuery: string,
        filterMode: boolean,
        multiSelectMode: boolean,
        onFilterToggle: () => void,
        onMultiSelectToggle: () => void,
        onSearch: (e: Event) => void,
        onSearchReset: () => void
    ): HTMLTemplateResult {
        if (!config?.multiselect?.enabled && !config?.search?.enabled && !config?.filter?.enabled) {
            return html``;
        }

        return html`
            <div class="toolbar">
                ${config?.filter?.enabled ? html`
                    <ha-icon-button
                        .label=${filterMode ? "Filter schließen" : "Filter"}
                        @click=${onFilterToggle}
                    >
                        <ha-icon icon="mdi:${filterMode ? "filter-off" : "filter"}"></ha-icon>
                    </ha-icon-button>
                ` : ""}
                ${config?.multiselect?.enabled ? html`
                    <ha-icon-button
                        .label=${multiSelectMode ? "Mehrfachauswahl beenden" : "Mehrfachauswahl"}
                        @click=${onMultiSelectToggle}
                    >
                        <ha-icon icon="mdi:${multiSelectMode ? "close" : "checkbox-multiple-outline"}"></ha-icon>
                    </ha-icon-button>
                ` : ""}
                ${config?.search?.enabled ? html`
                    <div class="search-container">
                        <ha-icon icon="mdi:magnify"></ha-icon>
                        <input
                            type="text"
                            .value=${searchQuery}
                            placeholder="${config?.search?.placeholder || "Suche..."}"
                            @input=${onSearch}
                        >
                        ${searchQuery ? html`
                            <ha-icon-button
                                .label=${"Suche zurücksetzen"}
                                @click=${onSearchReset}
                            >
                                <ha-icon icon="mdi:close"></ha-icon>
                            </ha-icon-button>
                        ` : ""}
                    </div>
                ` : ""}
            </div>
        `;
    }

    static renderTableHeader(
        columns: Array<{id: string, name: string}>,
        multiSelectMode: boolean,
        sortColumn: string,
        sortDirection: 'asc' | 'desc',
        onSort: (columnId: string) => void
    ): HTMLTemplateResult {
        return html`
            <thead>
                <tr>
                    ${multiSelectMode ? html`
                        <th class="checkbox-column"></th>
                    ` : ''}
                    ${columns.map(column => html`
                        <th @click=${() => onSort(column.id)} data-column="${column.id}">
                            ${column.name}
                            ${sortColumn === column.id ? 
                                html`<ha-icon icon="mdi:${sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}"></ha-icon>` : ''}
                        </th>
                    `)}
                </tr>
            </thead>
        `;
    }

    static renderTableRow(
        plant: HomeAssistantEntity,
        columns: Array<{id: string, name: string}>,
        multiSelectMode: boolean,
        selectedPlants: Set<string>,
        onPlantSelect: (entityId: string, event: Event) => void,
        onCellClick: (event: Event, plant: HomeAssistantEntity, columnId: string) => void,
        onRowClick: (event: Event, plant: HomeAssistantEntity) => void,
        getCursorStyle: (columnId: string) => string,
        getCellValue: (plant: HomeAssistantEntity, columnId: string) => string | HTMLTemplateResult
    ): HTMLTemplateResult {
        return html`
            <tr>
                ${multiSelectMode ? html`
                    <td>
                        <input 
                            type="checkbox"
                            .checked=${selectedPlants.has(plant.entity_id)}
                            @change=${(e: Event) => onPlantSelect(plant.entity_id, e)}
                            class="row-select"
                        >
                    </td>
                ` : ''}
                ${columns.map(column => html`
                    <td data-column="${column.id}" 
                        @click=${(e: Event) => {
                            if (multiSelectMode && selectedPlants.size > 0) {
                                onCellClick(e, plant, column.id);
                            } else if (!multiSelectMode) {
                                onRowClick(e, plant);
                            }
                        }}
                        style="cursor: ${getCursorStyle(column.id)}"
                    >
                        ${getCellValue(plant, column.id)}
                    </td>
                `)}
            </tr>
        `;
    }

    static renderFilterSidebar(
        columns: Array<{id: string, name: string}>,
        filterState: FilterState,
        onEntityTypeToggle: (type: string) => void,
        onFilterToggle: (column: string, value: string | { min: number; max: number }) => void,
        hass: HomeAssistant,
        plantEntities: HomeAssistantEntity[]
    ): HTMLTemplateResult {
        return html`
            <div class="filter-sidebar">
                ${columns.map(column => html`
                    ${column.id === columns[0].id ? html`
                        <div class="filter-group entity-type-filter">
                            <div class="filter-header">Entity Typ</div>
                            <label class="filter-item">
                                <input type="checkbox"
                                    .checked=${filterState.entityTypes.has('plant')}
                                    @change=${() => onEntityTypeToggle('plant')}
                                >
                                Pflanzen
                            </label>
                            <label class="filter-item">
                                <input type="checkbox"
                                    .checked=${filterState.entityTypes.has('cycle')}
                                    @change=${() => onEntityTypeToggle('cycle')}
                                >
                                Cycles
                            </label>
                        </div>
                    ` : ''}
                    ${this.renderColumnFilter(column, filterState, onFilterToggle, hass, plantEntities)}
                `)}
            </div>
        `;
    }

    private static renderColumnFilter(
        column: {id: string, name: string},
        filterState: FilterState,
        onFilterToggle: (column: string, value: string | { min: number; max: number }) => void,
        hass: HomeAssistant,
        plantEntities: HomeAssistantEntity[]
    ): HTMLTemplateResult {
        if (SensorUtils.isSensorColumn(column.id)) {
            const range = SensorUtils.getSensorRange(hass, plantEntities, column.id);
            const currentFilter = filterState.activeFilters[column.id] as { min: number; max: number } || range;
            return html`
                <div class="filter-range">
                    <div class="filter-header">${column.name}</div>
                    <div class="filter-range-inputs">
                        <input
                            class="filter-input"
                            type="number"
                            .value=${currentFilter.min}
                            @change=${(e: Event) => {
                                const input = e.target as HTMLInputElement;
                                const value = Number(input.value);
                                onFilterToggle(column.id, {
                                    min: value,
                                    max: (filterState.activeFilters[column.id] as { min: number; max: number })?.max || range.max
                                });
                            }}
                            step="0.1"
                        >
                        <span>bis</span>
                        <input
                            class="filter-input"
                            type="number"
                            .value=${currentFilter.max}
                            @change=${(e: Event) => {
                                const input = e.target as HTMLInputElement;
                                const value = Number(input.value);
                                onFilterToggle(column.id, {
                                    min: (filterState.activeFilters[column.id] as { min: number; max: number })?.min || range.min,
                                    max: value
                                });
                            }}
                            step="0.1"
                        >
                        <span>${range.unit}</span>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="filter-group">
                <div class="filter-header">${column.name}</div>
                ${FilterUtils.getUniqueValues(hass, plantEntities, column.id).map(value => html`
                    <label class="filter-item">
                        <input type="checkbox"
                            .checked=${(filterState.activeFilters[column.id] as Set<string>)?.has(value) || false}
                            @change=${() => onFilterToggle(column.id, value)}
                        >
                        ${value}
                    </label>
                `)}
            </div>
        `;
    }

    static renderAddPlantButton(onButtonClick: () => void): HTMLTemplateResult {
        return html`
            <tr class="add-plant-row">
                <td colspan="100%">
                    <div class="add-plant-text" @click=${onButtonClick}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        <span>Neue Pflanze hinzufügen</span>
                    </div>
                </td>
            </tr>
        `;
    }
} 