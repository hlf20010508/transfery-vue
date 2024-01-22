<template>
  <el-row class="input-area-input">
    <div v-if="removing" class="input-area-remove-all-div">
      <div>
        <i class="el-icon-circle-close input-area-remove-all" @click="removeAll"></i>
        <i
          class="el-icon-circle-check input-area-remove-complete"
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
      @keydown.native="submitWrap"
    ></el-input>
  </el-row>
</template>

<script>
export default {
  props: ["removing"],
  data() {
    return {
      input: "",
    };
  },
  methods: {
    removeAll() {
      this.$emit("removeAll");
    },
    unremove() {
      this.$emit("unremove");
    },
    focus() {
      this.$emit("focus");
    },
    blur() {
      this.$emit("blur");
    },
    submitWrap(event) {
      if (!event.shiftKey && event.keyCode == 13) {
        event.cancelBubble = true; // ie阻止冒泡行为
        event.stopPropagation(); // Firefox阻止冒泡行为
        event.preventDefault(); // 取消事件的默认动作
        this.$emit("submit", this.input);
        this.input = "";
      }
    },
  },
};
</script>

<style>
.input-area-input textarea {
  resize: none;
  background: #f3f3f3;
  border: 0px;
  height: 100px;
}

.input-area-remove-all-div {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-area-remove-all:hover {
  cursor: pointer;
  color: #f56c6c;
}

.input-area-remove-all,
.input-area-remove-complete {
  font-size: 34px;
  margin: 20px;
}

.input-area-remove-complete:hover {
  cursor: pointer;
  color: #409eff;
}
</style>