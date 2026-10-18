// Single source of truth for the products shown across sections.
// Fields: image = listing shot (thumbs/grids), full = bigger variant (hero panels),
// price in GH₵ from the source listing, brand + category used by shop filters.
export type Product = {
    name: string;
    brand: string;
    category: "men" | "women" | "unisex";
    price: number;
    image: string;
    full: string;
};

export const PRODUCTS: Product[] = [
    {
        name: "Mont Blanc Explorer Extreme Parfum",
        brand: "Montblanc",
        category: "men",
        price: 1300,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/explorer-extreme-parfum-500x500.avif",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/explorer-extreme-parfum-768x768.avif",
    },
    {
        name: "Jean Paul Gaultier Le Beau Le Parfum Intense",
        brand: "Jean Paul Gaultier",
        category: "men",
        price: 1590,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/JeanPaulGaultierLeBeauLeParfumIntense_1-500x500.webp",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/JeanPaulGaultierLeBeauLeParfumIntense_1-768x768.webp",
    },
    {
        name: "French Avenue Zenith Vanilla EDP",
        brand: "French Avenue",
        category: "men",
        price: 550,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/Zenith-Vanilla-Perfume-100ml-EDP-French-Avenue-175522647-500x500.webp",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/Zenith-Vanilla-Perfume-100ml-EDP-French-Avenue-175522647-768x768.webp",
    },
    {
        name: "Oud & Santal By Cartier EDP",
        brand: "Cartier",
        category: "unisex",
        price: 2800,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/OIP-C-300x300.webp",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/OIP-C.webp",
    },
    {
        name: "Tom Ford Noir De Noir EDP",
        brand: "Tom Ford",
        category: "men",
        price: 3900,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/tf_sku_T0C801_2000x2000_0-500x500.avif",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/tf_sku_T0C801_2000x2000_0-1024x1024.avif",
    },
    {
        name: "Christian Dior Dioriviera EDP",
        brand: "Christian Dior",
        category: "men",
        price: 4500,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/CHRISTIAN-DIOR-DIORIVIERA-125ML-1-500x500.jpg",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/CHRISTIAN-DIOR-DIORIVIERA-125ML-1-1024x1024.jpg",
    },
    {
        name: "Carolina Herrera 212 Men NYC Parfum",
        brand: "Carolina Herrera",
        category: "men",
        price: 1690,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/d2c18a636b8e7336666dc039fc0ec696-500x500.webp",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/d2c18a636b8e7336666dc039fc0ec696.webp",
    },
    {
        name: "Byredo Bal d'Afrique EDP",
        brand: "Byredo",
        category: "unisex",
        price: 3800,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/images-4-500x500.jpeg",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/images-4.jpeg",
    },
    {
        name: "Jean Paul Gaultier La Belle Intense EDP",
        brand: "Jean Paul Gaultier",
        category: "women",
        price: 1690,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/JEAN_20PAUL_20GAULTIER_20LA_20BELLE_20INTENSE_20EDP_20100ML_202-500x500.jpg",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/JEAN_20PAUL_20GAULTIER_20LA_20BELLE_20INTENSE_20EDP_20100ML_202-500x500.jpg",
    },
    {
        name: "Jean Paul Gaultier Divine Elixir EDP",
        brand: "Jean Paul Gaultier",
        category: "women",
        price: 1890,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/JPG-Divine-EDP-For-Woman-100ML-Set-1731397407963-500x500.webp",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/JPG-Divine-EDP-For-Woman-100ML-Set-1731397407963-500x500.webp",
    },
    {
        name: "Elizabeth Arden Untold Absolu EDP",
        brand: "Elizabeth Arden",
        category: "women",
        price: 400,
        image: "https://perfumegh.com/wp-content/uploads/2026/10/elizabeth-arden-untold-edp-spray-100-ml-500x500.jpg",
        full: "https://perfumegh.com/wp-content/uploads/2026/10/elizabeth-arden-untold-edp-spray-100-ml-500x500.jpg",
    },
];

// Distinct brands for the shop filter dropdown (derived once).
export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))];
