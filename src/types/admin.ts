export interface Photo {
    id: number;
    title: string;
    category: string;
    date: string;
    image_url: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  
  export interface Offer {
    id: number;
    title: string;
    discount_text: string;
    description: string;
    valid_until: string;
    active: boolean;
  }