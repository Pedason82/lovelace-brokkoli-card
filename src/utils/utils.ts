import { HomeAssistant, fireEvent } from "custom-card-helpers";
import { default_show_bars } from "./constants";
import BrokkoliCard from "../brokkoli-card";
import { HomeAssistantEntity } from "../types/brokkoli-card-types";

export const getConfigElement = (): HTMLElement => {
    return document.createElement("brokkoli-card-editor");
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getStubConfig = (hass: HomeAssistant) => {
    // There must be an easier way to do this...
    const isPlant = (entity: HomeAssistantEntity | unknown): entity is HomeAssistantEntity => {
        if (typeof entity == 'object' && 'entity_id' in entity && typeof entity.entity_id == 'string' && entity.entity_id.indexOf('plant.') === 0) {
            return !!entity;
        }
    }
    let supportedEntities: Array<any> = [];
    try {
        supportedEntities = Object.values(hass.states).filter(isPlant);
        //    (entity) => entity.entity_id.indexOf('plant.') === 0
        // );
    }
    catch(e) {
        console.info(`Unable to get ha-data: ${e}`);
    }
    const entity = supportedEntities.length > 0 ? supportedEntities[0].entity_id : 'plant.my_plant';

    return {
        entity: entity,
        battery_sensor: "sensor.myflower_battery",
        show_bars: default_show_bars
    }
}

export const moreInfo = (card: BrokkoliCard, entityId: string): void => {
    // console.log("Event", entityId);
    fireEvent(
        card,
        'hass-more-info',
        { entityId },
        { bubbles: false, composed: true }
    );

}
