import { html, HTMLTemplateResult } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';
import { CellTypeUtils } from './cell-type-utils';
import { FilterUtils } from './filter-utils';
import { TemplateUtils } from './template-utils';
import { getFieldDefinition } from './field-definitions';

interface CellRenderOptions {
    hass: HomeAssistant;
    plant: HomeAssistantEntity;
    columnId: string;
    editingCell: {entityId: string, column: string} | null;
    onCellClick: (e: Event) => void;
    onInputUpdate: (e: Event | KeyboardEvent, type: 'number' | 'select' | 'text' | 'date') => void;
    onRowClick: (e: Event) => void;
}

interface TemplateOptions {
    hass: HomeAssistant;
    plant: HomeAssistantEntity;
    columnId: string;
    onInput: (e: Event | KeyboardEvent, type: 'number' | 'select' | 'text' | 'date') => void;
    onClick: (e: Event) => void;
    onRowClick: (e: Event) => void;
}

export class CellRenderer {
    static renderCell(options: CellRenderOptions): HTMLTemplateResult {
        const { hass, plant, columnId, editingCell, onCellClick, onInputUpdate, onRowClick } = options;
        const plantName = plant.entity_id.split('.')[1];
        const templateOptions: TemplateOptions = {
            hass,
            plant,
            columnId,
            onInput: (e, type) => onInputUpdate(e, type),
            onClick: onCellClick,
            onRowClick
        };

        // Wenn die Zelle bearbeitet wird
        if (editingCell?.entityId === plant.entity_id && editingCell?.column === columnId) {
            return this.renderEditingCell(plantName, columnId, hass, templateOptions);
        }

        // Normale Zellenansicht
        return this.renderNormalCell(plantName, columnId, hass, plant, templateOptions);
    }

    private static renderEditingCell(
        plantName: string,
        columnId: string,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const plant = templateOptions.plant;
        
        // Funktion, um die korrekte Entity-ID aus der Sensor-Map zu erhalten
        const getEntityFromSensorMap = (type: string): string | undefined => {
            if (plant.attributes._sensorMap && plant.attributes._sensorMap[type]) {
                return plant.attributes._sensorMap[type];
            }
            return undefined;
        };

        // Für alle Felder: Nur rendern, wenn ein entsprechender Eintrag in der Sensor-Map existiert

        if (CellTypeUtils.isDateInput(columnId)) {
            const phaseEntityId = getEntityFromSensorMap('growth_phase');
            if (!phaseEntityId) return html`<span>Sensor-Map fehlt</span>`;
            
            const phaseEntity = hass?.states[phaseEntityId];
            return TemplateUtils.renderDateInput(phaseEntity?.attributes[columnId], templateOptions);
        }

        if (CellTypeUtils.isDurationInput(columnId)) {
            const phaseEntityId = getEntityFromSensorMap('growth_phase');
            if (!phaseEntityId) return html`<span>Sensor-Map fehlt</span>`;
            
            const phaseEntity = hass?.states[phaseEntityId];
            return TemplateUtils.renderNumberInput(phaseEntity?.attributes[columnId], 'Tage', templateOptions, 1);
        }

        if (CellTypeUtils.isNumberInput(columnId)) {
            const entityId = getEntityFromSensorMap(columnId);
            if (!entityId) return html`<span>Sensor-Map fehlt</span>`;
            
            const entity = hass?.states[entityId];
            const unit = this.getNumberInputUnit(columnId, entity);
            return TemplateUtils.renderNumberInput(entity?.state, unit, templateOptions);
        }

        if (CellTypeUtils.isSelectInput(columnId)) {
            // SelectInput-Methode kümmert sich selbst um die Sensor-Map-Prüfung
            return this.renderSelectInput(columnId, plantName, hass, templateOptions);
        }

        if (CellTypeUtils.isTextInput(columnId) || CellTypeUtils.isTextArea(columnId)) {
            return TemplateUtils.renderTextInput(
                templateOptions.plant.attributes[columnId],
                templateOptions,
                CellTypeUtils.isTextArea(columnId)
            );
        }

        return html``;
    }

