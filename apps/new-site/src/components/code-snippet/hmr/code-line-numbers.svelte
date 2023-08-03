<script lang="ts">
  export let id: string;
  export let lines: number;

  const toArray = (lines: number) => [...Array(lines).keys()].map((n) => n + 1);

  let lineNumbers = toArray(lines);

  if (import.meta.hot) {
    import.meta.hot.on(':invalidate_code_snippet', async (payload) => {
      if (payload.id !== id) return;
      lineNumbers = toArray(payload.lines);
    });
  }
</script>

<pre {...$$restProps}>
  {@html lineNumbers.join('\n')}
</pre>
