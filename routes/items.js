const express = require('express');
const router = express.Router();

// In-memory items store
let items = [];
let nextId = 1;

// GET /items - list items
router.get('/', (req, res) => res.json(items));

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
