import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
    return nodes.reduce((ace, node) => {
        return ace * TaskRegistry[node.data.type].credits
    }, 0)
}