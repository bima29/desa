import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const newsSchema = Joi.object({
  judul: Joi.string().required(),
  konten: Joi.string().required(),
  gambar: Joi.string().allow(''),
  penulis: Joi.string().required(),
  status: Joi.string().valid('published', 'draft').default('draft')
});

export const gallerySchema = Joi.object({
  judul: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
  gambar: Joi.string().required(),
  kategori: Joi.string().allow('')
});

export const eventSchema = Joi.object({
  judul: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
  tanggal: Joi.date().required(),
  lokasi: Joi.string().allow(''),
  gambar: Joi.string().allow('')
});

export const organizationSchema = Joi.object({
  nama: Joi.string().required(),
  jabatan: Joi.string().required(),
  foto: Joi.string().allow(''),
  urutan: Joi.number().integer().min(0).default(0)
});

export const serviceSchema = Joi.object({
  nama: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
  persyaratan: Joi.string().allow(''),
  template_dokumen: Joi.string().allow('')
});

export const serviceSubmissionSchema = Joi.object({
  layanan_id: Joi.number().integer().required(),
  nama: Joi.string().required(),
  nik: Joi.string().length(16).required(),
  file_pendukung: Joi.string().allow('')
});