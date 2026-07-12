<script>
    import {CLASS_ADD_CHILD, LEFT, RIGHT} from "./definitions";
    let { data, obj, addChild } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="vjs-mindmap-main vjs-mindmap-vertex">
    <div class="vjs-mindmap-title">{data.label}</div>
    {#if data.notes}
        <div class="vjs-mindmap-notes">{data.notes}</div>
    {/if}
    <div class={CLASS_ADD_CHILD} data-direction={LEFT} onclick={() => addChild(obj, LEFT)}></div>
    <div class={CLASS_ADD_CHILD} data-direction={RIGHT} onclick={() => addChild(obj, RIGHT)}></div>
</div>
