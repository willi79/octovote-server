import { Model, model, Schema, Types } from 'mongoose';

export interface CandidateInterface {
    _id: Types.ObjectId;
    name: string;
    votes: number;
}

const candidateSchema = new Schema<CandidateInterface>({
    name: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 0,
    },
});

export const Candidate: Model<CandidateInterface> = model<CandidateInterface>('Candidate', candidateSchema);
