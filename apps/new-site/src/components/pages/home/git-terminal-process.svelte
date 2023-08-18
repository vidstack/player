<script lang="ts">
  import MockTerminal from '../../mocks/terminal/mock-terminal.svelte';
  import { TerminalPromptType, type TerminalPrompt } from '../../mocks/terminal/types';

  const prompts: TerminalPrompt[] = [
    {
      type: TerminalPromptType.Text,
      text: 'vidstack login',
      loadDuration: 250,
      process: ['Hey, Charlie!'],
    },
    'vidstack init',
    {
      type: TerminalPromptType.List,
      select: 1,
      options: ['Create New Project', "Charlie's Site (react-casts.gg)"],
      process: [
        'Using AWS S3 Storage.',
        'Using Mux Streaming.',
        'Using Vidstack Analytics.',
        'Updated pre-push hook.',
        'Git LFS initialized.',
      ],
    },
    {
      type: TerminalPromptType.Text,
      text: 'git status',
      process: [
        'On branch main',
        'Changes not staged for commit:',
        { type: 'diff-neg', text: 'app/videos/installation.mp4' },
        { type: 'diff-neg', text: 'app/videos/thinking-in-react.mp4' },
      ],
    },
    'git add .',
    'git commit -m "new react course videos"',
    {
      type: TerminalPromptType.Text,
      text: 'git push',
      process: [
        {
          type: 'progress',
          duration: 500,
          text(percent) {
            const files = percent === 100 ? 2 : percent >= 50 ? 1 : 0,
              totalMb = 175,
              totalUploaded = (percent / 100) * totalMb;
            return `Git LFS: (${files} of 2 files) ${totalUploaded.toFixed(0)} MB / 175 MB`;
          },
        },
        'Uploaded to https://charlies-bucket.s3-us-west-2.amazonaws.com',
      ],
    },
  ];
</script>

<MockTerminal directory="next-app" {prompts} delay={2000} />
