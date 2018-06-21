<template lang="pug">
.admin-grant
  p 역할(Role)은 권한들의 집합입니다. 역할을 부여받은 사용자는 그 역할에 속한 권한을 가지게 됩니다.
  section
    h3.is-size-3 새 역할 추가
    b-field(label="역할 이름")
      b-input(v-model="newRoleName")
    button.button.is-primary(@click="submitNewRole") 추가
  section
    h3.is-size-3 역할 편집 / 제거
    b-field(label="역할 선택")
      b-select(placeholder="편집할 역할을 선택하세요." @input="fetchRole")
        option(v-for="role in roles" :value="role.id") {{ role.name }}
    section(v-if="roleId")
      p (체크: 허용)
      b-table(:data="permissionTable")
        template(slot-scope="props")
          b-table-column(label="네임스페이스")
            | {{ props.row.namespaceName }}
          b-table-column(label="읽기")
            b-field
              b-checkbox(v-model="props.row.readable")
          b-table-column(label="문서 생성")
            b-field
              b-checkbox(v-model="props.row.creatable")
          b-table-column(label="편집")
            b-field
              b-checkbox(v-model="props.row.editable")
          b-table-column(label="이름 변경")
            b-field
              b-checkbox(v-model="props.row.renamable")
          b-table-column(label="삭제")
            b-field
              b-checkbox(v-model="props.row.deletable")
      button.button.is-primary(@click="submitNamespacePermission") 저장
    section(v-if="roleId")
      h3.is-size-3 특수 권한
      b-field(v-for="(value, key) in specialPermissions" :key="key")
        b-checkbox(v-model="specialPermissions[key]") {{ key }}
      button.button.is-primary(@click="submitSpecialPermission") 저장
    section(v-if="roleId && roleId > 3")
      h3.is-size-3 역할 제거
      p 역할을 제거합니다. 그 역할을 부여받은 사용자들은 해당하는 권한을 잃게 됩니다.
      button.button.is-danger(@click="removeRole") 삭제
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 역할 관리'
    })
    const [
      { data: { roles } },
      { data: { namespaces } },
      { data: { specialPermissions } }
    ] = await Promise.all([
      request({
        method: 'get',
        path: 'roles',
        req,
        res
      }),
      request({
        method: 'get',
        path: 'namespaces',
        req,
        res
      }),
      request({
        method: 'get',
        path: 'special-permissions',
        req,
        res
      })
    ])
    const permissionTable = namespaces.map((namespace) => {
      return {
        namespaceId: namespace.id,
        namespaceName: namespace.name,
        readable: false,
        creatable: false,
        editable: false,
        renamable: false,
        deletable: false
      }
    })
    const specialPermissionsObj = specialPermissions.reduce((obj, key) => {
      obj[key] = false
      return obj
    }, {})
    return { roles, namespaces, permissionTable, specialPermissions: specialPermissionsObj }
  },
  data () {
    return {
      roleId: null,
      newRoleName: ''
    }
  },
  methods: {
    async submitNewRole () {
      if (!this.newRoleName) {
        this.$toast.open({
          duration: 3000,
          message: '역할 이름을 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      if (this.newRoleName.length > 127) {
        this.$toast.open({
          duration: 3000,
          message: '역할 이름이 너무 깁니다.',
          type: 'is-danger'
        })
        return
      }
      await request({
        path: `roles`,
        method: 'post',
        body: { role: { name: this.newRoleName } }
      })
      history.go(0)
    },
    async fetchRole (roleId) {
      this.roleId = roleId
      const { data: { role } } = await request({
        method: 'get',
        path: `roles/${roleId}`
      })
      this.permissionTable = this.namespaces.map((namespace) => {
        return {
          namespaceId: namespace.id,
          namespaceName: namespace.name,
          readable: false,
          creatable: false,
          editable: false,
          renamable: false,
          deletable: false
        }
      })
      for (const key of Object.keys(this.specialPermissions)) {
        this.specialPermissions[key] = false
      }
      role.namespacePermissions.forEach((p) => {
        const permissionRow = this.permissionTable.find(row => row.namespaceId === p.namespaceId)
        permissionRow.readable = p.readable
        permissionRow.creatable = p.creatable
        permissionRow.editable = p.editable
        permissionRow.renamable = p.renamable
        permissionRow.deletable = p.deletable
      })
      role.specialPermissions.forEach((p) => {
        this.specialPermissions[p.name] = true
      })
    },
    async submitNamespacePermission () {
      await request({
        path: `roles/${this.roleId}/namespace-permissions`,
        method: 'put',
        body: { namespacePermissions: this.permissionTable }
      })
      this.$toast.open({
        duration: 3000,
        message: '완료되었습니다.',
        type: 'is-success'
      })
      this.fetchRole(this.roleId)
    },
    async submitSpecialPermission () {
      const specialPermissions = Object.keys(this.specialPermissions)
        .map(key => this.specialPermissions[key] === true ? key : null)
        .filter(x => !!x)
      await request({
        path: `roles/${this.roleId}/special-permissions`,
        method: 'put',
        body: { specialPermissions }
      })
      this.$toast.open({
        duration: 3000,
        message: '완료되었습니다.',
        type: 'is-success'
      })
      this.fetchRole(this.roleId)
    },
    async removeRole () {
      await request({
        path: `roles/${this.roleId}`,
        method: 'DELETE'
      })
      this.$toast.open({
        duration: 3000,
        message: '완료되었습니다.',
        type: 'is-success'
      })
      history.go(0)
    }
  }
}
</script>

<style lang="scss">
.admin-grant {
  .select select {
    width: 100%;
  }
}
</style>
