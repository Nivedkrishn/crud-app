const express = require('express');
const router = express.Router();

// In-memory items store
// Seed data
let items = [
  { id: 1, name: 'Apple', value: 1 },
  { id: 2, name: 'Banana', value: 2 },
  { id: 3, name: 'Cherry', value: 3 }
];
let nextId = items.length + 1;

// GET /items - list items
router.get('/', (req, res) => res.json(items));

// GET /items/search?q=:text - search items by name (case-insensitive)
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.status(400).json({ message: 'q query param is required' });
  const results = items.filter(i => (i.name || '').toLowerCase().includes(q));
  res.json(results);
});

// GET /items/:id - get single item
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// POST /items - create item
router.post('/', (req, res) => {
  const { name, value } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  const newItem = { id: nextId++, name, value };
  items.push(newItem);
  res.status(201).json(newItem);
});

// POST /items/reset - reset items to default seed data
router.post('/reset', (req, res) => {
  items = [
    { id: 1, name: 'Apple', value: 1 },
    { id: 2, name: 'Banana', value: 2 },
    { id: 3, name: 'Cherry', value: 3 }
  ];
  nextId = items.length + 1;
  res.json({ message: 'Items reset to seed data', items });
});

// PUT /items/:id - update item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });
  const { name, value } = req.body;
  items[itemIndex] = { ...items[itemIndex], name, value };
  res.json(items[itemIndex]);
});

// DELETE /items/:id - delete item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const beforeLength = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length === beforeLength) return res.status(404).json({ message: 'Item not found' });
  res.status(204).end();
});

module.exports = router;
