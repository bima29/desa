import { Organization } from '../models/Organization.js';
import fs from 'fs/promises';
import path from 'path';

// Constants for file handling
const ORG_UPLOAD_PATH = path.join('public', 'assets', 'organization');
const BASE_URL_PATH = '/backend-assets/organization';

// Helper to build full URL for images
const buildImageUrl = (req, filename) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`.replace(/([^:]\/)\/+/g, '$1');
  return `${baseUrl}${BASE_URL_PATH}/${filename}`;
};

export const getAllOrganization = async (req, res) => {
  try {
    const organization = await Organization.getAll();

    // Validate and map image URLs
    const dataWithImages = await Promise.all(
      organization.map(async item => {
        if (!item.gambar) return item;
        const imagePath = path.join(ORG_UPLOAD_PATH, item.gambar);
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
    console.error('Error fetching organization:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch organization' });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Organization.getById(parseInt(id));
    if (!member) {
      return res.status(404).json({ success: false, message: 'Organization member not found' });
    }

    if (member.gambar) {
      const imagePath = path.join(ORG_UPLOAD_PATH, member.gambar);
      try {
        await fs.access(imagePath);
        member.gambar = buildImageUrl(req, member.gambar);
      } catch {
        member.gambar = null;
        member.warning = 'Image file not found on server';
      }
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error fetching organization member:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch organization' });
  }
};

export const createOrganization = async (req, res) => {
  try {
    // Expect file middleware (e.g., multer) to provide req.file
    const orgData = {
      ...req.body,
      foto: req.file ? req.file.filename : null
    };

    // Ensure upload directory exists
    await fs.mkdir(ORG_UPLOAD_PATH, { recursive: true });

    const id = await Organization.create(orgData);
    const created = await Organization.getById(id);

    if (created.gambar) {
      created.gambar = buildImageUrl(req, created.gambar);
    }

    res.status(201).json({ success: true, data: created, message: 'Organization member created successfully' });
  } catch (error) {
    console.error('Error creating organization member:', error);
    if (req.file) {
      await fs.unlink(path.join(ORG_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to create organization member' });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Organization.getById(parseInt(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Organization member not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.gambar = req.file.filename;
      await fs.unlink(path.join(ORG_UPLOAD_PATH, existing.gambar)).catch(console.warn);
    }

    await Organization.update(parseInt(id), updateData);
    const updated = await Organization.getById(parseInt(id));

    if (updated.gambar) {
      updated.gambar = buildImageUrl(req, updated.gambar);
    }

    res.json({ success: true, data: updated, message: 'Organization member updated successfully' });
  } catch (error) {
    console.error('Error updating organization member:', error);
    if (req.file) {
      await fs.unlink(path.join(ORG_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to update organization member' });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Organization.getById(parseInt(id));
    if (!member) {
      return res.status(404).json({ success: false, message: 'Organization member not found' });
    }

    await Organization.delete(parseInt(id));
    if (member.gambar) {
      await fs.unlink(path.join(ORG_UPLOAD_PATH, member.gambar)).catch(console.warn);
    }

    res.json({ success: true, message: 'Organization member deleted successfully', deletedId: parseInt(id) });
  } catch (error) {
    console.error('Error deleting organization member:', error);
    res.status(500).json({ success: false, message: 'Failed to delete organization member' });
  }
};