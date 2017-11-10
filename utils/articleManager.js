import request from './request'

export default {
  async getByFullTitle (fullTitle, { revisionId, fields = [], req, res } = {}) {
    const resp = await request({
      path: `articles/${encodeURIComponent(fullTitle)}`,
      query: {
        rev: revisionId,
        fields: fields.join(',')
      },
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
      path: `articles/${encodeURIComponent(destinationFullTitle)}/redirections`,
      method: 'delete',
      query: {
        source: sourceFullTitle
      }
    })
  },
  async setPermissions ({ fullTitle, articlePermissions }) {
    await request({
      path: `articles/${encodeURIComponent(fullTitle)}/permissions`,
      method: 'put',
      body: { articlePermissions }
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
