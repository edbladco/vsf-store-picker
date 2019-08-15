import { apiStatus } from '../../../lib/util';
import { Router } from 'express';

const createQuery = (index, term) => ({
  index,
  type: 'category',
  body: {
    "query": {
      "bool": {
        "filter": {
          term
        }
      }
    }
  }
})

module.exports = ({ config, db }) => {
  const api = Router();
  const index = config.elasticsearch.indices.join(',')

  api.get('/categoryByPath', (req, res) => {
    const { path: url_path } = req.query;
    db.search(createQuery(index, { url_path })).then(result => {
      if (result.hits.total === 0) {
        apiStatus(res, 'No result')
        return
      }
      const _id = result.hits.hits[0]._id
      db.search(createQuery(index, { _id })).then(result => {
        const storeViews = Object.entries(config.storeViews)
          .filter(([key, indice]) =>
            indice.hasOwnProperty('disabled') && indice.disabled === false
          )
          .map(([key, indice]) => ({
            ...indice,
            key
          }))
        const url_paths = {}
        result.hits.hits.forEach(hit => {
          const storeView = storeViews.find(storeView => hit._index === storeView.elasticsearch.index)
          if (storeView) {
            url_paths[storeView.key] = hit._source.url_path
          }
        })
        apiStatus(res, { url_paths });
      })
    })
  });

  return api;
};
