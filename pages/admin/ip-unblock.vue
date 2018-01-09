<template lang="pug">
.admin-unblock
  section.section-search(@keyup.enter="search")
    b-field(label="검색" message="차단 범위에 속하는 아이피 주소 하나를 입력해 주세요.")
      b-input(
        v-model="model.ipToSearch"
        icon="search"
      )
    button.button.is-primary(@click="search") 찾기
  section.section-form(v-if="blocks")
    b-table(:data="blocks")
      template(slot-scope="props")
        b-table-column(label="차단 범위") {{ props.row.ipStart }} ~ {{ props.row.ipEnd }}
        b-table-column(label="차단 기한")
          template(v-if="props.row.expiration") {{ $moment(props.row.expiration).format('LLLL') }}
          template(v-else) 무기한
        b-table-column(label="차단 사유") {{ props.row.reason }}
        b-table-column(label="해제")
          button.button.is-primary(@click="unblock(props.row.id)") 해제  
      template(slot="empty")
        p 해당 아이피는 차단되어 있지 않습니다. 다시 검색해 주세요.
</template>

<script>
import request from '~/utils/request'
import { isIP } from 'validator'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 아이피 차단 해제'
    })
  },
  data () {
    return {
      model: {
        ipToSearch: ''
      },
      ip: null,
      blocks: null
    }
  },
  methods: {
    async search () {
      if (this.ip === this.model.ipToSearch) return
      if (!isIP(this.model.ipToSearch)) {
        this.$toast.open({
          duration: 3000,
          message: '아이피 주소를 올바르게 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      const { data: { blocks } } = await request({
        path: 'blocks',
        method: 'get',
        query: {
          containing: this.model.ipToSearch
        }
      })
      this.blocks = blocks
      this.ip = this.model.ipToSearch
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
          containing: this.ip
        }
      })
      this.blocks = blocks
    }
  }
}
</script>