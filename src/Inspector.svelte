<script>
    import { InspectorComponent } from "@visuallyjs/browser-ui-svelte";
    import { PROPERTY_LABEL, PROPERTY_NOTES } from "./definitions";

    let current = $state(null)
</script>

<InspectorComponent bind:current={current}>
    {#if current}
        <div class="vjs-mindmap-inspector vjs-node-inspector">
            <div class="vjs-mindmap-inspector-section">
                <div>Label</div>
                <input type="text" vjs-att={PROPERTY_LABEL} vjs-focus/>
            </div>

            <div class="vjs-mindmap-inspector-section">
                <div>Notes</div>
                <textarea rows="10" vjs-att={PROPERTY_NOTES}></textarea>
            </div>
        </div>
    {/if}
</InspectorComponent>
