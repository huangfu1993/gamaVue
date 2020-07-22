<template>
  <div class="scoreList">
    <div v-if="list.length > 0">
      <div class="box">
        <div v-for="item in list" :key="item.id" :class="'list' + item.id">
          <span>{{ item.name }}:</span>
          <span>{{ item.score }}</span>
        </div>
      </div>
      <div class="action">
        <div>
          <router-link to="/">返回</router-link>
        </div>
        <div @click="empty">清空记录</div>
      </div>
    </div>

    <div v-if="list.length === 0">
      <div class="gamePlay">
        <router-link to="/game">去玩一把</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: '小明',
          score: 100,
          id: 1
        },
        {
          name: '小王',
          score: 80,
          id: 2
        },
        {
          name: '小李',
          score: 60,
          id: 3
        }
      ]
    };
  },
  methods: {
    empty() {
      this.list = [];
    }
  }
};
</script>
<style scoped lang="less">
.scoreList {
  height: 100%;
  font-size: 1rem;
  overflow: hidden;
  position: relative;
  background: linear-gradient(#e66465, #9198e5);
  .box {
    height: 50%;
    margin-top: 30%;
  }

  .list1 {
    color: gold;
    font-size: 2rem;
  }

  .list2 {
    color: #c0c0c0;
    font-size: 1.9rem;
  }

  .list3 {
    color: #b87333;
    font-size: 1.8rem;
  }

  .action {
    margin-bottom: 20%;
    margin-top: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    div:first-child {
      margin-right: 1rem;
    }
  }
  .gamePlay {
    margin-top: 20%;
    color: #fff;
    font-weight: 600;
  }
}
</style>
