<template lang="pug">
.page.page-permission
  p
    | 특정한 역할을 가진 사용자에게 이 문서에 관한 권한을 부여할 수 있습니다.
    | 기본값으로 설정한 경우 네임스페이스별 설정에 따릅니다.
  b-table(:data="table")
    template(slot-scope="props")
      b-table-column(label="역할")
        | {{ props.row.roleName }}
      b-table-column(label="읽기")
        b-field
          b-select(v-model="props.row.readable")
            option(:value="null") 기본값
            option(:value="true") 허용
            option(:value="false") 금지
      b-table-column(label="편집")
        b-field
          b-select(v-model="props.row.editable")
            option(:value="null") 기본값
            option(:value="true") 허용
            option(:value="false") 금지
      b-table-column(label="이름 변경")
        b-field
          b-select(v-model="props.row.renamable")
            option(:value="null") 기본값
            option(:value="true") 허용
            option(:value="false") 금지
      b-table-column(label="삭제")
        b-field
          b-select(v-model="props.row.deletable")
            option(:value="null") 기본값
            option(:value="true") 허용
            option(:value="false") 금지
  .right-wrapper
    button.button.is-primary(@click="submit") 설정
</template>

<script>
import articleManager from '~/utils/articleManager'
import request from '~/utils/request'
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서 권한 설정`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'permissions',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서 권한 설정`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })

      if (!article.allowedActions.includes('set-permission')) {
        return error({ statusCode: 403, message: '권한을 설정할 권한이 없습니다.' })
      }

      const { data: { roles } } = await request({
        method: 'get',
        path: 'roles',
        req,
        res
      })

      const table = roles.map(role => {
        const permission = article.permissions.find(p => p.roleId === role.id)
        if (permission) {
          return {
            roleId: role.id,
            roleName: role.name,
            readable: permission.readable,
            editable: permission.editable,
            renamable: permission.renamable,
            deletable: permission.deletable
          }
        } else {
          return {
            roleId: role.id,
            roleName: role.name,
            readable: null,
            editable: null,
            renamable: null,
            deletable: null
          }
        }
      })

      return {
        article,
        table
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.status === 404) {
        return error({ statusCode: 404, message: '문서가 존재하지 않습니다.' })
      }
      if (err.response.data.name === 'UnauthorizedError') {
        return error({ statusCode: 403, message: '권한이 없습니다.' })
      }
      return error({ statusCode: 500 })
    }
  },
  methods: {
    async submit () {
      await articleManager.setPermissions({
        fullTitle: this.article.fullTitle,
        articlePermissions: this.table
          .map(row => ({
            roleId: row.roleId,
            readable: row.readable,
            editable: row.editable,
            renamable: row.renamable,
            deletable: row.deletable
          }))
          .filter(row => row.readable !== null || row.editable !== null || row.renamable !== null || row.deletable !== null)
      })
      history.go(0)
    }
  }
}
</script>

<style lang="scss">
</style>
