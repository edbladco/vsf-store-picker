import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import { getClient } from '../../../lib/elastic'

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

const getHits = function (result) {
  if (result.body) { // differences between ES5 andd ES7
    return result.body.hits
  } else {
    return result.hits
  }
}

module.exports = ({ config }) => {
  const api = Router();
  const db = getClient(config)
  const index = config.elasticsearch.indices.join(',')

  api.get('/categoryByPath', (req, res) => {
    const { path: url_path } = req.query;
    db.search(createQuery(index, { url_path })).then(result => {
      const hits = getHits(result)
      if (hits.total === 0) {
        apiStatus(res, 'No result')
        return
      }
      const _id = hits.hits[0]._id
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
        const hits = getHits(result)
        hits.hits.forEach(hit => {
          const storeView = storeViews.find(storeView => hit._index === storeView.elasticsearch.index || hit._index.startsWith(storeView.elasticsearch.index + '_'))
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
