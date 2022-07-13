import mongoose from 'mongoose';

const camposEncuestasEsquema = new mongoose.Schema(
  {
    duration_minutes: Number,
    end_datetime: Date,
    id: String,
    options: [
      {
        position: Number,
        label: String,
        votes: Number,
      },
    ],
    voting_status: String,
  },
  { collection: 'camposEncuestas' }
);

export default camposEncuestasEsquema;