    private static renderNormalCell(
        plantName: string,
        columnId: string,
        hass: HomeAssistant,
        plant: HomeAssistantEntity,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const field = getFieldDefinition(columnId);
        
        // Spezielle Formatierung für Datumsfelder
        if (CellTypeUtils.isDateInput(columnId)) {
            return this.renderDateValue(plantName, columnId, hass, templateOptions);
        }

        // Spezielle Formatierung für Dauerfelder
        if (CellTypeUtils.isDurationInput(columnId)) {
            // Nur Entity-ID aus Sensor-Map verwenden
            let phaseEntity;
            if (plant.attributes._sensorMap && plant.attributes._sensorMap['growth_phase']) {
                const entityId = plant.attributes._sensorMap['growth_phase'];
                phaseEntity = hass?.states[entityId];
                const duration = phaseEntity?.attributes[columnId];
                return html`
                    <span @click=${templateOptions.onClick}>
                        ${duration ? `${duration} Tage` : '-'}
                    </span>
                `;
            }
            // Wenn nicht in Sensor-Map, zeige Platzhalter
            return html`<span @click=${templateOptions.onClick}>-</span>`;
        }

        // Sensoren mit Status-Bar
        if (field?.isSensor && field.showStatusBar) {
            return TemplateUtils.renderSensorCell(templateOptions);
        }

        // Sensoren ohne Status-Bar
        if (field?.isSensor && !field.showStatusBar) {
            // Nur Entity-ID aus Sensor-Map verwenden
            let entity;
            if (plant.attributes._sensorMap && plant.attributes._sensorMap[columnId]) {
                const entityId = plant.attributes._sensorMap[columnId];
                entity = hass?.states[entityId];
                return html`
                    <span @click=${templateOptions.onClick}>
                        ${entity ? `${entity.state} ${entity.attributes.unit_of_measurement || field.unit || ''}` : '-'}
                    </span>
                `;
            }
            // Wenn nicht in Sensor-Map, zeige Platzhalter
            return html`<span @click=${templateOptions.onClick}>-</span>`;
        }

        switch (columnId) {
            case 'friendly_name':
                return TemplateUtils.renderPlantName(
                    plant.attributes.friendly_name,
                    plant.attributes.entity_picture,
                    templateOptions
                );

            case 'state':
                return TemplateUtils.renderBadge(plant.state, templateOptions, 'status');

            case 'cycle':
                return this.renderCycleValue(plantName, plant, hass, templateOptions);

            case 'area':
                return this.renderAreaValue(plant, hass, templateOptions);

            case 'growth_phase':
                return this.renderGrowthPhaseValue(plantName, hass, templateOptions);

            case 'pot_size':
            case 'flowering_duration':
                return this.renderMeasurementValue(plantName, columnId, hass, templateOptions);

            case 'website':
                return TemplateUtils.renderWebsiteCell(
                    plant.attributes.website,
                    templateOptions,
                    false
                );

            default:
                return this.renderDefaultValue(columnId, plant, templateOptions);
        }
    }

    private static getNumberInputUnit(columnId: string, entity?: Record<string, any>): string {
        return columnId === 'flowering_duration' ? 'Tage' : 
               columnId === 'pot_size' ? 'L' : 
               entity?.attributes.unit_of_measurement || '';
    }

    private static renderSelectInput(
        columnId: string,
        plantName: string,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        let options: string[] = [];
        let value: string | undefined;
        const plant = templateOptions.plant;

        if (columnId === 'growth_phase') {
            // Nur Entity-ID aus Sensor-Map verwenden
            if (plant.attributes._sensorMap && plant.attributes._sensorMap['growth_phase']) {
                const entityId = plant.attributes._sensorMap['growth_phase'];
                const entity = hass?.states[entityId];
                options = CellTypeUtils.getGrowthPhaseOptions(hass, plant);
                value = entity?.state;
            }
        } else if (columnId === 'cycle') {
            // Nur Entity-ID aus Sensor-Map verwenden
            if (plant.attributes._sensorMap && plant.attributes._sensorMap['cycle']) {
                const entityId = plant.attributes._sensorMap['cycle'];
                const entity = hass?.states[entityId];
                options = CellTypeUtils.getCycleOptions(hass, plant);
                value = entity?.state;
            }
        } else if (columnId === 'area') {
            const areaId = FilterUtils.getAreaForEntity(hass, templateOptions.plant.entity_id);
            value = areaId ? hass?.areas[areaId]?.name : '';
            options = CellTypeUtils.getAreaOptions(hass);
        }

        return TemplateUtils.renderSelectInput(
            value,
            options,
            templateOptions,
            `${columnId}-select`
        );
    }

