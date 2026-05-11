import SignInClient from "./_components/sign-in-client";

type SignInPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  const redirectTo = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;

  return <SignInClient redirectTo={redirectTo} />;
}
