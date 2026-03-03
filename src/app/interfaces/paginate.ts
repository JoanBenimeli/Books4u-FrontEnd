import { Libro } from "./libro";

export interface Paginate {
    current_page:number,
    data:Libro[],
    first_page_url:string,
    from:number,
    last_page:number,
    last_page_url:string,
    next_page_url:string,
    path:string,
    prev_page_url:string
}
