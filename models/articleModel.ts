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
    required: [true, "can't be blank"],
    match: [/^\S+$/, 'is invalid'],
    index: true,
    maxlength: 100
  },
  title: {
    type: String,
    required: [true, "can't be blank"],
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, "can't be blank"],
    maxlength: 1000
  },
  body: {
    type: String,
    required: [true, "can't be blank"],
    maxlength: 100000
  },
  tagList: [{
    type: String,
    required: [true, "can't be blank"],
    match: [/^\S+$/, 'is invalid'],
    maxlength: 30
  }],
  author: {
    type: Schema.Types.ObjectId,
    required: [true, "can't be blank"],
    ref: 'User'
  }
}, { timestamps: true });

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken.' });

ArticleSchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slug = slug(this.title)
    log('Slug: %o', this.slug);
  }
  next();
});

ArticleSchema.pre('save', function(next) {
  let now = new Date();
  log('UpdatedAt from %o to %o', this.updatedAt, now);
  this.updatedAt = now;
  next();
});

ArticleSchema.methods.getArticleJSON = function() {
  let article = {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    author: this.author.getProfileJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
  log('Article: %o', article);
  return article;
};

export const ArticleModel: Model<IArticle> = model<IArticle>('Article', ArticleSchema);

export { ArticleSchema };
