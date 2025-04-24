export interface TimelineEvent {
    date: Date;
    type: string;
    label: string;
    description: string;
    style?: string;
    displayDate?: Date;
    data?: {
        imageIndex: number;
        url: string;
    };
}

export interface AreaHistoryEntry {
    date: string;
    area: string;
}

export interface TreatmentHistoryEntry {
    date: string;
    treatment: string;
}

export interface StateHistoryEntry {
    date: string;
    end_date?: string;
    state: string;
} 
