<template>
  <div>
    <!-- Button trigger modal -->
    <button ref="btnShow" type="button" class="hide" data-toggle="modal" data-target="#myModal">
    </button>
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close"><span
              @click="cancel" >&times;</span></button>
            <h4 class="modal-title" id="myModalLabel" v-text="title"></h4>
          </div>
          <div class="modal-body" v-text="content">
          </div>
          <div class="modal-footer">
            <button ref="btnHide" type="button" class="hide" data-dismiss="modal"></button>
            <button type="button" class="btn btn-default" @click="cancel">取消</button>
            <button type="button" class="btn btn-primary" @click="confirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * props:
   *  show 根据改变show的值 触发
   *  title: 标题
   *  content: 内容
   *
   * show = true
   * 显示弹出层
   * show = false
   * 隐藏弹出层
   *
   * 事件：
   *  1. cancel  点击取消
   *  2. confirm  点击确定
   *  3. close 关闭弹出层
   * */
  export default {
    props: {
      title: {
        type: String,
        default: '默认标题'
      },
      content: {
        type: String,
        default: '主要内容'
      },
      ifShow: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      ifShow (val, oldVal) {
        if (val) {
          this.show()
        } else {
          this.hide()
        }
      }
    },
    methods: {
      show () {
        this.$refs.btnShow.click()
      },
      hide () {
        this.$refs.btnHide.click()
        this.$emit('close')
      },
      cancel () {
        this.$emit('close')
        this.$emit('cancel')
      },
      confirm () {
        this.$emit('close')
        this.$emit('confirm')
      }
    }
  }
</script>
