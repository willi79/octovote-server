import bcrypt from 'bcryptjs';

import { Document, Model, model, Schema, Types } from 'mongoose';

export enum UserRole {
    Admin = 'admin',
    User = 'user',
}

export interface UserInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    hasVoted: boolean;
    votedFor?: Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserInterface>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true, minLength: 6 },
        role: { type: String, enum: UserRole, default: UserRole.User },
        hasVoted: { type: Boolean, default: false },
        votedFor: { type: Schema.Types.ObjectId, ref: 'Candidate', default: null },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next: any): Promise<void> {
    if (!this.isModified('password')) {
        return next();
    }
    const salt: string = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const User: Model<UserInterface> = model<UserInterface>('User', userSchema);
