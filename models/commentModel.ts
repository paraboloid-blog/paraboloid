import { Schema, Model, model } from 'mongoose';

let CommentSchema = new Schema();

model('Comment', CommentSchema);

export { CommentSchema };
