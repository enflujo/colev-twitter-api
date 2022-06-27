import mongoose from 'mongoose';

const camposMediosAdjuntosEsquema = new mongoose.Schema(
  {
    media: [
      {
        duration_ms: {
          type: Number,
        },
        type: {
          type: String,
        },
        height: {
          type: Number,
        },
        media_key: {
          type: String,
        },
        public_metrics: [
          {
            view_count: {
              type: Number,
            },
          },
        ],
        preview_image_url: {
          type: String,
        },
        width: {
          type: Number,
        },
        url: {
          type: String,
        },
        variants: [
          {
            bit_rate: {
              type: Number,
            },
            content_type: {
              type: String,
            },
            url: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { collection: 'camposMediosAdjuntos' }
);

export default camposMediosAdjuntosEsquema;
