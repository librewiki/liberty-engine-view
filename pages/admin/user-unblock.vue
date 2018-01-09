<template lang="pug">
.admin-unblock
  section.section-search(@keyup.enter="search")
    b-field(label="사용자 이름" message="차단을 해제할 사용자 이름을 입력해 주세요.")
      b-autocomplete(
        v-model="usernameToSearch"
        :data="usernameSuggestions"
        icon="search"
      )
    button.button.is-primary(@click="search") 찾기
  section.section-form(v-if="blocks")
    b-table(:data="blocks")
      template(slot-scope="props")
        b-table-column(label="차단 기한")
          template(v-if="props.row.expiration") {{ $moment(props.row.expiration).format('LLLL') }}
          template(v-else) 무기한
        b-table-column(label="차단 사유") {{ props.row.reason }}
        b-table-column(label="해제")
          button.button.is-primary(@click="unblock(props.row.id)") 해제  
      template(slot="empty")
        p 해당 사용자는 차단되어 있지 않습니다. 다시 검색해 주세요.
</template>

<script>
import request from '~/utils/request'
import _ from 'lodash'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 사용자 차단 해제'
    })
  },
  data () {
    return {
      usernameToSearch: '',
      usernameSuggestions: [],
      targetUser: null,
      blocks: null
    }
  },
  methods: {
    async search () {
      const { data: { users: [targetUser] } } = await request({
        method: 'get',
        path: 'users',
        query: {
          username: this.usernameToSearch
        }
      })
      if (!targetUser) {
        this.$toast.open({
          duration: 3000,
          message: '해당 사용자는 존재하지 않습니다.',
          type: 'is-danger'
        })
        return
      }
      const { data: { blocks } } = await request({
        path: 'blocks',
        method: 'get',
        query: {
          userId: targetUser.id
        }
      })
      this.targetUser = targetUser
      this.blocks = blocks
    },
    async unblock (id) {
      await request({
        path: `blocks/${id}`,
        method: 'delete'
      })
      const { data: { blocks } } = await request({
        path: 'blocks',
        method: 'get',
        query: {
          user: this.targetUser.id
        }
      })
      this.blocks = blocks
    }
  },
  watch: {
    usernameToSearch: _.debounce(async function () {
      if (!this.usernameToSearch) return
      const resp = await request({
        method: 'get',
        path: `users`,
        query: {
          startingWith: this.usernameToSearch,
          limit: 20
        }
      })
      this.usernameSuggestions = resp.data.users.map(targetUser => targetUser.username)
    }, 200)
  }
}
</script>