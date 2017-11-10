<template lang="pug">
.admin-grant
  p 역할(Role)은 권한들의 집합입니다. 역할을 부여받은 사용자는 그 역할에 속한 권한을 가지게 됩니다.
  b-field(label="권한 선택")
    b-select(placeholder="편집할 권한을 선택하세요." @input="fetchNamespacePermissions")
      option(v-for="role in roles" :value="role.id") {{ role.name }}
  section(v-if="roleId")
    h3.is-size-3 네임스페이스별 권한
    p (체크: 허용)
    b-table(:data="permissionTable")
      template(scope="props")
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
  //- section(v-if="roleId")
  //-   h3.is-size-3 특수 권한
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 역할 관리'
    })
    const { data: { roles } } = await request({
      method: 'get',
      path: 'roles',
      req,
      res
    })
    const { data: { namespaces } } = await request({
      method: 'get',
      path: 'namespaces',
      req,
      res
    })
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
    return { roles, namespaces, permissionTable }
  },
  data () {
    return {
      roleId: null
    }
  },
  methods: {
    async fetchNamespacePermissions (roleId) {
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
      role.namespacePermissions.forEach((p) => {
        const permissionRow = this.permissionTable.find(row => row.namespaceId === p.namespaceId)
        permissionRow.readable = p.readable
        permissionRow.creatable = p.creatable
        permissionRow.editable = p.editable
        permissionRow.renamable = p.renamable
        permissionRow.deletable = p.deletable
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
      this.fetchNamespacePermissions(this.roleId)
    },
    async submitSpecialPermission () {

    }
  }
}
</script>
