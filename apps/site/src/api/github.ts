export async function fetchGitHubStars(owner: string, repo: string): Promise<number> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) return -1;

    const data = await response.json(),
      starsCount = data.stargazers_count;

    return starsCount;
  } catch (error) {
    return -1;
  }
}
