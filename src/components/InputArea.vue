<template>
  <el-row class="index-row5 index-input">
    <div v-if="removing" class="index-remove-all-div">
      <div>
        <i class="el-icon-circle-close index-remove-all" @click="removeAll"></i>
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