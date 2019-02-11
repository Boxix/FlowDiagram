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
import NodeData from './models/node-data'
import Edge from './models/edge'
import Graph from './models/graph'

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

const newOption = (current = false) => {
  return {
    label: faker.name.findName(),
    current
  }
}

const graph = new Graph([
  new NodeData(ids.nodeId1, 'start', newOption()),
  new NodeData(ids.nodeId2, 'task', newOption()),
  new NodeData(ids.nodeId3, 'gateway', newOption()),
  new NodeData(ids.nodeId4, 'task', newOption()),
  new NodeData(ids.nodeId5, 'task', newOption()),
  new NodeData(ids.nodeId6, 'end', newOption(true)),
  new NodeData(ids.nodeId7, 'task', newOption()),
  new NodeData(ids.nodeId8, 'task', newOption())
])

// case 1
graph.addEdge(new Edge(ids.nodeId1, ids.nodeId2, true))
graph.addEdge(new Edge(ids.nodeId2, ids.nodeId3, true))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId4, false, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId4, ids.nodeId5, false))
graph.addEdge(new Edge(ids.nodeId5, ids.nodeId6, false))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId7, false, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId7, ids.nodeId5, false))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId8, false, faker.hacker.ingverb()))
graph.addEdge(new Edge(ids.nodeId8, ids.nodeId6))
graph.addEdge(new Edge(ids.nodeId3, ids.nodeId6, true, faker.hacker.ingverb()))

// case 2
// graph.addEdge(new Edge(ids.nodeId1, ids.nodeId2, true))
// graph.addEdge(new Edge(ids.nodeId2, ids.nodeId3, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId4, true, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId4, ids.nodeId5, true))
// graph.addEdge(new Edge(ids.nodeId5, ids.nodeId6, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId7, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId7, ids.nodeId5, false))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId8, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId8, ids.nodeId6))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId6, false, faker.hacker.ingverb()))

// case 3
// graph.addEdge(new Edge(ids.nodeId1, ids.nodeId2, true))
// graph.addEdge(new Edge(ids.nodeId2, ids.nodeId3, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId4, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId4, ids.nodeId5, false))
// graph.addEdge(new Edge(ids.nodeId5, ids.nodeId6, false))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId7, true, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId7, ids.nodeId5, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId8, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId8, ids.nodeId6))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId6, false, faker.hacker.ingverb()))

// case 4
// graph.addEdge(new Edge(ids.nodeId1, ids.nodeId2, true))
// graph.addEdge(new Edge(ids.nodeId2, ids.nodeId3, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId4, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId4, ids.nodeId5, false))
// graph.addEdge(new Edge(ids.nodeId5, ids.nodeId6, false))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId7, false, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId7, ids.nodeId5, false))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId8, true, faker.hacker.ingverb()))
// graph.addEdge(new Edge(ids.nodeId8, ids.nodeId6, true))
// graph.addEdge(new Edge(ids.nodeId3, ids.nodeId6, false, faker.hacker.ingverb()))

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
