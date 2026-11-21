import { z } from 'zod';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL as string;
const REPO = process.env.GITHUB_REPO as string; 
const SHOP_TOKEN = process.env.GITHUB_ISSUES_TOKEN as string;

const TokenResponse = z.object({
  access_token: z.string()
});

const GithubUser = z.object({
  id: z.number(),
  login: z.string(),
});

const CreatedIssue = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
});

const IssueListItem = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  user: z.object({ login: z.string() }).nullable(),
  pull_request: z.unknown().optional(),
});
const IssueList = z.array(IssueListItem);

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
export const getAuthorizeUrl = (state: string, codeChallenge: string) => {
  const params = new URLSearchParams({
    client_id:CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    scope: 'read:user',
    state,
    code_challenge: codeChallenge, 
    code_challenge_method: 'S256', 
  });
  return `https://github.com/login/oauth/authorize?${params}`;
};

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
export const exchangeCode = async (code: string, codeVerifier: string): Promise<string> => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: CALLBACK_URL,
      code_verifier: codeVerifier,
    }),
    signal: AbortSignal.timeout(5_000),
  });

  const answer: any = await response.json();

  const parsed = TokenResponse.safeParse(answer);
  if (!parsed.success) {
    throw new Error(`GitHub refused the code: ${answer?.error ?? response.status}`);
  }

  return parsed.data.access_token;
};

// https://docs.github.com/en/rest/users/users#get-the-authenticated-user
export const getUser = async (accessToken: string) => {
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
  const user: any = await response.json();

  const parsed = GithubUser.safeParse(user);
  if (!parsed.success) throw new Error('GitHub user response had an unexpected format');

  return parsed.data;
};

// Docs: https://docs.github.com/en/rest/issues/issues#create-an-issue
export const createIssue = async (
  title: string,
  body: string
): Promise<{ number: number, title: string, url: string}> => {
  const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${SHOP_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body}),
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) throw new Error(`GitHub answered ${response.status}`);

  const parsed = CreatedIssue.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error('GitHub create issue has the wrong format');
  }

  return {
    number: parsed.data.number,
    title: parsed.data.title,
    url: parsed.data.html_url
  };
};

// Docs: https://docs.github.com/en/rest/issues/issues#list-repository-issues
export const listOpenIssues = async (): Promise<
  { number: number; title: string; url: string; author: string }[]
> => {
  const response = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=50`, {
    headers: { 
      Authorization: `Bearer ${SHOP_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`GitHub answered ${response.status}`);

  const parsed = IssueList.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Github issue list has the wrong format');
  }

  const filteredIssues = parsed.data.filter((i) => !i.pull_request);

  return filteredIssues.map((i) => ({
    number: i.number,
    title: i.title,
    url: i.html_url,
    author: i.user?.login ?? 'okänd',
  }));  
};