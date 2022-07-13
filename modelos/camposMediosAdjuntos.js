import mongoose from 'mongoose';

const camposMediosAdjuntosEsquema = new mongoose.Schema(
  {
    media_key: String,
    type: {
      type: String,
    },
    url: String,
    duration_ms: Number,
    height: Number,
    non_public_metrics: {
      playback_0_count: Number,
      playback_100_count: Number,
      playback_25_count: Number,
      playback_50_count: Number,
      playback_75_count: Number,
    },
    organic_metrics: {
      playback_0_count: Number,
      playback_100_count: Number,
      playback_25_count: Number,
      playback_50_count: Number,
      playback_75_count: Number,
      view_count: Number,
    },
    preview_image_url: String,
    promoted_metrics: {
      playback_0_count: Number,
      playback_100_count: Number,
      playback_25_count: Number,
      playback_50_count: Number,
      playback_75_count: Number,
      view_count: Number,
    },
    public_metrics: {
      view_count: Number,
    },
    width: Number,
    alt_text: String,
    variants: [
      {
        bit_rate: Number,
        content_type: String,
        url: String,
      },
    ],
  },
  { collection: 'camposMediosAdjuntos' }
);

export default camposMediosAdjuntosEsquema;
