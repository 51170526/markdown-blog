<template>
  <div class="main">
    <!-- 文章列表开关 -->
    <div class="articleDrawerSwitch">
      <a-switch :checked="articleDrawerSwitchChecked" checked-children="文章列表" un-checked-children="文章列表" default-checked @change="showArticleDrawer"/>
    </div>
    <!-- 文章列表 -->
    <a-drawer
      title="文章列表"
      placement="left"
      :closable=true
      :width="720"
      :visible="articleVisible"
      @close="onCloseArticleDrawer"
    >
      <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
        <template v-for="article in articleDataList">
          <template v-if="article.isFolder">
            <a-tree-node :key="article.id" :title="article.title">
              <template v-for="articleLevelTwo in article.children">
                <template v-if="articleLevelTwo.isFolder">
                  <a-tree-node :key="articleLevelTwo.id" :title="articleLevelTwo.title">
                    <template v-for="articleLevelThree in articleLevelTwo.children">
                      <template v-if="articleLevelThree.isFolder">
                        <a-tree-node :key="articleLevelThree.id" :title="articleLevelThree.title">
                        </a-tree-node>
                      </template>
                      <template v-else>
                        <a-tree-node :key="articleLevelThree.id" :title="articleLevelThree.title" is-leaf :path="articleLevelThree.path" :pPath="articleLevelThree.pPath"/>
                      </template>
                    </template>
                  </a-tree-node>
                </template>
                <template v-else>
                  <a-tree-node :key="articleLevelTwo.id" :title="articleLevelTwo.title" is-leaf :path="articleLevelTwo.path" :pPath="articleLevelTwo.pPath"/>
                </template>
              </template>
            </a-tree-node>
          </template>
          <template v-else>
            <a-tree-node :key="article.id" :title="article.title" is-leaf :path="article.path" :pPath="article.pPath"/>
          </template>
        </template>
      </a-directory-tree>
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
  name: 'Main',
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
      articleDrawerSwitchChecked: true,
      articleDataList: []
    }
  },
  created: function () {
    window.onresize = () => {
      return (() => {
        // 窗口大小改变，重新计算文章目录开关位置
        this.reComputeContentsLeft()
      })();
    };

    // 加载文章列表
    this.$http({
      method: 'get',
      url: process.env.BASE_URL + "article.json",
      headers: {
				'Content-Type':'application/text/html;charset=utf-8'
			}}).then((response) => {
      this.articleDataList = response.data
    })
  },
  mounted() {
  },
  updated: function () {
    this.$nextTick(function () {
      // 代码高亮处理
      this.highlightHandle()
      // 计算文章目录开关显示位置
      this.reComputeContentsLeft()
    })
  },
  methods: {
    onSelect(keys, event) {
      if(event.node.$attrs.path){
        this.loadContent(event.node.$attrs.path, event.node.$attrs.pPath)
      }
    },
    onExpand() {
    },
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
    loadContent: function(path, pPath) {
      this.$http.get(process.env.BASE_URL + path).then((response) => {
        this.content = response.data.replace('_v_images', pPath + '_v_images')
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