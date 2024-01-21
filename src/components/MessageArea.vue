<template>
  <el-row class="index-mb index-row2">
    <div class="index-scrw" ref="myScrollbar">
      <infinite-loading direction="top" @infinite="getNewPage" :distance="0">
        <template slot="no-results">没有更多了</template>
        <template slot="no-more">没有更多了</template>
      </infinite-loading>
      <div v-for="(item, index) in list" :key="index">
        <div class="index-time" v-if="item.showTime">
          {{ time(item.time) }}
        </div>
        <div class="index-text" v-if="item.type == 'text'">
          <i
            class="el-icon-error index-remove-item"
            v-show="removing"
            @click="removeItem(item, index)"
          ></i>
          <div class="index-text-div" @click="copy(item.content)">
            <p
              class="index-text-p"
              v-for="(contentItem, contentIndex) in item.content
                .trim()
                .split('\n')"
              :key="'contentList' + contentIndex"
            >
              {{ contentItem }}
            </p>
          </div>
        </div>
        <div class="index-file" v-if="item.type == 'file'">
          <i
            class="el-icon-error index-remove-item"
            v-show="removing"
            @click="removeItem(item, index)"
          ></i>
          <div class="index-file-div" @click="download(item)">
            <i class="el-icon-document index-file-i">{{ item.content }}</i>
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import { time, copy } from "@/methods/utils.js";

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
      this.$emit("download", item);
    },
  },
};
</script>