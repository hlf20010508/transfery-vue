<template>
  <div class="index">
    <el-row class="index-row1">
      <div class="index-now">{{ now }}</div>
    </el-row>
    <MessageArea
      ref="MessageArea"
      :list="list"
      :removing="removing"
      @getNewPage="getNewPage"
      @removeItem="removeItem"
    />
    <el-row class="index-row2">
      <el-divider class="index-divider"></el-divider>
    </el-row>
    <ControlBar
      ref="ControlBar"
      :uploadsList="uploadsList"
      @uploadFile="uploadFile"
      @closeRemoveMode="closeRemoveMode"
      @remove="remove"
      @removeCompletedUploads="removeCompletedUploads"
      @resumeUploadsItem="resumeUploadsItem"
      @pauseUploadsItem="pauseUploadsItem"
    />
    <InputArea
      :removing="removing"
      @removeAll="removeAll"
      @unremove="unremove"
      @focus="focus"
      @blur="blur"
      @submit="submit"
    />
  </div>
</template>

<script>
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";
import { time } from "@/methods/utils.js";
import {
  setUpdateTime,
  adjustCSS,
  setHeight,
  setAutoRefresh,
} from "@/methods/init.js";
import {
  connect as connectSocketInner,
  disconnect as disconnectSocketInner,
  getNewItem as getNewItemSocketInner,
  removeItem as removeItemSocketInner,
  removeAll as removeAllSocketInner,
} from "@/methods/socket.js";
import {
  listenResize as listenResizeInner,
  focus as focusInner,
  blur as blurInner,
} from "@/methods/mobile.js";
import {
  toBottom as toBottomInner,
  getNewPage as getNewPageInner,
  sync as syncInner,
  submit as submitInner,
  remove as removeInner,
  unremove as unremoveInner,
  removeItem as removeItemInner,
  removeAll as removeAllInner,
} from "@/methods/message.js";
import {
  uploadFile as uploadFileInner,
  pauseUploadsItem as pauseUploadsItemInner,
  resumeUploadsItem as resumeUploadsItemInner,
  removeCompletedUploads as removeCompletedUploadsInner,
} from "@/methods/io.js";

export default {
  components: {
    MessageArea,
    ControlBar,
    InputArea,
  },
  data() {
    return {
      page: 0,
      list: [],
      // uploadsList中item.uploadingPercentage 0～100为上传进度，-1为上传完成，-2为取消上传
      uploadsList: [],
      removing: false,
      now: time(Date.parse(Date())),
      htmlHeight: null, //苹果
      displayHeight: null, //苹果
      windowHeight: null, //安卓
      refreshInterval: null, //页面切出计时器
    };
  },
  mounted() {
      adjustCSS();
      setUpdateTime(this);
      setHeight(this);
      setAutoRefresh(this);
  },
  sockets: {
    connect() {
      connectSocketInner(this);
    },
    disconnect() {
      disconnectSocketInner(this);
    },
    getNewItem() {
      getNewItemSocketInner(this, item);
    },
    removeItem() {
      removeItemSocketInner(this, id);
    },
    removeAll() {
      removeAllSocketInner(this);
    },
  },
  methods: {
    listenResize() {
      listenResizeInner(this);
    },
    focus() {
      focusInner(this);
    },
    blur() {
      blurInner(this);
    },
    toBottom() {
      toBottomInner(this);
    },
    getNewPage($state) {
      getNewPageInner(this, $state);
    },
    sync() {
      syncInner(this);
    },
    submit(value) {
      submitInner(this, value);
    },
    // 在选择文件的时候关闭remove模式
    closeRemoveMode() {
      this.unremove();
    },
    uploadFile(res) {
      uploadFileInner(this, res);
    },
    remove() {
      removeInner(this);
    },
    unremove() {
      unremoveInner(this);
    },
    removeItem(item, index) {
      removeItemInner(this, item, index);
    },
    removeAll() {
      removeAllInner(this);
    },
    removeCompletedUploads() {
      removeCompletedUploadsInner(this);
    },
    pauseUploadsItem(index) {
      pauseUploadsItemInner(this, index);
    },
    async resumeUploadsItem(index) {
      await resumeUploadsItemInner(this, index);
    },
  },
};
</script>

<style>
.index {
  max-width: 600px;
  height: 100%;
  margin: 0 auto 0 auto;
  background: #f3f3f3;
}

.index-now {
  margin: 10px 0 10px 0;
}

.index-divider {
  margin: 0 0 10px 0;
}
</style>
