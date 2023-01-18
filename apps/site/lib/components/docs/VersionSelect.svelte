<script>
  import Select from '$lib/components/base/Select.svelte';

  let value = '0.x';

  const options = ['0.x'];
</script>

<Select title="Player Library Version" {options} {value} block />
