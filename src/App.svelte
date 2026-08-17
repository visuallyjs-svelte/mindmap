<script>
    import { onMount } from "svelte";
    import './mindmap.css'
    import { registerParser, registerExporter, uuid, EVENT_GRAPH_CLEARED, CONNECTOR_TYPE_STRAIGHT, AnchorLocations, EVENT_CANVAS_CLICK, EVENT_UNDO, EVENT_REDO, BowtieLayout } from "@visuallyjs/browser-ui"
    import { SurfaceProvider, SurfaceComponent, ControlsComponent, MiniviewComponent } from "@visuallyjs/browser-ui-svelte";
    import {LEFT, RIGHT, SUBTOPIC} from "./definitions";
    import {MINDMAP_JSON, mindmapJsonExporter, mindmapJsonParser} from "./parser";
    import {MAIN} from "./definitions";
    import Inspector from "./Inspector.svelte"

    // Sub-components for nodes
    import MainNode from './MainNode.svelte';
    import SubtopicNode from './SubtopicNode.svelte';

    let { url = "/dataset.json" } = $props();

    let surface;
    let model;

    registerParser(MINDMAP_JSON, mindmapJsonParser)
    registerExporter(MINDMAP_JSON, mindmapJsonExporter)

    function addChild(vertex, direction) {
        const source = direction != null ? vertex.getPort(direction) : vertex
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

    function deleteVertex(vertex) {
        const nodeAndDescendants = model.selectDescendants(vertex, true)
        model.transaction(() => {
            model.remove(nodeAndDescendants)
        })
        relayout()
    }

    function relayout() {
        requestAnimationFrame(() => {
            surface.getSurface().relayout()
        })
    }

    function showInfo(vertex) {
        model.setSelection(vertex)
    }

    onMount(() => {
        const vjsSurface = surface.getSurface();
        model = vjsSurface.model;

        model.bind(EVENT_UNDO, relayout)
        model.bind(EVENT_REDO, relayout)

        model.bind(EVENT_GRAPH_CLEARED, () => {
            model.addNode({
                id:uuid(),
                type:MAIN,
                left:[],
                right:[],
                label:"Main"
            })
            vjsSurface.zoomToFit()
        })

        model.load({
            url:url,
            type:MINDMAP_JSON
        })
    })

    const viewOptions = {
        nodes:{
            main:{
                component:MainNode,
                props: { addChild }
            },
            subtopic:{
                component:SubtopicNode,
                props: { addChild, deleteVertex, showInfo }
            }
        }
    }

    const renderOptions = {
        elementsDraggable:false,
        zoomToFit:true,
        relayoutOnEdgeConnect:true,
        consumeRightClick:false,
        // Use a bowtie layout.
        layout:{
            type:BowtieLayout.type,
            options:{
                getRootNode:(ds) => ds.getNodes().filter(d => d.data.type === MAIN)[0],
                getUpstream:(ds, v) => v.getAllEdges().filter(e => e.target.data.direction === LEFT).map(e => e.target),
                getDownstream:(ds, v) => v.getAllEdges().filter(e => e.target.data.direction === RIGHT).map(e => e.target)
            }
        },
        edges:{
            connector:{
                type:CONNECTOR_TYPE_STRAIGHT,
                options:{
                    stub:20
                }
            },
            anchor:[ AnchorLocations.Left, AnchorLocations.Right ]
        },
        events:{
            [EVENT_CANVAS_CLICK]:() => model.clearSelection()
        }
    }
</script>

<div class="vjs-mindmap">
    <SurfaceProvider>
        <div class="vjs-mindmap-canvas">
            <SurfaceComponent {viewOptions} {renderOptions} bind:this={surface}>
                <ControlsComponent/>
                <MiniviewComponent/>
            </SurfaceComponent>
        </div>
        <div class="vjs-mindmap-rhs">
            <div class="description">
                <h3>Mindmap Builder</h3>
                <ul>
                    <li>Click the note icon in the upper left of a node to inspect/edit it.</li>
                    <li>Click the X button on a node to delete it and all its children.</li>
                    <li>Click the + button on a node to add a new subtopic. Subtopics can be added to the left or right of the
                        main node.
                    </li>
                </ul>
            </div>
            <hr/>
            <Inspector/>
        </div>
    </SurfaceProvider>
</div>

<style>
    :global(.vjs-mindmap) {
        display: flex;
        flex-direction: row;
        width: 100vw;
        height: 100vh;
    }
    :global(.vjs-mindmap-canvas) {
        flex: 1;
        position: relative;
    }
    :global(.vjs-mindmap-rhs) {
        width: 300px;
        border-left: 1px solid #ccc;
        padding: 10px;
        overflow-y: auto;
    }
</style>
