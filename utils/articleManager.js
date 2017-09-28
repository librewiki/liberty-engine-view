import request from './request'

export default {
  async getByFullTitle (fullTitle, { fields = [], req, res } = {}) {
    const resp = await request({
      path: `articles/${encodeURIComponent(fullTitle)}?fields=${fields.join(',')}`,
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
  async rename ({ fullTitle, newFullTitle }) {
    await request({
      path: `articles/${encodeURIComponent(fullTitle)}/full-title`,
      method: 'put',
      body: {
        fullTitle: newFullTitle
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
  async addRedirection ({ fromFullTitle, toFullTitle }) {
    await request({
      path: `articles/${encodeURIComponent(fromFullTitle)}/redirections`,
      method: 'post',
      body: {
        fullTitle: toFullTitle
      }
    })
  },
  async deleteRedirection ({ fromFullTitle, toFullTitle }) {
    await request({
      path: `articles/${encodeURIComponent(fromFullTitle)}/redirections?to=${encodeURIComponent(toFullTitle)}`,
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
