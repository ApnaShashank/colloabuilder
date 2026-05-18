const VERCEL_API_URL = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_TOKEN;

export async function createVercelDeployment(projectId: string, githubRepoId: string, branch: string) {
  const res = await fetch(`${VERCEL_API_URL}/v13/deployments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `colloa-project-${projectId}`,
      gitSource: {
        type: "github",
        repoId: githubRepoId,
        ref: branch,
      },
      projectSettings: {
        framework: "nextjs",
      },
    }),
  });

  return await res.json();
}

export async function getVercelDeployment(deploymentId: string) {
  const res = await fetch(`${VERCEL_API_URL}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return await res.json();
}

export async function getVercelDeploymentEvents(deploymentId: string) {
  const res = await fetch(`${VERCEL_API_URL}/v2/deployments/${deploymentId}/events`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return await res.json();
}
