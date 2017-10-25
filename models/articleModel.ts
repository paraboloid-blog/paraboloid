import * as uniqueValidator from 'mongoose-unique-validator';
import * as slug from 'slug';
import * as debug from 'debug';
import { Schema, Model, model } from 'mongoose';
import { IArticle } from './IArticle';
import { IUser } from './IUser';

let log = debug('paraboloid:server:models:article');

let ArticleSchema = new Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    maxlength: 100
  },
  title: {
    type: String,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  body: {
    type: String,
    maxlength: 100000
  },
  tagList: [{
    type: String,
    maxlength: 100
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { timestamps: true });

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken.' });

ArticleSchema.pre('validate', function(next) {
  if (!this.slug) this.slugify();
  next();
});

ArticleSchema.methods.slugify = function(): void {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ArticleSchema.methods.getArticleJSON = function() {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    author: this.author.getProfileJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const ArticleModel: Model<IArticle> = model<IArticle>('Article', ArticleSchema);

export { ArticleSchema };
