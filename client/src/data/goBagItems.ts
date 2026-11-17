import type { GoBagItem } from '../types/goBag'

// What goes in the go bag. The order here is the order on the page.
export const GO_BAG_ITEMS: GoBagItem[] = [
  {
    id: 'water',
    category: 'Water and food',
    name: 'Water',
    tip: 'About 3 litres per person per day, for at least 3 days.',
  },
  {
    id: 'food',
    category: 'Water and food',
    name: 'Food that needs no cooking',
    tip: 'Tins, muesli bars, dried fruit. Pack a can opener.',
  },
  {
    id: 'torch',
    category: 'Light and power',
    name: 'Torch',
    tip: 'Wind-up, or with spare batteries.',
  },
  {
    id: 'radio',
    category: 'Light and power',
    name: 'Battery or wind-up radio',
    tip: 'Phone networks can go down. A radio keeps you informed.',
  },
  {
    id: 'power-bank',
    category: 'Light and power',
    name: 'Phone charger and power bank',
    tip: 'Keep the power bank charged.',
  },
  {
    id: 'first-aid',
    category: 'Health',
    name: 'First aid kit',
    tip: 'Check the dates on anything in it every year.',
  },
  {
    id: 'medicines',
    category: 'Health',
    name: 'Medicines and glasses',
    tip: 'A week of anything you take regularly.',
  },
  {
    id: 'hygiene',
    category: 'Health',
    name: 'Toilet paper and wet wipes',
    tip: 'Toilets may not work after a big quake.',
  },
  {
    id: 'documents',
    category: 'Documents and money',
    name: 'Copies of important documents',
    tip: 'ID and insurance details, in a waterproof bag.',
  },
  {
    id: 'cash',
    category: 'Documents and money',
    name: 'Cash',
    tip: 'EFTPOS may not work. Small notes are best.',
  },
  {
    id: 'contacts',
    category: 'Documents and money',
    name: 'Emergency contacts on paper',
    tip: 'Written down, in case your phone dies.',
  },
  {
    id: 'warm-clothes',
    category: 'Warmth and shelter',
    name: 'Warm clothes and a rain jacket',
    tip: 'A spare set for everyone in the house.',
  },
  {
    id: 'blanket',
    category: 'Warmth and shelter',
    name: 'Blanket or sleeping bag',
    tip: 'Pack one each.',
  },
  {
    id: 'shoes',
    category: 'Warmth and shelter',
    name: 'Sturdy shoes',
    tip: 'For walking over broken glass and rubble.',
  },
  {
    id: 'whistle',
    category: 'Extras',
    name: 'Whistle',
    tip: 'To signal for help if you get trapped.',
  },
  {
    id: 'pet-supplies',
    category: 'Extras',
    name: 'Pet food and a lead',
    tip: 'Only if you have a pet.',
  },
]
