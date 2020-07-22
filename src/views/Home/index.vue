<template>
  <div class="home">
    <div class="nav">
      <div>
        <router-link to="/">首页</router-link>
      </div>
      <div>
        <router-link to="/game">游戏</router-link>
      </div>
      <div>
        <router-link to="/rankingList">排行榜</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  height: 100%;
  font-size: 1rem;
  overflow: hidden;
  position: relative;
  background: url("../../assets/timg.jpg");

  .nav {
    height: 6rem;
    position: absolute;
    top: 40%;
    width: 100%;

    div {
      text-align: center;
      line-height: 2rem;
      a {
        color: #fff;
      }
    }
  }
}
</style>
