<template>
  <div id="app">
    <lane v-for="(nodes, index) of graphData" :key="index" :lane="index" :data="nodes"></lane>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { uniqueId } from 'lodash'
import faker from 'faker'
import Node, {
  StartNode,
  EndNode,
  GatewayNode,
  TaskNode,
  PlaceholderNode,
  BranchStartNode,
  BranchEndNode
} from './models/node'
import Lane from './components/lane.vue'

const line1 = [
  new StartNode(uniqueId(), faker.name.findName()),
  new GatewayNode(uniqueId(), faker.hacker.ingverb()),
  new TaskNode(uniqueId(), faker.name.findName()),
  new TaskNode(uniqueId(), faker.name.findName()),
  new EndNode(uniqueId())
]

const line2 = [
  new Node(uniqueId()),
  new BranchStartNode(uniqueId(), faker.hacker.ingverb()),
  new TaskNode(uniqueId(), faker.name.findName()),
  new PlaceholderNode(uniqueId()),
  new BranchEndNode(uniqueId(), 0)
]

const line3 = [
  new Node(uniqueId()),
  new BranchStartNode(uniqueId(), faker.hacker.ingverb()),
  new TaskNode(uniqueId(), faker.name.findName()),
  new BranchEndNode(uniqueId(), 0),
  new Node(uniqueId())
]

const line4 = [
  new Node(uniqueId()),
  new BranchStartNode(uniqueId(), faker.hacker.ingverb()),
  new PlaceholderNode(uniqueId()),
  new PlaceholderNode(uniqueId()),
  new BranchEndNode(uniqueId(), 0)
]

const mockData = [line1, line2, line3, line4]

@Component({
  components: {
    Lane
  }
})
export default class App extends Vue {
  graphData = mockData
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
