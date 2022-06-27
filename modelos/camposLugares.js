import mongoose from 'mongoose';

const camposLugaresEsquema = new mongoose.Schema(
  {
    geo: [
      {
        id: {
          type: String,
        },
        full_name: {
          type: String,
        },
        country_code: {
          type: String,
        },
        geo: [
          {
            type: {
              type: String,
            },
            bbox: [
              {
                type: String,
              },
            ],
            properties: {},
          },
        ],
        country: {
          type: String,
        },
        id: {
          type: String,
        },
        place_type: {
          type: String,
        },
        name: {
          type: String,
        },
        contained_within: {
          type: Array,
        },
      },
    ],
  },
  { collection: 'camposLugares' }
);

export default camposLugaresEsquema;
