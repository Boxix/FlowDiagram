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
import Edge from './models/edge'
import Graph, { NodeData } from './models/graph'

const ids = {
  nodeId1: uniqueId('node_'),
  nodeId2: uniqueId('node_'),
  nodeId3: uniqueId('node_'),
  nodeId4: uniqueId('node_'),
  nodeId5: uniqueId('node_'),
  nodeId6: uniqueId('node_'),
  nodeId7: uniqueId('node_'),
  nodeId8: uniqueId('node_'),
  nodeId9: uniqueId('node_'),
  nodeId10: uniqueId('node_')
}

const graph = new Graph([
  new NodeData(ids.nodeId1, 'start', faker.name.findName()),
  new NodeData(ids.nodeId2, 'task', faker.name.findName()),
  new NodeData(ids.nodeId3, 'gateway'),
  new NodeData(ids.nodeId4, 'task', faker.name.findName()),
  new NodeData(ids.nodeId5, 'task', faker.name.findName()),
  new NodeData(ids.nodeId6, 'end', faker.name.findName()),
  new NodeData(ids.nodeId7, 'task', faker.name.findName()),
  new NodeData(ids.nodeId8, 'task', faker.name.findName())
])

graph.addEdge(new Edge(ids.nodeId1, ids.nodeId2))
graph.addEdge(new Edge(ids.nodeId2, ids.nodeId3))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId4, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId4, ids.nodeId5))
graph.addEdge(new Edge(ids.nodeId5, ids.nodeId6))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId7, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId7, ids.nodeId5))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId8, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId8, ids.nodeId6))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId6))

graph.toViewGraph()

@Component({
  components: {
    Lane
  }
})
export default class App extends Vue {
  graphData = graph.toViewGraph()
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
