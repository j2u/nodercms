var _ = require('lodash');
var logger = require('../../lib/logger.lib');
var articleService = require('../services/article.service');

/**
 * 多条内容
 * @param {Object} req
 *        {Boolean} req.query.deleted
 *        {MongoId} req.query.category
 *        {Number} req.query.pageSize
 *        {Number} req.query.currentPage
 * @param {Object} res
 */
exports.list = function (req, res) {
    req.checkQuery({
        'deleted': {
            optional: true,
            isBoolean: { errorMessage: 'deleted 需为布尔值' }
        },
        '_id': {
            optional: true,
            isMongoId: { errorMessage: 'category _id 需为 mongoId' }
        },
        'pageSize': {
            optional: true,
            isInt: { errorMessage: 'pageSize 需为数字' }
        },
        'currentPage': {
            optional: true,
            isInt: { errorMessage: 'currentPage 需为数字' }
        }
    });

    if (req.validationErrors()) {
        logger.system().error(__filename, '参数验证失败', req.validationErrors());
        return res.status(400).end();
    }

    var query = {};
    if (req.query._id) query._id = req.query._id;
    if (req.query.deleted === 'true') {
        query.deleted = true;
    } else if (req.query.deleted === 'false') {
        query.deleted = false;
    }
    if (req.query.pageSize) query.pageSize = req.query.pageSize;
    if (req.query.currentPage) query.currentPage = req.query.currentPage;

    articleService.list(query, function (err, result) {
        if (err) {
            logger[err.type]().error(err);
            return res.status(500).end();
        }

        res.status(200).json(result);
    });
    // res.status(200).json({hi:'iiiiii'})
};