export enum TaskType {
    LAUNCH_BROWSER = 'LAUNCH_BROWSER',
}

export enum TaskParamType {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    SELECT = 'SELECT',
    MULTI_SELECT = 'MULTI_SELECT',
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    [key: string]: any; 
}