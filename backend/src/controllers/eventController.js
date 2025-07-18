import { Event } from '../models/Event.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const id = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.update(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};