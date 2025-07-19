import { Event } from '../models/Event.js';
import fs from 'fs/promises';
import path from 'path';

// Constants for file handling
const EVENT_UPLOAD_PATH = path.join('public', 'assets', 'events');
const BASE_URL_PATH = '/backend-assets/events';

// Helper to build full URL for images
const buildImageUrl = (req, filename) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`.replace(/([^:]\/)\/+/g, '$1');
  return `${baseUrl}${BASE_URL_PATH}/${filename}`;
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();

    // Validate and map image URLs
    const dataWithImages = await Promise.all(
      events.map(async item => {
        if (!item.gambar) return item;
        const imagePath = path.join(EVENT_UPLOAD_PATH, item.gambar);
        try {
          await fs.access(imagePath);
          return { ...item, gambar: buildImageUrl(req, item.gambar) };
        } catch {
          return { ...item, gambar: null, warning: 'Image file not found on server' };
        }
      })
    );

    res.json({
      success: true,
      data: dataWithImages,
      imageBasePath: buildImageUrl(req, '')
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.getById(parseInt(id));
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.gambar) {
      const imagePath = path.join(EVENT_UPLOAD_PATH, event.gambar);
      try {
        await fs.access(imagePath);
        event.gambar = buildImageUrl(req, event.gambar);
      } catch {
        event.gambar = null;
        event.warning = 'Image file not found on server';
      }
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event by id:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    // Expect file middleware (e.g., multer) to provide req.file
    const eventData = {
      ...req.body,
      tanggal: req.body.tanggal || new Date().toISOString().split('T')[0],
      gambar: req.file ? req.file.filename : null
    };

    // Ensure upload directory exists
    await fs.mkdir(EVENT_UPLOAD_PATH, { recursive: true });

    const id = await Event.create(eventData);
    const created = await Event.getById(id);

    if (created.gambar) {
      created.gambar = buildImageUrl(req, created.gambar);
    }

    res.status(201).json({ success: true, data: created, message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    if (req.file) {
      await fs.unlink(path.join(EVENT_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Event.getById(parseInt(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.gambar = req.file.filename;
      await fs.unlink(path.join(EVENT_UPLOAD_PATH, existing.gambar)).catch(console.warn);
    }

    await Event.update(parseInt(id), updateData);
    const updated = await Event.getById(parseInt(id));

    if (updated.gambar) {
      updated.gambar = buildImageUrl(req, updated.gambar);
    }

    res.json({ success: true, data: updated, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    if (req.file) {
      await fs.unlink(path.join(EVENT_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.getById(parseInt(id));
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Event.delete(parseInt(id));
    if (event.gambar) {
      await fs.unlink(path.join(EVENT_UPLOAD_PATH, event.gambar)).catch(console.warn);
    }

    res.json({ success: true, message: 'Event deleted successfully', deletedId: parseInt(id) });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
};
