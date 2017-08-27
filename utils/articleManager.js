import request from './request'

export default {
  async getByFullTitle (fullTitle, { fields = [], req, res } = {}) {
    const resp = await request({
      path: `articles/full-title/${encodeURIComponent(fullTitle)}?fields=${fields.join(',')}`,
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
      path: `articles/full-title/${fullTitle}/wikitext`,
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
      path: `articles/full-title/${fullTitle}/full-title`,
      method: 'put',
      body: {
        fullTitle: newFullTitle
      }
    })
  },
  async addRedirection ({ fromFullTitle, toFullTitle }) {
    await request({
      path: `articles/full-title/${fromFullTitle}/redirections`,
      method: 'post',
      body: {
        fullTitle: toFullTitle
      }
    })
  },
  async deleteRedirection ({ fromFullTitle, toFullTitle }) {
    await request({
      path: `articles/full-title/${fromFullTitle}/redirections?to=${toFullTitle}`,
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
