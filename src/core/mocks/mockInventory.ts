export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Shampoo & Conditioner' | 'Hair Color' | 'Styling & Treatments' | 'Skincare & Serums';
  currentStock: number;
  minReorderLevel: number;
  unitPrice: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export const MOCK_INVENTORY: InventoryProduct[] = [
  {
    id: 'inv_1',
    sku: 'KRA-VOL-500',
    name: 'Kérastase Volumifique Shampoo 500ml',
    brand: 'Kérastase',
    category: 'Shampoo & Conditioner',
    currentStock: 42,
    minReorderLevel: 10,
    unitPrice: 48.0,
    supplier: 'L’Oréal Professional Supply',
    status: 'in_stock',
  },
  {
    id: 'inv_2',
    sku: 'OLAP-NO3-250',
    name: 'Olaplex No. 3 Hair Perfector Treatment',
    brand: 'Olaplex',
    category: 'Styling & Treatments',
    currentStock: 6,
    minReorderLevel: 12,
    unitPrice: 30.0,
    supplier: 'Olaplex Direct Wholesale',
    status: 'low_stock',
  },
  {
    id: 'inv_3',
    sku: 'WEL-COL-77',
    name: 'Wella Koleston Perfect Permanent Color 7/77',
    brand: 'Wella',
    category: 'Hair Color',
    currentStock: 18,
    minReorderLevel: 8,
    unitPrice: 18.5,
    supplier: 'Wella Company Distribution',
    status: 'in_stock',
  },
  {
    id: 'inv_4',
    sku: 'HYD-GLO-SER',
    name: 'HydraFacial Antioxidant Hydrating Serum 100ml',
    brand: 'HydraFacial',
    category: 'Skincare & Serums',
    currentStock: 3,
    minReorderLevel: 5,
    unitPrice: 95.0,
    supplier: 'BeautyHealth Co.',
    status: 'low_stock',
  },
  {
    id: 'inv_5',
    sku: 'MOR-OIL-100',
    name: 'Moroccanoil Original Treatment Oil 100ml',
    brand: 'Moroccanoil',
    category: 'Styling & Treatments',
    currentStock: 0,
    minReorderLevel: 10,
    unitPrice: 44.0,
    supplier: 'Moroccanoil Distro',
    status: 'out_of_stock',
  },
];
