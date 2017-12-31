<template lang="pug">
.admin-grant
  p 사용자에게 특정한 역할을 부여하거나 해제할 수 있습니다.
  section.section-search(@keyup.enter="search")
    b-field(label="사용자 검색" message="역할을 설정할 사용자 이름을 입력해 주세요.")
      b-autocomplete(
        v-model="usernameToSearch"
        :data="usernameSuggestions"
        icon="search"
      )
    button.button.is-primary(@click="search") 찾기
  section.section-form(v-if="targetUser")
    .field(v-for="role in model.roles")
      b-checkbox(
        v-model="role.checked"
        :disabled="role.id === 2 || role.id === 3"
      ) {{ role.name }}
    button.button.is-primary(@click="submit") 적용
</template>

<script>
import _ from 'lodash'
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 사용자 역할 부여 / 해제'
    })
    const { data: { roles } } = await request({
      method: 'get',
      path: 'roles',
      req,
      res
    })
    return { roles }
  },
  data () {
    return {
      usernameToSearch: '',
      usernameSuggestions: [],
      targetUser: null,
      model: {
        roles: {}
      }
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
      this.model.roles = this.roles.map((role) => {
        const checked = targetUser.roles.some(userRole => userRole.id === role.id)
        return { ...role, checked }
      })
    },
    async submit () {
      const roleIds = this.model.roles.filter(role => role.checked).map(role => role.id)
      if (roleIds.includes(2) || !roleIds.includes(3)) return // grant anonymous or revoke loggedIn
      await request({
        method: 'put',
        path: `users/${this.targetUser.id}/roles`,
        body: { roleIds }
      })
      this.$toast.open({
        duration: 3000,
        message: '성공했습니다.',
        type: 'is-success'
      })
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
.admin-grant {
  .section-form {
    margin-top: 1rem;
  }
}
</style>
