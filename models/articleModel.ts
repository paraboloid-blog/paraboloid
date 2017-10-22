import * as mongoose from 'mongoose';

let ArticleSchema = new mongoose.Schema();

mongoose.model('Article', ArticleSchema);

export { ArticleSchema };
