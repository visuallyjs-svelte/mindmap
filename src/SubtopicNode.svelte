<script>
    import {CLASS_ADD_CHILD, CLASS_MINDMAP_DELETE, CLASS_MINDMAP_INFO} from "./definitions";
    import { addChild, showInfo, deleteVertex } from "./util"
    let { data, vertex, model, ui } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="vjs-mindmap-subtopic vjs-mindmap-vertex">
    <div class="vjs-mindmap-title">{data.label}</div>
    {#if data.notes}
        <div class="vjs-mindmap-notes">{data.notes}</div>
    {/if}
    <div class={CLASS_MINDMAP_INFO} onclick={() => showInfo(model, vertex)}></div>
    <div class={CLASS_ADD_CHILD} data-direction={data.direction} onclick={() => addChild(model, vertex)}></div>
    <div class={CLASS_MINDMAP_DELETE} onclick={() => deleteVertex(model, ui, vertex )}></div>
</div>
