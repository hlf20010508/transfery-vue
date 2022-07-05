<template>
  <div class="index">
    <el-row class="index-row1">
      <div class="index-now">{{ now }}</div>
    </el-row>
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
            <span>
              <i
                class="el-icon-error index-remove-item"
                v-show="removing"
                @click="removeItem(item, index)"
              ></i>
              {{ item.content }}
            </span>
          </div>
          <div class="index-file" v-if="item.type == 'file'">
            <div>
              <el-progress
                v-if="isUploading(item)"
                :text-inside="true"
                :stroke-width="24"
                :percentage="getUploadingPercentage(item)"
                :format="getProgressContent"
                status="success"
              />
            </div>
            <div>
              <i
                class="el-icon-error index-remove-item"
                v-show="removing"
                @click="removeItem(item, index)"
              ></i>
              <span class="index-file-span" @click="download(item)">
                <i class="el-icon-document"></i>
                {{ item.content }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <el-row class="index-row3">
      <el-divider class="index-divider"></el-divider>
    </el-row>
    <el-row class="index-row4">
      <el-col :span="3">
        <el-upload
          action="/post/upload"
          multiple
          :http-request="uploadFile"
          :show-file-list="false"
        >
          <div class="index-upload-div">
            <i
              slot="trigger"
              class="el-icon-folder index-upload"
              @click="selectFile"
            ></i>
          </div>
        </el-upload>
      </el-col>
      <el-col :span="3">
        <div class="index-remove-div" @click="remove">
          <i class="el-icon-close index-remove"></i>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="index-refresh-div" @click="refresh">
          <i class="el-icon-refresh index-refresh"></i>
        </div>
      </el-col>
    </el-row>
    <el-row class="index-row5 index-input">
      <div v-if="removing" class="index-remove-all-div">
        <div>
          <i
            class="el-icon-circle-close index-remove-all"
            @click="removeAll"
          ></i>
          <i
            class="el-icon-circle-check index-remove-complete"
            @click="unremove"
          ></i>
        </div>
      </div>
      <el-input
        v-if="!removing"
        type="textarea"
        v-model="input"
        placeholder="请输入消息内容"
        @focus="focus"
        @blur="blur"
        @keyup.enter.native="submit"
      ></el-input>
    </el-row>
  </div>
</template>

<script>
import Moment from "moment";
import jquery from "jquery";
import device from "current-device";
import keyboardObserver from "keyboard-height";

export default {
  data() {
    return {
      page: 0,
      list: [],
      input: null,
      removing: false,
      now: this.time(Date.parse(Date())),
      htmlHeight: null, //苹果
      displayHeight: null, //苹果
      windowHeight: null, //安卓
      refreshInterval: null, //页面切出计时器
    };
  },
  mounted() {
    this.updateTime();
    this.adjustCSS();
    this.htmlHeight = jquery("html").outerHeight();
    this.displayHeight = jquery(".index-mb").outerHeight();
    window.addEventListener("visibilitychange", this.autoRefreshAfterResume);
  },
  sockets: {
    connect: function () {
      console.log(`client ${this.$socket.id} connected`);
    },
    disconnect() {
      console.log(`client ${this.$socket.id} disconnected`);
    },
    getNewItem(item) {
      console.log("got new item");
      this.list.push(item);
      console.log("new item pushed");
      this.$nextTick(() => this.toBottom());
    },
    removeItem(id) {
      console.log("got item to be removed");
      for (let i in this.list) {
        if (this.list[i].id == id) {
          this.list.splice(i, 1);
          console.log("item removed");
          break;
        }
      }
    },
    removeAll() {
      this.list = [];
      console.log("all items removed");
    },
  },
  methods: {
    adjustCSS() {
      let height = 0;
      height += jquery(".index-row1").outerHeight();
      height += jquery(".index-row2").outerHeight();
      height += jquery(".index-row3").outerHeight();
      height += jquery(".index-row4").outerHeight();
      let heightHTML = jquery("body").outerHeight();
      jquery(".index-input").css("height", heightHTML - height + "px");
      jquery(".index-input textarea").css(
        "height",
        heightHTML - height - 10 + "px"
      );

      if (device.mobile()) {
        //手机
        jquery("body").css("background", "#409eff");
      }
    },
    refresh() {
      this.$loading({
        fullscreen: true,
        background: "rgba(255, 255, 255, 0.5)",
      });
      setInterval(() => location.reload(), 500); //延迟0.5秒刷新，让loading图标能够显示全，不然只有一个点在转
    },
    autoRefreshAfterResume() {
      // 手机浏览器切出去后再回来就无法收到期间的消息，需要刷新
      if (document.visibilityState === "hidden") {
        //如果切出去太久，则会刷新页面
        console.log("app hidden");
        this.refreshInterval = setInterval(() => {
          this.refresh();
        }, 30 * 60 * 1000); //超过30钟没有切回就刷新
      }
      if (document.visibilityState === "visible") {
        clearInterval(this.refreshInterval); //取消计时
        console.log("app visible");
        //只刷新数据，不刷新页面
        this.sync();
      }
    },
    listenResize() {
      //安卓
      let newWindowHeight = document.documentElement.clientHeight;
      if (this.windowHeight == newWindowHeight) {
        jquery(".index-mb").css("height", this.displayHeight + "px");
      } else {
        let keyboardHeight = keyboardObserver.getKeyboardHeight();
        jquery(".index-mb").css(
          "height",
          this.displayHeight - keyboardHeight + "px"
        );
        this.toBottom();
      }
    },
    focus() {
      if (device.iphone() || device.ipod()) {
        //苹果 输入法获取焦点时页面元素高度不变，整体向上移动，因此在键盘呼出后滚动到最上方并减小页面和显示框的高度，以保证整体在可视范围内
        //需要延迟，不然检测时键盘还没呼出，得到的高度为0
        setTimeout(() => {
          let keyboardHeight = keyboardObserver.getKeyboardHeight(); //获取键盘高度
          document.documentElement.scrollTop = 0; //滚动到页面最上方
          jquery("html").css("height", this.htmlHeight - keyboardHeight + "px"); //减小页面高度, 若不减小，输入框高度会变大
          jquery(".index-mb").css(
            "height",
            this.displayHeight - keyboardHeight + "px"
          ); //减小显示框高度

          this.toBottom();
        }, 300);
      }
      if (device.androidPhone()) {
        //安卓 输入法获取焦点时页面元素高度改变，且收起键盘后不失去焦点。主要麻烦在于收起键盘不失去焦点。因此需要在获得焦点时监听页面高度
        //若页面高度恢复初始高度，说明键盘收起，则恢复显示框高度；若页面高度小于初始高度，说明键盘又被调起，则减小显示框高度
        setTimeout(() => {
          let keyboardHeight = keyboardObserver.getKeyboardHeight();
          jquery(".index-mb").css(
            "height",
            this.displayHeight - keyboardHeight + "px"
          );
          this.toBottom();
        }, 300);
        this.windowHeight = document.documentElement.clientHeight;
        window.addEventListener("resize", this.listenResize);
      }
    },
    blur() {
      if (device.iphone() || device.ipod()) {
        jquery("html").css("height", this.htmlHeight + "px");
        jquery(".index-mb").css("height", this.displayHeight + "px");
      }
      if (device.androidPhone()) {
        window.removeEventListener("resize", this.listenResize);
        jquery(".index-mb").css("height", this.displayHeight + "px");
      }
    },
    time(timeParse) {
      let date = new Moment(timeParse);
      return date.format("YYYY-MM-DD HH:mm:ss");
    },
    updateTime() {
      setInterval(() => (this.now = this.time(Date.parse(Date()))), 1000);
    },
    shouldShowTime(time1, time2) {
      let date1 = new Date(time1);
      let date2 = new Date(time2);
      if (Math.abs(date1.getTime() - date2.getTime()) > 1000 * 60) {
        return true;
      }
      return false;
    },
    toBottom() {
      this.$refs.myScrollbar.scrollTop =
        this.$refs.myScrollbar.scrollHeight;
    },
    getNewPage($state) {
      this.axios
        .get("/get/page", {
          params: {
            size: this.list.length,
          },
        })
        .then((response) => {
          let data = response.data;
          if (data.messages.length) {
            this.page += 1;
            this.list.unshift(...data.messages.reverse());
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
    sync() {
      console.log("syncing...");
      let size = this.list.length;
      let lastId;
      if (size > 0 && this.list[0].id) {
        let i = size - 1;
        while (!this.list[i].id) {
          //寻找最后一个有id的item，可以跳过正在上传的没有id的item
          i -= 1;
        }
        lastId = this.list[i].id;
      } else {
        lastId = 0;
      }
      this.axios
        .get("/get/sync", {
          params: {
            lastId: lastId,
          },
        })
        .then((res) => {
          let temp = res.data.newItems;
          console.log("received synced new items:", temp);
          if (temp.length > 0) {
            let i;
            let idList = [];
            for (i of this.list) {
              idList.push(i.id);
            }
            let newItems = [];
            for (i of temp) {
              let result = jquery.inArray(i.id, idList);
              if (result == -1) {
                newItems.push(i);
              }
            }
            console.log("final synced new items:", newItems);
            this.list.push(...newItems);

            // let newItems=res.data.newItems;
            // console.log('received synced new items:',newItems)
            // this.list.push(...newItems)

            // if(newItems.length>0){
            //   for(let item of newItems){
            //     if(item.id>lastId){
            //       this.list.push(item)
            //     }
            //   }
            this.$nextTick(() => this.toBottom());
            console.log("unsynced items pushed");
          } else {
            console.log("no unsynced item");
          }
        });
      console.log("synced");
    },
    submit() {
      if (this.input != "\n") {
        console.log("submit: ", this.input);
        let date = new Date();
        let time = Date.parse(date);
        let showTime = false;
        let size = this.list.length;
        if (size > 0) {
          showTime = this.shouldShowTime(time, this.list[size - 1].time);
        } else {
          showTime = true;
        }

        let newItem = {
          content: this.input,
          type: "text",
          showTime: showTime,
          time: time,
        };
        this.input = null;
        this.$socket.emit("pushItem", newItem, (id, success) => {
          if (success) {
            newItem.id = id;
            this.list.push(newItem);
            console.log("pushed");
            this.$nextTick(() => this.toBottom());
          }
        });
      } else {
        this.input = null;
      }
    },
    download(item) {
      console.log("download: ", item.content);
      this.axios
        .get("/get/download", { params: { fileName: item.fileName } })
        .then((res) => {
          let data = res.data;
          if (data.success) {
            var eleLink = document.createElement("a");
            eleLink.download = item.content;
            eleLink.target = "_blank";
            eleLink.style.display = "none";
            eleLink.href = data.url;
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
            console.log("downloaded");
          }
        });
    },
    selectFile() {
      this.unremove();
    },
    uploadFile(res) {
      let size = this.list.length;
      let time = Date.parse(Date());
      let showTime = true;
      if (size > 0) {
        showTime = this.shouldShowTime(time, this.list[size - 1].time);
      }
      let file = res.file;
      let newItem = {
        content: file.name,
        type: "file",
        showTime: showTime,
        time: time,
        uploading: false,
        uploadingPercentage: 0,
      };
      console.log("upload item: ", newItem);
      let newItemIndex = this.list.push(newItem) - 1;
      this.$nextTick(() => this.toBottom());
      let form = new FormData();
      form.append("file", file);
      form.append("size", file.size);
      form.append("time", time);
      this.axios({
        method: "post",
        url: "/post/upload",
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          this.list[newItemIndex].uploading = true;
          this.list[newItemIndex].uploadingPercentage =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      }).then((res) => {
        if (res.data.success) {
          delete this.list[newItemIndex].uploading;
          delete this.list[newItemIndex].uploadingPercentage;
          this.list[newItemIndex].fileName = res.data.fileName;
          this.$socket.emit(
            "pushItem",
            this.list[newItemIndex],
            (id, success) => {
              if (success) {
                this.list[newItemIndex].id = id;
                console.log("uploaded");
                this.$nextTick(() => this.toBottom());
              }
            }
          );
        }
      });
    },
    isUploading(item) {
      try {
        return item.uploading;
      } catch (err) {
        return false;
      }
    },
    getUploadingPercentage(item) {
      try {
        // console.log(item.uploadingPercentage);
        return item.uploadingPercentage;
      } catch (err) {
        console.log(err);
        return 100;
      }
    },
    getProgressContent(percentage) {
      return percentage === 100
        ? "已上传到服务器，正在处理中"
        : percentage + "%";
    },
    remove() {
      //开关删除模式
      if (!this.removing) {
        this.removing = true;
      } else {
        this.unremove();
      }
    },
    unremove() {
      //关闭删除模式
      this.removing = false;
    },
    removeItem(item, index) {
      //删除项目
      console.log("remove item: ", item);
      let showTime = false;
      let deletedItem = item;
      deletedItem.change = null;
      if (index != this.list.length - 1) {
        if (this.list[index].showTime) {
          //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
          showTime = true;
          deletedItem.change = {
            id: this.list[index + 1].id,
          };
        }
      }
      this.$socket.emit("remove", deletedItem, (success) => {
        if (success) {
          if (showTime) {
            this.list[index + 1].showTime = true;
          }
          this.list.splice(index, 1);
          console.log("removed");
        }
      });
    },
    removeAll() {
      if (confirm("确定要删除全部吗")) {
        this.$socket.emit("removeAll", (success) => {
          if (success) {
            this.list = [];
            this.unremove();
            console.log("removed all items");
          }
        });
      }
    },
  },
};
</script>

<style>
.index {
  width: 100%;
  height: 100%;
  margin: 0 auto 0 auto;
  background: #f3f3f3;
}
.index-now {
  margin: 10px 0 10px 0;
}
.index-mb {
  height: 70%;
}
.index-scrw {
  height: 100%;
  margin: 0 10px 0 20px;
  padding-right: 10px;
  overflow: auto;
}
.index-time {
  font-size: 14px;
  color: #aaaaaa;
  text-align: left;
}
.index-text {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  margin: 10px 0 10px 0;
  text-align: left;
}
.index-file {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  margin: 10px 0 10px 0;
  text-align: left;
}
.index-remove-item:hover,
.index-remove-all:hover {
  cursor: pointer;
  color: #f56c6c;
}
.index-divider {
  margin: 0 0 10px 0;
}
.index-upload-div,
.index-remove-div,
.index-refresh-div {
  display: flex;
  align-items: center;
  justify-content: center;
}
.index-upload,
.index-remove,
.index-refresh {
  font-size: 34px;
}
.index-remove-all,
.index-remove-complete {
  font-size: 34px;
  margin: 20px;
}
.index-file-span:hover,
.index-upload:hover,
.index-remove:hover,
.index-remove-complete:hover,
.index-refresh:hover {
  cursor: pointer;
  color: #409eff;
}
.index-remove-all-div {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.index-input textarea {
  resize: none;
  background: #f3f3f3;
  border: 0px;
  height: 100px;
}
</style>
