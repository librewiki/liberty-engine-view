<template lang="pug">
.admin-user-block
  section.section-search(@keyup.enter="search")
    b-field(label="사용자 이름" message="차단할 사용자 이름을 입력해 주세요.")
      b-autocomplete(
        v-model="usernameToSearch"
        :data="usernameSuggestions"
        icon="search"
      )
    button.button.is-primary(@click="search") 찾기
  section.section-form(v-if="targetUser")
    b-field(label="차단 사유")
      b-input(v-model="model.reason")
    b-field(label="차단 기한" message="YYYY-MM-DD HH:mm 형식으로 입력하세요. (예: 2017-03-02 20:49) 비워 둘 경우 무기한 차단됩니다.")
      b-input(v-model="model.exp")
    button.button.is-primary(@click="submit") 차단
</template>

<script>
import _ from 'lodash'
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 사용자 차단'
    })
  },
  data () {
    return {
      model: {
        reason: '',
        exp: ''
      },
      targetUser: null,
      usernameToSearch: '',
      usernameSuggestions: []
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
      this.targetUser = targetUser
    },
    async submit () {
      const expiration = this.model.exp ? this.$moment(this.model.exp, 'YYYY-MM-DD HH:mm') : null
      if (expiration && !expiration.isValid()) {
        this.$toast.open({
          duration: 3000,
          message: '날짜를 올바르게 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      if (expiration && !expiration.isAfter()) {
        this.$toast.open({
          duration: 3000,
          message: '현재 이후의 시간을 입력해야 합니다.',
          type: 'is-danger'
        })
        return
      }
      await request({
        path: 'blocks',
        method: 'post',
        body: {
          userId: this.targetUser.id,
          reason: this.model.reason,
          expiration: expiration || null
        }
      })
      history.go(0)
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

<style lang="scss">
.admin-user-block {
  .section-form {
    margin-top: 1rem;
  }
}
</style>