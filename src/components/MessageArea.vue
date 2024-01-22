<template>
  <el-row class="message-area">
    <div class="message-area-scrw" ref="myScrollbar">
      <infinite-loading direction="top" @infinite="getNewPage" :distance="0">
        <template slot="no-results">没有更多了</template>
        <template slot="no-more">没有更多了</template>
      </infinite-loading>
      <div v-for="(item, index) in list" :key="index">
        <div class="message-area-time" v-if="item.showTime">
          {{ time(item.time) }}
        </div>
        <div class="message-area-text" v-if="item.type == 'text'">
          <i
            class="el-icon-error message-area-remove-item"
            v-show="removing"
            @click="removeItem(item, index)"
          ></i>
          <div class="message-area-text-div" @click="copy(item.content)">
            <p
              class="message-area-text-p"
              v-for="(contentItem, contentIndex) in item.content
                .trim()
                .split('\n')"
              :key="'contentList' + contentIndex"
            >
              {{ contentItem }}
            </p>
          </div>
        </div>
        <div class="message-area-file" v-if="item.type == 'file'">
          <i
            class="el-icon-error message-area-remove-item"
            v-show="removing"
            @click="removeItem(item, index)"
          ></i>
          <div class="message-area-file-div" @click="download(item)">
            <i class="el-icon-document message-area-file-i">{{
              item.content
            }}</i>
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import { time, copy } from "@/methods/utils.js";
import { download as downloadInner } from "@/methods/io.js";

export default {
  props: ["list", "removing"],
  methods: {
    time,
    copy,
    getNewPage($state) {
      this.$emit("getNewPage", $state);
    },
    removeItem(item, index) {
      this.$emit("removeItem", item, index);
    },
    download(item) {
      downloadInner(item)
    },
  },
};
</script>

<style>
.message-area {
  height: 70%;
}

.message-area-scrw {
  height: 100%;
  margin: 0 10px 0 20px;
  padding-right: 10px;
  overflow: auto;
}

.message-area-time {
  font-size: 14px;
  color: #aaaaaa;
  text-align: left;
}

.message-area-text {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  text-align: left;
  display: flex;
}

.message-area-remove-item {
  vertical-align: top;
  margin-top: 12px;
}

.message-area-remove-item:hover {
  cursor: pointer;
  color: #f56c6c;
}

.message-area-text-div {
  display: inline-block;
}

.message-area-text-div:hover {
  cursor: pointer;
}

.message-area-text-p {
  margin: 8px 0;
}

.message-area-file {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  text-align: left;
  display: flex;
}

.message-area-file-div {
  word-break: break-all;
}

.message-area-file-div:hover {
  cursor: pointer;
  color: #409eff;
}

.message-area-file-i {
  margin: 12px 0;
}
</style>