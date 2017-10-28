import * as express from 'express';
import * as debug from 'debug';
import { DocumentQuery } from 'mongoose';
import { Authorization } from './Authorization'
import { IRequestExt } from './IRequestExt'
import { UserModel, IUser, ArticleModel, IArticle } from '../../models';

let log = debug('paraboloid:server:API:articles');
let router = express.Router();
let auth = new Authorization();

router.param('slug', (
    req: IRequestExt,
    res: express.Response,
    next: express.NextFunction,
    slug: string) => {

    log('>>> parameter slug %o determined', slug);

    ArticleModel
        .findOne({ slug: slug })
        .populate('author')
        .then((article) => {

            if (article) {
                log('Article %o found', slug);
                req.article = article;
                return next();
            }
            else {
                log('Article %o not found', slug);
                return res.status(404).send({ errors: { article: 'not valid' } });
            }
        }).catch(next);
});

router.get('/', (
    req: express.Request,
    res: express.Response) => {
    res.status(200);
    res.json(
        {
            path: req.originalUrl,
            tag: req.query.tag,
            author: req.query.author,
            limit: req.query.limit,
            offset: req.query.offset
        });
});

router.post('/', auth.required, (
    req: IRequestExt,
    res: express.Response,
    next: express.NextFunction) => {

    log('>>> post /api/articles with body %o/payload %o', req.body, req.payload);

    UserModel.findById(req.payload.id).then((user: IUser) => {
        if (user) {
            let article = new ArticleModel(req.body.article);
            article.author = user;
            article.save().then(() => {
                let json = article.getArticleJSON();
                log('Article was created: %o', json);
                return res.status(201).json({ article: json })
            }).catch(next);;
        }
        else {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
    }).catch(next);
});

router.get('/:slug', auth.optional, (
    req: IRequestExt,
    res: express.Response,
    next: express.NextFunction) => {

    log('>>> get /api/articles/:slug with payload %o', req.payload);

    req.article
        .populate('author').execPopulate()
        .then((results: any) => {
            let json = req.article.toJSON();
            log("Article found: %o", json);
            return res.status(200).json({ article: json });
        }).catch(next);
});

router.put('/:slug', auth.required, (
    req: IRequestExt,
    res: express.Response,
    next: express.NextFunction) => {

    log('>>> put /api/articles/:slug with payload %o', req.payload);

    UserModel.findById(req.payload.id).then(function(user: IUser) {

        if (!user) {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
        if (req.article.author._id.toString() !== req.payload.id.toString()) {
            log('User %o may not update article %o', user.username, req.article.slug);
            return res.status(403).send({
                errors: { article: 'may not be updated' }
            });
        }
        let bodyArticle = req.body.article;
        if (bodyArticle) {
            if (bodyArticle.title) req.article.title = bodyArticle.title;
            if (bodyArticle.description) req.article.description = bodyArticle.description;
            if (bodyArticle.body) req.article.body = bodyArticle.body;
            if (bodyArticle.tagList) req.article.tagList = bodyArticle.tagList;
        }
        req.article.save().then(function(article) {
            let json = article.toJSON();
            log('Article updated: %o', json);
            return res.status(200).json({ article: json });
        }).catch(next);
    }).catch(next);
});

router.delete('/:slug', auth.required, (
    req: IRequestExt,
    res: express.Response,
    next: express.NextFunction) => {

    log('>>> delete /api/articles/:slug with payload %o', req.payload);

    UserModel.findById(req.payload.id).then((user: IUser) => {
        if (!user) {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
        if (req.article.author._id.toString() === req.payload.id.toString()) {
            req.article.remove().then(() => {
                log('Article %o was deleted', req.article.slug);
                res.sendStatus(204);
            });
        } else {
            log('Article %o may not be deleted by %o', req.article.slug, user.username);
            return res.status(403).send({
                errors: { article: 'may not be deleted' }
            });
        }
    }).catch(next);
});

router.post('/:slug/comments', (
    req: express.Request,
    res: express.Response) => {
    res.status(201);
    res.json(
        {
            path: req.originalUrl,
            slug: req.params.slug
        });
});

router.get('/:slug/comments', (
    req: express.Request,
    res: express.Response) => {
    res.status(200);
    res.json(
        {
            path: req.originalUrl,
            slug: req.params.slug
        });
});

router.delete('/:slug/comments/:id', (
    req: express.Request,
    res: express.Response) => {
    res.status(200);
    res.json(
        {
            path: req.originalUrl,
            slug: req.params.slug,
            id: req.params.id
        });
});

export { router as articles };
