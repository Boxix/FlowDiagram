<template>
  <div class="lane">
    <div
      class="node"
      :class="[
        `node--${node.type}`,
        {
          'node--active': node.active,
          'node--current': node.current
        }
      ]"
      v-for="(node, index) of data"
      :key="index"
    >
      <span
        class="node__symbol"
        :style="{
          top:
            node.type === 'branchEnd'
              ? `-${(lane - (node.linkTo || 0) - 1) * 100 + 50}%`
              : null
        }"
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
  margin-left: -100px;
}

@color-default: #ccc;
@color-active: green;

.node {
  display: inline-block;
  width: 120px;
  height: 80px;
  position: relative;
  font-size: 12px;
  color: @color-default;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed;
    top: 50%;
    margin-top: -1px;
    z-index: 0;
  }

  &--empty::after {
    border: 0;
  }

  &--active {
    color: @color-active;
  }

  &--active::before,
  &--active::after {
    background: @color-active !important;
  }
  &--active &__symbol {
    border-color: @color-active !important;
  }
  &--active&--branchStart::after {
    width: 6px;
    margin-right: 0;
  }

  &--current&--task &__symbol::before {
    @size: 8px;
    content: '';
    position: absolute;
    height: @size;
    width: @size;
    background: @color-active;
    border-radius: 100%;
    top: 50%;
    left: 50%;
    margin: -@size / 2 0 0 -@size / 2;
  }

  &--start::after {
    border: 0;
  }

  &--start &__symbol,
  &--end &__symbol,
  &--task &__symbol {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid;
    right: 0;
    top: 50%;
    margin-top: -10px;
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
      white-space: nowrap;
    }
  }

  &--end &__symbol::after {
    margin-top: -32px;
  }

  &--gateway &__symbol {
    position: absolute;
    width: 8px;
    height: 8px;
    right: 0;
    top: 50%;
    border: 2px solid;
    margin-top: -7px;
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
      white-space: nowrap;
    }
  }

  &--branchStart::after {
    left: auto;
    right: 0;
    width: 4px;
    z-index: 1;
    margin-right: 2px;
  }

  &--branchStart::before {
    content: '';
    position: absolute;
    top: -50%;
    bottom: 50%;
    right: 0;
    margin-right: 6px;
    border-left: 1px dashed;
  }

  &--branchStart &__symbol::after {
    content: attr(label);
    position: absolute;
    bottom: 50%;
    left: 100%;
    margin-bottom: -20px;
    margin-left: 10px;
    white-space: nowrap;
  }

  &--branchEnd::after {
    right: 9px;
  }

  &--branchEnd &__symbol {
    position: absolute;
    top: -50%;
    bottom: 50%;
    right: 7px;
    margin-left: -1px;
    border-left: 1px dashed;
  }

  &--gateway,
  &--branchStart {
    width: 80px;
  }
}
</style>
