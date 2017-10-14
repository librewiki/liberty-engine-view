import request from './request'
import querystring from 'querystring'

export default {
  async getByFullTitle (fullTitle, { revisionId, fields = [], req, res } = {}) {
    const queryObj = {
      rev: revisionId, fields: fields.join(',')
    }
    for (const key of Object.keys(queryObj)) {
      if (!queryObj[key]) delete queryObj[key]
    }
    const resp = await request({
      path: `articles/${encodeURIComponent(fullTitle)}?${querystring.stringify(queryObj)}`,
      method: 'get',
      req,
      res
    })
    return resp.data.article
  },
  async create ({ fullTitle, wikitext, summary }) {
    await request({
      path: 'articles',
      method: 'post',
      body: {
        fullTitle,
        wikitext,
        summary
      }
    })
  },
  async edit ({ fullTitle, wikitext, latestRevisionId, summary }) {
    await request({
      path: `articles/${encodeURIComponent(fullTitle)}/wikitext`,
      method: 'put',
      body: {
        wikitext,
        latestRevisionId,
        summary
      }
    })
  },
  async rename ({ fullTitle, newFullTitle, summary }) {
    await request({
      path: `articles/${encodeURIComponent(fullTitle)}/full-title`,
      method: 'put',
      body: {
        fullTitle: newFullTitle,
        summary
      }
    })
  },
  async delete ({ fullTitle, summary }) {
    await request({
      path: `articles/${encodeURIComponent(fullTitle)}`,
      method: 'delete',
      body: {
        summary
      }
    })
  },
  async addRedirection ({ destinationFullTitle, sourceFullTitle }) {
    await request({
      path: `articles/${encodeURIComponent(destinationFullTitle)}/redirections`,
      method: 'post',
      body: {
        sourceFullTitle
      }
    })
  },
  async deleteRedirection ({ destinationFullTitle, sourceFullTitle }) {
    await request({
      path: `articles/${encodeURIComponent(destinationFullTitle)}/redirections?source=${encodeURIComponent(sourceFullTitle)}`,
      method: 'delete'
    })
  },
  async getRevision ({ id, req, res }) {
    const resp = await request({
      path: `revisions/${id}`,
      method: 'get',
      req,
      res
    })
    return resp.data.revision
  }
}
