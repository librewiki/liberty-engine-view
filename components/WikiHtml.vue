<template lang="pug">
  .wiki-content(v-html="html" @click="handleInternalLink")
</template>

<script>
import url from 'url'

export default {
  props: {
    html: String
  },
  methods: {
    handleInternalLink (event) {
      if (event.button === 1 || event.metaKey || event.ctrlKey) return
      const clickedEl = event.target
      let checkingNode = clickedEl
      while (checkingNode) {
        if (checkingNode.matches('.wiki-content')) {
          checkingNode = undefined
        } else if (checkingNode.matches('.wiki-content a')) {
          const href = checkingNode.getAttribute('href')
          if (!href) return
          const resolvedHref = url.resolve(window.location.href, href)
          const { host, path, query, hash } = url.parse(resolvedHref)
          if (host === window.location.host) {
            event.preventDefault()
            this.$router.push({ path, query, hash })
            if (hash) {
              setTimeout(() => {
                scrollBy({ top: -42, behavior: 'smooth' })
              }, 100)
            }
          }
          checkingNode = undefined
        } else {
          checkingNode = checkingNode.parentNode
        }
      }
    }
  }
}
</script>

<style lang="scss">
.wiki-content {
  pre {
    display: block;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f8fa;
    border: 1px solid #e1e8ed;
    border-radius: 0.35rem;
    padding: 0.8rem;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 90%;
    line-height: 1.5;
  }

  h2 {
    margin: 0.5rem 0;
  }

  p {
    margin-bottom: 0.8rem;
  }

  ol {
    margin-left: 2rem;
    margin-right: 1rem;
  }

  ul {
    margin-left: 1rem;
    list-style-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%225%22%20height%3D%2213%22%3E%0A%3Ccircle%20cx%3D%222.5%22%20cy%3D%229.5%22%20r%3D%222.5%22%20fill%3D%22%23373a3c%22%2F%3E%0A%3C%2Fsvg%3E%0A);
  }

  .toc {
    border-bottom-right-radius: 0.35rem;
    border-bottom-left-radius: 0.35rem;
    display: inline-block;
    font-size: 0.9rem;
    .toc-title {
      background-color: #f5f8fa;
    	border: 1px solid #e1e8ed;
    	border-top-right-radius: 0.35rem;
    	border-top-left-radius: 0.35rem;
    	padding: 0.6rem 1.2rem;
      h2 {
        display: inline;
      	font-size: 1.2rem;
      	font-weight: bold;
      	border: none;
      }
    }
    ul, li {
      background-color: #fff;
    	list-style-type: none;
    	list-style-image: none;
    }
    &>ul {
    	padding: 0.6rem 1.2rem;
    	border: 1px solid #e1e8ed;
    	border-top: none;
    	border-bottom-right-radius: 0.35rem;
    	border-bottom-left-radius: 0.35rem;
    }
    ul {
      margin: 0;
    }
    .toc-text {
      color: #373a3c;
    }
    a:hover {
      text-decoration: none;
    }
    a>.toc-number:hover {
      text-decoration: underline;
    }
  }

  .references {
    font-size: 90%;
    margin-left: 2.2rem;
  }

  .liberty-table-wrapper {
  	overflow-x: auto;
  	overflow-y: hidden;
  	max-width: 100%;
  	display: block;
    table ul {
    	margin: 0.3rem 0 0.3rem 0.2rem;
    }
  }

  .table-right {
  	float: right;
  }

  table.wikitable,
  table.infobox {
  	width: auto;
  	background: #fff;
  	border: none;
  	border-radius: 0.35rem;
  	border-collapse: separate;
  	border-spacing: 0;
  	float: none;
  	margin: 0.8rem 0;
  	padding: 0;
  	color: #373a3c;
    caption {
  		color: #373a3c;
    	font-size: 1.2rem;
    	padding: 0.2rem 0;
    	font-weight: bold;
    	text-align: center;
  		caption-side: top;
    }
  }

  table.wikitable {
  	width: auto;
    border-collapse: separate;
    border-radius: 0.35rem;
    th {
    	background-color: #f5f8fa;
    	text-align: center;
    	word-break: keep-all;
    }
    tr>th,
    tr>td {
      border: 0;
    	padding: 0.3rem 0.6rem;
    	border-top: 1px solid #e1e8ed;
    	border-right: 1px solid #e1e8ed;
      &:first-child {
        border-left: 1px solid #e1e8ed;
      }
      &:last-child {
        border-right: 1px solid #e1e8ed;
      }
  		&[rowspan]:first-child {
        border-right: 0;
        &+td,
        &+th {
          border-left: 1px solid #e1e8ed;
        }
      }
    }
    tr:last-child {
      &>th,
      &>td {
        border-bottom: 1px solid #e1e8ed;
      }
    }
    tr:first-child {
      &>th,
      &>td {
        &:first-child {
          border-radius: 0.35rem 0 0 0;
        }
        &:last-child {
          border-radius: 0 0.35rem 0 0;
        }
        &:only-child {
          border-radius: 0.35rem 0.35rem 0 0;
        }
      }
    }
    tr:last-child {
      &>th,
      &>td {
        &:first-child {
          border-radius: 0 0 0 0.35rem;
        }
        &:last-child {
          border-radius: 0 0 0.35rem 0;
        }
        &:only-child {
          border-radius: 0 0 0.35rem 0.35rem;
        }
      }
    }
    tr:only-child {
      &>th,
      &>td {
        &:first-child {
          border-radius: 0.35rem 0 0 0.35rem
        }
        &:last-child {
          border-radius: 0 0.35rem 0.35rem 0
        }
        &:only-child {
          border-radius: 0.35rem 0.35rem 0.35rem 0.35rem;
        }
      }
    }
  }
}
</style>
