export interface Log {
    _id?:string;
    habitId:string;
    date:string;
    status:'Complete'|'NotComplete'
}
