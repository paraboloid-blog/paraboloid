import * as mongoose from 'mongoose';

let CommentSchema = new mongoose.Schema();

mongoose.model('Comment', CommentSchema);

export { CommentSchema };
