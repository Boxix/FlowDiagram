<template>
  <div class="lane">
    <div class="node" :class="[`node--${node.type}`]" v-for="node of data" :key="node.id">
      <span
        class="node__symbol"
        :style="[{
        top: node.type === 'branchEnd' ? `-${(lane - (node.linkTo || 0) - 1) * 100 + 50}%` : null
      }]"
        :label="node.label"
      ></span>
    </div>
  </div>
</template>

<script type="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: {
    data: Array,
    lane: Number
  }
})
export default class Lane extends Vue {}
</script>

<style lang="less">
.lane {
  font-size: 0;
}

.node {
  display: inline-block;
  width: 120px;
  height: 80px;
  position: relative;
  font-size: 12px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: green;
    top: 50%;
    margin: -1px;
    z-index: 0;
  }

  &--empty::after {
    background: none;
  }

  &--start &__symbol,
  &--end &__symbol,
  &--task &__symbol {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid green;
    left: 50%;
    top: 50%;
    margin: -10px 0 0 -10px;
    border-radius: 100%;
    background: #fff;
    z-index: 1;

    &::after {
      content: attr(label);
      position: absolute;
      bottom: 50%;
      left: 50%;
      width: 80px;
      margin-left: -40px;
      margin-bottom: 16px;
    }
  }

  &--end &__symbol::after {
    margin-top: -32px;
  }

  &--gateway &__symbol {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 50%;
    top: 50%;
    border: 2px solid green;
    margin: -10px 0 0 -10px;
    transform: rotate(45deg);
    background: #fff;
    z-index: 1;

    &::after {
      content: attr(label);
      position: absolute;
      top: 0;
      left: 20px;
      transform: rotate(-45deg);
      transform-origin: top left;
    }
  }

  &--branchStart::after {
    left: 50%;
    background: green;
  }

  &--branchStart::before {
    content: '';
    position: absolute;
    top: -50%;
    bottom: 50%;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    background: green;
  }

  &--branchStart &__symbol::after {
    content: attr(label);
    position: absolute;
    bottom: 50%;
    left: 50%;
    margin-bottom: -20px;
    margin-left: 10px;
  }

  &--branchEnd::after {
    right: 50%;
    background: green;
  }

  &--branchEnd &__symbol {
    position: absolute;
    top: -50%;
    bottom: 50%;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    background: green;
  }

  &--gateway,
  &--branchStart {
    width: 80px;
  }
}
</style>
