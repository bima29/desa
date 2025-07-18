import { Service, ServiceSubmission } from '../models/Service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

export const createService = async (req, res) => {
  try {
    const id = await Service.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.update(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};

// Service Submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ServiceSubmission.getAll();
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const submission = await ServiceSubmission.create(req.body);
    
    res.status(201).json({
      success: true,
      data: submission,
      message: 'Service submission created successfully'
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service submission'
    });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    
    await ServiceSubmission.updateStatus(parseInt(id), status, catatan);
    
    res.json({
      success: true,
      message: 'Submission status updated successfully'
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission status'
    });
  }
};