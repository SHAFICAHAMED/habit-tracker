export interface Habit {
    _id?:string;
    title:string;
    goal:'daily'|'weekly';
    createdAt?:string;
}
