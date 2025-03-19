import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <main className="container mx-auto px-4 py-8 pt-4">
      <div className="md:max-w-5xl mx-auto flex h-[400px] gap-7 flex-col md:flex-row items-center rounded-md md:border mt-5 pl-5 md:pl-0 pr-5">
        <div className="w-1/2 hidden md:block h-full signIn-left rounded-tl-md rounded-bl-md" />
        <LoginForm />
      </div>
    </main>
  );
}
