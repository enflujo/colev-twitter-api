import mongoose from 'mongoose';

const camposLugaresEsquema = new mongoose.Schema(
  {
    full_name: String,
    id: String,
    contained_within: Array,
    country: String,
    country_code: String,
    geo: {
      type: {
        type: String,
      },
      bbox: [Number, Number, Number, Number],
      properties: Object,
    },
    name: String,
    place_type: String,
  },
  { collection: 'camposLugares' }
);

export default camposLugaresEsquema;
