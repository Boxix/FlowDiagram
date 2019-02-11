<template>
  <div class="lane">
    <div
      class="node"
      :class="[
        `node--${node.type}`,
        {
          'node--active': node.type !== 'empty' && node.active,
          'node--edge-active': node.type !== 'empty' && node.active && node.lanePrev && node.lanePrev.active,
          'node--current': node.isCurrent,
        }
      ]"
      v-for="(node, index) of data"
      :key="index"
    >
      <span
        class="node__symbol"
        :style="{
          top:
            node.type === 'branchEnd' || node.type === 'branchStart'
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
@keyframes pulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

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

  &--edge-active::after {
    border-top: 1px solid @color-active;
  }
  &--active &__symbol {
    color: @color-active !important;
    border-color: @color-active !important;
    z-index: 2 !important;
  }
  &--active&--branchEnd &__symbol,
  &--active&--branchStart &__symbol {
    border-left: 1px solid @color-active;
    z-index: 1 !important;
  }
  &--active&--branchStart::after {
    width: 6px;
    margin-right: 0;
    border-top: 1px solid @color-active;
  }

  &--current&--start &__symbol::before,
  &--current&--end &__symbol::before,
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
    will-change: transform;
    animation: pulse 2s ease-in-out infinite;
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

  &--branchStart &__symbol {
    position: absolute;
    top: -50%;
    bottom: 50%;
    right: 0;
    margin-right: 6px;
    border-left: 1px dashed;
    z-index: 0;
  }

  &--branchStart &__symbol::after {
    content: attr(label);
    position: absolute;
    bottom: 0;
    left: 100%;
    margin-bottom: -20px;
    margin-left: 10px;
    white-space: nowrap;
  }

  &--branchEnd::after {
    right: 7px;
  }

  &--branchEnd &__symbol {
    position: absolute;
    top: -50%;
    bottom: 50%;
    right: 7px;
    border-left: 1px dashed;
    z-index: 0;
  }

  &--gateway,
  &--branchStart {
    width: 80px;
  }

  &--virtual {
    width: 0;
  }

  &--virtual &__symbol::after {
    content: attr(label);
    position: absolute;
    top: 50%;
    margin-top: 4px;
  }
}
</style>
