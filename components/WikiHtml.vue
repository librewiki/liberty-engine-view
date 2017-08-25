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
}
</style>
