////////////////////////////////////////////////////////////////////////////
// Endpoint routes for user generated lists. Can be either public or private. Checks to ensure duplicates arent added to the same list
// Assigns a UUID to each list to ensure uniqueness 
// GET /my-lists (Private, shows all lists created by the user)
// GET /public
// GET /public/search
// POST / (Create new list)
// GET /:id (Show list by ID)
// GET /share/:shareID (Get public lists by ID, public)
// PUT /:id (update list, user level)
// DELETE /:id (delete list by ID, user level)
// GET /:id/items (get items on list)
// POST /:id/items (add items to list)
// DELETE /:id/items/:itemId (Delete item from list)
// GET /:id/items/check (Check for duplicates)
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const List = require('../models/List');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-lists', authenticateToken, async (req, res) => {
  try {
    const lists = await List.getUserLists(req.user.userId);
    res.json(lists);
  } catch (error) {
    console.error('Error getting user lists:', error);
    res.status(500).json({ 
      error: 'Failed to get lists',
      details: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
});

router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const lists = await List.getPublicLists(page, limit);
    res.json(lists);
  } catch (error) {
    console.error('Error getting public lists:', error);
    res.status(500).json({ error: 'Failed to get public lists' });
  }
});

router.get('/public/search', async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const lists = await List.searchPublicLists(q, page, limit);
    res.json(lists);
  } catch (error) {
    console.error('Error searching public lists:', error);
    res.status(500).json({ error: 'Failed to search lists' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'List name is required' });
    }

    const list = await List.create({
      user_id: req.user.userId,
      name,
      description,
      is_public: is_public !== undefined ? is_public : true
    });
    
    res.status(201).json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Failed to create list' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const list = await List.getById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (!list.is_public && (!req.user || list.user_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error getting list:', error);
    res.status(500).json({ error: 'Failed to get list' });
  }
});

router.get('/share/:shareId', async (req, res) => {
  try {
    const list = await List.getByShareId(req.params.shareId);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found or not public' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error getting shared list:', error);
    res.status(500).json({ error: 'Failed to get shared list' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    
    const existingList = await List.getById(req.params.id);
    if (!existingList) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (existingList.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const list = await List.update({
      id: req.params.id,
      name,
      description,
      is_public
    });
    
    res.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Failed to update list' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existingList = await List.getById(req.params.id);
    if (!existingList) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (existingList.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await List.delete(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const list = await List.getById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (!list.is_public && (!req.user || list.user_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const items = await List.getItems(req.params.id);
    res.json(items);
  } catch (error) {
    console.error('Error getting list items:', error);
    res.status(500).json({ error: 'Failed to get list items' });
  }
});

router.post('/:id/items', authenticateToken, async (req, res) => {
  try {
    const { item_type, artist_id, album_id } = req.body;
    
    if (!item_type || (item_type !== 'artist' && item_type !== 'album')) {
      return res.status(400).json({ error: 'Valid item_type (artist or album) is required' });
    }
    
    if (item_type === 'artist' && !artist_id) {
      return res.status(400).json({ error: 'artist_id is required for artist items' });
    }
    
    if (item_type === 'album' && !album_id) {
      return res.status(400).json({ error: 'album_id is required for album items' });
    }
    
    // First, verify user owns this list
    const existingList = await List.getById(req.params.id);
    if (!existingList) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (existingList.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const itemExists = await List.isItemInList({
      list_id: req.params.id,
      item_type,
      artist_id,
      album_id
    });
    
    if (itemExists) {
      return res.status(400).json({ error: 'Item already in list' });
    }
    
    const item = await List.addItem({
      list_id: req.params.id,
      item_type,
      artist_id,
      album_id
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding item to list:', error);
    res.status(500).json({ error: 'Failed to add item to list' });
  }
});

router.delete('/:id/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const existingList = await List.getById(req.params.id);
    if (!existingList) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    if (existingList.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await List.removeItem({
      list_id: req.params.id,
      item_id: req.params.itemId
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Item not found in list' });
    }
    
    res.json({ message: 'Item removed from list' });
  } catch (error) {
    console.error('Error removing item from list:', error);
    res.status(500).json({ error: 'Failed to remove item from list' });
  }
});

router.get('/:id/items/check', async (req, res) => {
  try {
    const { item_type, artist_id, album_id } = req.query;
    
    if (!item_type || (item_type !== 'artist' && item_type !== 'album')) {
      return res.status(400).json({ error: 'Valid item_type (artist or album) is required' });
    }
    
    const exists = await List.isItemInList({
      list_id: req.params.id,
      item_type,
      artist_id: artist_id || null,
      album_id: album_id || null
    });
    
    res.json({ exists });
  } catch (error) {
    console.error('Error checking item in list:', error);
    res.status(500).json({ error: 'Failed to check item' });
  }
});

module.exports = router;