<template>
  <div class="about">
    <!-- 文章列表开关 -->
    <div class="articleDrawerSwitch">
      <a-switch :checked="articleDrawerSwitchChecked" checked-children="文章列表" un-checked-children="文章列表" default-checked @change="showArticleDrawer"/>
    </div>
    <!-- 文章列表 -->
    <a-drawer
      title="文章列表"
      placement="left"
      :closable=true
      :visible="articleVisible"
      @close="onCloseArticleDrawer"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>


    <!-- 文章回到顶部 -->
    <a-back-top :visibilityHeight="1">
      <div class="ant-back-top-inner">
      UP
      </div>
    </a-back-top>

    <!-- 文章目录开关 -->
    <div class="contents">
      <a-switch checked-children="目录" un-checked-children="目录" default-checked @change="openNavigation"/>
    </div>

    <!-- markdown编辑器,用于文章显示 -->
    <mavon-editor 
     ref=md
     :ishljs="setIshljs"
     v-model="content"
     :subfield="setSubfield"
     :defaultOpen="setDefaultOpen"
     :editable="setEditable"
     :toolbarsFlag="setToolbarsFlag"
     :navigation="setNavigation"
     :codeStyle="setCodeStyle"
     :externalLink="externalLink"/>
  </div>
</template>
<script>
import hljs from "highlight.js"

export default {
  name: 'About',
  data: function () {
    return {
      content: "",
      setNavigation: true,
      setDefaultOpen: "preview",
      setSubfield: false,
      setEditable: false,
      setToolbarsFlag: false,
      setIshljs: true,
      setCodeStyle: "atelier-cave-dark",
      externalLink: {
        hljs_css: function(css) {
          return 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/' + css + '.min.css'
        },
      },
      articleVisible: true,
      articleDrawerSwitchChecked: true
    }
  },
  created: function () {
    this.loadContent()
    window.onresize = () => {
      return (() => {
        this.reComputeContentsLeft()
      })();
    };
  },
  mounted() {
  },
  updated: function () {
    this.$nextTick(function () {
      this.highlightHandle()
      this.reComputeContentsLeft()
    })
  },
  methods: {
    showArticleDrawer() {
      this.articleVisible = true
      this.articleDrawerSwitchChecked = true
    },
    onCloseArticleDrawer() {
      this.articleVisible = false
      this.articleDrawerSwitchChecked = false
    },
    openNavigation: function() {
      if (this.$refs.md.s_navigation) {
        this.$refs.md.s_navigation = false
      } else {
        this.$refs.md.s_navigation = true
      }
    },
    loadContent: function() {
      this.$http.get(process.env.BASE_URL + "Kubernetes/02-k8s1.19.3_docker高可用集群部署/05-binary 搭建k8s高可用集群-k8s集群安装.md").then((response) => {
        this.content = response.data
      })
    },
    highlightHandle: async function(){
      await hljs
      let tags = document.querySelectorAll('.v-show-content code')
      tags.forEach((tag)=>{
        hljs.highlightBlock(tag)
      })
    },
    reComputeContentsLeft: function(){
      document.querySelector('div.contents').style = 'left:' + (window.innerWidth-100) + 'px;'
    },
  }
}
</script>
<style scoped>
.ant-back-top {
  bottom: 100px;
  z-index: 99998 !important;
}
.ant-back-top-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
.contents {
  position: relative;
  width: 80px;
  top: 35px;
  z-index: 99998;
}
.articleDrawerSwitch {
  position: fixed;
  width: 80px;
  top: 10px;
  left: 20px;
  z-index: 99998;
}
.ant-drawer {
  z-index: 99999
}
</style>