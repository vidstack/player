<script>
	let hovering;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div on:pointerenter={enter} on:pointerleave={leave}>
	<slot {hovering} />
</div>
