<template>
  <div class="game-container-box">
    <div class="scoreBox">
      <div class="scoreText">
        <span>得分：</span>
        <span>{{ score }}</span>
      </div>

      <div class="timeText">
        <span>时间：</span>
        <span :class="{ timeCritical: (time < 10 && time !== 0) }">{{ time }}</span>
      </div>
    </div>
    <div class="game-container">
      <div v-for="(good, i) in goods" :key="JSON.stringify(good)" class="container">
        <span
          v-for="(item, j) in good"
          :key="item.id"
          :class="
            'block-' +
              item.value +
              ' block' +
              ' gama-span' +
            (item.disappearing ? ' blast' : '')"
          @touchstart="touchstart($event, i, j)"
          @click="click($event, i, j)"
        >{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 需求
 * 1. 初始化页面。
 * 2. 点击交互元素位置。
 * 3. 判断元素是否是连续三个以上的存在。给上特殊类。
 * 4. 元素爆炸。
 * 5. 补充新元素。
 * 6. 得分计算。
 * 思路：点击交换： 通过传入的两个index取出当前的元素。监听移动事件获取交换的元素。两个原色交换位置。
 * 在根据这两个index取出距离最近的元素。如果下一个不一样就停止比较，否则放入一个数组中。
 * 1横向元素
 * 2竖向元素。
 * 如果相同的大于三个。增加可爆炸的属性。否则元素交换无效。返回交换之前的位置。
 */

export default {
  data() {
    return {
      id: 0,
      goods: [],
      interchange: [],
      execution: false,
      score: 0,
      time: 60,
      suspend: false,
      timer: null
    };
  },

  created() {
    const gameList = [];
    const list = [0, 1, 2, 3, 4, 5];

    for (let i = 0; i < 10; i += 1) {
      const arr = [];
      for (let j = 0; j < 10; j += 1) {
        this.id += 1;
        const index = Math.floor(Math.random() * list.length);
        arr.push({
          id: this.id,
          value: list[index]
        });
      }
      gameList.push(arr);
    }
    this.goods = [
      [
        { id: 1, value: 5 },
        { id: 2, value: 0 },
        { id: 3, value: 3 },
        { id: 4, value: 2 },
        { id: 5, value: 4 },
        { id: 6, value: 2 },
        { id: 7, value: 0 },
        { id: 8, value: 3 },
        { id: 9, value: 5 },
        { id: 10, value: 5 }
      ],
      [
        { id: 11, value: 5 },
        { id: 12, value: 3 },
        { id: 13, value: 5 },
        { id: 14, value: 2 },
        { id: 15, value: 0 },
        { id: 17, value: 3 },
        { id: 16, value: 2 },
        { id: 28, value: 2 },
        { id: 19, value: 2 },
        { id: 20, value: 2 }
      ],
      [
        { id: 21, value: 1 },
        { id: 22, value: 4 },
        { id: 23, value: 0 },
        { id: 24, value: 0 },
        { id: 25, value: 2 },
        { id: 26, value: 3 },
        { id: 27, value: 1 },
        { id: 18, value: 3 },
        { id: 29, value: 5 },
        { id: 30, value: 1 }
      ],
      [
        { id: 31, value: 3 },
        { id: 32, value: 0 },
        { id: 33, value: 3 },
        { id: 34, value: 0 },
        { id: 35, value: 3 },
        { id: 36, value: 4 },
        { id: 37, value: 5 },
        { id: 38, value: 2 },
        { id: 39, value: 5 },
        { id: 40, value: 1 }
      ],
      [
        { id: 41, value: 1 },
        { id: 42, value: 0 },
        { id: 43, value: 1 },
        { id: 44, value: 0 },
        { id: 45, value: 5 },
        { id: 46, value: 2 },
        { id: 47, value: 5 },
        { id: 48, value: 4 },
        { id: 49, value: 5 },
        { id: 50, value: 3 }
      ],
      [
        { id: 61, value: 3 },
        { id: 52, value: 5 },
        { id: 53, value: 4 },
        { id: 54, value: 0 },
        { id: 55, value: 5 },
        { id: 56, value: 5 },
        { id: 57, value: 2 },
        { id: 58, value: 1 },
        { id: 59, value: 3 },
        { id: 60, value: 3 }
      ],
      [
        { id: 81, value: 3 },
        { id: 62, value: 4 },
        { id: 63, value: 0 },
        { id: 64, value: 0 },
        { id: 65, value: 2 },
        { id: 66, value: 4 },
        { id: 67, value: 1 },
        { id: 68, value: 0 },
        { id: 69, value: 0 },
        { id: 70, value: 5 }
      ],
      [
        { id: 51, value: 0 },
        { id: 72, value: 2 },
        { id: 73, value: 3 },
        { id: 74, value: 0 },
        { id: 75, value: 4 },
        { id: 76, value: 5 },
        { id: 77, value: 4 },
        { id: 78, value: 2 },
        { id: 79, value: 0 },
        { id: 80, value: 0 }
      ],
      [
        { id: 71, value: 0 },
        { id: 82, value: 5 },
        { id: 83, value: 1 },
        { id: 84, value: 2 },
        { id: 85, value: 5 },
        { id: 86, value: 2 },
        { id: 87, value: 2 },
        { id: 88, value: 5 },
        { id: 89, value: 5 },
        { id: 90, value: 2 }
      ],
      [
        { id: 91, value: 0 },
        { id: 92, value: 3 },
        { id: 93, value: 4 },
        { id: 94, value: 4 },
        { id: 95, value: 5 },
        { id: 96, value: 1 },
        { id: 97, value: 0 },
        { id: 98, value: 3 },
        { id: 99, value: 4 },
        { id: 100, value: 0 }
      ]
    ];
  },

  mounted() {
    this.globalEliminate();
    // 计时。
    this.timer = setInterval(() => {
      // 最后一秒的时候清除定时器。
      if (this.time <= 1) {
        clearInterval(this.timer);
      }
      this.time = this.time - 1;
    }, 1000);
  },
  updated() {
    // 数据更新了还要重新对比是否有三个一样的方块。
    this.globalEliminate();
  },

  methods: {
    touchstart(e, i, j) {
      document.onmousemove = function(e) {
        document.onmousemove = null;
      };
      document.onmouseup = function() {
        document.onmousemove = null;
      };
    },
    toJSon(d) {
      return JSON.parse(JSON.stringify(d));
    },
    // 找到相邻的三个以上相等的准备消除掉。页面第一次加载的时候执行一次。遍历矩阵 goods。查出当前行的value。如果连续三个相等。就给个特殊的属性disappearing。
    // 把连续三个或以上的方块消除掉。
    // 连续的元素在末尾时会出错。
    globalEliminate() {
      // 行遍历。
      let newList = this.goods.map(item => {
        // 存放已经遍历出来的连续三个的元素数组。
        const disappearLine = [];
        let disappearList = [];
        const newItem = item.map((block, i) => {
          // 把当前的数据放到数组中。拿下一次的数据跟这次比较。如果value相等，就继续存放。
          // 如果 这个 list 中已经有值了。要么是第一次进来的。要么是重新赋值了。
          if (disappearList.length) {
            // 拿出来已经存在的 连续 value 相同的数据的一条。
            const previousBlock = disappearList[disappearList.length - 1];
            // 继续比较，
            if (previousBlock.block.value === block.value) {
              // 相等就放进去。 假如这次已经是最后一个方块了。满足条件是存不到 disappearLine 里面的。因为这里没有相关的逻辑。
              disappearList.push({
                block,
                i
              });
            } else {
              // 不相等就判断 list 里面放的条数是不是满足条件了。
              if (disappearList.length >= 3) {
                // 满足条件就放到 disappearLine 里。
                disappearLine.push(disappearList);
              }
              // 重新赋值。继续比较。
              disappearList = [
                {
                  block,
                  i
                }
              ];
            }
          } else {
            // 否则就往里面增加一条，一般是第一个数组里面的遍历完了。  disappearList 被重新赋值了。
            disappearList.push({
              block,
              i
            });
          }

          // 判断是否当前列遍历完毕。最后一次的情况要单独判断。
          if (i === item.length - 1) {
            if (disappearList.length > 2) {
              disappearLine.push(disappearList);
            }
          }
          return block;
        });
        if (disappearLine.length >= 1) {
          disappearLine.forEach(disappear => {
            let scoreAdd = 0;
            if (disappear.length === 3) {
              scoreAdd = 1;
            } else if (disappear.length === 4) {
              scoreAdd = 3;
            } else if (disappear.length > 4) {
              scoreAdd = 5;
            }
            if (disappear.length >= 3) {
              disappear.forEach(disappear => {
                item[disappear.i].disappearing = true;
              });
            }
            this.score += scoreAdd;
          });
        }
        return newItem;
      });
      // 列遍历
      for (let i = 0; i < newList.length; i++) {
        const good = newList[i];
        const disappearLine = [];
        let disappearList = [];
        for (let k = 0; k < good.length; k++) {
          if (disappearList.length) {
            const previousBlock = disappearList[disappearList.length - 1];
            if (previousBlock.block.value === newList[k][i].value) {
              disappearList.push({
                block: newList[k][i],
                i: k
              });
            } else {
              if (disappearList.length >= 3) {
                disappearLine.push(disappearList);
              }

              disappearList = [
                {
                  block: newList[k][i],
                  i: k
                }
              ];
            }
          } else {
            disappearList.push({
              block: newList[k][i],
              i: k
            });
          }

          // 判断是否当前列遍历完毕。
          if (k === good.length - 1) {
            if (disappearList.length > 2) {
              disappearLine.push(disappearList);
            }
          }
        }

        if (disappearLine.length >= 1) {
          disappearLine.forEach(disappear => {
            let scoreAdd = 0;
            if (disappear.length === 3) {
              scoreAdd = 1;
            } else if (disappear.length === 4) {
              scoreAdd = 3;
            } else if (disappear.length > 4) {
              scoreAdd = 5;
            }
            if (disappear.length >= 3) {
              disappear.forEach(disappear => {
                newList[disappear.i][i].disappearing = true;
              });
            }

            this.score += scoreAdd;
          });
        }
      }
      // 把所有的带 disappearing: true 的元素替换掉。
      // 计算分数在这里，规则：三个相同的增加1分，四个增加3分，五个及五个以上增加5分，

      newList = this.toJSon(newList).map(item => {
        const newListChild = item.map(block => {
          if (block) {
            const obj = {
              id: block.id,
              value: block.value
            };

            if (block.disappearing) {
              const list = [0, 1, 2, 3, 4, 5];
              const index = Math.floor(Math.random() * list.length);
              obj.value = list[index];
            }
            return obj;
          }
        });
        return newListChild;
      });
      if (
        JSON.stringify(this.toJSon(newList)) !==
        JSON.stringify(this.toJSon(this.goods))
      ) {
        this.goods = [...newList];
        // 前一次的数据和这一次的数据不一样。说明新渲染出来的方块里面有三个一样的。这个时候要禁止点击事件。
        this.execution = true;
      } else {
        this.execution = false;
      }
    },

    // 点击两个相邻的交换位置
    click(e, i, j) {
      if (this.execution || !this.time) {
        return;
      }
      // 记录点击的方块信息。判断上一次和这一次点击的方块是否相邻。不相邻则认为重新选择了一个方块
      this.interchange.push({
        block: this.goods[i][j],
        i,
        j,
        ele: e.target
      });
      if (this.interchange.length !== 2) {
        return;
      }

      if (this.isAdjacent(this.interchange)) {
        // 添加动画，按照点击的顺序加上不同的动画
        this.addAnimationDirection(this.interchange);

        // 交换位置。
        const block1 = this.interchange[0];
        const block2 = this.interchange[1];
        const newGoods = [...this.goods];
        newGoods[block1.i][block1.j] = block2.block;
        newGoods[block2.i][block2.j] = block1.block;

        this.interchange = [];

        setTimeout(() => {
          this.goods = [...newGoods];
          this.globalEliminate();
        }, 300);
      } else {
        // 不相邻则认为重新选择方块。
        this.interchange = [
          {
            block: this.goods[i][j],
            i,
            j,
            ele: e.target
          }
        ];
      }
      // this.globalEliminate();
    },

    // 判断是否相邻
    isAdjacent() {
      let isAdjacent = false;
      const block1 = this.interchange[0];
      const block2 = this.interchange[1];

      if (block1.i === block2.i && Math.abs(block1.j - block2.j) === 1) {
        isAdjacent = true;
      }

      if (block1.j === block2.j && Math.abs(block1.i - block2.i) === 1) {
        isAdjacent = true;
      }

      return isAdjacent;
    },

    // 按照点击的顺序给方块加上不同的类名。
    addAnimationDirection() {
      const block1 = this.interchange[0];
      const block2 = this.interchange[1];
      // 同一行左右移动
      if (block1.i === block2.i) {
        // 同一列上下移动
        if (block1.j - block2.j === 1) {
          block1.ele.classList.add('bottom');
          block2.ele.classList.add('top');
        } else {
          block1.ele.classList.add('top');
          block2.ele.classList.add('bottom');
        }
      } else {
        // 先点左边的
        if (block1.i - block2.i === 1) {
          block1.ele.classList.add('right');
          block2.ele.classList.add('left');
        } else {
          block1.ele.classList.add('left');
          block2.ele.classList.add('right');
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.game-container-box {
  height: 100%;
  background: #000;
  overflow: hidden;
  .scoreBox {
    color: #000;
    height: 28vh;
    background: url("../../assets/animal.jpg") no-repeat 0px -62px;
    position: relative;
    .scoreText {
      color: #f9e70c;
      padding-left: 14px;
      position: absolute;
      top: 0;
      width: 8rem;
      text-align: left;
      left: 0;
      line-height: 2rem;
    }

    .timeText {
      font-size: 0.6rem;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 4rem;
      color: #f97849;
      line-height: 1.3rem;
    }

    .timeCritical {
      animation: timeCritical 1s infinite;
      display: inline-block;
      color: red;
    }

    @keyframes timeCritical {
      from {
        transform: scale(1);
        opacity: 1;
      }

      to {
        transform: scale(1.3);
        opacity: 0.6;
      }
    }
  }

  .game-container {
    margin: 0 auto;
    width: 100%;
    height: calc(100vw - 20px);
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    grid-template-columns: repeat(10, 1fr);
  }

  .container {
    display: grid;
    grid-template-rows: repeat(10, 1fr);
    grid-template-columns: repeat(1, 1fr);
    width: 100%;

    .block {
      display: inline-block;
      border-radius: 6px;
      line-height: 10vw;
      height: 10vw;
      text-align: center;
      color: #fff;
      font-weight: 500;
      position: relative;
      opacity: 1;
    }
    .block-0 {
      background: #edb338;
    }
    .block-1 {
      background: #23a51f;
    }
    .block-2 {
      background: #cd6b0d;
    }
    .block-3 {
      background: #c81005;
    }
    .block-4 {
      background: #b733e9;
    }
    .block-5 {
      background: #28daf4;
    }
    .span-7 {
      background: #fff;
    }
    .gama-span {
      position: relative;
    }

    .left {
      transition: all 0.3s;
      transform: translateX(100%);
    }
    .right {
      transition: all 0.3s;
      transform: translateX(-100%);
    }
    .top {
      transition: all 0.3s;
      transform: translateY(100%);
    }
    .bottom {
      transition: all 0.3s;
      transform: translateY(-100%);
    }

    .blast {
      transition: all 0.3s;
      transform: scale(.1);
      opacity: 0;
    }

    .red {
      background: red;
    }
  }
}
</style>
