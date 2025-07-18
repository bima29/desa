import { Organization } from '../models/Organization.js';

export const getAllOrganization = async (req, res) => {
  try {
    const organization = await Organization.getAll();
    
    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organization'
    });
  }
};

export const createOrganization = async (req, res) => {
  try {
    const id = await Organization.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Organization member created successfully'
    });
  } catch (error) {
    console.error('Error creating organization member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create organization member'
    });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    await Organization.update(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: 'Organization member updated successfully'
    });
  } catch (error) {
    console.error('Error updating organization member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update organization member'
    });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    await Organization.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Organization member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organization member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete organization member'
    });
  }
};