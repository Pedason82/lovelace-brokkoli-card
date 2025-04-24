import { HomeAssistant } from 'custom-card-helpers';
import { HomeAssistantEntity } from '../types/brokkoli-list-card-types';

export class PlantEntityUtils {
    // Globaler Cache für Pflanzeninformationen
    private static _plantInfoCache: Record<string, any> = {};
    
    // Timeouts für die planmäßige Aktualisierung
    private static _plantRetryTimeouts: Record<string, number> = {};
    
    // Zeitpunkt der letzten Aktualisierung pro Pflanze
    private static _plantLastLoaded: Record<string, number> = {};

    static async getPlantInfo(hass: HomeAssistant, plantEntityId: string): Promise<any> {
        // Wenn Daten im Cache sind, verwende diese
        if (this._plantInfoCache[plantEntityId]) {
            return this._plantInfoCache[plantEntityId];
        }
        
        // Sonst starte einen API-Aufruf und plane regelmäßige Updates
        return this._loadPlantInfoWithRetry(hass, plantEntityId);
    }
    
    // Lädt Pflanzendaten und plant einen regelmäßigen Refresh
    private static async _loadPlantInfoWithRetry(hass: HomeAssistant, plantEntityId: string): Promise<any> {
        try {
            // Aktualisiere den Zeitstempel
            this._plantLastLoaded[plantEntityId] = Date.now();
            
            const response = await hass.callWS({
                type: "plant/get_info",
                entity_id: plantEntityId,
            });
            
            // Die eigentlichen Daten sind im "result"-Objekt
            const result = typeof response === 'object' && response !== null && 'result' in response 
                ? response.result 
                : null;
            
            // Ergebnis im Cache speichern
            if (result) {
                this._plantInfoCache[plantEntityId] = result;
            }
            
            // Plane die nächste Aktualisierung für diese Pflanze in 5 Sekunden
            this._scheduleNextUpdate(hass, plantEntityId);
            
            return result;
        } catch (err) {
            console.error(`[PLANT-ENTITY] Fehler beim API-Call für ${plantEntityId}:`, err);
            
            // Bei Fehler: versuche erneut in 10 Sekunden
            this._scheduleNextUpdate(hass, plantEntityId, true);
            
            return null;
        }
    }
    
    // Plant den nächsten Update für eine bestimmte Pflanze
    private static _scheduleNextUpdate(hass: HomeAssistant, plantEntityId: string, isError: boolean = false): void {
        // Wenn bereits ein Timeout existiert, diesen löschen
        if (this._plantRetryTimeouts[plantEntityId]) {
            window.clearTimeout(this._plantRetryTimeouts[plantEntityId]);
            delete this._plantRetryTimeouts[plantEntityId];
        }
        
        // Timeout für den nächsten Update setzen
        this._plantRetryTimeouts[plantEntityId] = window.setTimeout(() => {
            delete this._plantRetryTimeouts[plantEntityId];
            // Erneuten API-Call ausführen
            this._loadPlantInfoWithRetry(hass, plantEntityId);
        }, isError ? 10000 : 5000); // Bei Fehler 10 Sekunden, sonst 5 Sekunden
    }
    
    // Startet die initiale Ladung aller Pflanzendaten mit leicht verzögertem Start
    static initPlantDataLoading(hass: HomeAssistant, plantEntities: string[]): void {
        if (!hass || plantEntities.length === 0) return;
        
        // Lösche alle bestehenden Timeouts
        this.clearAllTimeouts();
        
        // Starte die Ladung für jede Pflanze mit leicht unterschiedlicher initialer Verzögerung
        plantEntities.forEach((entityId, index) => {
            // Wenn bereits Daten im Cache existieren, plane nur den nächsten Abruf
            if (this._plantInfoCache[entityId]) {
                if (!this._plantRetryTimeouts[entityId]) {
                    this._scheduleNextUpdate(hass, entityId);
                }
                return;
            }
            
            // Initiale Verzögerung, um API-Überlastung zu vermeiden
            const initialDelay = 500 + Math.random() * 2000; // 0.5-2.5 Sekunden initiale Verzögerung
            
            // Setze einen Timeout für den initialen Abruf
            this._plantRetryTimeouts[entityId] = window.setTimeout(() => {
                delete this._plantRetryTimeouts[entityId];
                this._loadPlantInfoWithRetry(hass, entityId);
            }, initialDelay);
        });
    }
    
    // Löscht alle Timeouts (z.B. beim Entfernen der Komponente)
    static clearAllTimeouts(): void {
        Object.values(this._plantRetryTimeouts).forEach(timeoutId => {
            window.clearTimeout(timeoutId);
        });
        this._plantRetryTimeouts = {};
    }

    static getPlantEntities(hass: HomeAssistant, filter: 'plant' | 'cycle' | 'all' = 'all'): HomeAssistantEntity[] {
        return Object.values(hass.states)
            .filter((entity): entity is HomeAssistantEntity => {
                if (
                    typeof entity !== 'object' || 
                    entity === null || 
                    !('entity_id' in entity) || 
                    !('attributes' in entity) ||
                    typeof entity.entity_id !== 'string'
                ) {
                    return false;
                }
                
                const isPlant = entity.entity_id.startsWith('plant.');
                const isCycle = entity.entity_id.startsWith('cycle.') && 'member_count' in (entity.attributes as any);
                
                if (filter === 'plant') return isPlant;
                if (filter === 'cycle') return isCycle;
                return isPlant || isCycle;
            });
    }

    static async updatePlantInfo(
        hass: HomeAssistant,
        plantEntities: HomeAssistantEntity[],
        plantInfo: Map<string, any>
    ): Promise<Map<string, any>> {
        const updatedPlantInfo = new Map(plantInfo);
        
        // Pflanzen-Entity-IDs ermitteln
        const entityIds = plantEntities.map(plant => plant.entity_id);
        
        // Initiale Ladung der Pflanzeninformationen starten
        this.initPlantDataLoading(hass, entityIds);
        
        // Für jede Pflanze den Cache überprüfen und ggf. aktualisieren
        for (const plant of plantEntities) {
            const cachedInfo = this._plantInfoCache[plant.entity_id];
            if (cachedInfo) {
                updatedPlantInfo.set(plant.entity_id, cachedInfo);
            } else if (!updatedPlantInfo.has(plant.entity_id)) {
                // Falls keine Daten im Cache und noch nicht in plantInfo, null setzen
                // Daten werden durch initPlantDataLoading asynchron geladen
                updatedPlantInfo.set(plant.entity_id, null);
            }
        }
        
        return updatedPlantInfo;
    }

    static togglePlantSelection(
        entityId: string,
        selectedPlants: Set<string>,
        event?: Event
    ): Set<string> {
        event?.stopPropagation();
        const updatedSelection = new Set(selectedPlants);
        
        if (updatedSelection.has(entityId)) {
            updatedSelection.delete(entityId);
        } else {
            updatedSelection.add(entityId);
        }
        
        return updatedSelection;
    }

    static clearPlantSelection(selectedPlants: Set<string>): Set<string> {
        return new Set();
    }
} 