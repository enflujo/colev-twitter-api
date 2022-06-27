import mongoose from 'mongoose';

const camposEncuestasEsquema = new mongoose.Schema(
  {
    poll: [
      {
        duration_minutes: {
          type: Number,
        },
        end_datetime: {
          type: Date,
        },
        id: {
          type: Number,
        },
        options: [
          {
            position: {
              type: Number,
            },
            label: {
              type: String,
            },
            votes: {
              type: Number,
            },
          },
        ],
        voting_status: {
          type: String,
        },
      },
    ],
  },
  { collection: 'camposEncuestas' }
);

export default camposEncuestasEsquema;