    private static renderDateValue(
        plantName: string,
        columnId: string,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const plant = templateOptions.plant;
        // Nur Entity-ID aus Sensor-Map verwenden
        if (plant.attributes._sensorMap && plant.attributes._sensorMap['growth_phase']) {
            const entityId = plant.attributes._sensorMap['growth_phase'];
            const phaseEntity = hass?.states[entityId];
            const dateValue = phaseEntity?.attributes[columnId];
            if (dateValue) {
                const date = new Date(dateValue);
                return html`
                    <span @click=${templateOptions.onClick}>
                        ${date.toLocaleDateString('de-DE')}
                    </span>
                `;
            }
        }
        return html`<span @click=${templateOptions.onClick}>-</span>`;
    }

    private static renderCycleValue(
        plantName: string,
        plant: HomeAssistantEntity,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        if (plant.entity_id.startsWith('cycle.')) {
            return html`${plant.attributes.member_count || 0} Mitglieder`;
        }
        // Nur Entity-ID aus Sensor-Map verwenden
        if (plant.attributes._sensorMap && plant.attributes._sensorMap['cycle']) {
            const entityId = plant.attributes._sensorMap['cycle'];
            const cycleEntity = hass?.states[entityId];
            return TemplateUtils.renderBadge(cycleEntity?.state, templateOptions, 'cycle');
        }
        return html`<span @click=${templateOptions.onClick}>-</span>`;
    }

    private static renderAreaValue(
        plant: HomeAssistantEntity,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const areaId = FilterUtils.getAreaForEntity(hass, plant.entity_id);
        const areaName = areaId ? hass?.areas[areaId]?.name : '-';
        return TemplateUtils.renderBadge(areaName, templateOptions, 'area');
    }

    private static renderGrowthPhaseValue(
        plantName: string,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const plant = templateOptions.plant;
        // Nur Entity-ID aus Sensor-Map verwenden
        if (plant.attributes._sensorMap && plant.attributes._sensorMap['growth_phase']) {
            const entityId = plant.attributes._sensorMap['growth_phase'];
            const growthPhaseEntity = hass?.states[entityId];
            return TemplateUtils.renderBadge(growthPhaseEntity?.state, templateOptions, 'phase');
        }
        return html`<span @click=${templateOptions.onClick}>-</span>`;
    }

    private static renderMeasurementValue(
        plantName: string,
        columnId: string,
        hass: HomeAssistant,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const plant = templateOptions.plant;
        // Nur Entity-ID aus Sensor-Map verwenden
        if (plant.attributes._sensorMap && plant.attributes._sensorMap[columnId]) {
            const entityId = plant.attributes._sensorMap[columnId];
            const entity = hass?.states[entityId];
            const unit = columnId === 'pot_size' ? 'L' : 'Tage';
            return html`
                <span @click=${templateOptions.onClick}>
                    ${entity ? `${entity.state} ${unit}` : '-'}
                </span>
            `;
        }
        return html`<span @click=${templateOptions.onClick}>-</span>`;
    }

    private static renderDefaultValue(
        columnId: string,
        plant: HomeAssistantEntity,
        templateOptions: TemplateOptions
    ): HTMLTemplateResult {
        const field = getFieldDefinition(columnId);
        const clickAction = field?.clickAction || 'none';
        
        if (field?.hasExternalLink) {
            return TemplateUtils.renderWebsiteCell(
                plant.attributes[columnId],
                templateOptions,
                false
            );
        }
        
        if (clickAction === 'edit') {
            return html`
                <span @click=${templateOptions.onClick}>
                    ${plant.attributes[columnId]?.toString() || '-'}
                </span>
            `;
        }
        return html`${plant.attributes[columnId]?.toString() || '-'}`;
    }
} 