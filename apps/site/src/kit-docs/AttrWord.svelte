<script>
  import { isReactPath } from '$lib/stores/path';

  import { uppercaseFirstLetter } from '@vidstack/foundation';

  export let plural = false;
  export let short = false;
  export let title = false;

  const plurals = {
    property: 'properties',
  };

  function pluralize(word) {
    return plurals[word] ?? `${word}s`;
  }

  $: htmlWord = short ? 'attr' : 'attribute';
  $: reactWord = short ? 'prop' : 'property';
  $: word = $isReactPath ? reactWord : htmlWord;
  $: properWord = plural ? pluralize(word) : word;
</script>

{title ? uppercaseFirstLetter(properWord) : properWord}
