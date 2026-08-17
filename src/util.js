import {uuid} from "@visuallyjs/browser-ui";
import {SUBTOPIC} from "./definitions.js";

function relayout(surface) {
    requestAnimationFrame(() => {
        surface.relayout()
    })
}

export function showInfo(model, vertex) {
    model.setSelection(vertex)
}

export function addChild(model, vertex, direction) {
    // for edges from the main node, we attach them to a port on the node, because the main node can
    // have `left` and `right` edges. For subtopic nodes we attach directly to the node. So this code tests
    // for a matching port and uses it as the source if found, otherwise it uses the source node.
    const source =  vertex
    const payload = {
        id:uuid(),
        parentId:vertex.id,
        label:"New subtopic",
        children:[],
        type:SUBTOPIC,
        direction
    }

    model.transaction(() => {
        const node = model.addNode(payload)
        model.addEdge({source, target:node})
    })
}

export function deleteVertex(model, surface, vertex) {
    // select the node that was clicked and all of its descendants (we get a Selection object back)
    const nodeAndDescendants = model.selectDescendants(vertex, true)
    // inside a transaction, remove everything in that selection from the model (including edges to each of the nodes).
    // we do this inside a transaction so we can undo the whole operation as one unit.
    model.transaction(() => {
        model.remove(nodeAndDescendants)
    })

    relayout(surface)
}
